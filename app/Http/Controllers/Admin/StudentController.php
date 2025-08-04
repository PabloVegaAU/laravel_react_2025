<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['profile', 'student'])
            ->role('student')
            ->paginate(10);

        return Inertia::render('admin/students/index', [
            'users' => $users,
        ]);
    }

    public function studentToEnrollments()
    {
        $students = Student::with(['profile'])
            ->get();

        return response()->json($students);
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
            'name' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'secondLastName' => 'required|string|max:255',
            'birthDate' => 'required|date',
            'phone' => 'required|string|max:255',
            'entryDate' => 'required|date',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'password' => Hash::make($request->password),
                'email' => $request->email,
            ]);

            $user->assignRole('student');

            $user->profile()->create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'second_last_name' => $request->secondLastName,
                'birth_date' => $request->birthDate,
                'phone' => $request->phone,
            ]);

            $user->student()->create([
                'entry_date' => $request->entryDate,
                'status' => 'active',
                'experience_achieved' => 0,
                'points_store' => 0,
                'graduation_date' => null,
                'user_id' => $user->id,
                'level_id' => 1,
                'range_id' => 1,
            ]);

            DB::commit();

            return redirect()->route('admin.students.index')->with('success', 'Estudiante creado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error al crear el estudiante: '.$e->getMessage());
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
        $user = User::with(['profile', 'student'])->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'secondLastName' => 'required|string|max:255',
            'birthDate' => 'required|date',
            'phone' => 'required|string|max:255',
            'entryDate' => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            $user = User::findOrFail($id);
            $user->update([
                'name' => $request->name,
                'password' => $request->password ? Hash::make($request->password) : $user->password,
                'email' => $request->email,
            ]);
            $user->profile()->update([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'second_last_name' => $request->secondLastName,
                'birth_date' => $request->birthDate,
                'phone' => $request->phone,
            ]);
            $user->student()->update([
                'entry_date' => $request->entryDate,
                'status' => 'active',
                'experience_achieved' => 0,
                'points_store' => 0,
                'graduation_date' => null,
                'user_id' => $user->id,
                'level_id' => 1,
                'range_id' => 1,
            ]);

            DB::commit();

            return redirect()->route(route: 'admin.students.index')->with('success', 'Estudiante actualizado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error al actualizar el estudiante: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
