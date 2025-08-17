<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $teacher = User::factory()->create([
            'name' => '76621872',
            'email' => 'teacher@teacher.com',
        ]);

        Teacher::factory()->create(
            [
                'user_id' => $teacher->id,
            ]
        );
    }
}
