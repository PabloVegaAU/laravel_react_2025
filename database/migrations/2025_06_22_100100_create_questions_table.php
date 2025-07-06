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
            $table->id();

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

            $table->enum('difficulty', [
                'easy',    // Pregunta básica
                'medium',  // Pregunta intermedia
                'hard',    // Pregunta avanzada
            ])
                ->default('easy')
                ->index('idx_question_difficulty')
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

            // Relaciones
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia al profesor usando user_id como clave foránea');

            $table->foreignId('question_type_id')
                ->constrained('question_types')
                ->restrictOnDelete();

            $table->foreignId('capability_id')
                ->constrained('capabilities')
                ->restrictOnDelete();

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Índices individuales para claves foráneas
            $table->index('teacher_id', 'idx_question_teacher');
            $table->index('question_type_id', 'idx_question_type');
            $table->index('capability_id', 'idx_question_capability');

            $table->index(
                ['question_type_id', 'difficulty'],
                'idx_question_type_difficulty'
            );

            // Índice para búsqueda por texto
            $table->fullText(['name', 'description'], 'ft_question_search');
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
