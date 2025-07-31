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
        Schema::create('application_form_response_question_options', function (Blueprint $table) {
            // General
            $table->id()->comment('ID único de la opción de respuesta a la pregunta');

            // Datos de evaluación
            $table->boolean('is_correct')
                ->default(false)
                ->comment('Indica si la opción seleccionada es correcta');

            $table->unsignedInteger('selected_order')
                ->nullable()
                ->comment('Orden seleccionado');

            // Relaciones
            $table->foreignId('application_form_response_question_id')
                ->constrained('application_form_response_questions')
                ->cascadeOnDelete()
                ->comment('Referencia a la respuesta de la pregunta');

            $table->foreignId('question_option_id')
                ->constrained('question_options')
                ->cascadeOnDelete()
                ->comment('Referencia a la opción seleccionada');

            $table->foreignId('paired_with_option_id')
                ->nullable()
                ->constrained('question_options')
                ->nullOnDelete()
                ->comment('Para preguntas de emparejamiento - referencia la opción emparejada');

            // Metadatos
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación suave');

            // Índices
            $table->index('application_form_response_question_id', 'idx_afrqo_response_question');
            $table->index('question_option_id', 'idx_afrqo_question_option');

            // Restricción única para evitar opciones duplicadas
            $table->unique(
                ['application_form_response_question_id', 'question_option_id'],
                'uq_afrqo_response_question_option'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_form_response_question_options');
    }
};
