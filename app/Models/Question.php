<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use SoftDeletes;

    public const DIFFICULTY_EASY = 'easy';

    public const DIFFICULTY_MEDIUM = 'medium';

    public const DIFFICULTY_HARD = 'hard';

    public const LEVEL_PRIMARY = 'primary';

    public const LEVEL_SECONDARY = 'secondary';

    protected $table = 'questions';

    protected $fillable = [
        'teacher_id',
        'question_type_id',
        'capability_id',
        'name',
        'description',
        'image',
        'help_message',
        'difficulty',
        'explanation_required',
        'correct_feedback',
        'incorrect_feedback',
        'level',
        'grades',
    ];

    protected $casts = [
        'difficulty' => 'string',
        'explanation_required' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'grades' => 'array',
    ];

    protected $attributes = [
        'difficulty' => self::DIFFICULTY_EASY,
        'explanation_required' => false,
        'level' => self::LEVEL_PRIMARY,
        'grades' => '[]',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'user_id');
    }

    public function questionType(): BelongsTo
    {
        return $this->belongsTo(QuestionType::class, 'question_type_id', 'id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class, 'question_id', 'id');
    }

    public function capability(): BelongsTo
    {
        return $this->belongsTo(Capability::class, 'capability_id', 'id');
    }

    public function applicationFormQuestions(): HasMany
    {
        return $this->hasMany(ApplicationFormQuestion::class, 'question_id', 'id');
    }

    public function scopeEasy(Builder $query): Builder
    {
        return $query->where('difficulty', self::DIFFICULTY_EASY);
    }

    public function scopeMedium(Builder $query): Builder
    {
        return $query->where('difficulty', self::DIFFICULTY_MEDIUM);
    }

    public function scopeHard(Builder $query): Builder
    {
        return $query->where('difficulty', self::DIFFICULTY_HARD);
    }

    public function scopePrimaryLevel(Builder $query): Builder
    {
        return $query->where('level', self::LEVEL_PRIMARY);
    }

    public function scopeSecondaryLevel(Builder $query): Builder
    {
        return $query->where('level', self::LEVEL_SECONDARY);
    }

    public function scopeForGrade(Builder $query, string $grade): Builder
    {
        return $query->whereJsonContains('grades', $grade);
    }

    public function scopeForTeacher(Builder $query, int $teacherId): Builder
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeForCapability(Builder $query, int $capabilityId): Builder
    {
        return $query->where('capability_id', $capabilityId);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function isCorrectOption(int $optionId): bool
    {
        return $this->options()
            ->where('id', $optionId)
            ->where('is_correct', true)
            ->exists();
    }

    public function hasCorrectOptions(): bool
    {
        return $this->options()
            ->where('is_correct', true)
            ->exists();
    }
}
