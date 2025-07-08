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
        Schema::create('questions', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único de la pregunta');

            // Información básica
            $table->string('name')
                ->comment('Nombre descriptivo de la pregunta');
            $table->text('description')
                ->comment('Enunciado o contenido completo de la pregunta');
            $table->string('image')
                ->nullable()
                ->comment('URL de la imagen asociada a la pregunta');
            $table->text('help_message')
                ->nullable()
                ->comment('Texto de ayuda o pista para responder la pregunta');

            // Configuración de la pregunta
            $table->enum('difficulty', [
                'easy',    // Pregunta básica
                'medium',  // Pregunta intermedia
                'hard',    // Pregunta avanzada
            ])->default('easy')
                ->comment('Nivel de dificultad de la pregunta');

            $table->boolean('explanation_required')
                ->default(false)
                ->comment('Indica si se requiere una explicación para la pregunta');

            // Retroalimentación
            $table->text('correct_feedback')
                ->nullable()
                ->comment('Retroalimentación mostrada cuando se responde correctamente');
            $table->text('incorrect_feedback')
                ->nullable()
                ->comment('Retroalimentación mostrada cuando la respuesta es incorrecta');

            // Niveles educativos
            $table->enum('level', [
                'primary',     // Educación primaria
                'secondary',   // Educación secundaria
            ])->default('primary')
                ->comment('Nivel educativo de la pregunta');

            $table->string('grades')
                ->comment('Grados académicos de la pregunta (ej: 1st,2nd,3rd)');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia al profesor que creó la pregunta');

            $table->foreignId('question_type_id')
                ->constrained('question_types')
                ->restrictOnDelete()
                ->comment('Tipo de pregunta (opción múltiple, verdadero/falso, etc.)');

            $table->foreignId('capability_id')
                ->constrained('capabilities')
                ->restrictOnDelete()
                ->comment('Capacidad evaluada por la pregunta');

            // Índices
            $table->index('difficulty', 'idx_question_difficulty');
            $table->index('teacher_id', 'idx_question_teacher');
            $table->index('question_type_id', 'idx_question_type');
            $table->index('capability_id', 'idx_question_capability');
            $table->index(
                ['question_type_id', 'difficulty'],
                'idx_question_type_difficulty'
            );
            $table->fullText(['name', 'description'], 'ft_question_search')
                ->comment('Índice de búsqueda de texto completo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
