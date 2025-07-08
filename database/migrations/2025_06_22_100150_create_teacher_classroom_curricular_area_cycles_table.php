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
        Schema::create('teacher_classroom_curricular_area_cycles', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único de la asignación');
            $table->year('academic_year')
                ->comment('Año académico de la asignación');

            // Metadatos
            $table->timestamps();

            // Relaciones
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia al profesor usando user_id como clave foránea');

            $table->foreignId('classroom_id')
                ->constrained('classrooms')
                ->restrictOnDelete()
                ->comment('Referencia al aula');

            $table->foreignId('curricular_area_cycle_id')
                ->constrained('curricular_area_cycles')
                ->restrictOnDelete()
                ->comment('Referencia al área curricular en un ciclo específico');

            // Índices
            $table->index('teacher_id', 'idx_tcca_teacher');
            $table->index('classroom_id', 'idx_tcca_classroom');
            $table->index('curricular_area_cycle_id', 'idx_tcca_curricular_area_cycle');
            $table->index('academic_year', 'idx_tcca_academic_year');
            $table->index(
                ['teacher_id', 'academic_year'],
                'idx_tcca_teacher_year'
            );

            // Restricciones únicas
            $table->unique(
                ['teacher_id', 'classroom_id', 'curricular_area_cycle_id', 'academic_year'],
                'uq_teacher_classroom_curricular_area_cycle'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_classroom_curricular_area_cycles');
    }
};
