<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ApplicationFormResponse;
use App\Models\Enrollment;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener datos estudiante
        $enrollment = Enrollment::with([
            'classroom',
        ])->where('student_id', auth()->id())
            ->where('status', 'active')->first();

        $applicationFormResponses = ApplicationFormResponse::with([
            'applicationForm',
            'applicationForm.learningSession.teacherClassroomCurricularAreaCycle',
            'applicationForm.learningSession.teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea:id,name',
        ])->where('student_id', auth()->id())
            ->where('status', 'pending')
            ->get();

        return Inertia::render('student/dashboard/index', [
            'enrollment' => $enrollment,
            'application_form_responses' => $applicationFormResponses,
        ]);
    }
}
