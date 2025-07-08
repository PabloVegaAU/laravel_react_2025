<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningSession extends Model
{
    protected $table = 'learning_sessions';

    protected $fillable = [
        'name',
        'purpose_learning',
        'application_date',
        'educational_institution_id',
        'teacher_classroom_curricular_area_id',
        'competency_id',
    ];

    protected $casts = [
        'application_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function educationalInstitution(): BelongsTo
    {
        return $this->belongsTo(EducationalInstitution::class);
    }

    public function teacherClassroomCurricularArea(): BelongsTo
    {
        return $this->belongsTo(TeacherClassroomCurricularArea::class);
    }

    public function competency(): BelongsTo
    {
        return $this->belongsTo(Competency::class);
    }

    public function applicationForms()
    {
        return $this->hasMany(ApplicationForm::class);
    }
}
