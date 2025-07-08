<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Background extends Model
{
    protected $table = 'backgrounds';

    protected $casts = [
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function studentBackgrounds(): HasMany
    {
        return $this->hasMany(StudentBackground::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_backgrounds', 'background_id', 'student_id')
            ->withPivot('is_active', 'purchased_at')
            ->withTimestamps();
    }
}
