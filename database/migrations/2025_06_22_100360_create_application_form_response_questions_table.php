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
        Schema::create('application_form_response_questions', function (Blueprint $table) {
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

            $table->boolean('is_correct')
                ->default(false)
                ->comment('Indica si la respuesta es correcta en la revisión');

            // Relaciones
            $table->foreignId('application_form_response_id')
                ->constrained('application_form_responses')
                ->cascadeOnDelete()
                ->comment('Referencia a la respuesta del formulario');

            $table->foreignId('application_form_question_id')
                ->constrained('application_form_questions')
                ->cascadeOnDelete()
                ->comment('Referencia a la pregunta del formulario');

            // Metadatos
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación suave');

            // Índices
            $table->index('application_form_response_id', 'idx_afrq_response');
            $table->index('application_form_question_id', 'idx_afrq_question');

            // Restricción única para evitar respuestas duplicadas
            $table->unique(
                ['application_form_response_id', 'application_form_question_id'],
                'uq_application_form_response_questions'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_form_response_questions');
    }
};
