<?php

namespace Database\Factories;

use App\Models\Level;
use App\Models\Range;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'level_id' => Level::inRandomOrder()->first()?->id ?? 1,
            'range_id' => Range::inRandomOrder()->first()?->id ?? 1,
            'entry_date' => now()->subMonths(rand(1, 12)),
            'status' => 'active',
            'experience_achieved' => 0,
            'points_store_achieved' => 0,
            'points_store' => 0,
            'graduation_date' => null,
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Student $student) {
            $student->user->assignRole('student');
        });
    }
}
