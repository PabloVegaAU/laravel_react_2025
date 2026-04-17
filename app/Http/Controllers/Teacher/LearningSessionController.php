<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ApplicationForm;
use App\Models\ApplicationFormQuestion;
use App\Models\ApplicationFormResponse;
use App\Models\ApplicationFormResponseQuestion;
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
    public function index(Request $request)
    {
        $query = LearningSession::with([
            'competency',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'applicationForm',
        ]);

        // Aplicar filtros
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('registration_status')) {
            $query->where('registration_status', $request->registration_status);
        } else {
            $query->where('registration_status', 'active');
        }

        if ($request->filled('area')) {
            $query->whereHas('teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea', function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->area.'%');
            });
        }

        if ($request->filled('competency')) {
            $query->whereHas('competency', function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->competency.'%');
            });
        }

        if ($request->filled('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        $learningSessions = $query->orderByDesc('id')->paginate(10);

        return Inertia::render('teacher/learning-session/index', [
            'learningSessions' => $learningSessions,
            'filters' => $request->only(['search', 'status', 'registration_status', 'area', 'competency', 'start_date', 'end_date']),
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
            // Combine date and time fields if they are separate
            $requestData = $request->all();
            if (isset($requestData['start_date']) && isset($requestData['start_time'])) {
                $requestData['start_date'] = $requestData['start_date'].'T'.$requestData['start_time'];
            }
            if (isset($requestData['end_date']) && isset($requestData['end_time'])) {
                $requestData['end_date'] = $requestData['end_date'].'T'.$requestData['end_time'];
            }
            $request->merge($requestData);

            $validated = $request->validate([
                'redirect' => 'nullable|boolean',
                'educational_institution_id' => 'required|exists:educational_institutions,id',
                'name' => 'required|string|max:255',
                'purpose_learning' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'status' => 'required|in:scheduled,active,finished,canceled',
                'registration_status' => 'required|in:active,inactive',
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
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $validated['status'],
                'registration_status' => $validated['registration_status'],
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
    public function show(int $id)
    {
        $learningSession = LearningSession::with([
            'educationalInstitution',
            'teacherClassroomCurricularAreaCycle.classroom',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.cycle',
            'competency',
            'capabilities',
            'applicationForm',
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

        return Inertia::render('teacher/learning-session/show/index', [
            'learning_session' => $learningSession,
            'teacher_classroom_curricular_area_cycles' => $teacherClassroomCurricularAreaCycles,
        ]);
    }

    /**
     * Display the table calification for the specified resource.
     */
    public function getTableCalification(int $id)
    {
        $learningSession = LearningSession::with([
            'educationalInstitution',
            'teacherClassroomCurricularAreaCycle.classroom',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
            'teacherClassroomCurricularAreaCycle.curricularAreaCycle.cycle',
            'applicationForm',
            'applicationForm.responses',
            'applicationForm.responses.student',
            'applicationForm.responses.student.profile',
        ])->findOrFail($id);

        return Inertia::render('teacher/learning-session/table-calification/index', [
            'learning_session' => $learningSession,
        ]);
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
            'applicationForm',
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
            // Combine date and time fields if they are separate
            $requestData = $request->all();
            if (isset($requestData['start_date']) && isset($requestData['start_time'])) {
                $requestData['start_date'] = $requestData['start_date'].'T'.$requestData['start_time'];
            }
            if (isset($requestData['end_date']) && isset($requestData['end_time'])) {
                $requestData['end_date'] = $requestData['end_date'].'T'.$requestData['end_time'];
            }
            $request->merge($requestData);

            $validated = $request->validate([
                'redirect' => 'nullable|boolean',
                'name' => 'required|string|max:255',
                'purpose_learning' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'status' => 'required|in:scheduled,active,finished,canceled',
                'registration_status' => 'required|in:active,inactive',
                'performances' => 'required|string',
                'start_sequence' => 'required|string',
                'end_sequence' => 'required|string',
                'teacher_classroom_curricular_area_cycle_id' => 'required|exists:teacher_classroom_curricular_area_cycles,id',
                'competency_id' => 'required|exists:competencies,id',
                'capability_ids' => 'nullable|array',
                'capability_ids.*' => 'nullable|exists:capabilities,id',
                'application_form_id' => 'nullable|exists:application_forms,id',
            ]);

            DB::beginTransaction();

            $learningSession = LearningSession::with('applicationForm')->findOrFail($id);

            $learningSession->update([
                'name' => $validated['name'],
                'purpose_learning' => $validated['purpose_learning'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => $validated['status'],
                'registration_status' => $validated['registration_status'],
                'performances' => $validated['performances'],
                'start_sequence' => $validated['start_sequence'],
                'end_sequence' => $validated['end_sequence'],
                'teacher_classroom_curricular_area_cycle_id' => $validated['teacher_classroom_curricular_area_cycle_id'],
                'competency_id' => $validated['competency_id'],
            ]);

            // Sincronizar fechas con ApplicationForm relacionado
            if ($learningSession->applicationForm) {
                $learningSession->applicationForm->update([
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                ]);
            }

            if (isset($validated['application_form_id'])) {
                // Remover las formularios que ya no pertenecen a esta sesión
                ApplicationForm::where('learning_session_id', $learningSession->id)
                    ->where('id', '!=', $validated['application_form_id'])
                    ->update(['learning_session_id' => null]);

                // Asignar esta sesión a los nuevos formularios
                ApplicationForm::where('id', $validated['application_form_id'])
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

            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.'.$e->getMessage());
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Ocurrió un error inesperado al guardar la sesión. Intenta nuevamente.'.$e->getMessage());
        }
    }

    /**
     * Cambiar el estado de registro de una sesión de aprendizaje
     *
     * El registration_status es independiente del status de la sesión y controla
     * si la sesión está disponible para registro por estudiantes.
     * - active: La sesión está disponible para registro
     * - inactive: La sesión no está disponible para registro (establece deactivated_at)
     *
     * Restricciones de negocio (lógica manual):
     * - NO permitir desactivar si el estado actual es "finished" o "active"
     * - NO permitir reactivar si el estado actual es "canceled" y fuera de rango de fecha inicio y fin
     * - SOLO permitir desactivar si el estado actual es "scheduled"
     * - Al desactivar manualmente, status cambia a "canceled"
     */
    public function changeRegistrationStatus(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'registration_status' => 'required|in:active,inactive',
            ]);

            $learningSession = LearningSession::with('applicationForm')->findOrFail($id);

            DB::beginTransaction();

            // Validar restricciones de estado
            if ($validated['registration_status'] === 'inactive') {
                // NO permitir desactivar si el estado es "finished" o "active"
                if (in_array($learningSession->status, ['finished', 'active'])) {
                    throw new \Exception('No se puede desactivar el registro de una sesión que está finalizada o activa. Solo se puede desactivar sesiones en estado "programado".');
                }

                // SOLO permitir desactivar si el estado es "scheduled"
                if ($learningSession->status !== 'scheduled') {
                    throw new \Exception('Solo se puede desactivar el registro de sesiones que están en estado "programado".');
                }

                // Establecer fecha de desactivación y cambiar status a canceled (manual)
                $updateData = [
                    'registration_status' => 'inactive',
                    'deactivated_at' => now(),
                    'status' => 'canceled',
                ];

                // Sincronizar con applicationForm relacionado aplicando las mismas restricciones
                if ($learningSession->applicationForm) {
                    // Validar que el ApplicationForm también esté en estado "scheduled"
                    if ($learningSession->applicationForm->status !== 'scheduled') {
                        throw new \Exception('No se puede desactivar el registro porque la ficha de aplicación relacionada no está en estado "programado".');
                    }

                    $learningSession->applicationForm->update([
                        'status' => 'canceled',
                        'registration_status' => 'inactive',
                        'deactivated_at' => now(),
                    ]);
                }
            } else {
                // Reactivar a active
                // NO permitir reactivar si el estado es "canceled" fuera del rango de fechas
                if ($learningSession->status === 'canceled') {
                    $now = now();
                    $startDate = $learningSession->start_date;
                    $endDate = $learningSession->end_date;

                    if ($now < $startDate || $now > $endDate) {
                        throw new \Exception('No se puede reactivar el registro de una sesión cancelada fuera del rango de fechas de la sesión.');
                    }
                }

                // Limpiar fecha de desactivación
                $updateData = [
                    'registration_status' => 'active',
                    'deactivated_at' => null,
                ];

                // Calcular status basado en la fecha actual
                $now = now();
                $startDate = $learningSession->start_date;
                $endDate = $learningSession->end_date;

                if ($now >= $startDate && $now <= $endDate) {
                    // Dentro del rango de fechas: activo
                    $updateData['status'] = 'active';
                } elseif ($now < $startDate) {
                    // Antes de la fecha de inicio: programado
                    $updateData['status'] = 'scheduled';
                } else {
                    // Después de la fecha de fin: mantener el status actual
                    $updateData['status'] = $learningSession->status;
                }

                // Reactivar applicationForm relacionado con el mismo status
                if ($learningSession->applicationForm) {
                    // Validar que el ApplicationForm no esté cancelado
                    if ($learningSession->applicationForm->status === 'canceled') {
                        throw new \Exception('No se puede reactivar el registro porque la ficha de aplicación relacionada está cancelada.');
                    }

                    $learningSession->applicationForm->update([
                        'status' => $updateData['status'],
                        'registration_status' => 'active',
                        'deactivated_at' => null,
                    ]);
                }
            }

            $learningSession->update($updateData);

            DB::commit();

            return back()
                ->with('success', 'Estado de registro de la sesión de aprendizaje actualizado correctamente');
        } catch (ValidationException $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al actualizar el estado de registro de la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    // Generar ApplicationFormResponses para students
    public function generateApplicationFormResponses(LearningSession $learningSession)
    {
        // Revisar si existen applicationFormResponses
        if (ApplicationFormResponse::where('application_form_id', $learningSession->applicationForm->id)->exists()) {
            return;
        }

        $applicationForm = $learningSession->applicationForm->load('questions');

        // Después de insertar las preguntas del formulario, obtenemos los IDs generados
        $insertedQuestions = ApplicationFormQuestion::where('application_form_id', $applicationForm->id)->get();

        // Creamos un mapa de question_id a application_form_question_id
        $questionIdMap = $insertedQuestions->pluck('id', 'question_id');

        // Obtener estudiantes del aula para crear respuestas
        $teacherClassroomCurricularAreaCycle = TeacherClassroomCurricularAreaCycle::with(['classroom.students' => function ($query) {
            $query->select('students.*')
                ->whereHas('enrollments', function ($q) {
                    $q->where('status', 'active');
                });
        }])->findOrFail($learningSession->teacher_classroom_curricular_area_cycle_id);

        if ($teacherClassroomCurricularAreaCycle->classroom && $teacherClassroomCurricularAreaCycle->classroom->students->isNotEmpty()) {
            foreach ($teacherClassroomCurricularAreaCycle->classroom->students as $student) {
                $applicationFormResponses = [
                    'score' => 0,
                    'status' => 'pending',
                    'started_at' => null,
                    'submitted_at' => null,
                    'graded_at' => null,
                    'application_form_id' => $applicationForm->id,
                    'student_id' => $student->user_id,
                ];

                $applicationFormResponse = ApplicationFormResponse::create($applicationFormResponses);

                // Preparar preguntas de respuesta para inserción masiva
                $applicationFormResponseQuestions = [];
                foreach ($applicationForm->questions as $question) {
                    // Usamos el mapa para obtener el ID correcto
                    $appFormQuestionId = $questionIdMap[$question->question_id] ?? null;

                    $applicationFormResponseQuestions[] = [
                        'application_form_response_id' => $applicationFormResponse->id,
                        'application_form_question_id' => $appFormQuestionId,
                        'explanation' => '',
                        'score' => $question['score'],
                        'points_store' => $question['points_store'],
                    ];
                }

                ApplicationFormResponseQuestion::insert($applicationFormResponseQuestions);
            }
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
