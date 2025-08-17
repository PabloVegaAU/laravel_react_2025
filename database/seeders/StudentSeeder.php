<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $student = User::factory()->create([
            'name' => '76621871',
            'email' => 'student@student.com',
        ]);

        Student::factory()->create(
            [
                'user_id' => $student->id,
            ]
        );
    }
}
