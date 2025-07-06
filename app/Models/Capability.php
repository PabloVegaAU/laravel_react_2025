<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Capability extends Model
{
    protected $table = 'capabilities';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function competency(): BelongsTo
    {
        return $this->belongsTo(Competency::class, 'competency_id', 'id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
