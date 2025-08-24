<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\TeacherClassroomCurricularAreaCycle;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Areas currículares del año escolar actual
        $teacherClassroomCurricularAreaCycles = TeacherClassroomCurricularAreaCycle::with([
            'curricularAreaCycle.curricularArea:id,name,color',
            'classroom:id,grade,section,level',
        ])
            ->where('teacher_id', auth()->user()->id)
            ->where('academic_year', date('Y'))
            ->get();

        return Inertia::render('teacher/dashboard/index', [
            'teacher_classroom_curricular_area_cycles' => $teacherClassroomCurricularAreaCycles,
        ]);
    }
}
