<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Range extends Model
{
    use SoftDeletes;

    protected $table = 'ranges';

    protected $fillable = [
        'name',
        'color',
        'image',
        'description',
        'order',
        'level_required',
    ];

    protected $casts = [
        'order' => 'integer',
        'level_required' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}
