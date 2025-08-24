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
            // General
            $table->id()->comment('Identificador único del formulario de aplicación');

            // Información básica
            $table->string('name')
                ->comment('Nombre del formulario de aplicación');
            $table->text('description')
                ->nullable()
                ->comment('Descripción detallada del formulario');

            // Configuración de estado
            $table->enum('status', [
                'draft',      // Borrador (solo visible para el profesor)
                'scheduled',  // Programada (visible pero no accesible)
                'active',     // Activa (disponible para los estudiantes)
                'inactive',   // Inactiva (no visible)
                'archived',   // Archivada (solo lectura)
            ])->default('draft')
                ->comment('Estado del formulario: borrador, programado, activo, inactivo, archivado');

            // Puntuación y fechas
            $table->decimal('score_max', 10, 2)
                ->comment('Puntuación máxima posible en este formulario');
            $table->dateTime('start_date')
                ->comment('Fecha y hora de inicio de disponibilidad del formulario');
            $table->dateTime('end_date')
                ->comment('Fecha y hora de finalización de disponibilidad del formulario');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            // Relación con el profesor (user_id de teachers)
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al profesor (user_id en teachers)');
            // Relación con la sesión de aprendizaje
            $table->foreignId('learning_session_id')
                ->constrained('learning_sessions')
                ->restrictOnDelete()
                ->comment('Referencia a la sesión de aprendizaje relacionada');

            // Índices
            $table->index('status', 'idx_application_form_status');
            $table->index('start_date', 'idx_application_form_start_date');
            $table->index('end_date', 'idx_application_form_end_date');
            $table->index('learning_session_id', 'idx_application_form_learning_session');
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
