<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'teachers';

    protected $primaryKey = 'user_id';

    public $incrementing = false;

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'teacher_classroom_curricular_areas', 'teacher_id', 'classroom_id')
            ->withTimestamps();
    }

    public function curricularAreas(): BelongsToMany
    {
        return $this->belongsToMany(CurricularArea::class, 'teacher_classroom_curricular_areas', 'teacher_id', 'curricular_area_id')
            ->withTimestamps();
    }

    public function teacherAssignments(): HasMany
    {
        return $this->hasMany(TeacherClassroomCurricularArea::class, 'teacher_id', 'user_id');
    }

    public function applicationForms(): HasMany
    {
        return $this->hasMany(ApplicationForm::class, 'teacher_id', 'user_id');
    }
}
