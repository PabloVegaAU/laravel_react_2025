<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionType extends Model
{
    // Definición de constantes para los tipos de pregunta
    public const SINGLE_CHOICE = 1;

    public const ORDERING = 2;

    public const MATCHING = 3;

    public const TRUE_FALSE = 4;

    protected $table = 'question_types';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
