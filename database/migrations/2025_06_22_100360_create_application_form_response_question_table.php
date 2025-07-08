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
            // General
            $table->id()->comment('ID único de la relación entre respuesta y pregunta');
            // Datos de la respuesta
            $table->text('explanation')
                ->nullable()
                ->comment('Explicación escrita del estudiante para justificar su respuesta');

            // Puntuación y recompensas
            $table->decimal('score', 10, 2)
                ->default(0)
                ->comment('Puntaje obtenido en la pregunta');

            $table->decimal('points_store', 10, 2)
                ->default(0)
                ->comment('Puntos de la tienda obtenidos por esta respuesta');

            // Relaciones
            $table->foreignId('application_form_response_id')
                ->constrained('application_form_responses')
                ->cascadeOnDelete()
                ->comment('Referencia a la respuesta del formulario');

            $table->foreignId('application_form_question_id')
                ->constrained('application_form_questions')
                ->cascadeOnDelete()
                ->comment('Referencia a la pregunta del formulario');

            $table->foreignId('question_option_id')
                ->nullable()
                ->constrained('question_options')
                ->nullOnDelete()
                ->comment('Referencia a la opción seleccionada (opcional para preguntas abiertas)');

            // Metadatos
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación suave');

            // Índices
            $table->index('application_form_response_id', 'idx_afrq_response');
            $table->index('application_form_question_id', 'idx_afrq_question');
            $table->index('question_option_id', 'idx_afrq_option');

            // Restricción única para evitar respuestas duplicadas
            $table->unique(
                ['application_form_response_id', 'application_form_question_id'],
                'uq_application_form_response_question'
            );
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
