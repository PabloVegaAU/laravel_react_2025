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

    protected $table = 'application_form_response_question';

    protected $fillable = [
        'application_form_response_id',
        'application_form_question_id',
        'question_option_id',
        'explanation',
        'score',
        'points_store',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'score' => 0.00,
        'points_store' => 0.00,
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
        )->withTrashed();
    }

    public function questionOption(): BelongsTo
    {
        return $this->belongsTo(
            QuestionOption::class,
            'question_option_id',
            'id'
        )->withTrashed();
    }

    public function selectedOptions(): HasMany
    {
        return $this->hasMany(
            ApplicationFormResponseQuestionOption::class,
            'application_form_response_question_id',
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

    public function scopeWithOption(Builder $query, int $optionId): Builder
    {
        return $query->where('question_option_id', $optionId);
    }

    public function getIsCorrectAttribute(): bool
    {
        if ($this->questionOption) {
            return $this->questionOption->is_correct;
        }

        return false;
    }

    public function updateScore(): void
    {
        $this->score = $this->is_correct ?
            $this->applicationFormQuestion->score : 0;

        $this->points_store = $this->is_correct ?
            $this->applicationFormQuestion->points_store : 0;

        $this->save();
    }
}
