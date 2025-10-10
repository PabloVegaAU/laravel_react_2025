<?php

namespace App\Http\Services\Admin;

use App\Models\Student;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StudentService
{
    public function getPaginatedStudents(int $perPage = 15): LengthAwarePaginator
    {
        return Student::with(['user', 'profile', 'level'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findStudent(int $id): Student
    {
        return Student::with(['user', 'profile', 'level'])->findOrFail($id);
    }

    public function createStudent(array $data): Student
    {
        return DB::transaction(function () use ($data) {
            // Crear usuario
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => \Hash::make($data['password']),
            ]);

            // Asignar rol de estudiante
            $user->assignRole('student');

            // Crear perfil
            $user->profile()->create([
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName'],
                'second_last_name' => $data['secondLastName'],
                'birth_date' => $data['birthDate'],
                'phone' => $data['phone'],
            ]);

            // Crear estudiante
            return $user->student()->create([
                'entry_date' => $data['entryDate'],
                'status' => 'active',
                'experience_achieved' => 0,
                'points_store' => 0,
                'graduation_date' => null,
                'level_id' => 1, // Valor por defecto
                'range_id' => 1, // Valor por defecto
            ]);
        });
    }

    public function updateStudent(int $id, array $data): Student
    {
        return DB::transaction(function () use ($id, $data) {
            $student = $this->findStudent($id);

            // Actualizar usuario
            $student->user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => isset($data['password'])
                    ? \Hash::make($data['password'])
                    : $student->user->password,
            ]);

            // Actualizar perfil
            $student->user->profile()->update([
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName'],
                'second_last_name' => $data['secondLastName'],
                'birth_date' => $data['birthDate'],
                'phone' => $data['phone'],
            ]);

            // Actualizar estudiante
            $student->update([
                'entry_date' => $data['entryDate'],
                'status' => $data['status'] ?? $student->status,
                'level_id' => $data['level_id'] ?? $student->level_id,
            ]);

            return $student;
        });
    }

    public function deleteStudent(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $student = $this->findStudent($id);
            $student->user()->delete();

            return $student->delete();
        });
    }
}
