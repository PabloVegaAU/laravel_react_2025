<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\EducationalInstitution;
use App\Models\LearningSession;
use App\Models\TeacherClassroomCurricularAreaCycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LearningSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $learningSessions = LearningSession::paginate(10);

        return Inertia::render('teacher/learning-session/index', [
            'learningSessions' => $learningSessions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $educationalInstitution = EducationalInstitution::findOrFail(1);

        $currentYear = now()->year;

        $teacherClassroomAreaCycles = TeacherClassroomCurricularAreaCycle::with([
            'classroom',
            'curricularAreaCycle.curricularArea', 'curricularAreaCycle.cycle',
            'curricularAreaCycle.curricularArea.competencies',
            'curricularAreaCycle.curricularArea.competencies.capabilities',
        ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', $currentYear)
            ->get();

        $applicationForms = ApplicationForm::where('teacher_id', auth()->id())
            ->where('status', '!=', 'inactive')
            ->get();

        return Inertia::render('teacher/learning-session/create/index', [
            'educational_institution' => $educationalInstitution,
            'teacher_classroom_area_cycles' => $teacherClassroomAreaCycles,
            'application_forms' => $applicationForms,
            'current_year' => $currentYear,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'purpose_learning' => 'required|string',
            'application_date' => 'required|date',
            'status' => 'required|in:draft,active,inactive',
            'performances' => 'required|string',
            'start_sequence' => 'required|string',
            'end_sequence' => 'required|string',
            'teacher_classroom_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
            'application_form_ids' => 'required|array',
            'application_form_ids.*' => 'required|exists:application_forms,id',
        ]);

        DB::beginTransaction();

        try {
            $learningSession = LearningSession::create([
                'name' => $validated['name'],
                'purpose_learning' => $validated['purpose_learning'],
                'application_date' => $validated['application_date'],
                'status' => $validated['status'],
                'performances' => $validated['performances'],
                'start_sequence' => $validated['start_sequence'],
                'end_sequence' => $validated['end_sequence'],
                'teacher_classroom_area_cycle_id' => $validated['teacher_classroom_area_cycle_id'],
                'competency_id' => $validated['competency_id'],
                'educational_institution_id' => $validated['educational_institution_id'],
            ]);

            $learningSession->applicationForms()->attach($validated['application_form_ids']);

            DB::commit();

            return redirect()->route('teacher.learning-sessions.index')->with('success', 'Learning session created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LearningSession $learningSession)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LearningSession $learningSession)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LearningSession $learningSession)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LearningSession $learningSession)
    {
        //
    }
}
