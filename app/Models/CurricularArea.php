<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class CurricularArea extends Model
{
    protected $table = 'curricular_areas';

    protected $fillable = [
        'name',
        'description',
        'color',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class);
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(
            Classroom::class,
            'teacher_classroom_curricular_area_cycles',
            'curricular_area_id',
            'classroom_id'
        )->withPivot(['teacher_id', 'academic_year']);
    }

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(
            Teacher::class,
            'teacher_classroom_curricular_area_cycles',
            'curricular_area_id',
            'teacher_id',
            'id',
            'user_id'
        )->withPivot(['classroom_id', 'academic_year']);
    }

    public function cycles(): BelongsToMany
    {
        return $this->belongsToMany(
            Cycle::class,
            'curricular_area_cycles',
            'curricular_area_id',
            'cycle_id'
        )->withTimestamps();
    }

    public function curricularAreaCycles(): HasMany
    {
        return $this->hasMany(CurricularAreaCycle::class);
    }

    public function competencies(): HasManyThrough
    {
        return $this->hasManyThrough(
            Competency::class,
            CurricularAreaCycle::class,
            'curricular_area_id',
            'curricular_area_cycle_id'
        );
    }

    public function teacherClassroomCurricularAreaCycles(): HasManyThrough
    {
        return $this->hasManyThrough(
            TeacherClassroomCurricularAreaCycle::class,
            CurricularAreaCycle::class,
            'curricular_area_id', // foreign key on curricular_area_cycles table
            'curricular_area_cycle_id', // foreign key on teacher_classroom_curricular_area_cycles table
            'id', // local key on curricular_areas table
            'id' // local key on curricular_area_cycles table
        );
    }
}
