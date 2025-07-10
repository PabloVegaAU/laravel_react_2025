<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use SoftDeletes;

    protected $table = 'questions';

    protected $fillable = [
        'teacher_id',
        'question_type_id',
        'capability_id',
        'name',
        'description',
        'difficulty',
        'explanation_required',
        'level',
        'grades',
    ];

    protected $casts = [
        'difficulty' => 'string',
        'explanation_required' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'user_id');
    }

    public function questionType(): BelongsTo
    {
        return $this->belongsTo(QuestionType::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }

    public function capability(): BelongsTo
    {
        return $this->belongsTo(Capability::class);
    }

    public function applicationFormQuestions(): HasMany
    {
        return $this->hasMany(ApplicationFormQuestion::class);
    }
}
