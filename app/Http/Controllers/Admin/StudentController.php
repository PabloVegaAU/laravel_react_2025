<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Services\Admin\StudentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(
        private StudentService $studentService
    ) {}

    public function index()
    {
        $students = $this->studentService->getPaginatedStudents();

        return Inertia::render('admin/students/index', [
            'students' => $students,
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'secondLastName' => 'required|string|max:255',
            'birthDate' => 'required|date|before:today',
            'phone' => 'required|string|max:20',
            'entryDate' => 'required|date',
        ]);

        try {
            $this->studentService->createStudent($validated);

            return redirect()->route('admin.students.index')
                ->with('success', 'Estudiante creado exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al crear el estudiante: '.$e->getMessage())
                ->withInput();
        }
    }

    public function show(int $id)
    {
        //
    }

    public function edit(int $id)
    {
        $student = $this->studentService->findStudent($id);

        return response()->json($student);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$id.',id',
            'password' => 'nullable|string|min:8|confirmed',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'secondLastName' => 'required|string|max:255',
            'birthDate' => 'required|date|before:today',
            'phone' => 'required|string|max:20',
            'entryDate' => 'required|date',
            'status' => 'sometimes|in:active,inactive,graduated',
            'level_id' => 'sometimes|exists:levels,id',
        ]);

        try {
            $this->studentService->updateStudent($id, $validated);

            return redirect()->route(route: 'admin.students.index')->with('success', 'Estudiante actualizado exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al actualizar el estudiante: '.$e->getMessage())
                ->withInput();
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->studentService->deleteStudent($id);

            return redirect()->route('admin.students.index')
                ->with('success', 'Estudiante eliminado exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al eliminar el estudiante: '.$e->getMessage());
        }
    }
}
