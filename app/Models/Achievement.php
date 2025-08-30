<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Achievement extends Model
{
    use SoftDeletes;

    protected $table = 'achievements';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'description',
        'image',
        'activo',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function studentAchievements(): HasMany
    {
        return $this->hasMany(StudentAchievement::class, 'achievement_id', 'id');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(
            Student::class,
            'student_achievements',
            'achievement_id',
            'student_id',
            'id',
            'user_id'
        )->withPivot('achieved_at')
            ->withTimestamps();
    }

    public function scopeWithName(Builder $query, string $name): Builder
    {
        return $query->where('name', $name);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where('name', 'like', "%{$search}%")
            ->orWhere('description', 'like', "%{$search}%");
    }
}
