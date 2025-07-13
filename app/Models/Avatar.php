<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Avatar extends Model
{
    protected $table = 'avatars';

    protected $fillable = [
        'name',
        'image',
        'level_required',
        'points_store',
    ];

    protected $casts = [
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function studentAvatars(): HasMany
    {
        return $this->hasMany(StudentAvatar::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_avatars')
            ->withPivot(['active', 'points_store', 'exchange_date'])
            ->withTimestamps();
    }

    public function requiredLevel(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'level_required');
    }
}
