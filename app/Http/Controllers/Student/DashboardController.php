<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ApplicationFormResponse;
use App\Models\Enrollment;
use App\Models\StudentAvatar;
use App\Models\StudentBackground;
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

        // Obtener respuestas de formularios de aplicación pendientes
        $applicationFormResponses = ApplicationFormResponse::with([
            'applicationForm',
            'applicationForm.learningSession.teacherClassroomCurricularAreaCycle',
            'applicationForm.learningSession.teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea:id,name',
        ])->where('student_id', auth()->id())
            ->where('status', 'pending')
            ->get();

        // Obtener avatar activo
        $studentAvatar = StudentAvatar::with('avatar')
            ->where('student_id', auth()->id())
            ->active()
            ->first();

        // Obtener fondo activo
        $studentBackground = StudentBackground::with('background')
            ->where('student_id', auth()->id())
            ->active()
            ->first();

        return Inertia::render('student/dashboard/index', [
            'enrollment' => $enrollment,
            'application_form_responses' => $applicationFormResponses,
            'avatar' => $studentAvatar?->avatar?->image_url ?? null,
            'background' => $studentBackground?->background?->image ?? null,
        ]);
    }
}
