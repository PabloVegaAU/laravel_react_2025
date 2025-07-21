<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicationFormResponse extends Model
{
    use SoftDeletes;

    protected $table = 'application_form_responses';

    protected $fillable = [
        'score',
        'status',
        'started_at',
        'submitted_at',
        'graded_at',
        'application_form_id',
        'student_id',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
        'score' => 0.00,
    ];

    public function applicationForm(): BelongsTo
    {
        return $this->belongsTo(ApplicationForm::class, 'application_form_id', 'id')
            ->withTrashed();
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id')
            ->withTrashed();
    }

    public function responseQuestions(): HasMany
    {
        return $this->hasMany(
            ApplicationFormResponseQuestion::class,
            'application_form_response_id',
            'id'
        );
    }

    public function scopeForApplicationForm(Builder $query, int $applicationFormId): Builder
    {
        return $query->where('application_form_id', $applicationFormId);
    }

    public function scopeForStudent(Builder $query, int $studentId): Builder
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeWithStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeGraded(Builder $query): Builder
    {
        return $query->whereNotNull('graded_at');
    }

    public function scopeSubmitted(Builder $query): Builder
    {
        return $query->whereNotNull('submitted_at');
    }

    public function markAsStarted(): bool
    {
        if (! $this->started_at) {
            $this->started_at = now();
            $this->status = 'in progress';

            return $this->save();
        }

        return false;
    }

    public function markAsSubmitted(): bool
    {
        if (! $this->submitted_at) {
            $this->submitted_at = now();
            $this->status = 'submitted';

            return $this->save();
        }

        return false;
    }

    public function calculateScore(): float
    {
        return $this->responseQuestions()
            ->with('applicationFormQuestion')
            ->get()
            ->sum(function ($responseQuestion) {
                return $responseQuestion->is_correct ?
                    $responseQuestion->applicationFormQuestion->score : 0;
            });
    }

    public function isGraded(): bool
    {
        return $this->status === 'graded' && $this->graded_at !== null;
    }

    public function isLate(): bool
    {
        $submittedAt = Carbon::parse($this->submitted_at);
        $endDate = Carbon::parse($this->applicationForm->end_date);

        return $submittedAt->greaterThanOrEqualTo($endDate);
    }

    /**
     * Actualiza el puntaje total sumando los puntajes de todas las preguntas respondidas.
     */
    public function updateTotalScore(): bool
    {
        $totalScore = $this->responseQuestions()
            ->with('applicationFormQuestion')
            ->get()
            ->sum(function ($responseQuestion) {
                return $responseQuestion->score ?? 0;
            });

        $this->score = $totalScore;

        return $this->save();
    }
}
