<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateApplicationFormResponseRequest;
use App\Models\ApplicationFormResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApplicationFormResponseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(int $id)
    {
        // Cargar la respuesta del formulario con todas las relaciones necesarias en una sola consulta
        $applicationFormResponse = ApplicationFormResponse::query()
            ->with([
                'applicationForm',
                'responseQuestions' => function ($query) {
                    $query->with([
                        'applicationFormQuestion' => function ($query) {
                            $query->with([
                                'question' => function ($query) {
                                    $query->with([
                                        'questionType',
                                        'options' => function ($query) {
                                            $query->orderBy('order');
                                        },
                                    ]);
                                },
                            ])
                                ->orderBy('order');
                        },
                        'selectedOptions' => function ($query) {
                            $query->with('questionOption');
                        },
                    ]);
                },
            ])
            ->where('id', $id)
            ->where('student_id', auth()->id())
            ->firstOrFail();

        // Ordenar las preguntas por el orden definido en el formulario
        $formattedResponse = $applicationFormResponse->toArray();
        $formattedResponse['response_questions'] = $applicationFormResponse->responseQuestions
            ->sortBy('applicationFormQuestion.order')
            ->values()
            ->map(function ($question) {
                return array_merge($question->toArray(), [
                    'question' => $question->applicationFormQuestion->question ?? null,
                    'selected_options' => $question->selectedOptions->map(function ($option) {
                        return array_merge($option->toArray(), [
                            'question_option' => $option->questionOption,
                            'is_correct' => $option->is_correct,
                        ]);
                    })->sortBy('selected_order')->values(),
                    'score' => $question->score,
                ]);
            });

        return Inertia::render('student/application-form-response/show', [
            'application_form_response' => $formattedResponse,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        // Cargar la respuesta del formulario con todas las relaciones necesarias en una sola consulta
        $applicationFormResponse = ApplicationFormResponse::query()
            ->with([
                'applicationForm.learningSession',
                'responseQuestions' => function ($query) {
                    $query->with([
                        'applicationFormQuestion' => function ($query) {
                            $query->with([
                                'question' => function ($query) {
                                    $query->with([
                                        'questionType',
                                        'options' => function ($query) {
                                            $query->orderBy('order');
                                        },
                                    ]);
                                },
                            ])
                                ->orderBy('order');
                        },
                        'selectedOptions.questionOption',
                    ]);
                },
            ])
            ->where('id', $id)
            ->where('student_id', auth()->id())
            ->firstOrFail();

        // Si el formulario no ha sido enviado, aleatorizar opciones de ordenamiento y emparejamiento
        if ($applicationFormResponse->status === 'pending') {
            $applicationFormResponse->responseQuestions->each(function ($responseQuestion) {
                $question = $responseQuestion->applicationFormQuestion->question;
                $questionTypeId = $question->questionType->id;

                // Solo aleatorizar si no hay opciones seleccionadas
                if ($responseQuestion->selectedOptions->isEmpty() && in_array($questionTypeId, [2, 3])) {
                    // Crear una colección mutable para las opciones
                    $options = $question->options;

                    // Aleatorizar el orden de las opciones
                    $shuffledOptions = $options->shuffle();

                    // Reemplazar la colección de opciones con la versión aleatorizada
                    $question->setRelation('options', $shuffledOptions);
                }
            });
        }

        // Transformar los datos para el frontend
        $formattedResponse = $applicationFormResponse->toArray();
        $formattedResponse['response_questions'] = $applicationFormResponse->responseQuestions
            ->sortBy('applicationFormQuestion.order')
            ->values()
            ->map(function ($question) {
                return array_merge($question->toArray(), [
                    'question' => $question->applicationFormQuestion->question ?? null,
                    'selected_options' => $question->selectedOptions->map(function ($option) {
                        return array_merge($option->toArray(), [
                            'question_option' => $option->questionOption,
                            'is_correct' => $option->is_correct,
                        ]);
                    })->sortBy('selected_order')->values(),
                    'score' => $question->score,
                ]);
            });

        // Start the timer
        $applicationFormResponse->markAsStarted();

        return Inertia::render('student/application-form-response/edit/index', [
            'application_form_response' => $formattedResponse,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationFormResponseRequest $request, int $id)
    {
        $response = ApplicationFormResponse::with([
            'responseQuestions' => function ($query) {
                $query->with([
                    'applicationFormQuestion.question',
                    'selectedOptions',
                ]);
            },
        ])->findOrFail($id);

        // Verificar permisos
        if ($response->student_id !== auth()->id()) {
            return back()->with('error', 'No tienes permiso para modificar esta respuesta.');
        }

        // Verificar estado
        if (in_array($response->status, ['submitted', 'graded'])) {
            return back()->with('error', 'No se puede modificar una respuesta ya enviada o calificada.');
        }

        try {
            return DB::transaction(function () use ($request, $response) {
                foreach ($request->validated('responses') as $responseData) {
                    // Buscar respuesta existente o crear una nueva
                    $questionResponse = $response->responseQuestions()
                        ->withTrashed()
                        ->firstOrNew(
                            ['application_form_question_id' => $responseData['application_form_question_id']],
                            ['application_form_response_id' => $response->id]
                        );

                    // Si estaba eliminado, restaurar
                    if ($questionResponse->trashed()) {
                        $questionResponse->restore();
                    }

                    // Actualizar datos básicos
                    $questionResponse->fill([
                        'explanation' => $responseData['explanation'] ?? null,
                    ]);

                    // Guardar la respuesta si es nueva
                    if (! $questionResponse->exists) {
                        $questionResponse->save();
                    } else {
                        $questionResponse->update();
                    }

                    // Cargar las opciones existentes para esta respuesta, incluyendo eliminadas
                    $questionResponse->load(['selectedOptions']);

                    // Obtener el tipo de pregunta
                    $question = $questionResponse->applicationFormQuestion->question;
                    $questionTypeId = $question->question_type_id;
                    $optionsToSync = [];

                    // Ensure response data has required structure
                    $responseData = array_merge([
                        'selected_options' => [],
                        'order' => [],
                        'pairs' => [],
                        'explanation' => null,
                    ], $responseData);

                    // Validar el tipo de pregunta
                    if (! in_array($questionTypeId, [1, 2, 3, 4, 5])) {
                        throw new \Exception("Tipo de pregunta no válido: {$questionTypeId}");
                    }

                    // Procesar según el tipo de pregunta
                    switch ($questionTypeId) {
                        case 2: // Ordenar
                            // Usar el array 'order' si está presente, de lo contrario usar 'selected_options'
                            $orderedOptions = $responseData['order'] ?? $responseData['selected_options'] ?? [];
                            if (! is_array($orderedOptions)) {
                                throw new \Exception('Formato de orden inválido');
                            }

                            foreach ($orderedOptions as $index => $optionId) {
                                $optionId = (int) $optionId;
                                $optionsToSync[$optionId] = [
                                    'question_option_id' => $optionId,
                                    'is_correct' => false, // Se actualizará después
                                    'selected_order' => $index + 1,
                                ];
                            }
                            break;

                        case 3: // Emparejar
                            $pairs = $responseData['pairs'] ?? [];
                            if (! is_array($pairs)) {
                                throw new \Exception('Formato de pares inválido');
                            }

                            // Procesar cada par
                            foreach ($pairs as $leftId => $rightId) {
                                $leftId = (int) $leftId;
                                $rightId = (int) $rightId;

                                // Solo procesar si ambos IDs son válidos
                                if ($leftId > 0 && $rightId > 0) {
                                    $optionsToSync[$leftId] = [
                                        'question_option_id' => $leftId,
                                        'is_correct' => false, // Se actualizará después
                                        'paired_with_option_id' => $rightId,
                                    ];
                                }
                            }
                            break;

                        case 1: // Respuesta única
                        case 4: // Verdadero/Falso
                            $selectedOptions = $responseData['selected_options'] ?? [];
                            if (! is_array($selectedOptions)) {
                                throw new \Exception('Formato de opciones seleccionadas inválido');
                            }

                            // Para preguntas de selección única, solo tomar el primer elemento si hay más de uno
                            if ($questionTypeId === 1 && count($selectedOptions) > 1) {
                                $selectedOptions = [reset($selectedOptions)];
                            }

                            foreach ($selectedOptions as $optionId) {
                                $optionId = (int) $optionId;
                                $optionsToSync[$optionId] = [
                                    'question_option_id' => $optionId,
                                    'is_correct' => false, // Se actualizará después
                                ];
                            }
                            break;
                        case 5: // Respuesta abierta
                            break;

                        default:
                            throw new \Exception("Tipo de pregunta no soportado: {$questionTypeId}");
                    }

                    // Sincronizar las opciones con la base de datos
                    $questionResponse->syncSelectedOptions($optionsToSync);

                    // Actualizar puntuación de la pregunta
                    if (! $questionResponse->updateScore()) {
                        throw new \Exception('Error al actualizar la puntuación de la pregunta.');
                    }
                }

                // Actualizar puntuación total
                if (! $response->updateTotalScore()) {
                    throw new \Exception('Error al actualizar el puntaje total.');
                }

                // Marcar como enviado si se indica en la petición
                if (! $response->markAsSubmitted()) {
                    throw new \Exception('No se pudo marcar el formulario como enviado.');
                }

                return redirect()
                    ->route('student.application-form-responses.show', $response->id)
                    ->with('success', 'Respuestas guardadas correctamente');
            });
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
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
