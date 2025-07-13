<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionOption extends Model
{
    use SoftDeletes;

    protected $table = 'question_options';

    protected $fillable = [
        'question_id',
        'value',
        'is_correct',
        'order',
        'correct_order',
        'pair_key',
        'pair_side',
        'score',
        'feedback',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'order' => 'integer',
        'correct_order' => 'integer',
        'score' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'is_correct' => false,
        'order' => 0,
        'correct_order' => 0,
        'score' => 0.00,
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id', 'id')->withTrashed();
    }

    public function responseQuestionOptions(): HasMany
    {
        return $this->hasMany(ApplicationFormResponseQuestionOption::class, 'question_option_id', 'id');
    }

    public function scopeCorrect(Builder $query): Builder
    {
        return $query->where('is_correct', true);
    }

    public function scopeForQuestion(Builder $query, int $questionId): Builder
    {
        return $query->where('question_id', $questionId);
    }

    public function scopeForPair(Builder $query, string $pairKey): Builder
    {
        return $query->where('pair_key', $pairKey);
    }

    public function scopeLeftSide(Builder $query): Builder
    {
        return $query->where('pair_side', 'left');
    }

    public function scopeRightSide(Builder $query): Builder
    {
        return $query->where('pair_side', 'right');
    }

    public function isLeftSide(): bool
    {
        return $this->pair_side === 'left';
    }

    public function isRightSide(): bool
    {
        return $this->pair_side === 'right';
    }
}
