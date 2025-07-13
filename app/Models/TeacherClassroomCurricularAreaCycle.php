<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherClassroomCurricularAreaCycle extends Model
{
    use HasFactory;

    protected $table = 'teacher_classroom_curricular_area_cycles';

    protected $fillable = [
        'teacher_id',
        'classroom_id',
        'curricular_area_cycle_id',
        'academic_year',
    ];

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

    public function curricularAreaCycle(): BelongsTo
    {
        return $this->belongsTo(CurricularAreaCycle::class);
    }

    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class, 'teacher_classroom_curricular_area_cycle_id');
    }
}
