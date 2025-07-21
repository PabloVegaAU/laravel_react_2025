<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'teachers';

    protected $primaryKey = 'user_id';

    public $incrementing = false;

    protected $fillable = [
        'status',
    ];

    protected $attributes = [
        'status' => 'active',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'teacher_classroom_curricular_area_cycles', 'teacher_id', 'classroom_id')
            ->withPivot(['academic_year', 'curricular_area_cycle_id'])
            ->withTimestamps();
    }

    public function curricularAreas(): BelongsToMany
    {
        return $this->belongsToMany(CurricularArea::class, 'teacher_classroom_curricular_area_cycles', 'teacher_id', 'curricular_area_cycle_id')
            ->withPivot(['classroom_id', 'academic_year'])
            ->withTimestamps();
    }

    public function curricularAreaCycles(): BelongsToMany
    {
        return $this->belongsToMany(CurricularAreaCycle::class, 'teacher_classroom_curricular_area_cycles', 'teacher_id', 'curricular_area_cycle_id')
            ->withPivot(['classroom_id', 'academic_year'])
            ->withTimestamps();
    }

    public function teacherAssignments(): HasMany
    {
        return $this->hasMany(TeacherClassroomCurricularAreaCycle::class, 'teacher_id', 'user_id');
    }

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class, 'teacher_id', 'user_id');
    }

    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class, 'teacher_id', 'user_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'inactive');
    }

    public function scopeOnLeave(Builder $query): Builder
    {
        return $query->where('status', 'on leave');
    }

    public function scopeRetired(Builder $query): Builder
    {
        return $query->where('status', 'retired');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isOnLeave(): bool
    {
        return $this->status === 'on leave';
    }

    public function isRetired(): bool
    {
        return $this->status === 'retired';
    }
}
