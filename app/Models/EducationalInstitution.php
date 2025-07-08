<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalInstitution extends Model
{
    protected $table = 'educational_institutions';

    protected $fillable = [
        'name',
        'ugel',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
