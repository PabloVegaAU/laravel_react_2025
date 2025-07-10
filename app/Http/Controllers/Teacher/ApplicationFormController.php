<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormQuestion;
use App\Models\ApplicationFormResponse;
use App\Models\ApplicationFormResponseQuestion;
use App\Models\LearningSession;
use App\Models\Question;
use App\Models\TeacherClassroomCurricularAreaCycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ApplicationFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentYear = now()->year;

        // Obtener formularios de aplicación con relaciones optimizadas
        $applicationForms = ApplicationForm::select([
            'application_forms.*',
            'learning_sessions.name as session_name',
            'classrooms.name as classroom_name',
            'curricular_areas.name as curricular_area_name',
        ])
            ->join('learning_sessions', 'learning_sessions.id', '=', 'application_forms.learning_session_id')
            ->join('teacher_classroom_curricular_area_cycles as tccac',
                'tccac.id', '=', 'learning_sessions.teacher_classroom_curricular_area_cycle_id')
            ->join('classrooms', 'classrooms.id', '=', 'tccac.classroom_id')
            ->join('curricular_area_cycles as cac', 'cac.id', '=', 'tccac.curricular_area_cycle_id')
            ->join('curricular_areas', 'curricular_areas.id', '=', 'cac.curricular_area_id')
            ->where('tccac.teacher_id', auth()->id())
            ->where('tccac.academic_year', $currentYear)
            ->with([
                'learningSession' => function ($query) {
                    $query->select('id', 'name', 'application_date');
                },
                'learningSession.competency' => function ($query) {
                    $query->select('id', 'name');
                },
            ])
            ->latest('application_forms.created_at')
            ->paginate(10);

        return Inertia::render('teacher/application-form/index', [
            'applicationForms' => $applicationForms,
            'currentYear' => $currentYear,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $currentYear = now()->year;

        // Obtener asignaciones de aula-área-curricular con eager loading optimizado
        $teacherClassroomAreaCycles = TeacherClassroomCurricularAreaCycle::select([
            'id', 'classroom_id', 'curricular_area_cycle_id', 'academic_year',
        ])
            ->with([
                'classroom',
                'curricularAreaCycle.curricularArea',
                'curricularAreaCycle.curricularArea.competencies',
            ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', $currentYear)
            ->get();

        // Obtener preguntas con relaciones mínimas necesarias
        $questions = Question::select(['id', 'name', 'capability_id'])
            ->with([
                'capability:id,name,competency_id',
                'capability.competency:id,name',
            ])
            ->where('teacher_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/application-form/create/index', [
            'teacherClassroomAreaCycles' => $teacherClassroomAreaCycles,
            'questions' => $questions,
            'currentYear' => $currentYear,
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
            'teacher_classroom_curricular_area_cycle_id' => [
                'required',
                'exists:teacher_classroom_curricular_area_cycles,id',
                function ($attribute, $value, $fail) {
                    $exists = TeacherClassroomCurricularAreaCycle::where('id', $value)
                        ->where('teacher_id', auth()->id())
                        ->where('academic_year', now()->year)
                        ->exists();

                    if (! $exists) {
                        $fail('La asignación de aula-área-curricular no es válida.');
                    }
                },
            ],

            // Datos de la sesión de aprendizaje
            'ls_name' => 'required|string|max:255',
            'ls_purpose_learning' => 'required|string',
            'ls_application_date' => 'required|date|after_or_equal:today',
            'ls_competency_id' => [
                'required',
                'exists:competencies,id',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = DB::table('teacher_classroom_curricular_area_cycles as tccac')
                        ->join('curricular_area_cycles as cac', 'cac.id', '=', 'tccac.curricular_area_cycle_id')
                        ->join('competencies as c', 'c.curricular_area_cycle_id', '=', 'cac.id')
                        ->where('tccac.id', $request->teacher_classroom_curricular_area_cycle_id)
                        ->where('c.id', $value)
                        ->exists();

                    if (! $exists) {
                        $fail('La competencia seleccionada no pertenece al área curricular.');
                    }
                },
            ],

            // Datos de la ficha de aplicación
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,scheduled,active,inactive,archived',
            'score_max' => 'required|numeric|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'required|exists:questions,id',
            'questions.*.order' => 'required|integer|min:1',
            'questions.*.score' => 'required|numeric|min:0.1|max:100',
            'questions.*.points_store' => 'required|numeric|min:0.1|max:100',
        ]);

        DB::beginTransaction();

        try {
            // Obtener la institución educativa del profesor
            $institutionId = auth()->user()->educational_institution_id;

            if (! $institutionId) {
                throw new \Exception('El profesor no tiene una institución educativa asignada.');
            }

            // Verificar que el profesor sea dueño de las preguntas
            $questionIds = collect($validated['questions'])->pluck('id');
            $invalidQuestions = Question::whereIn('id', $questionIds)
                ->where('teacher_id', '!=', auth()->id())
                ->exists();

            if ($invalidQuestions) {
                throw new \Exception('No tienes permiso para usar una o más preguntas seleccionadas.');
            }

            // Crear la sesión de aprendizaje
            $learningSession = LearningSession::create([
                'name' => $validated['ls_name'],
                'purpose_learning' => $validated['ls_purpose_learning'],
                'application_date' => $validated['ls_application_date'],
                'educational_institution_id' => $institutionId,
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'competency_id' => $validated['ls_competency_id'],
                'status' => 'draft', // Estado inicial
            ]);

            // Crear la ficha de aplicación
            $applicationForm = ApplicationForm::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $validated['status'],
                'score_max' => $validated['score_max'],
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'learning_session_id' => $learningSession->id,
                'created_by' => auth()->id(),
            ]);

            // Preparar datos para la inserción masiva
            $applicationFormQuestions = [];
            $now = now();

            foreach ($validated['questions'] as $index => $questionData) {
                $applicationFormQuestions[] = [
                    'application_form_id' => $applicationForm->id,
                    'question_id' => $questionData['id'],
                    'order' => $questionData['order'] ?? ($index + 1),
                    'score' => $questionData['score'],
                    'points_store' => $questionData['points_store'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // Insertar preguntas de la ficha de forma masiva
            if (! empty($applicationFormQuestions)) {
                ApplicationFormQuestion::insert($applicationFormQuestions);
            }

            // Obtener estudiantes del aula para crear respuestas
            $classroom = TeacherClassroomCurricularAreaCycle::with(['classroom.students' => function ($query) {
                $query->where('status', 'active');
            }])->findOrFail($validated['teacher_classroom_curricular_area_cycle_id']);

            if ($classroom->classroom && $classroom->classroom->students->isNotEmpty()) {
                $applicationFormResponses = [];
                $applicationFormResponseQuestions = [];
                $now = now();

                foreach ($classroom->classroom->students as $student) {
                    $responseId = (string) Str::uuid();

                    $applicationFormResponses[] = [
                        'id' => $responseId,
                        'student_id' => $student->id,
                        'application_form_id' => $applicationForm->id,
                        'status' => 'pending',
                        'score' => 0,
                        'started_at' => null,
                        'completed_at' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    // Preparar preguntas de respuesta para inserción masiva
                    foreach ($validated['questions'] as $question) {
                        $applicationFormResponseQuestions[] = [
                            'id' => (string) Str::uuid(),
                            'application_form_response_id' => $responseId,
                            'question_id' => $question['id'],
                            'score' => 0,
                            'is_correct' => false,
                            'feedback' => null,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }

                // Insertar respuestas y preguntas de forma masiva
                if (! empty($applicationFormResponses)) {
                    ApplicationFormResponse::insert($applicationFormResponses);
                }

                if (! empty($applicationFormResponseQuestions)) {
                    ApplicationFormResponseQuestion::insert($applicationFormResponseQuestions);
                }
            }

            DB::commit();

            return redirect()
                ->route('teacher.application-forms.index')
                ->with('success', 'Ficha de aplicación creada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al crear ficha de aplicación: '.$e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Error al crear la ficha de aplicación: '.$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ApplicationForm $applicationForm)
    {
        // Cargar relaciones necesarias
        $applicationForm->load([
            'learningSession.teacherClassroomCurricularAreaCycle.classroom',
            'learningSession.teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'learningSession.competency',
            'questions.question.capability.competency',
            'responses.student',
            'responses.questions.question',
        ]);

        return Inertia::render('teacher/application-form/show', [
            'applicationForm' => $applicationForm,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $applicationForm = ApplicationForm::with([
            'learningSession.teacherClassroomCurricularAreaCycle',
            'learningSession.competency',
            'questions.question.capability.competency',
        ])->findOrFail($id);

        // Obtener asignaciones del profesor para el año actual
        $teacherClassroomAreaCycles = TeacherClassroomCurricularAreaCycle::select([
            'id', 'classroom_id', 'curricular_area_cycle_id', 'academic_year',
        ])
            ->with([
                'classroom:id,name',
                'curricularAreaCycle.curricularArea:id,name',
                'curricularAreaCycle.competencies:id,name,curricular_area_cycle_id',
            ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', now()->year)
            ->get();

        // Obtener preguntas del profesor
        $questions = Question::select(['id', 'name', 'capability_id'])
            ->with([
                'capability:id,name,competency_id',
                'capability.competency:id,name',
            ])
            ->where('teacher_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('teacher/application-form/edit/index', [
            'applicationForm' => $applicationForm,
            'teacherClassroomAreaCycles' => $teacherClassroomAreaCycles,
            'questions' => $questions,
            'currentYear' => now()->year,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ApplicationForm $applicationForm)
    {
        // Validar los datos del formulario
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,scheduled,active,inactive,archived',
            'score_max' => 'required|numeric|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'required|exists:questions,id',
            'questions.*.order' => 'required|integer|min:1',
            'questions.*.score' => 'required|numeric|min:0.1|max:100',
            'questions.*.points_store' => 'required|numeric|min:0.1|max:100',
        ]);

        DB::beginTransaction();

        try {
            // Actualizar la ficha de aplicación
            $applicationForm->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $validated['status'],
                'score_max' => $validated['score_max'],
            ]);

            // Sincronizar preguntas
            $questionsToSync = [];
            $now = now();

            foreach ($validated['questions'] as $questionData) {
                $questionsToSync[$questionData['id']] = [
                    'order' => $questionData['order'],
                    'score' => $questionData['score'],
                    'points_store' => $questionData['points_store'],
                    'updated_at' => $now,
                ];
            }

            // Sincronizar preguntas existentes
            $applicationForm->questions()->sync($questionsToSync);

            DB::commit();

            return redirect()
                ->route('teacher.application-forms.index')
                ->with('success', 'Ficha de aplicación actualizada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al actualizar ficha de aplicación: '.$e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Error al actualizar la ficha de aplicación: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApplicationForm $applicationForm)
    {
        DB::beginTransaction();

        try {
            // Verificar si hay respuestas antes de eliminar
            if ($applicationForm->responses()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la ficha de aplicación porque ya tiene respuestas asociadas.',
                ], 422);
            }

            // Eliminar preguntas de la ficha
            $applicationForm->questions()->delete();

            // Eliminar la ficha
            $applicationForm->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ficha de aplicación eliminada exitosamente',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al eliminar ficha de aplicación: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la ficha de aplicación: '.$e->getMessage(),
            ], 500);
        }
    }
}
