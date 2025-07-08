<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentLevelHistory extends Model
{
    protected $table = 'student_level_histories';

    protected $casts = [
        'experience' => 'decimal:2',
        'achieved_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function range(): BelongsTo
    {
        return $this->belongsTo(Range::class);
    }
}
