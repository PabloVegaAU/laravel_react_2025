<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classroom extends Model
{
    use SoftDeletes;

    protected $table = 'classrooms';

    protected $fillable = [
        'grade',
        'section',
        'level',
        'academic_year',
    ];

    protected $casts = [
        'academic_year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(
            Teacher::class,
            'teacher_classroom_curricular_area_cycles',
            'classroom_id',
            'teacher_id',
            'id',
            'user_id'
        )->withPivot(['curricular_area_cycle_id', 'academic_year']);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(
            Student::class,
            'enrollments',
            'classroom_id',
            'student_id',
            'id',
            'user_id'
        );
    }

    public function teacherClassroomCurricularAreaCycles(): HasMany
    {
        return $this->hasMany(TeacherClassroomCurricularAreaCycle::class, 'classroom_id');
    }

    public function curricularAreaCycles(): BelongsToMany
    {
        return $this->belongsToMany(
            CurricularAreaCycle::class,
            'teacher_classroom_curricular_area_cycles',
            'classroom_id',
            'curricular_area_cycle_id'
        )->withPivot(['teacher_id', 'academic_year']);
    }

    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class);
    }

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class);
    }
}
