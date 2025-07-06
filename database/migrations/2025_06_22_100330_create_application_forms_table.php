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
        Schema::create('application_forms', function (Blueprint $table) {
            $table->id();

            // Información básica
            $table->string('name');
            $table->text('description');

            // Relación con la asignación profesor/aula/área
            $table->foreignId('teacher_classroom_curricular_area_id')
                ->constrained('teacher_classroom_curricular_areas')
                ->restrictOnDelete()
                ->comment('Relación con la asignación de profesor en aula y área curricular');

            // Relación con el profesor para búsquedas rápidas
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'user_id')
                ->restrictOnDelete()
                ->comment('Referencia directa al profesor para optimizar consultas');

            $table->foreignId('learning_session_id')
                ->constrained('learning_sessions')
                ->restrictOnDelete()
                ->comment('Relación con la sesión de aprendizaje');

            // Configuración de estado
            $table->enum('status', [
                'draft',      // Borrador (solo visible para el profesor)
                'scheduled',  // Programada (visible pero no accesible)
                'active',     // Activa (disponible para los estudiantes)
                'inactive',   // Inactiva (no visible)
                'archived',   // Archivada (solo lectura)
            ])->default('draft')
                ->comment('Estado de la práctica: draft, scheduled, active, inactive, archived')
                ->index('idx_application_form_status');

            // Puntuación y fechas
            $table->decimal('score_max', 10, 2);
            $table->dateTime('start_date')->index('idx_application_form_start_date');
            $table->dateTime('end_date')->index('idx_application_form_end_date');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Índices para consultas frecuentes
            $table->index('teacher_classroom_curricular_area_id', 'idx_application_form_tcca');
            $table->index('teacher_id', 'idx_application_form_teacher');
            $table->index('learning_session_id', 'idx_application_form_learning_session');

            // Índice compuesto para programación
            $table->index(
                ['status', 'start_date', 'end_date'],
                'idx_application_form_scheduling'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_forms');
    }
};
