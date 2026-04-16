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
        'start_date',
        'end_date',
        'status',
        'registration_status',
        'performances',
        'start_sequence',
        'end_sequence',
        'educational_institution_id',
        'teacher_classroom_curricular_area_cycle_id',
        'competency_id',
        'deactivated_at',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'performances' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'deactivated_at' => 'datetime',
    ];

    protected $dates = [
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
        'deleted_at',
        'deactivated_at',
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

    /**
     * Check if the session is scheduled (before start_date)
     */
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled' || now() < $this->start_date;
    }

    /**
     * Check if the session is active (within date range and status is active)
     */
    public function isActive(): bool
    {
        return $this->status === 'active' &&
               now() >= $this->start_date &&
               now() <= $this->end_date;
    }

    /**
     * Check if the session is finished (after end_date or status is finished)
     */
    public function isFinished(): bool
    {
        return $this->status === 'finished' || now() > $this->end_date;
    }

    /**
     * Check if the session is canceled (deactivated_at is not null or status is canceled)
     */
    public function isCanceled(): bool
    {
        return $this->status === 'canceled' || $this->deactivated_at !== null;
    }

    /**
     * Get the temporal status of the session
     */
    public function getTemporalStatus(): string
    {
        if ($this->isCanceled()) {
            return 'canceled';
        }

        if ($this->isScheduled()) {
            return 'scheduled';
        }

        if ($this->isActive()) {
            return 'active';
        }

        if ($this->isFinished()) {
            return 'finished';
        }

        return 'unknown';
    }
}
