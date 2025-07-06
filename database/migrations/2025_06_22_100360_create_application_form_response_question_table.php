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
        Schema::create('application_form_response_question', function (Blueprint $table) {
            $table->id();
            // Relaciones
            // Relación con la respuesta de la práctica
            $table->foreignId('application_form_response_id')
                ->constrained('application_form_responses')
                ->cascadeOnDelete()
                ->comment('Referencia a la respuesta de la práctica');

            // Relación con la pregunta en la práctica
            $table->foreignId('application_form_question_id')
                ->constrained('application_form_questions')
                ->cascadeOnDelete()
                ->comment('Referencia a la pregunta en la práctica');

            // Relación con la opción seleccionada (puede ser nula para preguntas abiertas)
            $table->foreignId('question_option_id')
                ->nullable()
                ->constrained('question_options')
                ->nullOnDelete()
                ->comment('Referencia a la opción seleccionada (opcional)');

            // Explicación
            $table->text('explanation')
                ->nullable()
                ->comment('Explicación escrita del estudiante para justificar su respuesta');

            // Puntuación y puntos de la tienda
            $table->decimal('score', 10, 2)->default(0)->comment('Puntaje de la pregunta');
            $table->decimal('points_store', 10, 2)->default(0)->comment('Puntos de la tienda');

            $table->timestamps();

            // Índice único para evitar respuestas duplicadas
            $table->unique(
                ['application_form_response_id', 'application_form_question_id'],
                'uq_application_form_response_question'
            );

            // Índices para optimizar consultas
            $table->index('application_form_response_id', 'idx_application_form_response_question_response');
            $table->index('application_form_question_id', 'idx_application_form_response_question_pq');
            $table->index('question_option_id', 'idx_application_form_response_question_option');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_form_response_question');
    }
};
