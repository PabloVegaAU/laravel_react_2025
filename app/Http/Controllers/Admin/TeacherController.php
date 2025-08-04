<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeacherClassroomCurricularAreaCycle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['profile', 'teacher'])
            ->role('teacher')
            ->paginate(10);

        return Inertia::render('admin/teachers/index', [
            'users' => $users,
        ]);
    }

    public function classroomCurricularAreaCycles($id)
    {
        $teacherClassroomCurricularAreaCycles = TeacherClassroomCurricularAreaCycle::with(
            [
                'classroom',
                'curricularAreaCycle',
                'curricularAreaCycle.curricularArea',
                'curricularAreaCycle.cycle',
            ]
        )
            ->where('teacher_id', $id)
            ->where('academic_year', date('Y'))
            ->get();

        return response()->json($teacherClassroomCurricularAreaCycles);
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
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'password' => Hash::make($request->password),
                'email' => $request->email,
            ]);

            $user->assignRole('teacher');

            $user->profile()->create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'second_last_name' => $request->secondLastName,
                'birth_date' => $request->birthDate,
                'phone' => $request->phone,
            ]);

            $user->teacher()->create([
                'status' => 'active',
            ]);

            DB::commit();

            return redirect()->route('admin.teachers.index')->with('success', 'Docente creado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error al crear el docente: '.$e->getMessage());
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
        $user = User::with(['profile', 'teacher'])->findOrFail($id);

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

            DB::commit();

            return redirect()->route(route: 'admin.teachers.index')->with('success', 'Docente actualizado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error al actualizar el docente: '.$e->getMessage());
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
