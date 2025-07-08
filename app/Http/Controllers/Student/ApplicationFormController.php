<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationFormController extends Controller
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
            return Inertia::render('student/application-form/index', [
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

        return Inertia::render('student/application-form/index', [
            'applicationForms' => $applicationForms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ApplicationForm $applicationForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ApplicationForm $applicationForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApplicationForm $applicationForm)
    {
        //
    }
}
