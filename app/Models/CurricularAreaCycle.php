<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CurricularAreaCycle extends Model
{
    protected $table = 'curricular_area_cycles';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
        return $this->hasMany(TeacherClassroomCurricularAreaCycle::class);
    }
}
