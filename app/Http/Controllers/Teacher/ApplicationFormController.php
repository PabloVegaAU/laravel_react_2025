<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormQuestion;
use App\Models\LearningSession;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
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
            DB::raw("CONCAT(classrooms.grade, ' - ', classrooms.section) as classroom_name"),
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
    public function create(Request $request)
    {
        try {
            // Validar datos de Learning sessión
            $validated = $request->validate([
                'learning_session_id' => 'required|exists:learning_sessions,id',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
            ]);

            $currentYear = now()->year;

            $learningSession = LearningSession::with([
                'teacherClassroomCurricularAreaCycle',
                'teacherClassroomCurricularAreaCycle.curricularAreaCycle',
                'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
                'teacherClassroomCurricularAreaCycle.classroom',
                'competency',
                'capabilities',
            ])->findOrFail($validated['learning_session_id']);

            // Obtener datos de asignación de aula-área-curricular-ciclo
            $teacherClassroomCurricularAreaCycle = $learningSession->teacherClassroomCurricularAreaCycle;

            // Obtener preguntas con relaciones mínimas necesarias
            $capabilityIds = $learningSession->capabilities->pluck('id');

            $questions = Question::with([
                'capability:id,competency_id,color',
                'capability.competency:id,name',
                'questionType:id,name',
            ])
                ->whereIn('capability_id', $capabilityIds)
                ->where('questions.teacher_id', auth()->id())
                ->orderBy('questions.created_at', 'desc')
                ->get();

            return Inertia::render('teacher/application-form/create/index', [
                'learning_session' => $learningSession,
                'teacher_classroom_curricular_area_cycle' => $teacherClassroomCurricularAreaCycle,
                'questions' => $questions,
                'current_year' => $currentYear,
            ]);
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validar los datos del formulario
            $validated = $request->validate([
                'learning_session_id' => 'required|exists:learning_sessions,id',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'status' => 'required|in:draft,scheduled,active,inactive,archived',
                'score_max' => 'required|numeric|min:20|max:20',
                'questions' => 'required|array|min:1',
                'questions.*.id' => 'required|exists:questions,id',
                'questions.*.order' => 'required|integer|min:1',
                'questions.*.score' => 'required|numeric|min:0.1|max:100',
                'questions.*.points_store' => 'required|numeric|min:0.1|max:100',
            ]);

            DB::beginTransaction();

            // Verificar que el profesor sea dueño de las preguntas
            $questionIds = collect($validated['questions'])->pluck('id');
            $invalidQuestions = Question::whereIn('id', $questionIds)
                ->where('teacher_id', '!=', auth()->id())
                ->exists();

            if ($invalidQuestions) {
                throw new \Exception('No tienes permiso para usar una o más preguntas seleccionadas.');
            }

            // Crear la ficha de aplicación
            $applicationForm = ApplicationForm::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'score_max' => $validated['score_max'],
                'teacher_id' => auth()->id(),
                'learning_session_id' => $validated['learning_session_id'],
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

            DB::commit();

            return redirect()
                ->route('teacher.application-forms.index')
                ->with('success', 'Ficha de aplicación creada exitosamente');
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
                ->with('error', 'Error al crear la ficha de aplicación: '.$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        // Cargar el formulario con sus relaciones
        $applicationForm = ApplicationForm::with([
            'learningSession.teacherClassroomCurricularAreaCycle' => function ($query) {
                $query->select(['id', 'classroom_id', 'curricular_area_cycle_id', 'teacher_id', 'academic_year'])
                    ->with([
                        'classroom:id,grade,section,level',
                        'curricularAreaCycle.curricularArea:id,name',
                    ]);
            },
            'learningSession.competency:id,name',
            'questions' => function ($query) {
                $query->orderBy('order')
                    ->with([
                        'question' => function ($q) {
                            $q->with([
                                'capability.competency:id,name',
                                'questionType:id,name',
                                'options' => function ($q) {
                                    $q->orderBy('order');
                                },
                            ]);
                        },
                    ]);
            },
        ])->findOrFail($id);

        return Inertia::render('teacher/application-form/show/index', [
            'application_form' => $applicationForm,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        // Cargar el formulario con sus relaciones
        $applicationForm = ApplicationForm::with([
            'learningSession.teacherClassroomCurricularAreaCycle' => function ($query) {
                $query->select(['id', 'classroom_id', 'curricular_area_cycle_id', 'teacher_id', 'academic_year'])
                    ->with([
                        'classroom:id,grade,section,level',
                        'curricularAreaCycle.curricularArea:id,name',
                    ]);
            },
            'learningSession.competency:id,name',
            'questions' => function ($query) {
                $query->orderBy('order')
                    ->with([
                        'question' => function ($q) {
                            $q->with([
                                'capability.competency:id,name',
                                'questionType:id,name',
                                'options' => function ($q) {
                                    $q->orderBy('order');
                                },
                            ]);
                        },
                    ]);
            },
        ])->findOrFail($id);

        // Obtener IDs de preguntas ya seleccionadas en el formulario
        $selectedQuestionIds = $applicationForm->questions()->pluck('question_id');

        // Obtener preguntas, ordenando primero las seleccionadas
        $questions = Question::with([
            'capability.competency:id,name',
            'questionType:id,name',
        ])
            ->whereIn('capability_id', $applicationForm->learningSession->capabilities->pluck('id'))
            ->when($selectedQuestionIds->isNotEmpty(), function ($query) use ($selectedQuestionIds) {
                // Usar CASE para ordenar primero las preguntas seleccionadas
                $query->orderByRaw(
                    'CASE WHEN id IN ('.$selectedQuestionIds->join(',').') THEN 0 ELSE 1 END'
                );
            })
            ->orderBy('id')
            ->get();

        return Inertia::render('teacher/application-form/edit/index', [
            'application_form' => $applicationForm,
            'questions' => $questions,
        ]);
    }

    /**
     * Update the questions order for an application form.
     */
    protected function updateQuestionsOrder(ApplicationForm $applicationForm, array $questionIds): void
    {
        $order = 1;
        $updates = [];

        foreach ($questionIds as $questionId) {
            $updates[$questionId] = ['order' => $order++];
        }

        $applicationForm->questions()->sync($updates);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $applicationForm = ApplicationForm::with(['questions'])->findOrFail($id);

        // Normalize input data
        $input = $request->all();

        // Normalize questions data
        if (isset($input['questions']) && is_array($input['questions'])) {
            $input['questions'] = array_map(function ($question) {
                // Handle both nested and flat question structures
                $questionId = $question['id'] ?? null;
                $score = $question['score'] ?? 1.0;
                $pointsStore = $question['points_store'] ?? 1.0;
                $order = $question['order'] ?? 0;

                // If the question has a nested question object (from frontend)
                if (isset($question['question']) && is_array($question['question'])) {
                    $questionId = $question['question']['id'] ?? $questionId;
                    $score = $question['question']['score'] ?? $score;
                    $pointsStore = $question['question']['points_store'] ?? $pointsStore;
                    $order = $question['question']['order'] ?? $order;
                }

                return [
                    'id' => (int) $questionId,
                    'score' => (float) $score,
                    'points_store' => (float) $pointsStore,
                    'order' => (int) $order,
                ];
            }, $input['questions']);
        }

        // Validate input
        $validated = validator($input, [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:draft,scheduled,active,inactive,archived',
            'score_max' => 'required|numeric|min:20|max:20',
            'questions' => 'required|array|min:1',
            'questions.*.id' => 'required|exists:questions,id',
            'questions.*.score' => 'required|numeric|min:0.1',
            'questions.*.points_store' => 'required|numeric|min:0.1',
            'questions.*.order' => 'sometimes|integer|min:1',
            'questions_order' => 'sometimes|array',
            'questions_order.*' => 'exists:questions,id',
        ])->validate();

        DB::transaction(function () use ($validated, $applicationForm) {
            // Update basic form data
            $applicationForm->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $validated['status'],
                'score_max' => floatval($validated['score_max']),
            ]);

            // Get existing questions keyed by question_id
            $existingQuestions = $applicationForm->questions->keyBy('question_id');
            $newQuestionIds = collect($validated['questions'])->pluck('id')->toArray();

            // Delete questions that are not in the new list
            $questionsToDelete = $existingQuestions->keys()->diff($newQuestionIds);
            if ($questionsToDelete->isNotEmpty()) {
                $applicationForm->questions()
                    ->whereIn('question_id', $questionsToDelete)
                    ->delete();
            }

            // Update or create questions
            foreach ($validated['questions'] as $questionData) {
                $questionId = $questionData['id'];
                $questionOrder = $questionData['order'];

                if ($existingQuestions->has($questionId)) {
                    // Update existing question
                    $existingQuestions[$questionId]->update([
                        'order' => $questionOrder,
                        'score' => $questionData['score'],
                        'points_store' => $questionData['points_store'],
                    ]);
                } else {
                    // Create new question
                    $applicationForm->questions()->create([
                        'question_id' => $questionId,
                        'order' => $questionOrder,
                        'score' => $questionData['score'],
                        'points_store' => $questionData['points_store'],
                    ]);
                }
            }

            // If questions_order is provided, update the order
            if (isset($validated['questions_order']) && ! empty($validated['questions_order'])) {
                $this->updateQuestionsOrder($applicationForm, $validated['questions_order']);
            }
        });

        return redirect()->route('teacher.application-forms.index')
            ->with('success', 'Formulario actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        DB::beginTransaction();

        try {
            $applicationForm = ApplicationForm::findOrFail($id);
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
                'message' => 'Ficha de aplicación eliminada correctamente.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la ficha de aplicación: '.$e->getMessage(),
            ], 500);
        }
    }
}
