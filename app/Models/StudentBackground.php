<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentBackground extends Model
{
    use HasFactory;

    protected $table = 'student_backgrounds';

    protected $casts = [
        'is_active' => 'boolean',
        'points_store' => 'decimal:2',
        'exchange_date' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function background(): BelongsTo
    {
        return $this->belongsTo(Background::class);
    }
}
