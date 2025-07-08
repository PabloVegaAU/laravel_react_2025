<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationFormResponseQuestion extends Model
{
    protected $table = 'application_form_response_questions';

    protected $fillable = [
        'application_form_response_id',
        'application_form_question_id',
        'question_option_id',
        'explanation',
        'score',
        'points_store',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function applicationFormResponse(): BelongsTo
    {
        return $this->belongsTo(ApplicationFormResponse::class)->cascadeOnDelete();
    }

    public function applicationFormQuestion(): BelongsTo
    {
        return $this->belongsTo(ApplicationFormQuestion::class)->cascadeOnDelete();
    }

    public function selectedOption(): BelongsTo
    {
        return $this->belongsTo(QuestionOption::class, 'question_option_id')
            ->withDefault()
            ->nullOnDelete();
    }
}
