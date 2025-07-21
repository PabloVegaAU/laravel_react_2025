<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Level extends Model
{
    use SoftDeletes;

    protected $table = 'levels';

    protected $fillable = [
        'name',
        'level',
        'experience_max',
        'experience_required',
    ];

    protected $casts = [
        'level' => 'integer',
        'experience_max' => 'decimal:2',
        'experience_required' => 'decimal:2',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function studentLevelHistories(): HasMany
    {
        return $this->hasMany(StudentLevelHistory::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_level_histories', 'level_id', 'student_id')
            ->withPivot('reached_at', 'experience', 'range_id')
            ->withTimestamps();
    }

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }

    public function enrollments(): HasManyThrough
    {
        return $this->hasManyThrough(Enrollment::class, Classroom::class);
    }
}
