<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Level extends Model
{
    use SoftDeletes;

    protected $table = 'levels';

    protected $casts = [
        'level' => 'integer',
        'experience_required' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function studentLevelHistories(): HasMany
    {
        return $this->hasMany(StudentLevelHistory::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_level_histories', 'level_id', 'student_id')
            ->withPivot('reached_at')
            ->withTimestamps();
    }
}
