<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CurricularArea;
use App\Models\Enrollment;
use App\Models\LearningSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $studentId = auth()->id();

        // Obtener el salón de clases activo del estudiante
        $enrollment = Enrollment::where('student_id', $studentId)
            ->where('status', 'active')
            ->firstOrFail();

        // Construir consulta base con relaciones necesarias
        $query = LearningSession::query()
            ->with([
                'teacherClassroomCurricularAreaCycle.curricularAreaCycle.curricularArea',
                'applicationForm' => function ($q) use ($studentId) {
                    $q->with(['responses' => function ($q) use ($studentId) {
                        $q->where('student_id', $studentId);
                    }]);
                },
            ])
            ->whereHas('teacherClassroomCurricularAreaCycle', function ($q) use ($enrollment) {
                $q->where('classroom_id', $enrollment->classroom_id);
            });

        // Aplicar filtro por área curricular si se especifica y no está vacío ni es '0'
        if ($request->has('curricular_area_id') && $request->curricular_area_id !== '' && $request->curricular_area_id !== '0') {
            $query->whereHas('teacherClassroomCurricularAreaCycle.curricularAreaCycle', function ($q) use ($request) {
                $q->where('curricular_area_id', $request->curricular_area_id);
            });
        }

        // Aplicar filtro por estado de respuesta
        if ($request->has('response_status')) {
            $status = $request->response_status;

            if ($status === 'with_responses') {
                $query->whereHas('applicationForm.responses', function ($q) use ($studentId) {
                    $q->where('student_id', $studentId)
                        ->whereIn('status', ['submitted', 'graded']);
                });
            } elseif ($status === 'without_responses') {
                $query->whereDoesntHave('applicationForm.responses', function ($q) use ($studentId) {
                    $q->where('student_id', $studentId);
                });
            } elseif ($status === 'pending') {
                $query->whereHas('applicationForm.responses', function ($q) use ($studentId) {
                    $q->where('student_id', $studentId)
                        ->where('status', 'in_progress');
                });
            }
        }

        $learningSessions = $query->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        // Obtener áreas curriculares disponibles para el filtro con datos del docente
        $curricularAreas = CurricularArea::whereHas('cycles.teacherClassroomCurricularAreaCycles', function ($q) use ($enrollment) {
            $q->where('classroom_id', $enrollment->classroom_id);
        })
            ->with(['cycles.teacherClassroomCurricularAreaCycles' => function ($q) use ($enrollment) {
                $q->where('classroom_id', $enrollment->classroom_id)
                    ->with(['teacher' => function ($q) {
                        $q->select('user_id')
                            ->with(['user' => function ($q) {
                                $q->select('id')
                                    ->with('profile:user_id,first_name,last_name');
                            }]);
                    }]);
            }])
            ->get()
            ->prepend((object) [
                'id' => '0',
                'name' => 'Todos',
                'color' => '',
                'cycles' => [],
            ]);

        return Inertia::render('student/learning-session/index', [
            'learning_sessions' => $learningSessions,
            'filters' => $request->only(['curricular_area_id', 'response_status']),
            'curricular_areas' => $curricularAreas,
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
    public function show(LearningSession $learningSession)
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
    public function update(Request $request, int $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        //
    }
}
