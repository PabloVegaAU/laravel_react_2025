<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormQuestion;
use App\Models\ApplicationFormResponse;
use App\Models\ApplicationFormResponseQuestion;
use App\Models\EducationalInstitution;
use App\Models\LearningSession;
use App\Models\TeacherClassroomCurricularAreaCycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LearningSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $learningSessions = LearningSession::with([
            'competency',
            'applicationForm',
        ])
            ->orderByDesc('id')
            ->paginate(10);

        return Inertia::render('teacher/learning-session/index', [
            'learningSessions' => $learningSessions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $educationalInstitution = EducationalInstitution::findOrFail(1);

        $currentYear = now()->year;

        $teacherClassroomCurricularAreaCycles = TeacherClassroomCurricularAreaCycle::with([
            'classroom',
            'curricularAreaCycle.curricularArea', 'curricularAreaCycle.cycle',
            'curricularAreaCycle.curricularArea.competencies',
            'curricularAreaCycle.curricularArea.competencies.capabilities',
        ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', $currentYear)
            ->get();

        return Inertia::render('teacher/learning-session/create/index', [
            'educational_institution' => $educationalInstitution,
            'teacher_classroom_curricular_area_cycles' => $teacherClassroomCurricularAreaCycles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'redirect' => 'nullable|boolean',
                'educational_institution_id' => 'required|exists:educational_institutions,id',
                'name' => 'required|string|max:255',
                'purpose_learning' => 'required|string',
                'application_date' => 'required|date',
                'status' => 'required|in:draft,active,inactive',
                'performances' => 'required|string',
                'start_sequence' => 'required|string',
                'end_sequence' => 'required|string',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
                'capability_ids' => 'nullable|array',
                'capability_ids.*' => 'nullable|exists:capabilities,id',
            ]);

            DB::beginTransaction();

            $learningSession = LearningSession::create([
                'name' => $validated['name'],
                'purpose_learning' => $validated['purpose_learning'],
                'application_date' => $validated['application_date'],
                'status' => $validated['status'],
                'performances' => $validated['performances'],
                'start_sequence' => $validated['start_sequence'],
                'end_sequence' => $validated['end_sequence'],
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'competency_id' => $validated['competency_id'],
                'educational_institution_id' => $validated['educational_institution_id'],
            ]);

            if (! empty($validated['capability_ids'])) {
                $learningSession->capabilities()->attach($validated['capability_ids']);
            }

            DB::commit();

            if ($request->boolean('redirect')) {
                return redirect()->route('teacher.application-forms.create', [
                    'learning_session_id' => $learningSession->id,
                    'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                    'competency_id' => $validated['competency_id'],
                ]);
            }

            return redirect()->route('teacher.learning-sessions.index')
                ->with('success', 'Sesión creada exitosamente');
        } catch (ValidationException $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $learningSession = LearningSession::with([
            'educationalInstitution',
            'teacherClassroomCurricularAreaCycle.classroom',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.cycle',
            'applicationForm',
            'applicationForm.responses',
            'applicationForm.responses.student',
            'applicationForm.responses.student.profile',
        ])->findOrFail($id);

        return Inertia::render('teacher/learning-session/show/index', [
            'learning_session' => $learningSession,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $learningSession = LearningSession::with([
            'educationalInstitution',
            'teacherClassroomCurricularAreaCycle.classroom',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.cycle',
            'competency',
            'capabilities',
            'applicationForm',
        ])->findOrFail($id);

        $teacherClassroomCurricularAreaCycles = TeacherClassroomCurricularAreaCycle::with([
            'classroom',
            'curricularAreaCycle.curricularArea', 'curricularAreaCycle.cycle',
            'curricularAreaCycle.curricularArea.competencies',
            'curricularAreaCycle.curricularArea.competencies.capabilities',
        ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', now()->year)
            ->get();

        return Inertia::render('teacher/learning-session/edit/index', [
            'learning_session' => $learningSession,
            'teacher_classroom_curricular_area_cycles' => $teacherClassroomCurricularAreaCycles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'redirect' => 'nullable|boolean',
                'name' => 'required|string|max:255',
                'purpose_learning' => 'required|string',
                'application_date' => 'required|date',
                'status' => 'required|in:draft,active,inactive',
                'performances' => 'required|string',
                'start_sequence' => 'required|string',
                'end_sequence' => 'required|string',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
                'capability_ids' => 'nullable|array',
                'capability_ids.*' => 'nullable|exists:capabilities,id',
                'application_form_id' => 'nullable|exists:application_forms,id',
            ]);

            DB::beginTransaction();

            $learningSession = LearningSession::findOrFail($id);

            $learningSession->update([
                'name' => $validated['name'],
                'purpose_learning' => $validated['purpose_learning'],
                'application_date' => $validated['application_date'],
                'status' => $validated['status'],
                'performances' => $validated['performances'],
                'start_sequence' => $validated['start_sequence'],
                'end_sequence' => $validated['end_sequence'],
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'competency_id' => $validated['competency_id'],
            ]);

            if (isset($validated['application_form_id'])) {
                // Remover las formularios que ya no pertenecen a esta sesión
                ApplicationForm::where('learning_session_id', $learningSession->id)
                    ->whereNotIn('id', $validated['application_form_id'])
                    ->update(['learning_session_id' => null]);

                // Asignar esta sesión a los nuevos formularios
                ApplicationForm::whereIn('id', $validated['application_form_id'])
                    ->update(['learning_session_id' => $learningSession->id]);
            }

            if (! empty($validated['capability_ids'])) {
                $learningSession->capabilities()->detach();
                $learningSession->capabilities()->attach($validated['capability_ids']);
            }

            DB::commit();

            if ($request->boolean('redirect')) {
                return redirect()->route('teacher.application-forms.create', [
                    'learning_session_id' => $learningSession->id,
                    'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                    'competency_id' => $validated['competency_id'],
                ]);
            }

            return redirect()->route('teacher.learning-sessions.index')
                ->with('success', 'Sesión de aprendizaje actualizada correctamente');
        } catch (ValidationException $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        }
    }

    public function changeStatus(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:draft,active,inactive',
            ]);

            $learningSession = LearningSession::with('applicationForm')->findOrFail($id);

            DB::beginTransaction();

            // Validar y manejar la activación de la sesión
            if ($validated['status'] === 'active') {
                if (! $learningSession->applicationForm || $learningSession->applicationForm->status !== 'active') {
                    throw new \Exception('La ficha de aplicación debe estar activo para poder activar la sesión de aprendizaje.');
                }
                $this->generateApplicationFormResponses($learningSession);
            }

            $learningSession->update([
                'status' => $validated['status'],
            ]);

            DB::commit();

            return redirect()->route('teacher.learning-sessions.index')
                ->with('success', 'Estado de la sesión de aprendizaje actualizado correctamente');
        } catch (ValidationException $e) {
            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al actualizar el estado de la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    // Generar ApplicationFormResponses para students
    public function generateApplicationFormResponses(LearningSession $learningSession)
    {
        // Revisar si existen applicationFormResponses
        if (ApplicationFormResponse::where('application_form_id', $learningSession->applicationForm->id)->exists()) {
            return;
        }

        $applicationForm = $learningSession->applicationForm->load('questions');

        // Después de insertar las preguntas del formulario, obtenemos los IDs generados
        $insertedQuestions = ApplicationFormQuestion::where('application_form_id', $applicationForm->id)->get();

        // Creamos un mapa de question_id a application_form_question_id
        $questionIdMap = $insertedQuestions->pluck('id', 'question_id');

        // Obtener estudiantes del aula para crear respuestas
        $teacherClassroomCurricularAreaCycle = TeacherClassroomCurricularAreaCycle::with(['classroom.students' => function ($query) {
            $query->select('students.*')
                ->whereHas('enrollments', function ($q) {
                    $q->where('status', 'active');
                });
        }])->findOrFail($learningSession->teacher_classroom_curricular_area_cycle_id);

        if ($teacherClassroomCurricularAreaCycle->classroom && $teacherClassroomCurricularAreaCycle->classroom->students->isNotEmpty()) {
            foreach ($teacherClassroomCurricularAreaCycle->classroom->students as $student) {
                $applicationFormResponses = [
                    'score' => 0,
                    'status' => 'pending',
                    'started_at' => null,
                    'submitted_at' => null,
                    'graded_at' => null,
                    'application_form_id' => $applicationForm->id,
                    'student_id' => $student->user_id,
                ];

                $applicationFormResponse = ApplicationFormResponse::create($applicationFormResponses);

                // Preparar preguntas de respuesta para inserción masiva
                $applicationFormResponseQuestions = [];
                foreach ($applicationForm->questions as $question) {
                    // Usamos el mapa para obtener el ID correcto
                    $appFormQuestionId = $questionIdMap[$question->question_id] ?? null;

                    $applicationFormResponseQuestions[] = [
                        'application_form_response_id' => $applicationFormResponse->id,
                        'application_form_question_id' => $appFormQuestionId,
                        'explanation' => '',
                        'score' => $question['score'],
                        'points_store' => $question['points_store'],
                    ];
                }

                ApplicationFormResponseQuestion::insert(values: $applicationFormResponseQuestions);
            }
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
    }
}
