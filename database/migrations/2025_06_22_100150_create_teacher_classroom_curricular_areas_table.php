php<?php

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
        Schema::create('teacher_classroom_curricular_areas', function (Blueprint $table) {
            $table->id();

            // Relación con el profesor (usando user_id como clave foránea)
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia al profesor usando user_id como clave foránea');

            // Relación con el aula
            $table->foreignId('classroom_id')
                ->constrained('classrooms')
                ->restrictOnDelete()
                ->comment('Referencia al aula');

            // Relación con el área curricular
            $table->foreignId('curricular_area_id')
                ->constrained('curricular_areas')
                ->restrictOnDelete()
                ->comment('Referencia al área curricular');

            $table->year('academic_year');
            $table->timestamps();

            // Índice único para evitar asignaciones duplicadas
            $table->unique(
                ['teacher_id', 'classroom_id', 'curricular_area_id', 'academic_year'],
                'uq_teacher_classroom_curricular_area'
            );

            // Índices para optimizar consultas comunes
            $table->index('teacher_id', 'idx_tcca_teacher');
            $table->index('classroom_id', 'idx_tcca_classroom');
            $table->index('curricular_area_id', 'idx_tcca_curricular_area');
            $table->index('academic_year', 'idx_tcca_academic_year');

            // Índice compuesto para búsquedas por profesor y año académico
            $table->index(
                ['teacher_id', 'academic_year'],
                'idx_tcca_teacher_year'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_classroom_curricular_areas');
    }
};
