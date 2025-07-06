<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionOption extends Model
{
    use SoftDeletes;

    protected $table = 'question_options';

    protected $fillable = [
        'question_id',
        'value',
        'is_correct',
        'order',
        'correct_order',
        'pair_key',
        'pair_side',
        'score',
        'feedback',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
