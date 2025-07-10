<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class CurricularArea extends Model
{
    protected $table = 'curricular_areas';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class);
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'teacher_classroom_curricular_area_cycles', 'curricular_area_id', 'classroom_id')
            ->withPivot('teacher_id')
            ->withTimestamps();
    }

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'teacher_classroom_curricular_area_cycles', 'curricular_area_id', 'teacher_id')
            ->withPivot('classroom_id')
            ->withTimestamps();
    }

    public function cycles(): BelongsToMany
    {
        return $this->belongsToMany(Cycle::class, 'curricular_area_cycles');
    }

    public function curricularAreaCycles(): HasMany
    {
        return $this->hasMany(CurricularAreaCycle::class);
    }

    public function competencies(): HasManyThrough
    {
        return $this->hasManyThrough(Competency::class, CurricularAreaCycle::class, 'id', 'curricular_area_cycle_id');
    }
}
