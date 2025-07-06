<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Desactivar restricciones de clave foránea temporalmente
        Schema::disableForeignKeyConstraints();

        try {
            DB::beginTransaction();

            // 1. Datos base del sistema
            $this->call([
                RoleSeeder::class,
            ]);

            // 2. Datos de gamificación
            $this->call([
                LevelSeeder::class,
                RangeSeeder::class,
            ]);

            DB::commit();

            // 3. Usuarios y perfiles
            $this->call([
                AdminSeeder::class,
                TeacherSeeder::class,
                StudentSeeder::class,
            ]);

            DB::commit();

            $this->command->info('¡Base de datos sembrada exitosamente! 🌱');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error al sembrar la base de datos: '.$e->getMessage());
            throw $e;
        } finally {
            // Reactivar restricciones de clave foránea
            Schema::enableForeignKeyConstraints();
        }
    }
}
