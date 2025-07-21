<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class LearningSession extends Model
{
    use SoftDeletes;

    protected $table = 'learning_sessions';

    protected $fillable = [
        'name',
        'purpose_learning',
        'application_date',
        'status',
        'performances',
        'start_sequence',
        'end_sequence',
        'educational_institution_id',
        'teacher_classroom_curricular_area_cycle_id',
        'competency_id',
    ];

    protected $casts = [
        'application_date' => 'date',
        'performances' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'application_date',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function educationalInstitution(): BelongsTo
    {
        return $this->belongsTo(EducationalInstitution::class);
    }

    public function competency(): BelongsTo
    {
        return $this->belongsTo(Competency::class);
    }

    public function capabilities(): BelongsToMany
    {
        return $this->belongsToMany(
            Capability::class,
            'learning_session_capabilities',
            'learning_session_id',
            'capability_id'
        )->withTimestamps();
    }

    public function teacherClassroomCurricularAreaCycle(): BelongsTo
    {
        return $this->belongsTo(TeacherClassroomCurricularAreaCycle::class);
    }

    public function applicationForm(): HasOne
    {
        return $this->hasOne(ApplicationForm::class, 'learning_session_id');
    }
}
