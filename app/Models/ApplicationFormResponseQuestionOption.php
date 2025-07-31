<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicationFormResponseQuestionOption extends Model
{
    use SoftDeletes;

    protected $table = 'application_form_response_question_options';

    protected $fillable = [
        'application_form_response_question_id',
        'question_option_id',
        'is_correct',
        'selected_order',
        'paired_with_option_id',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'score' => 0.00,
        'is_correct' => false,
    ];

    public function applicationFormResponseQuestion(): BelongsTo
    {
        return $this->belongsTo(
            ApplicationFormResponseQuestion::class,
            'application_form_response_question_id',
            'id'
        )->withTrashed();
    }

    public function questionOption(): BelongsTo
    {
        return $this->belongsTo(
            QuestionOption::class,
            'question_option_id',
            'id'
        );
    }

    public function pairedWithOption(): BelongsTo
    {
        return $this->belongsTo(
            QuestionOption::class,
            'paired_with_option_id',
            'id'
        )->withTrashed();
    }

    public function scopeForResponseQuestion(Builder $query, int $responseQuestionId): Builder
    {
        return $query->where('application_form_response_question_id', $responseQuestionId);
    }

    public function scopeForQuestionOption(Builder $query, int $optionId): Builder
    {
        return $query->where('question_option_id', $optionId);
    }

    public function scopeCorrectAnswers(Builder $query): Builder
    {
        return $query->where('is_correct', true);
    }

    public function syncWithQuestionOption(): void
    {
        if ($this->questionOption) {
            $this->is_correct = $this->questionOption->is_correct;
            $this->save();
        }
    }
}
