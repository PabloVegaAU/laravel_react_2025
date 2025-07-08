<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class ApplicationForm extends Model
{
    protected $table = 'application_forms';

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'score_max',
        'teacher_id',
        'teacher_classroom_curricular_area_id',
        'learning_session_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'score_max' => 'decimal:2',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
    ];

    public function teacherClassroomCurricularArea(): BelongsTo
    {
        return $this->belongsTo(TeacherClassroomCurricularArea::class);
    }

    public function learningSession(): BelongsTo
    {
        return $this->belongsTo(LearningSession::class);
    }

    public function applicationFormQuestions(): HasMany
    {
        return $this->hasMany(ApplicationFormQuestion::class);
    }

    public function questions(): HasManyThrough
    {
        return $this->hasManyThrough(
            Question::class,
            ApplicationFormQuestion::class,
            'application_form_id',
            'id',
            'id',
            'question_id'
        );
    }

    public function responses(): HasMany
    {
        return $this->hasMany(ApplicationFormResponse::class);
    }
}
