<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicationForm extends Model
{
    use SoftDeletes;

    protected $table = 'application_forms';

    protected $fillable = [
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'score_max',
        'teacher_id',
        'learning_session_id',
    ];

    protected $casts = [
        'score_max' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'draft',
        'score_max' => 0.00,
    ];

    public function learningSession(): BelongsTo
    {
        return $this->belongsTo(LearningSession::class, 'learning_session_id', 'id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'user_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ApplicationFormQuestion::class, 'application_form_id', 'id')
            ->orderBy('order');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(ApplicationFormResponse::class, 'application_form_id', 'id');
    }

    public function scopeActive(Builder $query): Builder
    {
        $now = now();

        return $query->where('status', 'active')
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now);
    }

    public function scopeForTeacher(Builder $query, int $teacherId): Builder
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function isActive(): bool
    {
        $now = now();

        return $this->status === 'active' &&
               $this->start_date <= $now &&
               $this->end_date >= $now;
    }

    public function isUpcoming(): bool
    {
        return $this->status === 'scheduled' && $this->start_date > now();
    }

    public function isExpired(): bool
    {
        return $this->end_date < now();
    }
}
