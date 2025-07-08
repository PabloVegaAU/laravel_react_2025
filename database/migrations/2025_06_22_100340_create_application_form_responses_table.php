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
            // General
            $table->id()->comment('ID único de la respuesta al formulario');

            $table->decimal('score', 10, 2)
                ->default(0)
                ->comment('Puntuación obtenida en la evaluación');

            $table->enum('status', [
                'pending',    // Por comenzar
                'in progress', // En progreso
                'submitted',  // Enviado para revisión
                'in review',  // En revisión por el profesor
                'graded',     // Calificado
                'returned',   // Devuelto con comentarios
                'late',       // Entregado tarde
            ])->default('pending')
                ->comment('Estado actual de la respuesta');
            $table->timestamp('started_at')
                ->nullable()
                ->comment('Fecha y hora de inicio de la respuesta');
            $table->timestamp('submitted_at')
                ->nullable()
                ->comment('Fecha y hora de envío de la respuesta');
            $table->timestamp('graded_at')
                ->nullable()
                ->comment('Fecha y hora de calificación');

            // Relaciones
            $table->foreignId('application_form_id')
                ->constrained('application_forms')
                ->restrictOnDelete()
                ->comment('Referencia al formulario de aplicación');

            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia al estudiante que responde');

            // Metadatos
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación suave');

            // Índices
            $table->index('student_id', 'idx_application_form_responses_student');
            $table->index('application_form_id', 'idx_application_form_responses_form');

            // Restricción única para evitar respuestas duplicadas
            $table->unique(
                ['application_form_id', 'student_id'],
                'uq_application_form_response'
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
