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

            $learningSession = LearningSession::findOrFail($id);

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

    public function changeStatus(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:scheduled,active,finished,canceled',
            ]);

            $learningSession = LearningSession::with('applicationForm')->findOrFail($id);

            // Validar transición de estados
            $currentStatus = $learningSession->status;
            $newStatus = $validated['status'];

            // No permitir cambiar de estado una vez cancelado
            if ($currentStatus === 'canceled') {
                throw new \Exception('No se puede cambiar el estado de una sesión cancelada. Una vez cancelada, la sesión no puede cambiar de estado.');
            }

            // No permitir retroceder de active a scheduled
            if ($currentStatus === 'active' && $newStatus === 'scheduled') {
                throw new \Exception('No se puede cambiar de activo a programado. Una sesión activa no puede volver a programada.');
            }

            // No permitir reactivar desde finished
            if ($currentStatus === 'finished' && $newStatus === 'active') {
                throw new \Exception('No se puede reactivar una sesión finalizada.');
            }

            // No permitir reactivar si registration_status es inactive
            if ($learningSession->registration_status === 'inactive' && in_array($newStatus, ['scheduled', 'active'])) {
                throw new \Exception('No se puede reactivar una sesión con estado de registro inactivo.');
            }

            DB::beginTransaction();

            // Sincronizar registration_status basado en el status
            // Regla de negocio: registration_status es active cuando status es scheduled o active, inactive cuando es finished o canceled
            $registrationStatus = in_array($validated['status'], ['scheduled', 'active']) ? 'active' : 'inactive';
            $updateData = [
                'status' => $validated['status'],
                'registration_status' => $registrationStatus,
            ];

            // Manejar la activación de la sesión
            if ($validated['status'] === 'active') {
                // Validar que la ficha de aplicación exista
                if (! $learningSession->applicationForm) {
                    throw new \Exception('La sesión de aprendizaje debe tener una ficha de aplicación asociada para poder activarse.');
                }

                // NOTA: Se eliminó la validación de fecha de inicio para permitir activar antes de la fecha de inicio
                // La sesión puede activarse en cualquier momento

                // Generar respuestas del formulario para los estudiantes
                $this->generateApplicationFormResponses($learningSession);
            }

            // Manejar la finalización o cancelación de la sesión
            if (in_array($validated['status'], ['finished', 'canceled'])) {
                // Establecer fecha de desactivación
                $updateData['deactivated_at'] = now();

                // Manejar applicationFormResponse cuando se cancela
                if ($validated['status'] === 'canceled' && $learningSession->applicationForm) {
                    // Eliminar applicationFormResponse en pending o in progress
                    ApplicationFormResponse::where('application_form_id', $learningSession->applicationForm->id)
                        ->whereIn('status', ['pending', 'in progress'])
                        ->delete(); // Soft delete
                }

                // Sincronizar con la ficha de aplicación relacionada
                if ($learningSession->applicationForm) {
                    $learningSession->applicationForm->update([
                        'status' => $validated['status'],
                        'registration_status' => 'inactive',
                        'deactivated_at' => now(),
                    ]);
                }
            }

            // Manejar la reactivación de la sesión (scheduled o active)
            if (in_array($validated['status'], ['scheduled', 'active'])) {
                // Limpiar fecha de desactivación
                $updateData['deactivated_at'] = null;

                // Reactivar la ficha de aplicación relacionada si existe
                if ($learningSession->applicationForm) {
                    $learningSession->applicationForm->update([
                        'status' => $validated['status'],
                        'registration_status' => 'active',
                        'deactivated_at' => null,
                    ]);
                }
            }

            // Actualizar la sesión
            $learningSession->update($updateData);

            DB::commit();

            return redirect()->route('teacher.learning-sessions.index')
                ->with('success', 'Estado de la sesión de aprendizaje actualizado correctamente');
        } catch (ValidationException $e) {
            return back()
                ->withInput()
                ->withErrors($e->validator)
                ->with('error', 'Ocurrió un error inesperado al actualizar el estado de la sesión. Intenta nuevamente.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', $e->getMessage());
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
     * Regla de negocio: Cuando registration_status cambia a inactive, status cambia a canceled
     */
    public function changeRegistrationStatus(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'registration_status' => 'required|in:active,inactive',
            ]);

            $learningSession = LearningSession::with('applicationForm')->findOrFail($id);

            DB::beginTransaction();

            // Lógica de negocio para registration_status
            $updateData = [
                'registration_status' => $validated['registration_status'],
            ];

            if ($validated['registration_status'] === 'inactive') {
                // Establecer fecha de desactivación y cancelar la sesión
                $updateData['deactivated_at'] = now();
                $updateData['status'] = 'canceled';

                // Sincronizar con applicationForm relacionado
                if ($learningSession->applicationForm) {
                    $learningSession->applicationForm->update([
                        'status' => 'canceled',
                        'registration_status' => 'inactive',
                        'deactivated_at' => now(),
                    ]);
                }
            } else {
                // Limpiar fecha de desactivación
                $updateData['deactivated_at'] = null;

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
                    // Después de la fecha de fin: mantener el status actual o cambiar a scheduled si era canceled
                    if ($learningSession->status === 'canceled') {
                        $updateData['status'] = 'scheduled';
                    }
                }

                // Reactivar applicationForm relacionado con el mismo status
                if ($learningSession->applicationForm) {
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
