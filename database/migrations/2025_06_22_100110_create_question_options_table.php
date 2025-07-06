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
        Schema::create('question_options', function (Blueprint $table) {
            $table->id()
                ->comment('Identificador único de la opción');

            // Relación con la pregunta
            $table->foreignId('question_id')
                ->constrained('questions')
                ->cascadeOnDelete()
                ->comment('Referencia a la pregunta a la que pertenece esta opción');

            $table->string('value')
                ->comment('Texto de la opción de respuesta');

            $table->boolean('is_correct')
                ->default(false)
                ->index('idx_question_option_correct')
                ->comment('Indica si esta opción es la respuesta correcta');

            $table->unsignedInteger('order')
                ->default(0)
                ->comment('Orden de visualización de la opción');

            $table->unsignedInteger('correct_order')
                ->default(0)
                ->comment('Para preguntas de ordenar, indica el orden correcto');

            $table->string('pair_key')
                ->nullable()
                ->comment('Para preguntas de emparejar, identifica pares relacionados');

            $table->enum('pair_side', ['left', 'right'])
                ->nullable()
                ->comment('Indica si esta opción pertenece al lado izquierdo o derecho del emparejamiento');

            // Peso o puntuación de la opción (útil para respuestas parciales)
            $table->decimal('score', 10, 2)
                ->default(0)
                ->comment('Puntuación otorgada al seleccionar esta opción');

            // Retroalimentación específica para esta opción
            $table->text('feedback')
                ->nullable()
                ->comment('Retroalimentación específica para esta opción');

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimizar consultas
            $table->index('question_id', 'idx_question_option_question');

            // Índice compuesto para búsquedas frecuentes
            $table->index(
                ['question_id', 'is_correct'],
                'idx_question_option_correct_answers'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_options');
    }
};
