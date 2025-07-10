<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Competency extends Model
{
    protected $table = 'competencies';

    protected $casts = [
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function curricularAreaCycle(): BelongsTo
    {
        return $this->belongsTo(CurricularAreaCycle::class, 'curricular_area_cycle_id', 'id');
    }

    public function capabilities(): HasMany
    {
        return $this->hasMany(Capability::class);
    }
}
