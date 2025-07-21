<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $levels = [
            ['level' => 1, 'name' => 'Iniciante', 'experience_required' => 0],
            ['level' => 2, 'name' => 'Aprendiz', 'experience_required' => 1000],
            ['level' => 3, 'name' => 'Intermedio', 'experience_required' => 3000],
            ['level' => 4, 'name' => 'Avanzado', 'experience_required' => 6000],
            ['level' => 5, 'name' => 'Experto', 'experience_required' => 10000],
            ['level' => 6, 'name' => 'Maestro', 'experience_required' => 15000],
            ['level' => 7, 'name' => 'Gran Maestro', 'experience_required' => 21000],
            ['level' => 8, 'name' => 'Leyenda', 'experience_required' => 28000],
            ['level' => 9, 'name' => 'Mítico', 'experience_required' => 36000],
            ['level' => 10, 'name' => 'Supremo', 'experience_required' => 45000],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(
                ['level' => $level['level']],
                $level
            );
        }
    }
}
