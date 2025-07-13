<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Competency extends Model
{
    protected $table = 'competencies';

    protected $fillable = [
        'curricular_area_cycle_id',
        'name',
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

    public function curricularAreaCycle(): BelongsTo
    {
        return $this->belongsTo(CurricularAreaCycle::class, 'curricular_area_cycle_id');
    }

    public function capabilities(): HasMany
    {
        return $this->hasMany(Capability::class);
    }

    public function learningSessions(): BelongsToMany
    {
        return $this->belongsToMany(
            LearningSession::class,
            'learning_session_competencies'
        );
    }
}
