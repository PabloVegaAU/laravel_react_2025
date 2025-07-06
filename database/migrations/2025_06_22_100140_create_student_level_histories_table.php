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
        Schema::create('student_level_histories', function (Blueprint $table) {
            $table->id()
                ->comment('Identificador único del registro de historial de nivel');

            // Relación con el estudiante (usando user_id como clave primaria en la tabla students)
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante usando user_id como clave foránea');

            // Relación con el nivel
            $table->foreignId('level_id')
                ->constrained('levels')
                ->restrictOnDelete()
                ->comment('Nivel alcanzado por el estudiante');

            // Relación con el rango
            $table->foreignId('range_id')
                ->constrained('ranges')
                ->restrictOnDelete()
                ->comment('Rango alcanzado por el estudiante');

            // Experiencia acumulada
            $table->decimal('experience', 10, 2)
                ->default(0)
                ->comment('Cantidad de experiencia acumulada');

            // Fecha de logro
            $table->timestamp('achieved_at')
                ->useCurrent()
                ->comment('Fecha y hora en que se alcanzó este nivel/rango');

            // Índices para optimizar consultas
            $table->index(['student_id', 'achieved_at'], 'idx_student_achievement_date');
            $table->index(['level_id', 'range_id'], 'idx_level_range');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_level_histories');
    }
};
