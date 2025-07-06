<?php

namespace Database\Factories;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'status' => 'active',
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Teacher $teacher) {
            $teacher->user->assignRole('teacher');
        });
    }
}
