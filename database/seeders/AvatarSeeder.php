<?php

namespace Database\Seeders;

use App\Models\Avatar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AvatarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing avatars
        DB::table('avatars')->delete();

        // Create test avatars
        Avatar::create([
            'name' => 'Estudiante Ejemplar',
            'image_url' => 'avatars/default-avatar.png',
            'price' => 100.00,
            'is_active' => true,
        ]);

        // Add more test avatars if needed
        Avatar::create([
            'name' => 'Científico Loco',
            'image_url' => 'avatars/scientist-avatar.png',
            'price' => 150.00,
            'is_active' => true,
        ]);

        Avatar::create([
            'name' => 'Deportista',
            'image_url' => 'avatars/athlete-avatar.png',
            'price' => 120.00,
            'is_active' => true,
        ]);
    }
}
