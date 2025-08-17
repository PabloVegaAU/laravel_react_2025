<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Enrollment;
use App\Models\StudentPrize;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentPrizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Obtener salones del profesor autenticado
        $classrooms = Classroom::with('teachers')
            ->whereHas('teachers', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->get();

        $classroomIds = $classrooms->pluck('id')->toArray();

        $enrollments = Enrollment::with('student')
            ->whereIn('classroom_id', $classroomIds)
            ->get();

        $studentIds = $enrollments->pluck('student_id')->toArray();

        // Construir query
        $query = StudentPrize::with('student.profile', 'prize')
            ->whereIn('student_id', $studentIds);

        // Aplicar búsqueda si existe
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student.profile', function ($q) use ($search) {
                $q->where('first_name', 'ILIKE', "%{$search}%")
                    ->orWhere('last_name', 'ILIKE', "%{$search}%")
                    ->orWhere('second_last_name', 'ILIKE', "%{$search}%");
            });
        }

        // Paginación
        $studentPrizes = $query->paginate($request->per_page ?? 10);

        return Inertia::render('teacher/student-prizes/index', [
            'student_prizes' => $studentPrizes,
            'filters' => $request->all(),
        ]);
    }

    public function claim(int $id)
    {
        $studentPrize = StudentPrize::findOrFail($id);

        $studentPrize->claimed = true;
        $studentPrize->claimed_at = now();

        $studentPrize->save();

        return redirect()->back()->with('success', 'Premio reclamado exitosamente');
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
