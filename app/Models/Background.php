<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Background extends Model
{
    protected $table = 'backgrounds';

    protected $fillable = [
        'name',
        'image',
        'level_required',
        'points_store',
    ];

    protected $casts = [
        'points_store' => 'decimal:2',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function requiredLevel(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'level_required');
    }

    public function studentBackgrounds(): HasMany
    {
        return $this->hasMany(StudentBackground::class);
    }

    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'student_backgrounds',
            'background_id',
            'student_id',
            'id',
            'user_id'
        )->withPivot(['screen', 'active', 'points_store', 'exchange_date']);
    }
}
