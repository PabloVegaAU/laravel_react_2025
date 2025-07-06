<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class StoreReward extends Model
{
    use SoftDeletes;

    protected $table = 'store_rewards';

    protected $casts = [
        'points' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'level_required');
    }

    public function studentStoreRewards(): HasMany
    {
        return $this->hasMany(StudentStoreReward::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_store_rewards', 'store_reward_id', 'student_id')
            ->withPivot('status', 'redeemed_at')
            ->withTimestamps();
    }
}
