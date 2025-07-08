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
            // General
            $table->id()->comment('Identificador único de la relación pregunta-formulario');

            // Configuración de la pregunta
            $table->unsignedInteger('order')
                ->comment('Orden de la pregunta dentro del formulario');
            $table->decimal('score', 10, 2)
                ->default(0)
                ->comment('Puntaje máximo de la pregunta');
            $table->decimal('points_store', 10, 2)
                ->default(0)
                ->comment('Puntos que otorga en la tienda al responder correctamente');

            // Metadatos
            $table->timestamps();

            // Relaciones
            $table->foreignId('application_form_id')
                ->constrained('application_forms')
                ->cascadeOnDelete()
                ->comment('Referencia al formulario de aplicación');

            $table->foreignId('question_id')
                ->constrained('questions')
                ->restrictOnDelete()
                ->comment('Referencia a la pregunta');

            // Índices
            $table->unique(
                ['application_form_id', 'question_id'],
                'uq_application_form_question'
            );
            $table->index(
                'application_form_id',
                'idx_application_form_question_application_form'
            );
            $table->index(
                'question_id',
                'idx_application_form_question_question'
            );
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
