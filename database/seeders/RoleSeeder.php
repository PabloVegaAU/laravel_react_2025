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
        $admin = Role::create(['name' => 'admin']);
        $teacher = Role::create(['name' => 'teacher']);
        $student = Role::create(['name' => 'student']);

        // DASHBOARD
        Permission::create(['name' => 'admin.dashboard.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'teacher.dashboard.index'])->syncRoles([$teacher]);
        Permission::create(['name' => 'student.dashboard.index'])->syncRoles([$student]);

        // ********************* PERMISOS ADMIN *****************************
        // CRUD USERS
        Permission::create(['name' => 'admin.users.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.users.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.users.show'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.users.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.users.destroy'])->syncRoles([$admin]);

        // CRUD STUDENTS
        Permission::create(['name' => 'admin.students.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.students.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.students.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.students.destroy'])->syncRoles([$admin]);

        // CRUD TEACHERS
        Permission::create(['name' => 'admin.teachers.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.teachers.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.teachers.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.teachers.destroy'])->syncRoles([$admin]);

        // CRUD ACHIEVEMENTS
        Permission::create(['name' => 'admin.achievements.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.achievements.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.achievements.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.achievements.destroy'])->syncRoles([$admin]);

        // CRUD STORE REWARDS
        Permission::create(['name' => 'admin.store-rewards.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.store-rewards.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.store-rewards.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.store-rewards.destroy'])->syncRoles([$admin]);

        // CRUD AVATARS
        Permission::create(['name' => 'admin.avatars.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.avatars.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.avatars.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.avatars.destroy'])->syncRoles([$admin]);

        // CRUD BACKGROUND
        Permission::create(['name' => 'admin.backgrounds.index'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.backgrounds.create'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.backgrounds.edit'])->syncRoles([$admin]);
        Permission::create(['name' => 'admin.backgrounds.destroy'])->syncRoles([$admin]);

        // ********************* PERMISOS TEACHER *****************************
        // CRUD QUESTIONS
        Permission::create(['name' => 'teacher.questions.index'])->syncRoles([$teacher]);
        Permission::create(['name' => 'teacher.questions.create'])->syncRoles([$teacher]);
        Permission::create(['name' => 'teacher.questions.edit'])->syncRoles([$teacher]);
        Permission::create(['name' => 'teacher.questions.destroy'])->syncRoles([$teacher]);

        // CRUD APPLICATION FORMS
        Permission::create(['name' => 'teacher.application-forms.index'])->syncRoles([$teacher]);
        Permission::create(['name' => 'teacher.application-forms.create'])->syncRoles([$teacher]);
        Permission::create(['name' => 'teacher.application-forms.edit'])->syncRoles([$teacher]);
        Permission::create(['name' => 'teacher.application-forms.destroy'])->syncRoles([$teacher]);

        // ********************* PERMISOS STUDENT *****************************
    }
}
