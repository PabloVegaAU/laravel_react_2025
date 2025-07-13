<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAvatar extends Model
{
    protected $table = 'student_avatars';

    protected $fillable = [
        'student_id',
        'avatar_id',
        'active',
        'points_store',
        'exchange_date',
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

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Avatar::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
