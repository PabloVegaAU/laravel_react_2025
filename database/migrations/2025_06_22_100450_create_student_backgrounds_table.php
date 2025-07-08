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
        Schema::create('student_backgrounds', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único del fondo del estudiante');

            // Configuración del fondo
            $table->string('screen')
                ->comment('Pantalla específica donde se aplica el fondo (ej: perfil, dashboard, etc.)');

            $table->boolean('active')
                ->default(false)
                ->comment('Indica si el fondo está actualmente en uso');

            $table->decimal('points_store', 10, 2)
                ->comment('Puntos de la tienda utilizados para adquirir el fondo');

            $table->timestamp('exchange_date')
                ->nullable()
                ->comment('Fecha y hora en que se canjeó el fondo');

            // Relaciones
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante dueño del fondo');

            $table->foreignId('background_id')
                ->constrained('backgrounds')
                ->cascadeOnDelete()
                ->comment('Referencia al fondo de pantalla');

            // Índices
            $table->index(
                ['student_id', 'background_id'],
                'idx_student_background'
            );

            $table->index(
                ['student_id', 'active', 'screen'],
                'idx_student_background_active_screen'
            );

            // Restricción única para evitar duplicados
            $table->unique(
                ['student_id', 'background_id', 'screen'],
                'uq_student_background_screen'
            );

            // Índice para búsqueda por estudiante
            $table->index('student_id', 'idx_student_backgrounds_student');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_backgrounds');
    }
};
