<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherClassroomCurricularArea extends Model
{
    use HasFactory;

    protected $table = 'teacher_classroom_curricular_areas';

    protected $casts = [
        'academic_year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'user_id');
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function curricularArea(): BelongsTo
    {
        return $this->belongsTo(CurricularArea::class);
    }

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class, 'teacher_classroom_curricular_area_id');
    }
}
