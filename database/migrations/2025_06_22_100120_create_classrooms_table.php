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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id()
                ->comment('Identificador único del aula');

            $table->string('grade', 10)
                ->comment('Grado académico (ej: 1ro, 2do, etc.)');

            $table->string('section', 10)
                ->comment('Sección del grado (ej: A, B, C)');

            $table->enum('level', [
                'primary',     // Educación primaria
                'secondary',   // Educación secundaria
            ])->comment('Nivel educativo del aula');

            $table->year('academic_year')
                ->comment('Año académico al que pertenece el aula');

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimizar consultas
            $table->index(['level', 'grade', 'section'], 'idx_classroom_level_grade_section');
            $table->index('academic_year', 'idx_classroom_academic_year');

            // Índice compuesto para búsquedas frecuentes
            $table->index(
                ['academic_year', 'level'],
                'idx_classroom_year_level'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
