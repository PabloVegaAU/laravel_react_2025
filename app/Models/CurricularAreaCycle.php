<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CurricularAreaCycle extends Model
{
    protected $table = 'curricular_area_cycles';

    protected $fillable = [
        'cycle_id',
        'curricular_area_id',
    ];

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(Cycle::class);
    }

    public function curricularArea(): BelongsTo
    {
        return $this->belongsTo(CurricularArea::class);
    }

    public function teacherClassroomCurricularAreaCycles(): HasMany
    {
        return $this->hasMany(TeacherClassroomCurricularAreaCycle::class, 'curricular_area_cycle_id');
    }

    public function competencies(): HasMany
    {
        return $this->hasMany(Competency::class, 'curricular_area_cycle_id');
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(
            Classroom::class,
            'teacher_classroom_curricular_area_cycles',
            'curricular_area_cycle_id',
            'classroom_id'
        )->withPivot(['teacher_id', 'academic_year']);
    }

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(
            Teacher::class,
            'teacher_classroom_curricular_area_cycles',
            'curricular_area_cycle_id',
            'teacher_id',
            'id',
            'user_id'
        )->withPivot(['classroom_id', 'academic_year']);
    }
}
