<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentBackground extends Model
{
    protected $table = 'student_backgrounds';

    protected $fillable = [
        'screen',
        'active',
        'points_store',
        'exchange_date',
        'student_id',
        'background_id',
    ];

    protected $casts = [
        'active' => 'boolean',
        'points_store' => 'decimal:2',
    ];

    protected $dates = [
        'exchange_date',
        'created_at',
        'updated_at',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    public function scopeForScreen(Builder $query, string $screen): Builder
    {
        return $query->where('screen', $screen);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function background(): BelongsTo
    {
        return $this->belongsTo(Background::class);
    }
}
