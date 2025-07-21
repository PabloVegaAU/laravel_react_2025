<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\Enrollment;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();

        // Obtener la matrícula activa del estudiante
        $enrollment = Enrollment::with('classroom')
            ->where('student_id', $userId)
            ->where('academic_year', now()->year)
            ->first();

        if (! $enrollment) {
            return Inertia::render('student/store/index', [
                'applicationForms' => [],
                'error' => 'No estás matriculado en ningún aula este año académico.',
            ]);
        }

        // Obtener las fichas de aplicación para el aula del estudiante
        $applicationForms = ApplicationForm::whereHas('teacherClassroomCurricularArea', function ($query) use ($enrollment) {
            $query->where('classroom_id', $enrollment->classroom_id);
        })
            ->with([
                'teacherClassroomCurricularArea.teacher.user',
                'teacherClassroomCurricularArea.curricularArea',
            ])
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->where('status', 'active')
            ->latest()
            ->paginate(10);

        return Inertia::render('student/store/index', [
            'applicationForms' => $applicationForms,
        ]);
    }

    public function avatars()
    {
        return Inertia::render('student/store/avatars');
    }

    public function backgrounds()
    {
        return Inertia::render('student/store/backgrounds');
    }

    public function rewards()
    {
        return Inertia::render('student/store/rewards');
    }
}
