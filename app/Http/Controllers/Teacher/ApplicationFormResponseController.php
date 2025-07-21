<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationFormResponse;
use App\Models\ApplicationFormResponseQuestion;
use Illuminate\Http\Request;
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
            'applicationForm.learningSession.teacherClassroomCurricularAreaCycle.classroom',
            'applicationForm.learningSession.teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
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
            $query->whereHas('student.user.profile', function ($q) use ($search) {
                $q->whereRaw("CONCAT(first_name, ' ', last_name, ' ', second_last_name) like ?", ["%{$search}%"]);
            });
        }

        // Aplicar ordenamiento
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginar resultados
        $responses = $query->paginate(10)->withQueryString();

        // Retornar vista Inertia con los datos
        return Inertia::render('teacher/application-form-responses/index', [
            'application_form_responses' => $responses,
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
        $applicationFormResponse = ApplicationFormResponse::with([
            'applicationForm',
            'responseQuestions' => function ($query) {
                $query->with([
                    'applicationFormQuestion',
                    'applicationFormQuestion.question' => function ($query) {
                        $query->with(['questionType', 'options']);
                    },
                    'selectedOptions' => function ($query) {
                        $query->with('questionOption');
                    },
                    'questionOption',
                ]);
            },
        ])
            ->where('id', $id)
            ->firstOrFail();

        $formattedResponse = $applicationFormResponse->toArray();
        $formattedResponse['response_questions'] = $applicationFormResponse->responseQuestions->map(function ($question) {
            return array_merge($question->toArray(), [
                'question' => $question->applicationFormQuestion->question ?? null,
                'selected_options' => $question->selectedOptions->map(function ($option) {
                    return array_merge($option->toArray(), [
                        'question_option' => $option->questionOption,
                        'is_correct' => $option->is_correct,
                        'score' => $option->score,
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
        $applicationFormResponse = ApplicationFormResponse::with([
            'applicationForm',
            'responseQuestions' => function ($query) {
                $query->with([
                    'applicationFormQuestion',
                    'applicationFormQuestion.question' => function ($query) {
                        $query->with(['questionType', 'options']);
                    },
                    'selectedOptions' => function ($query) {
                        $query->with('questionOption');
                    },
                    'questionOption',
                ]);
            },
        ])
            ->where('id', $id)
            ->firstOrFail();

        $formattedResponse = $applicationFormResponse->toArray();
        $formattedResponse['response_questions'] = $applicationFormResponse->responseQuestions->map(function ($question) {
            return array_merge($question->toArray(), [
                'question' => $question->applicationFormQuestion->question ?? null,
                'selected_options' => $question->selectedOptions->map(function ($option) {
                    return array_merge($option->toArray(), [
                        'question_option' => $option->questionOption,
                        'is_correct' => $option->is_correct,
                        'score' => $option->score,
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
     */
    public function update(Request $request, string $id)
    {

        $data = $request->validate([
            'response_questions' => 'required|array',
            'response_questions.*.id' => 'required|exists:application_form_response_questions,id',
            'response_questions.*.is_correct' => 'required|boolean',
        ]);

        $applicationFormResponse = ApplicationFormResponse::findOrFail($id);

        // Cambiar estado
        $applicationFormResponse->update([
            'status' => 'graded',
            'graded_at' => now(),
        ]);

        foreach ($data['response_questions'] as $question) {
            ApplicationFormResponseQuestion::where('id', $question['id'])->update([
                'is_correct' => $question['is_correct'],
            ]);
        }

        return redirect()
            ->route('teacher.application-form-responses.index')
            ->with('success', 'Retroalimentación guardada correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
