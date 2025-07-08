<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationFormQuestion extends Model
{
    protected $table = 'application_form_questions';

    protected $fillable = [
        'application_form_id',
        'question_id',
        'order',
        'score',
        'points_store',
    ];

    protected $casts = [
        'order' => 'integer',
        'score' => 'decimal:2',
        'points_store' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function applicationForm(): BelongsTo
    {
        return $this->belongsTo(ApplicationForm::class)->cascadeOnDelete();
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class)->restrictOnDelete();
    }

    public function responseQuestions(): HasMany
    {
        return $this->hasMany(ApplicationFormResponseQuestion::class, 'application_form_question_id');
    }
}
