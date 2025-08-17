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
        Schema::create('enrollments', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único de la matrícula');

            // Información de la matrícula
            $table->year('academic_year')
                ->comment('Año académico de la matrícula');

            $table->enum('status', [
                'active',       // Activo (estudiante actualmente matriculado)
                'completed',    // Completado (graduado o finalizado exitosamente)
                'transferred',  // Transferido a otra institución
                'inactive',     // Inactivo (puede regresar)
                'withdrawn',    // Retirado voluntariamente
                'dismissed',    // Expulsado/separado de la institución
                'failed',       // Reprobado
            ])->default('active')
                ->comment('Estado actual de la matrícula');

            // Fechas importantes
            $table->date('enrollment_date')
                ->useCurrent()
                ->comment('Fecha en que se realizó la matrícula');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante usando user_id como clave foránea');
            $table->foreignId('classroom_id')
                ->constrained('classrooms')
                ->restrictOnDelete()
                ->comment('Referencia al aula en la que está matriculado el estudiante');

            // Índices
            $table->index('academic_year', 'idx_enrollment_academic_year');
            $table->index('status', 'idx_enrollment_status');
            $table->index('student_id', 'idx_enrollment_student');
            $table->index('classroom_id', 'idx_enrollment_classroom');
            $table->index(
                ['student_id', 'academic_year', 'status'],
                'idx_enrollment_student_year_status'
            );

            // Restricciones únicas
            $table->unique(
                ['student_id', 'classroom_id', 'academic_year'],
                'uq_enrollment_student_classroom_year'
            );
            $table->index(
                ['status', 'academic_year'],
                'idx_enrollment_status_year'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
