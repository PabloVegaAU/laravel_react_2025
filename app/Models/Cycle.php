<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cycle extends Model
{
    use SoftDeletes;

    protected $table = 'cycles';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function curricularAreaCycles()
    {
        return $this->hasMany(CurricularAreaCycle::class);
    }
}
