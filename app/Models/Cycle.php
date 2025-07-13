<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cycle extends Model
{
    use SoftDeletes;

    protected $table = 'cycles';

    protected $fillable = [
        'name',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function curricularAreaCycles(): HasMany
    {
        return $this->hasMany(CurricularAreaCycle::class);
    }

    public function curricularAreas(): HasManyThrough
    {
        return $this->hasManyThrough(
            CurricularArea::class,
            CurricularAreaCycle::class,
            'cycle_id',
            'id',
            'id',
            'curricular_area_id'
        );
    }

    public function teacherClassroomCurricularAreaCycles(): HasManyThrough
    {
        return $this->hasManyThrough(
            TeacherClassroomCurricularAreaCycle::class,
            CurricularAreaCycle::class,
            'cycle_id',
            'curricular_area_cycle_id'
        );
    }
}
