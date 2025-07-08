<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentStoreReward extends Model
{
    use HasFactory;

    protected $table = 'student_store_rewards';

    protected $casts = [
        'points_store' => 'decimal:2',
        'exchange_date' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function storeReward(): BelongsTo
    {
        return $this->belongsTo(StoreReward::class);
    }
}
