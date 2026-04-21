<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $teacher = Role::firstOrCreate(['name' => 'teacher']);
        $student = Role::firstOrCreate(['name' => 'student']);

        // DASHBOARD
        Permission::firstOrCreate(['name' => 'admin.dashboard.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'teacher.dashboard.index'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'student.dashboard.index'])->syncRoles([$student]);

        // ********************* PERMISOS ADMIN *****************************
        // CRUD USERS
        Permission::firstOrCreate(['name' => 'admin.users.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.users.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.users.show'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.users.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.users.destroy'])->syncRoles([$admin]);

        // CRUD STUDENTS
        Permission::firstOrCreate(['name' => 'admin.students.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.students.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.students.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.students.destroy'])->syncRoles([$admin]);

        // CRUD TEACHERS
        Permission::firstOrCreate(['name' => 'admin.teachers.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.teachers.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.teachers.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.teachers.destroy'])->syncRoles([$admin]);

        // CRUD ACHIEVEMENTS
        Permission::firstOrCreate(['name' => 'admin.achievements.index'])->syncRoles([$admin,$teacher]);
        Permission::firstOrCreate(['name' => 'admin.achievements.create'])->syncRoles([$admin,$teacher]);
        Permission::firstOrCreate(['name' => 'admin.achievements.edit'])->syncRoles([$admin,$teacher]);
        Permission::firstOrCreate(['name' => 'admin.achievements.destroy'])->syncRoles([$admin,$teacher]);

        // CRUD PRIZES
        Permission::firstOrCreate(['name' => 'admin.prizes.index'])->syncRoles([$admin,$teacher]);
        Permission::firstOrCreate(['name' => 'admin.prizes.create'])->syncRoles([$admin,$teacher]);
        Permission::firstOrCreate(['name' => 'admin.prizes.edit'])->syncRoles([$admin,$teacher]);
        Permission::firstOrCreate(['name' => 'admin.prizes.destroy'])->syncRoles([$admin,$teacher]);

        // CRUD AVATARS
        Permission::firstOrCreate(['name' => 'admin.avatars.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.avatars.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.avatars.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.avatars.destroy'])->syncRoles([$admin]);

        // CRUD BACKGROUND
        Permission::firstOrCreate(['name' => 'admin.backgrounds.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.backgrounds.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.backgrounds.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.backgrounds.destroy'])->syncRoles([$admin]);

        // CRUD ENROLLMENTS
        Permission::firstOrCreate(['name' => 'admin.enrollments.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.enrollments.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.enrollments.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.enrollments.destroy'])->syncRoles([$admin]);

        // CRUD OBJECTS
        Permission::firstOrCreate(['name' => 'admin.objects.index'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.objects.create'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.objects.edit'])->syncRoles([$admin]);
        Permission::firstOrCreate(['name' => 'admin.objects.destroy'])->syncRoles([$admin]);

        // ********************* PERMISOS TEACHER *****************************
        // CRUD LEARNING SESSIONS
        Permission::firstOrCreate(['name' => 'teacher.learning-sessions.index'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.learning-sessions.create'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.learning-sessions.edit'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.learning-sessions.destroy'])->syncRoles([$teacher]);

        // CRUD APPLICATION FORMS
        Permission::firstOrCreate(['name' => 'teacher.application-forms.index'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.application-forms.create'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.application-forms.edit'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.application-forms.destroy'])->syncRoles([$teacher]);

        // CRUD QUESTIONS
        Permission::firstOrCreate(['name' => 'teacher.questions.index'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.questions.create'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.questions.edit'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.questions.destroy'])->syncRoles([$teacher]);

        // CRUD PRIZES
        Permission::firstOrCreate(['name' => 'teacher.student-prizes.index'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.student-prizes.create'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.student-prizes.edit'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.student-prizes.destroy'])->syncRoles([$teacher]);

        // CRUD ACHIEVEMENTS
        Permission::firstOrCreate(['name' => 'teacher.achievements.index'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.achievements.create'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.achievements.edit'])->syncRoles([$teacher]);
        Permission::firstOrCreate(['name' => 'teacher.achievements.destroy'])->syncRoles([$teacher]);

        // ********************* PERMISOS STUDENT *****************************
        // CRUD LEARNING SESSIONS
        Permission::firstOrCreate(['name' => 'student.learning-sessions.index'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.learning-sessions.create'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.learning-sessions.edit'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.learning-sessions.destroy'])->syncRoles([$student]);

        // CRUD APPLICATION FORMS
        Permission::firstOrCreate(['name' => 'student.application-forms.index'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.application-forms.create'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.application-forms.edit'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.application-forms.destroy'])->syncRoles([$student]);

        // STORE
        Permission::firstOrCreate(['name' => 'student.store'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.store.points.index'])->syncRoles([$student]);
        Permission::firstOrCreate(['name' => 'student.objects'])->syncRoles([$student]);

    }
}
