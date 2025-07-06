<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationFormResponseQuestionOption extends Model
{
    protected $table = 'application_form_response_question_options';

    protected $casts = [
        'score' => 'decimal:2',
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function applicationFormResponseQuestion(): BelongsTo
    {
        return $this->belongsTo(ApplicationFormResponseQuestion::class)->cascadeOnDelete();
    }

    public function questionOption(): BelongsTo
    {
        return $this->belongsTo(QuestionOption::class)->cascadeOnDelete();
    }
}
