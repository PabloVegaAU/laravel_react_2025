<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si el usuario admin ya existe
        if (! User::where('email', 'admin@example.com')->exists()) {
            // Crear usuario administrador
            $admin = User::create([
                'name' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            // Asignar rol de administrador
            $admin->assignRole('admin');

            // Crear perfil para el administrador
            Profile::create([
                'user_id' => $admin->id,
                'first_name' => 'Administrador',
                'last_name' => 'Sistema',
                'second_last_name' => 'Admin',
                'phone' => '1234567890',
                'birth_date' => '1990-01-01',
            ]);
        }

        // Verificar si el usuario profesor ya existe
        if (! User::where('email', 'profesor@example.com')->exists()) {
            // Crear usuario profesor
            $teacher = User::create([
                'name' => 'profesor',
                'email' => 'profesor@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            // Asignar rol de profesor
            $teacher->assignRole('teacher');

            // Crear perfil para el profesor
            $teacherProfile = Profile::create([
                'user_id' => $teacher->id,
                'first_name' => 'Profesor',
                'last_name' => 'Ejemplo',
                'second_last_name' => 'Profesor',
                'phone' => '0987654321',
                'birth_date' => '1985-05-15',
            ]);

            // Crear registro de profesor si no existe
            if (! Teacher::where('user_id', $teacher->id)->exists()) {
                Teacher::create([
                    'user_id' => $teacher->id,
                    'status' => 'active',
                ]);
            }
        }

        // Verificar si el usuario estudiante ya existe
        if (! User::where('email', 'estudiante@example.com')->exists()) {
            // Crear usuario estudiante
            $student = User::create([
                'name' => 'estudiante',
                'email' => 'estudiante@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            // Asignar rol de estudiante
            $student->assignRole('student');

            // Crear perfil para el estudiante
            $studentProfile = Profile::create([
                'user_id' => $student->id,
                'first_name' => 'Estudiante',
                'last_name' => 'Ejemplo',
                'second_last_name' => 'Estudiante',
                'phone' => '5555555555',
                'birth_date' => '2010-07-20',
            ]);

            // Crear registro de estudiante si no existe
            if (! Student::where('user_id', $student->id)->exists()) {
                Student::create([
                    'user_id' => $student->id,
                    'level_id' => 1, // Asumiendo que existe un nivel con ID 1
                    'points' => 0,
                    'coins' => 100,
                ]);
            }
        }
    }
}
