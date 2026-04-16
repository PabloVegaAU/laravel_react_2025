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
                'scheduled',  // Programada (visible pero no accesible)
                'active',     // Activa (disponible para los estudiantes)
                'finished',   // Finalizada (cierre de evaluación)
                'canceled',   // Cancelada
            ])->default('scheduled')
                ->comment('Estado del formulario: programado, activo, finalizado, cancelado');
            $table->enum('registration_status', ['active', 'inactive'])
                ->default('active')
                ->comment('Estado de registro del formulario: activo, inactivo');

            // Puntuación y fechas
            $table->decimal('score_max', 10, 2)
                ->comment('Puntuación máxima posible en este formulario');
            $table->dateTime('start_date')
                ->comment('Fecha y hora de inicio de disponibilidad del formulario');
            $table->dateTime('end_date')
                ->comment('Fecha y hora de finalización de disponibilidad del formulario');

            // Metadatos
            $table->dateTime('deactivated_at')->nullable()
                ->comment('Fecha de desactivación del formulario');
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
            $table->index('registration_status', 'idx_application_form_registration_status');
            $table->index('start_date', 'idx_application_form_start_date');
            $table->index('end_date', 'idx_application_form_end_date');
            $table->index('teacher_id', 'idx_application_form_teacher');
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
