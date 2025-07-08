<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_achievements', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único del logro del estudiante');
            $table->timestamp('achieved_at')
                ->useCurrent()
                ->comment('Fecha y hora en que se obtuvo el logro');

            // Relaciones
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante que obtuvo el logro');

            $table->foreignId('achievement_id')
                ->constrained('achievements')
                ->cascadeOnDelete()
                ->comment('Referencia al logro obtenido');

            // Índices
            $table->index('student_id', 'idx_student_achievements_student');
            $table->index('achievement_id', 'idx_student_achievements_achievement');

            // Restricción única para evitar duplicados
            $table->unique(
                ['student_id', 'achievement_id'],
                'uq_student_achievement'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_achievements');
    }
};
