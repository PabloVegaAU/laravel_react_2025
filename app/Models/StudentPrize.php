<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPrize extends Model
{
    use HasFactory;

    protected $table = 'student_prizes';

    public $timestamps = false;

    protected $casts = [
        'points_store' => 'decimal:2',
        'exchange_date' => 'datetime',
        'claimed' => 'boolean',
        'claimed_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function prize(): BelongsTo
    {
        return $this->belongsTo(Prize::class);
    }
}
