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
            $table->id()
                ->comment('Identificador único de la matrícula');

            // Relación con el estudiante
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante usando user_id como clave foránea');

            // Relación con el aula
            $table->foreignId('classroom_id')
                ->constrained('classrooms')
                ->restrictOnDelete()
                ->comment('Referencia al aula en la que está matriculado el estudiante');

            $table->year('academic_year')
                ->index('idx_enrollment_academic_year')
                ->comment('Año académico de la matrícula');

            $table->enum('status', [
                'active',       // Activo (estudiante actualmente matriculado)
                'completed',    // Completado (graduado o finalizado exitosamente)
                'transferred',  // Transferido a otra institución
                'inactive',     // Inactivo (puede regresar)
                'withdrawn',    // Retirado voluntariamente
                'dismissed',    // Expulsado/separado de la institución
            ])
                ->default('active')
                ->index('idx_enrollment_status')
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

            // Información adicional
            $table->string('enrollment_code', 50)
                ->unique('uq_enrollment_code')
                ->comment('Código único de matrícula (ej: MAT-2025-001)');

            $table->text('notes')
                ->nullable()
                ->comment('Notas adicionales sobre la matrícula');

            $table->string('created_by')
                ->nullable()
                ->comment('Usuario que realizó el registro');

            $table->string('updated_by')
                ->nullable()
                ->comment('Usuario que actualizó por última vez');

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimizar consultas
            $table->index('student_id', 'idx_enrollment_student');
            $table->index('classroom_id', 'idx_enrollment_classroom');

            // Índice compuesto para búsquedas frecuentes
            $table->index(
                ['student_id', 'academic_year', 'status'],
                'idx_enrollment_student_year_status'
            );

            // Índice para búsqueda por rango de fechas
            $table->index(
                ['start_date', 'end_date'],
                'idx_enrollment_date_range'
            );

            // Restricción única para evitar duplicados
            $table->unique(
                ['student_id', 'classroom_id', 'academic_year'],
                'uq_enrollment_student_classroom_year'
            );

            // Índice para búsqueda por estado y año
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
