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
        Schema::create('learning_sessions', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único de la sesión de aprendizaje');
            $table->string('name')
                ->comment('Nombre de la sesión de aprendizaje');
            $table->string('purpose_learning')
                ->comment('Propósito de aprendizaje de la sesión');
            $table->date('application_date')
                ->comment('Fecha de aplicación de la sesión');
            $table->enum('status', ['draft', 'active', 'inactive'])
                ->default('draft')
                ->comment('Estado de la sesión: borrador, activa, inactiva');

            // Contenido de la sesión
            $table->text('performances')
                ->comment('Desempeños esperados en la sesión');
            $table->text('start_sequence')
                ->comment('Secuencia de inicio de la sesión');
            $table->text('end_sequence')
                ->comment('Secuencia de cierre de la sesión');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->foreignId('educational_institution_id')
                ->constrained('educational_institutions')
                ->cascadeOnDelete()
                ->comment('Referencia a la institución educativa');

            $table->foreignId('teacher_classroom_curricular_area_cycle_id')
                ->constrained('teacher_classroom_curricular_area_cycles')
                ->cascadeOnDelete()
                ->comment('Referencia a la asignación de profesor-aula-área-ciclo');

            $table->foreignId('competency_id')
                ->constrained('competencies')
                ->cascadeOnDelete()
                ->comment('Referencia a la competencia asociada');

            // Índices
            $table->index('status', 'idx_learning_sessions_status');
            $table->index('application_date', 'idx_learning_sessions_application_date');
            $table->index('educational_institution_id', 'idx_learning_sessions_institution');
            $table->index('competency_id', 'idx_learning_sessions_competency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_sessions');
    }
};
