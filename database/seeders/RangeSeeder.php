<?php

namespace Database\Seeders;

use App\Models\Range;
use Illuminate\Database\Seeder;

class RangeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $ranges = [
            [
                'name' => 'Novato',
                'level_required' => 1,
                'color' => '#808080',
                'image' => 'ranges/novato.png',
                'description' => '¡Bienvenido a la aventura! Recién empiezas tu viaje.',
                'order' => 1,
            ],
            [
                'name' => 'Aprendiz',
                'level_required' => 2,
                'color' => '#2ecc71',
                'image' => 'ranges/aprendiz.png',
                'description' => 'Has dado tus primeros pasos en el aprendizaje.',
                'order' => 2,
            ],
            [
                'name' => 'Intermedio',
                'level_required' => 3,
                'color' => '#3498db',
                'image' => 'ranges/intermedio.png',
                'description' => 'Vas por buen camino, sigue así.',
                'order' => 3,
            ],
            [
                'name' => 'Avanzado',
                'level_required' => 4,
                'color' => '#9b59b6',
                'image' => 'ranges/avanzado.png',
                'description' => 'Tus habilidades están por encima del promedio.',
                'order' => 4,
            ],
            [
                'name' => 'Experto',
                'level_required' => 5,
                'color' => '#f1c40f',
                'image' => 'ranges/experto.png',
                'description' => 'Dominas los conceptos fundamentales.',
                'order' => 5,
            ],
            [
                'name' => 'Maestro',
                'level_required' => 6,
                'color' => '#e67e22',
                'image' => 'ranges/maestro.png',
                'description' => 'Otros buscan tu conocimiento y guía.',
                'order' => 6,
            ],
            [
                'name' => 'Gran Maestro',
                'level_required' => 7,
                'color' => '#e74c3c',
                'image' => 'ranges/gran-maestro.png',
                'description' => 'Eres una autoridad en el tema.',
                'order' => 7,
            ],
            [
                'name' => 'Leyenda',
                'level_required' => 8,
                'color' => '#c0392b',
                'image' => 'ranges/leyenda.png',
                'description' => 'Tu nombre quedará grabado en la historia.',
                'order' => 8,
            ],
            [
                'name' => 'Mítico',
                'level_required' => 9,
                'color' => '#8e44ad',
                'image' => 'ranges/mitico.png',
                'description' => 'Pocos alcanzan este nivel de maestría.',
                'order' => 9,
            ],
            [
                'name' => 'Supremo',
                'level_required' => 10,
                'color' => '#2c3e50',
                'image' => 'ranges/supremo.png',
                'description' => 'Has alcanzado la cima del conocimiento.',
                'order' => 10,
            ],
        ];

        foreach ($ranges as $range) {
            Range::updateOrCreate(
                ['name' => $range['name']],
                $range
            );
        }
    }
}
