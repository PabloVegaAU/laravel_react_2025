<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicationFormResponse extends Model
{
    use SoftDeletes;

    protected $table = 'application_form_responses';

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
        'score' => 'decimal:2',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function applicationForm(): BelongsTo
    {
        return $this->belongsTo(ApplicationForm::class)->withDefault();
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id')->withDefault();
    }

    public function responseQuestions(): HasMany
    {
        return $this->hasMany(ApplicationFormResponseQuestion::class);
    }
}
