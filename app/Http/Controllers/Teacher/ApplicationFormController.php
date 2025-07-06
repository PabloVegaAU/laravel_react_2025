<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\TeacherClassroomCurricularArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applicationForms = ApplicationForm::paginate(10)->withQueryString();

        return Inertia::render('teacher/application-form/index', [
            'applicationForms' => $applicationForms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all classroom-curricular area assignments for the current teacher in the current academic year
        $teacherClassroomAreas = TeacherClassroomCurricularArea::with(['classroom', 'curricularArea'])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', now()->year)
            ->get();

        return Inertia::render('teacher/application-form/create/index', [
            'teacherClassroomAreas' => $teacherClassroomAreas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,published,archived',
            'score_max' => 'required|numeric|min:1',
            'teacher_classroom_curricular_area_id' => 'required|exists:teacher_classroom_curricular_areas,id',
        ]);

        $applicationForm = auth()->user()->teacher->applicationForms()->create($validated);

        return redirect()->route('teacher.application-forms.index')
            ->with('success', 'Ficha de aplicación creada exitosamente');
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
    public function edit(ApplicationForm $applicationForm)
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
