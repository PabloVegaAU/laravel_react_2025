<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicationFormResponseQuestion extends Model
{
    use SoftDeletes;

    protected $table = 'application_form_response_questions';

    protected $fillable = [
        'application_form_response_id',
        'application_form_question_id',
        'explanation',
        'score',
        'points_store',
        'is_correct',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'points_store' => 'decimal:2',
        'is_correct' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'score' => 0.00,
        'points_store' => 0.00,
        'is_correct' => false,
    ];

    public function applicationFormResponse(): BelongsTo
    {
        return $this->belongsTo(
            ApplicationFormResponse::class,
            'application_form_response_id',
            'id'
        )->withTrashed();
    }

    public function applicationFormQuestion(): BelongsTo
    {
        return $this->belongsTo(
            ApplicationFormQuestion::class,
            'application_form_question_id',
            'id'
        );
    }

    public function selectedOptions(): HasMany
    {
        return $this->hasMany(
            ApplicationFormResponseQuestionOption::class,
            'application_form_response_question_id',
            'id'
        );
    }

    public function questionOption(): BelongsTo
    {
        return $this->belongsTo(
            QuestionOption::class,
            'question_option_id',
            'id'
        );
    }

    public function scopeForResponse(Builder $query, int $responseId): Builder
    {
        return $query->where('application_form_response_id', $responseId);
    }

    public function scopeForQuestion(Builder $query, int $questionId): Builder
    {
        return $query->where('application_form_question_id', $questionId);
    }

    public function updateScore(): bool
    {
        try {
            // Cargar las relaciones necesarias para asegurar que los datos están actualizados
            $this->load([
                'applicationFormQuestion.question.options', // Opciones originales con las respuestas correctas
                'selectedOptions' => function ($query) {
                    $query->withTrashed(); // Incluir opciones eliminadas temporalmente
                },
            ]);

            $question = $this->applicationFormQuestion->question;
            $studentSelectedOptions = $this->selectedOptions;

            // Inicializar variables para el cálculo
            $score = 0.00;
            $pointsStore = 0.00;

            // Obtener la respuesta del estudiante desde el request
            $response = request()->input('responses.'.$this->application_form_question_id, [
                'selected_options' => [],
                'order' => [],
                'pairs' => [],
            ]);

            // Lógica de calificación por tipo de pregunta
            switch ($question->question_type_id) {
                case 1: // Respuesta única
                case 4: // Verdadero o Falso
                    $selectedOptionId = $response['selected_options'][0] ?? null;
                    $correctOption = $question->options->firstWhere('is_correct', true);
                    $isCorrect = $correctOption && $selectedOptionId == $correctOption->id;

                    // Actualizar is_correct en la opción seleccionada
                    if ($selectedOption = $studentSelectedOptions->firstWhere('question_option_id', $selectedOptionId)) {
                        $selectedOption->update(['is_correct' => $isCorrect]);
                    }

                    if ($isCorrect) {
                        $score = $this->applicationFormQuestion->score;
                        $pointsStore = $this->applicationFormQuestion->points_store;
                    }
                    break;

                case 2: // Ordenar
                    // Obtener las opciones con su orden correcto
                    $correctOptions = $question->options
                        ->whereNotNull('correct_order')
                        ->sortBy('correct_order')
                        ->values();

                    // Obtener las opciones seleccionadas por el estudiante ordenadas por selected_order
                    $selectedOptions = $this->selectedOptions()
                        ->with(['questionOption'])
                        ->orderBy('selected_order')
                        ->get();

                    $totalOptions = $correctOptions->count();
                    $correctCount = 0;

                    // Verificar cada opción en el orden seleccionado
                    foreach ($selectedOptions as $index => $selectedOption) {
                        $isInCorrectPosition = false;

                        // Verificar si la opción está en la posición correcta
                        if (isset($correctOptions[$index]) &&
                            $selectedOption->question_option_id === $correctOptions[$index]->id) {
                            $correctCount++;
                            $isInCorrectPosition = true;
                        }

                        // Actualizar el estado de la opción
                        $selectedOption->update(['is_correct' => $isInCorrectPosition]);
                    }

                    // Calcular puntuación basada en el porcentaje de opciones en la posición correcta
                    if ($totalOptions > 0) {
                        $correctPercentage = ($correctCount / $totalOptions) * 100;
                        $score = ($this->applicationFormQuestion->score * $correctPercentage) / 100;
                        $pointsStore = ($this->applicationFormQuestion->points_store * $correctPercentage) / 100;

                        // Redondear a 2 decimales
                        $score = round($score, 2);
                        $pointsStore = round($pointsStore, 2);
                    }
                    break;

                case 3: // Emparejar
                    $pairs = $response['pairs'] ?? [];
                    $leftOptions = $question->options->where('pair_side', 'left');
                    $rightOptions = $question->options->where('pair_side', 'right');
                    $totalPairs = $leftOptions->count();
                    $correctPairsCount = 0;

                    // Crear mapa de opciones por ID para búsqueda rápida
                    $allOptions = $question->options->keyBy('id');

                    // Reiniciar is_correct para todas las opciones
                    $this->selectedOptions()->update(['is_correct' => false]);

                    if ($totalPairs > 0) {
                        // Verificar cada par en la respuesta del estudiante
                        foreach ($pairs as $leftId => $rightId) {
                            $leftOption = $allOptions->get($leftId);
                            $rightOption = $allOptions->get($rightId);

                            // Verificar si el par es correcto (mismo pair_key)
                            $isPairCorrect = $leftOption && $rightOption &&
                                           $leftOption->pair_key === $rightOption->pair_key;

                            // Actualizar is_correct para este par
                            if ($selectedOption = $studentSelectedOptions->firstWhere('question_option_id', $leftId)) {
                                $selectedOption->update([
                                    'is_correct' => $isPairCorrect,
                                    'paired_with_option_id' => $rightId,
                                ]);
                            }

                            if ($isPairCorrect) {
                                $correctPairsCount++;
                            }
                        }

                        // Calcular puntuación parcial
                        $scorePerPair = $this->applicationFormQuestion->score / $totalPairs;
                        $pointsPerPair = $this->applicationFormQuestion->points_store / $totalPairs;

                        $score = $scorePerPair * $correctPairsCount;
                        $pointsStore = $pointsPerPair * $correctPairsCount;
                    }
                    break;

                default:
                    // Tipo de pregunta no soportado, puntuación es cero
                    $score = 0.00;
                    $pointsStore = 0.00;
                    break;
            }

            // Asignar los valores calculados
            $this->score = $score;
            $this->points_store = $pointsStore;

            return $this->save();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Sincroniza las opciones seleccionadas para esta respuesta de pregunta.
     *
     * @param  array  $selectedOptions  Array de opciones seleccionadas. Puede ser:
     *                                  - Un array de IDs de opción (compatibilidad hacia atrás)
     *                                  - Un array asociativo donde la clave es el ID de opción y el valor es un array con datos de la opción
     *
     * @throws \Exception
     */
    public function syncSelectedOptions(array $optionsData): void
    {
        try {
            // Obtener los IDs de las opciones que se van a sincronizar
            $optionIds = array_map('intval', array_keys($optionsData));

            // Incluir registros eliminados suavemente para evitar errores de unicidad
            $existingOptions = $this->selectedOptions()
                ->withTrashed()
                ->whereIn('question_option_id', $optionIds)
                ->get()
                ->keyBy('question_option_id');

            // Procesar cada opción
            foreach ($optionsData as $optionId => $data) {
                $optionId = (int) $optionId;

                if ($existingOptions->has($optionId)) {
                    $existingOption = $existingOptions[$optionId];

                    // Si la opción estaba eliminada, restaurarla
                    if ($existingOption->trashed()) {
                        $existingOption->restore();
                    }

                    // Actualizar los datos
                    $existingOption->update($data);
                } else {
                    // Usar updateOrCreate para manejar condiciones de carrera
                    $this->selectedOptions()->updateOrCreate(
                        [
                            'application_form_response_question_id' => $this->id,
                            'question_option_id' => $optionId,
                        ],
                        $data
                    );
                }
            }

            // Eliminar opciones que ya no están en la selección (y no están ya eliminadas)
            $this->selectedOptions()
                ->whereNotIn('question_option_id', $optionIds)
                ->delete();

            // Recargar la relación para asegurar que tenemos los datos más recientes
            $this->load('selectedOptions');
        } catch (\Exception $e) {

            throw $e;
        }
    }
}
