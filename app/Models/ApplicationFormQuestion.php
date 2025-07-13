<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationFormQuestion extends Model
{
    protected $table = 'application_form_questions';

    protected $fillable = [
        'application_form_id',
        'question_id',
        'order',
        'score',
        'points_store',
    ];

    protected $casts = [
        'order' => 'integer',
        'score' => 'decimal:2',
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'score' => 0.00,
        'points_store' => 0.00,
    ];

    public function applicationForm(): BelongsTo
    {
        return $this->belongsTo(ApplicationForm::class, 'application_form_id', 'id')
            ->withTrashed();
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id', 'id')
            ->withTrashed();
    }

    public function responseQuestions(): HasMany
    {
        return $this->hasMany(
            ApplicationFormResponseQuestion::class,
            'application_form_question_id',
            'id'
        );
    }

    public function scopeForApplicationForm(Builder $query, int $applicationFormId): Builder
    {
        return $query->where('application_form_id', $applicationFormId);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order');
    }

    public function scopeWithQuestion(Builder $query, int $questionId): Builder
    {
        return $query->where('question_id', $questionId);
    }

    public function isCorrectAnswer(array $selectedOptions): bool
    {
        $correctOptions = $this->question->options()
            ->where('is_correct', true)
            ->pluck('id')
            ->toArray();

        sort($correctOptions);
        sort($selectedOptions);

        return $correctOptions === $selectedOptions;
    }
}
