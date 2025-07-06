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
        Schema::create('application_form_responses', function (Blueprint $table) {
            $table->id();
            // Relaciones principales
            // Relación con la práctica
            $table->foreignId('application_form_id')
                ->constrained('application_forms')
                ->restrictOnDelete()
                ->comment('Referencia a la práctica');

            // Relación con el estudiante (usando user_id como clave foránea)
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia al estudiante usando user_id como clave foránea');

            // Datos de evaluación
            $table->decimal('score', 10, 2)->default(0);
            $table->enum('status', [
                'pending',    // Por comenzar
                'in progress', // En progreso
                'submitted',  // Enviado para revisión
                'in review',  // En revisión por el profesor
                'graded',     // Calificado
                'returned',   // Devuelto con comentarios
                'late',       // Entregado tarde
            ])->default('pending');

            // Metadatos
            $table->timestamp('started_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Índice único para evitar respuestas duplicadas
            $table->unique(
                ['application_form_id', 'student_id'],
                'uq_application_form_response_student'
            );

            // Índices para optimizar consultas comunes
            $table->index('status', 'idx_application_form_response_status');
            $table->index('score', 'idx_application_form_response_score');
            $table->index('submitted_at', 'idx_application_form_response_submitted');
            $table->index('graded_at', 'idx_application_form_response_graded');
            $table->index('created_at', 'idx_application_form_response_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_form_responses');
    }
};
