<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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

    protected $fillable = [
        'user_id',
        'level_id',
        'range_id',
        'entry_date',
        'status',
        'experience_achieved',
        'points_store_achieved',
        'points_store',
        'graduation_date',
    ];

    protected $dates = [
        'entry_date',
        'graduation_date',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'experience_achieved' => 'decimal:2',
        'points_store_achieved' => 'decimal:2',
        'points_store' => 'decimal:2',
    ];

    protected $attributes = [
        'status' => 'active',
        'experience_achieved' => 0,
        'points_store_achieved' => 0,
        'points_store' => 0,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function range(): BelongsTo
    {
        return $this->belongsTo(Range::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'user_id');
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(
            Classroom::class,
            'enrollments',
            'student_id',
            'classroom_id',
            'user_id',
            'id'
        )->withTimestamps();
    }

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class, 'student_id', 'user_id');
    }

    public function applicationFormResponses(): HasMany
    {
        return $this->hasMany(ApplicationFormResponse::class, 'student_id', 'user_id');
    }

    public function storeRewards(): BelongsToMany
    {
        return $this->belongsToMany(
            StoreReward::class,
            'student_store_rewards',
            'student_id',
            'store_reward_id',
            'user_id',
            'id'
        )->withPivot('status', 'redeemed_at')
            ->withTimestamps();
    }

    public function avatars(): BelongsToMany
    {
        return $this->belongsToMany(
            Avatar::class,
            'student_avatars',
            'student_id',
            'avatar_id',
            'user_id',
            'id'
        )->withPivot('is_active')
            ->withTimestamps();
    }

    public function backgrounds(): BelongsToMany
    {
        return $this->belongsToMany(
            Background::class,
            'student_backgrounds',
            'student_id',
            'background_id',
            'user_id',
            'id'
        )->withPivot('is_active')
            ->withTimestamps();
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(
            Achievement::class,
            'student_achievements',
            'student_id',
            'achievement_id',
            'user_id',
            'id'
        )->withTimestamps();
    }

    public function activeAvatar(): ?Avatar
    {
        return $this->avatars()
            ->wherePivot('is_active', true)
            ->first();
    }

    public function activeBackground(): ?Background
    {
        return $this->backgrounds()
            ->wherePivot('is_active', true)
            ->first();
    }

    public function levelHistory(): HasMany
    {
        return $this->hasMany(StudentLevelHistory::class, 'student_id', 'user_id')
            ->with(['level', 'range'])
            ->latest('reached_at');
    }

    public function scopeStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'inactive');
    }

    public function scopeGraduated(Builder $query): Builder
    {
        return $query->where('status', 'graduated');
    }
}
