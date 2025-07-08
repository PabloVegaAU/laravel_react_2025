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
        Schema::create('student_avatars', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único del avatar del estudiante');

            // Estado del avatar
            $table->boolean('active')
                ->default(false)
                ->comment('Indica si el avatar está actualmente en uso');

            $table->decimal('points_store', 10, 2)
                ->comment('Puntos de la tienda utilizados para adquirir el avatar');

            $table->timestamp('exchange_date')
                ->nullable()
                ->comment('Fecha y hora en que se canjeó el avatar');

            // Relaciones
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante dueño del avatar');

            $table->foreignId('avatar_id')
                ->constrained('avatars')
                ->cascadeOnDelete()
                ->comment('Referencia al avatar adquirido');

            // Índices
            $table->index('student_id', 'idx_student_avatars_student');
            $table->index('avatar_id', 'idx_student_avatars_avatar');
            $table->index('active', 'idx_student_avatars_active');

            // Restricción única para evitar duplicados
            $table->unique(
                ['student_id', 'avatar_id'],
                'uq_student_avatar'
            );

            // Índice para búsqueda por estudiante y estado activo
            $table->index(
                ['student_id', 'active'],
                'idx_student_avatars_student_active'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_avatars');
    }
};
