<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationFormResponse;
use App\Models\ApplicationFormResponseQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApplicationFormResponseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Obtener el profesor autenticado
        $teacher = $request->user()->teacher;

        // Parámetros de filtrado
        $learningSessionId = $request->input('learning_session_id');

        // Consulta base para respuestas
        $query = ApplicationFormResponse::with([
            'student.user.profile',
            'responseQuestions.applicationFormQuestion',
        ])
            ->whereHas('applicationForm.learningSession', function ($q) use ($teacher, $learningSessionId) {
                // Filtrar solo sesiones del profesor actual
                $q->whereHas('teacherClassroomCurricularAreaCycle', function ($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->user_id);
                });

                // Filtrar por sesión de aprendizaje si se especificó
                if ($learningSessionId) {
                    $q->where('id', $learningSessionId);
                }
            });

        // Aplicar búsqueda si se proporcionó
        if ($search = $request->input('search')) {
            $search = strtolower($search);
            $query->whereHas('student.user.profile', function ($q) use ($search) {
                $q->whereRaw("CONCAT(LOWER(first_name), ' ', LOWER(last_name), ' ', LOWER(second_last_name)) like ?", ["%{$search}%"]);
            });
        }

        // Aplicar ordenamiento
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginar resultados
        $responses = $query->paginate(10)->withQueryString();

        // Obtener datos de la sesión de aprendizaje si está filtrada
        $learningSession = null;
        if ($learningSessionId) {
            $learningSession = \App\Models\LearningSession::with([
                'competency',
                'capabilities',
                'teacherClassroomCurricularAreaCycle.classroom',
                'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
                'applicationForm',
            ])->find($learningSessionId);
        }

        // Retornar vista Inertia con los datos
        return Inertia::render('teacher/application-form-responses/index', [
            'application_form_responses' => $responses,
            'learning_session' => $learningSession,
            'filters' => $request->only([
                'search',
                'learning_session_id',
                'sort_field',
                'sort_direction',
            ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Primero obtenemos la respuesta del formulario con las relaciones básicas
        $applicationFormResponse = ApplicationFormResponse::with([
            'applicationForm',
            'responseQuestions.applicationFormQuestion.question.questionType',
            'responseQuestions.selectedOptions.questionOption',
        ])
            ->where('id', $id)
            ->firstOrFail();

        // Cargamos las preguntas con sus relaciones y las ordenamos
        $applicationFormResponse->load([
            'responseQuestions' => function ($query) {
                $query->select('application_form_response_questions.*')
                    ->join('application_form_questions as afq', 'afq.id', '=', 'application_form_response_questions.application_form_question_id')
                    ->orderBy('afq.order', 'asc')
                    ->with([
                        'applicationFormQuestion' => function ($query) {
                            $query->with([
                                'question' => function ($query) {
                                    $query->with([
                                        'questionType',
                                        'options',
                                    ]);
                                },
                            ]);
                        },
                        'selectedOptions.questionOption',
                    ]);
            },
        ]);

        $formattedResponse = $applicationFormResponse->toArray();
        $formattedResponse['response_questions'] = $applicationFormResponse->responseQuestions->map(function ($question) {
            return array_merge($question->toArray(), [
                'question' => $question->applicationFormQuestion->question ?? null,
                'selected_options' => $question->selectedOptions->map(function ($option) {
                    return array_merge($option->toArray(), [
                        'question_option' => $option->questionOption,
                        'is_correct' => $option->is_correct,
                    ]);
                }),
                'score' => $question->score,
                'feedback' => $question->feedback,
            ]);
        });

        return Inertia::render('teacher/application-form-responses/show/index', [
            'application_form_response' => $formattedResponse,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        // Primero obtenemos la respuesta del formulario con las relaciones básicas
        $applicationFormResponse = ApplicationFormResponse::with([
            'applicationForm',
            'responseQuestions.applicationFormQuestion.question.questionType',
            'responseQuestions.selectedOptions.questionOption',
        ])
            ->where('id', $id)
            ->firstOrFail();

        // Cargamos las preguntas con sus relaciones y las ordenamos
        $applicationFormResponse->load([
            'responseQuestions' => function ($query) {
                $query->select('application_form_response_questions.*')
                    ->join('application_form_questions as afq', 'afq.id', '=', 'application_form_response_questions.application_form_question_id')
                    ->orderBy('afq.order', 'asc')
                    ->with([
                        'applicationFormQuestion' => function ($query) {
                            $query->with([
                                'question' => function ($query) {
                                    $query->with([
                                        'questionType',
                                        'options',
                                    ]);
                                },
                            ]);
                        },
                        'selectedOptions.questionOption',
                    ]);
            },
        ]);

        $formattedResponse = $applicationFormResponse->toArray();
        $formattedResponse['response_questions'] = $applicationFormResponse->responseQuestions->map(function ($question) {
            return array_merge($question->toArray(), [
                'question' => $question->applicationFormQuestion->question ?? null,
                'selected_options' => $question->selectedOptions->map(function ($option) {
                    return array_merge($option->toArray(), [
                        'question_option' => $option->questionOption,
                        'is_correct' => $option->is_correct,
                    ]);
                }),
                'score' => $question->score,
                'feedback' => $question->feedback,
            ]);
        });

        return Inertia::render('teacher/application-form-responses/edit/index', [
            'application_form_response' => $formattedResponse,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * This method handles the grading of student responses with the following logic:
     * 1. Validates that manual_score can only be used when is_correct = true
     * 2. Calculates points difference to prevent duplication on re-grading
     * 3. Applies difficulty multiplier (easy: 2, medium: 3, hard: 5) to points calculation
     * 4. Auto-calculates is_correct based on final score
     * 5. Updates student points_store and experience based on score differences
     */
    public function update(Request $request, string $id)
    {

        $validated = $request->validate([
            'response_questions' => 'required|array',
            'response_questions.*.id' => 'required|exists:application_form_response_questions,id',
            'response_questions.*.is_correct' => 'required|boolean',
            'response_questions.*.manual_score' => 'nullable|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $applicationFormResponse = ApplicationFormResponse::with('student')->findOrFail($id);

            // Calcular totales antes de actualizar para simplificar la lógica de puntos
            $oldTotalPointsStore = $applicationFormResponse->responseQuestions->sum('points_store');
            $oldTotalScore = $applicationFormResponse->score;

            // Cambiar estado a calificado
            $applicationFormResponse->update([
                'status' => 'graded',
                'graded_at' => now(),
            ]);

            $totalScore = 0;

            foreach ($validated['response_questions'] as $responseQuestion) {
                // Cargar la pregunta de respuesta con sus relaciones necesarias
                $applicationFormResponseQuestion = ApplicationFormResponseQuestion::with([
                    'applicationFormQuestion.question',
                    'applicationFormQuestion',
                ])
                    ->where('id', $responseQuestion['id'])->firstOrFail();

                $maxScore = $applicationFormResponseQuestion->applicationFormQuestion->score;
                $maxPointsStore = $applicationFormResponseQuestion->applicationFormQuestion->points_store;
                $manualScore = $responseQuestion['manual_score'] ?? null;

                // Validación: manual_score solo puede usarse cuando is_correct es true
                if ($manualScore !== null && ! $responseQuestion['is_correct']) {
                    throw new \Exception('No se puede asignar puntaje manual sin marcar como correcto');
                }

                // Validación: manual_score no puede exceder el puntaje máximo
                if ($manualScore !== null && $manualScore > $maxScore) {
                    throw new \Exception('El puntaje manual no puede exceder el puntaje máximo de la pregunta');
                }

                // Calcular el puntaje y points_store basado en manual_score o is_correct
                if ($manualScore !== null) {
                    // Si se proporciona manual_score, usar ese valor y recalcular points_store proporcionalmente
                    $score = min($manualScore, $maxScore); // Asegurar que no exceda el máximo
                    // Recalcular points_store proporcionalmente basado en el manual_score
                    // points_store ya incluye el multiplicador de dificultad del application form
                    $pointsStore = ($score / $maxScore) * $maxPointsStore;
                } elseif ($responseQuestion['is_correct']) {
                    // Si no hay manual_score pero está marcado como correcto, usar flujo natural
                    $score = $maxScore;
                    $pointsStore = $maxPointsStore;
                } else {
                    // Si no hay manual_score y está marcado como incorrecto, usar flujo natural
                    $score = 0;
                    $pointsStore = 0;
                }

                // Auto-calcular is_correct basado en el puntaje final
                // is_correct = true si score > 0, false si score = 0
                $isCorrect = $score > 0;

                // Actualizar la pregunta de respuesta
                $applicationFormResponseQuestion->update([
                    'is_correct' => $isCorrect,
                    'score' => $score,
                    'points_store' => $pointsStore,
                ]);

                $totalScore += $score;
            }

            // Actualizar el puntaje total del formulario de respuesta
            $applicationFormResponse->update([
                'score' => $totalScore,
            ]);

            // Calcular el nuevo total de points_store después de todas las actualizaciones
            $newTotalPointsStore = $applicationFormResponse->responseQuestions->fresh()->sum('points_store');

            // Calcular la diferencia total de points_store
            $pointsDifference = $newTotalPointsStore - $oldTotalPointsStore;

            // Aplicar la diferencia total una sola vez al estudiante
            // Esto simplifica la lógica y previene duplicación al re-calificar
            if ($pointsDifference !== 0) {
                $student = $applicationFormResponse->student;
                $student->update([
                    'points_store' => max(0, $student->points_store + $pointsDifference),
                ]);
            }

            // Calcular la diferencia de experiencia total
            $experienceDifference = $totalScore - $oldTotalScore;

            // Actualizar la experiencia del estudiante basado en la diferencia total
            // Esto previene duplicación de experiencia al re-calificar
            if ($experienceDifference !== 0) {
                DB::statement('SELECT spu_student_progress_upd(:user_id, :experience)', [
                    'user_id' => $applicationFormResponse->student->user_id,
                    'experience' => $experienceDifference,
                ]);
            }

            DB::commit();

            // Obtener el learning_session_id para mantener el contexto de navegación
            $learningSessionId = $applicationFormResponse->applicationForm->learning_session_id;

            return redirect()
                ->route('teacher.application-form-responses.index', ['learning_session_id' => $learningSessionId])
                ->with('success', 'Retroalimentación guardada correctamente');
        } catch (\Exception $e) {
            DB::rollBack();

            // Obtener el learning_session_id para mantener el contexto de navegación
            $learningSessionId = $applicationFormResponse->applicationForm->learning_session_id ?? null;

            return redirect()
                ->route('teacher.application-form-responses.index', $learningSessionId ? ['learning_session_id' => $learningSessionId] : [])
                ->with('error', 'Error al revisar la respuesta: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
