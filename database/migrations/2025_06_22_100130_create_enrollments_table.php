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
            ])->default('active')
                ->comment('Estado actual de la matrícula');

            // Fechas importantes
            $table->date('enrollment_date')
                ->useCurrent()
                ->comment('Fecha en que se realizó la matrícula');
            $table->date('start_date')
                ->nullable()
                ->comment('Fecha de inicio de clases para esta matrícula');
            $table->date('end_date')
                ->nullable()
                ->comment('Fecha de finalización de la matrícula');

            // Metadatos
            $table->string('created_by')
                ->nullable()
                ->comment('Usuario que realizó el registro');
            $table->string('updated_by')
                ->nullable()
                ->comment('Usuario que actualizó por última vez');
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
            $table->index(
                ['start_date', 'end_date'],
                'idx_enrollment_date_range'
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
