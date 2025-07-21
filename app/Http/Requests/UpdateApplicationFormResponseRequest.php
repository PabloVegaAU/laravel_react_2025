<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationFormResponseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'responses' => 'required|array',
            'responses.*.application_form_question_id' => 'required|exists:application_form_questions,id',
            'responses.*.selected_options' => 'sometimes|array',
            'responses.*.selected_options.*' => 'exists:question_options,id',
            'responses.*.explanation' => 'nullable|string',
            'responses.*.order' => 'nullable|array',
            'responses.*.order.*' => 'exists:question_options,id',
            'responses.*.pairs' => 'nullable|array',
            'responses.*.pairs.*' => 'integer|exists:question_options,id',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($this->responses as $key => $response) {
                $question = \App\Models\ApplicationFormQuestion::with('question.questionType')
                    ->find($response['application_form_question_id']);

                if (! $question) {
                    continue;
                }

                $questionType = $question->question->question_type_id;
                $selectedOptions = $response['selected_options'] ?? [];
                $order = $response['order'] ?? [];
                $pairs = $response['pairs'] ?? [];

                switch ($questionType) {
                    case 1: // Single Choice
                    case 4: // True/False
                        // Validación para preguntas de opción única y verdadero/falso
                        if (empty($selectedOptions)) {
                            $validator->errors()->add(
                                "responses.{$key}.selected_options",
                                'Debe seleccionar una opción.'
                            );
                        }

                        if (count($selectedOptions) > 1) {
                            $validator->errors()->add(
                                "responses.{$key}.selected_options",
                                'Solo se permite seleccionar una opción para este tipo de pregunta.'
                            );
                        }
                        break;

                    case 2: // Ordering
                        if (empty($order)) {
                            $validator->errors()->add(
                                "responses.{$key}.order",
                                'Debe proporcionar un orden para las opciones.'
                            );
                        }

                        if (count($order) !== count(array_unique($order))) {
                            $validator->errors()->add(
                                "responses.{$key}.order",
                                'Las opciones no pueden estar duplicadas en el orden.'
                            );
                        }
                        break;

                    case 3: // Matching
                        if (empty($pairs)) {
                            $validator->errors()->add(
                                "responses.{$key}.pairs",
                                'Debe proporcionar los pares para las opciones.'
                            );
                        } else {
                            // Validate that all left and right options are properly paired
                            $leftOptions = array_keys($pairs);
                            $rightOptions = array_values($pairs);

                            if (count($leftOptions) !== count(array_unique($leftOptions))) {
                                $validator->errors()->add(
                                    "responses.{$key}.pairs",
                                    'No se pueden repetir las opciones de la izquierda.'
                                );
                            }

                            if (count($rightOptions) !== count(array_unique($rightOptions))) {
                                $validator->errors()->add(
                                    "responses.{$key}.pairs",
                                    'No se pueden repetir las opciones de la derecha.'
                                );
                            }
                        }
                        break;
                }
            }
        });
    }
}
