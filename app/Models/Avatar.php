<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Avatar extends Model
{
    protected $table = 'avatars';

    protected $casts = [
        'points' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = ['created_at', 'updated_at'];

    public function studentAvatars(): HasMany
    {
        return $this->hasMany(StudentAvatar::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_avatars', 'avatar_id', 'student_id')
            ->withPivot('is_active', 'purchased_at')
            ->withTimestamps();
    }
}
