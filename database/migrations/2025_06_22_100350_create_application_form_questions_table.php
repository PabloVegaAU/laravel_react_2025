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
        Schema::create('application_form_questions', function (Blueprint $table) {
            $table->id();
            // Relaciones
            $table->foreignId('application_form_id')
                ->constrained('application_forms')
                ->cascadeOnDelete()
                ->comment('Referencia a la ficha de aplicación');

            $table->foreignId('question_id')
                ->constrained('questions')
                ->restrictOnDelete()
                ->comment('Referencia a la pregunta');

            // Configuración de la pregunta en la ficha de aplicación
            $table->unsignedInteger('order');
            $table->decimal('score', 10, 2)->default(0)->comment('Puntaje máximo de la pregunta');
            $table->decimal('points_store', 10, 2)->default(0)->comment('Puntos de la tienda');

            // Metadatos
            $table->timestamps();

            // Índice único para evitar duplicados
            $table->unique(['application_form_id', 'question_id'], 'uq_application_form_question');

            // Índices para optimizar consultas
            $table->index('application_form_id', 'idx_application_form_question_application_form');
            $table->index('question_id', 'idx_application_form_question_question');

            // Índice compuesto para optimizar consultas de ordenación por ficha de aplicación y orden
            $table->index(
                ['application_form_id', 'order'],
                'idx_application_form_question_application_form_order'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_form_questions');
    }
};
