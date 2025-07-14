<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\EducationalInstitution;
use App\Models\LearningSession;
use App\Models\TeacherClassroomCurricularAreaCycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LearningSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $learningSessions = LearningSession::orderByDesc('id')
            ->paginate(10);

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

        $teacherClassroomCurricularAreaCycles = TeacherClassroomCurricularAreaCycle::with([
            'classroom',
            'curricularAreaCycle.curricularArea', 'curricularAreaCycle.cycle',
            'curricularAreaCycle.curricularArea.competencies',
            'curricularAreaCycle.curricularArea.competencies.capabilities',
        ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', $currentYear)
            ->get();

        return Inertia::render('teacher/learning-session/create/index', [
            'educational_institution' => $educationalInstitution,
            'teacher_classroom_curricular_area_cycles' => $teacherClassroomCurricularAreaCycles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'redirect' => 'nullable|boolean',
                'educational_institution_id' => 'required|exists:educational_institutions,id',
                'name' => 'required|string|max:255',
                'purpose_learning' => 'required|string',
                'application_date' => 'required|date',
                'status' => 'required|in:draft,active,inactive',
                'performances' => 'required|string',
                'start_sequence' => 'required|string',
                'end_sequence' => 'required|string',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
                'capability_ids' => 'nullable|array',
                'capability_ids.*' => 'nullable|exists:capabilities,id',
            ]);

            DB::beginTransaction();

            $learningSession = LearningSession::create([
                'name' => $validated['name'],
                'purpose_learning' => $validated['purpose_learning'],
                'application_date' => $validated['application_date'],
                'status' => $validated['status'],
                'performances' => $validated['performances'],
                'start_sequence' => $validated['start_sequence'],
                'end_sequence' => $validated['end_sequence'],
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'competency_id' => $validated['competency_id'],
                'educational_institution_id' => $validated['educational_institution_id'],
            ]);

            if (! empty($validated['capability_ids'])) {
                $learningSession->capabilities()->attach($validated['capability_ids']);
            }

            DB::commit();

            if ($request->boolean('redirect')) {
                return redirect()->route('teacher.application-forms.create', [
                    'learning_session_id' => $learningSession->id,
                    'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                    'competency_id' => $validated['competency_id'],
                ]);
            }

            return redirect()->route('teacher.learning-sessions.index')
                ->with('success', 'Sesión creada exitosamente');
        } catch (ValidationException $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
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
    public function edit(int $id)
    {
        $learningSession = LearningSession::with([
            'educationalInstitution',
            'teacherClassroomCurricularAreaCycle.classroom',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.cycle',
            'competency',
            'capabilities',
            'applicationForms',
        ])->findOrFail($id);

        $teacherClassroomCurricularAreaCycles = TeacherClassroomCurricularAreaCycle::with([
            'classroom',
            'curricularAreaCycle.curricularArea', 'curricularAreaCycle.cycle',
            'curricularAreaCycle.curricularArea.competencies',
            'curricularAreaCycle.curricularArea.competencies.capabilities',
        ])
            ->where('teacher_id', auth()->id())
            ->where('academic_year', now()->year)
            ->get();

        return Inertia::render('teacher/learning-session/edit/index', [
            'learning_session' => $learningSession,
            'teacher_classroom_curricular_area_cycles' => $teacherClassroomCurricularAreaCycles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'redirect' => 'nullable|boolean',
                'name' => 'required|string|max:255',
                'purpose_learning' => 'required|string',
                'application_date' => 'required|date',
                'status' => 'required|in:draft,active,inactive',
                'performances' => 'required|string',
                'start_sequence' => 'required|string',
                'end_sequence' => 'required|string',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
                'capability_ids' => 'nullable|array',
                'capability_ids.*' => 'nullable|exists:capabilities,id',
                'application_form_ids' => 'nullable|array',
                'application_form_ids.*' => 'nullable|exists:application_forms,id',
            ]);

            DB::beginTransaction();

            $learningSession = LearningSession::findOrFail($id);

            $learningSession->update([
                'name' => $validated['name'],
                'purpose_learning' => $validated['purpose_learning'],
                'application_date' => $validated['application_date'],
                'status' => $validated['status'],
                'performances' => $validated['performances'],
                'start_sequence' => $validated['start_sequence'],
                'end_sequence' => $validated['end_sequence'],
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'competency_id' => $validated['competency_id'],
            ]);

            if (isset($validated['application_form_ids'])) {
                // Remover las formularios que ya no pertenecen a esta sesión
                ApplicationForm::where('learning_session_id', $learningSession->id)
                    ->whereNotIn('id', $validated['application_form_ids'])
                    ->update(['learning_session_id' => null]);

                // Asignar esta sesión a los nuevos formularios
                ApplicationForm::whereIn('id', $validated['application_form_ids'])
                    ->update(['learning_session_id' => $learningSession->id]);
            }

            if (! empty($validated['capability_ids'])) {
                $learningSession->capabilities()->detach();
                $learningSession->capabilities()->attach($validated['capability_ids']);
            }

            DB::commit();

            if ($request->boolean('redirect')) {
                return redirect()->route('teacher.application-forms.create', [
                    'learning_session_id' => $learningSession->id,
                    'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                    'competency_id' => $validated['competency_id'],
                ]);
            }

            return redirect()->route('teacher.learning-sessions.index')
                ->with('success', 'Sesión de aprendizaje actualizada correctamente');
        } catch (ValidationException $e) {
            DB::rollBack();
            dd($e);

            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();
            dd($e);

            return back()
                ->withInput()
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
    }
}
