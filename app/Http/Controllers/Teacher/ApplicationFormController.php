<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormQuestion;
use App\Models\ApplicationFormResponse;
use App\Models\ApplicationFormResponseQuestion;
use App\Models\LearningSession;
use App\Models\Question;
use App\Models\TeacherClassroomCurricularArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Solo de los que le pertenecen al docente
        $applicationForms = ApplicationForm::whereHas('teacherClassroomCurricularArea', function ($query) {
            $query->where('teacher_id', auth()->id());
        })
            ->with(['teacherClassroomCurricularArea.classroom', 'teacherClassroomCurricularArea.curricularArea'])
            ->latest()
            ->paginate(10);

        return Inertia::render('teacher/application-form/index', [
            'applicationForms' => $applicationForms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all classroom-curricular area assignments for the current teacher in the current academic year
        $teacherClassroomAreas = TeacherClassroomCurricularArea::with(['classroom', 'curricularArea', 'curricularArea.competencies'])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', now()->year)
            ->get();

        $questions = Question::with('capability.competency')->where('teacher_id', auth()->id())->get();

        return Inertia::render('teacher/application-form/create/index', [
            'teacherClassroomAreas' => $teacherClassroomAreas,
            'questions' => $questions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $validated = $request->validate([
            // Datos del área curricular
            'teacher_classroom_curricular_area_id' => 'required|exists:teacher_classroom_curricular_areas,id',

            // Datos de la sesión de aprendizaje
            'ls_name' => 'required|string|max:255',
            'ls_purpose_learning' => 'required|string',
            'ls_application_date' => 'required|date',
            'ls_competency_id' => 'required|exists:competencies,id',

            // Datos de la ficha de aplicación
            'name' => 'required|string|max:255',
            'description' => 'string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,scheduled,active,inactive,archived',
            'score_max' => 'required|numeric|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.order' => 'required|integer|min:1',
            'questions.*.score' => 'required|numeric|min:1',
            'questions.*.points_store' => 'required|numeric|min:1',
        ]);

        // Obtener el área curricular para relaciones adicionales
        $teacherClassroomArea = TeacherClassroomCurricularArea::findOrFail($validated['teacher_classroom_curricular_area_id']);

        // Crear la sesión de aprendizaje
        $learningSession = LearningSession::create([
            'name' => $validated['ls_name'],
            'purpose_learning' => $validated['ls_purpose_learning'],
            'application_date' => $validated['ls_application_date'],
            'educational_institution_id' => 1,
            'teacher_classroom_curricular_area_id' => $validated['teacher_classroom_curricular_area_id'],
            'competency_id' => $validated['ls_competency_id'],
        ]);

        // Crear la ficha de aplicación
        $applicationForm = ApplicationForm::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
            'score_max' => $validated['score_max'],
            'teacher_classroom_curricular_area_id' => $validated['teacher_classroom_curricular_area_id'],
            'learning_session_id' => $learningSession->id,
        ]);

        // Asignar preguntas a la ficha de aplicación
        foreach ($validated['questions'] as $index => $questionData) {
            // Verificar si es un array (del frontend) o un ID directo
            $questionId = is_array($questionData) ? $questionData['id'] : $questionData;

            ApplicationFormQuestion::create([
                'application_form_id' => $applicationForm->id,
                'question_id' => $questionId,
                'order' => is_array($questionData) ? ($questionData['order'] ?? $index) : $index,
                'score' => is_array($questionData) ? ($questionData['score'] ?? 1) : 1,
                'points_store' => is_array($questionData) ? ($questionData['points_store'] ?? 0) : 0,
            ]);
        }

        // Crear respuestas para cada estudiante en el aula
        $classroom = $teacherClassroomArea->classroom()->with('students')->first();

        if ($classroom && $classroom->students->isNotEmpty()) {
            foreach ($classroom->students as $student) {
                // Crear la respuesta principal del estudiante
                $applicationFormResponse = ApplicationFormResponse::create([
                    'student_id' => $student->id,
                    'application_form_id' => $applicationForm->id,
                    'status' => 'pending',
                    'score' => 0,
                    'started_at' => null,
                    'completed_at' => null,
                ]);

                // Crear las relaciones con las preguntas para esta respuesta
                foreach ($validated['questions'] as $questionId) {
                    ApplicationFormResponseQuestion::create([
                        'application_form_response_id' => $applicationFormResponse->id,
                        'question_id' => $questionId,
                        'score' => 0,
                        'is_correct' => false,
                        'feedback' => null,
                    ]);
                }
            }
        }

        return redirect()->route('teacher.application-forms.index')
            ->with('success', 'Ficha de aplicación creada exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(ApplicationForm $applicationForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $applicationForm = ApplicationForm::with([
            'teacherClassroomCurricularArea',
            'teacherClassroomCurricularArea.curricularArea',
            'learningSession',
            'learningSession.competency',
        ])->findOrFail($id);

        $teacherClassroomAreas = auth()->user()->teacherClassroomCurricularAreas()
            ->with('curricularArea.competencies')
            ->get();

        return Inertia::render('teacher/application-form/edit/index', [
            'applicationForm' => $applicationForm,
            'teacherClassroomAreas' => $teacherClassroomAreas,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ApplicationForm $applicationForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApplicationForm $applicationForm)
    {
        //
    }
}
