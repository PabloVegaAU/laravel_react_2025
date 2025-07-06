<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'students';

    protected $primaryKey = 'user_id';

    public $incrementing = false;

    public $timestamps = true;

    protected $casts = [
        'entry_date' => 'date',
        'experience_achieved' => 'decimal:2',
        'points_achieved' => 'decimal:2',
        'total_score' => 'decimal:2',
        'graduation_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function range()
    {
        return $this->belongsTo(Range::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'enrollments', 'student_id', 'classroom_id')
            ->withTimestamps();
    }

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class, 'student_id');
    }

    public function applicationFormResponses(): HasMany
    {
        return $this->hasMany(ApplicationFormResponse::class);
    }

    public function storeRewards(): BelongsToMany
    {
        return $this->belongsToMany(StoreReward::class, 'student_store_rewards', 'student_id', 'store_reward_id')
            ->withPivot('status', 'redeemed_at')
            ->withTimestamps();
    }

    public function avatars(): BelongsToMany
    {
        return $this->belongsToMany(Avatar::class, 'student_avatars', 'student_id', 'avatar_id')
            ->withPivot('is_active')
            ->withTimestamps();
    }

    public function backgrounds(): BelongsToMany
    {
        return $this->belongsToMany(Background::class, 'student_backgrounds', 'student_id', 'background_id')
            ->withPivot('is_active')
            ->withTimestamps();
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(Achievement::class, 'student_achievements', 'student_id', 'achievement_id')
            ->withTimestamps();
    }

    public function activeAvatar()
    {
        return $this->avatars()->wherePivot('is_active', true)->first();
    }

    public function activeBackground()
    {
        return $this->backgrounds()->wherePivot('is_active', true)->first();
    }
}
