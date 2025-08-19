<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'year' => 'nullable|integer',
            'search' => 'nullable|string|max:255',
        ]);

        $enrollments = Enrollment::with([
            'classroom',
            'student.profile',
        ])
            ->when($request->year, function ($query) use ($request) {
                return $query->where('academic_year', $request->year);
            })
            ->when($request->search, function ($query) use ($request) {
                return $query->whereHas('student.user.profile', function ($q) use ($request) {
                    $searchTerm = '%'.$request->search.'%';
                    $q->where('first_name', 'like', $searchTerm)
                        ->orWhere('last_name', 'like', $searchTerm)
                        ->orWhere('second_last_name', 'like', $searchTerm);
                });
            })
            ->latest('enrollment_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/enrollments/index', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['year', 'search']),
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
        $request->validate([
            'student_id' => 'required|exists:students,user_id',
            'classroom_id' => 'required|exists:classrooms,id',
            'academic_year' => 'required|integer',
            'enrollment_date' => 'required|date',
            'status' => 'required|string|in:active,inactive',
            'status_previous' => 'required|string|in:inactive,active,completed,transferred,withdrawn,dismissed,failed',
        ]);

        try {
            // Buscar matricula actual
            $currentEnrollment = Enrollment::where('student_id', $request->student_id)
                ->where('academic_year', $request->academic_year)
                ->first();

            // Verificar si ya existe una matrícula para este año
            if ($currentEnrollment) {
                return redirect()->back()->with('error', 'El estudiante ya tiene una matrícula para este año');
            }

            // Buscar matricula anterior
            $previousEnrollment = Enrollment::where('student_id', $request->student_id)
                ->latest('academic_year')
                ->where('academic_year', '<', $request->academic_year)
                ->first();

            // Cambiar estado de matricula anterior si existe
            if ($previousEnrollment && ($previousEnrollment->status == 'active' || $previousEnrollment->status == 'inactive')) {
                $previousEnrollment->update([
                    'status' => $request->status_previous,
                ]);
            }

            Enrollment::create([
                'student_id' => $request->student_id,
                'classroom_id' => $request->classroom_id,
                'academic_year' => $request->academic_year,
                'enrollment_date' => $request->enrollment_date,
                'status' => $request->status,
            ]);

            return redirect()->route('admin.enrollments.index')->with('success', 'Matricula agregada exitosamente');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Error al agregar matricula'.$th->getMessage());
        }
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
    {//
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
