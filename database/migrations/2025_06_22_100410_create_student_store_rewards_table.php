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
        Schema::create('student_store_rewards', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único del registro de canje');

            // Información del canje
            $table->decimal('points_store', 10, 2)
                ->comment('Cantidad de puntos de la tienda utilizados');
            $table->timestamp('exchange_date')
                ->nullable()
                ->comment('Fecha y hora en que se realizó el canje');

            // Relaciones
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante que realizó el canje');

            $table->foreignId('store_reward_id')
                ->constrained('store_rewards')
                ->cascadeOnDelete()
                ->comment('Referencia a la recompensa canjeada');

            // Índices
            $table->index(
                ['student_id', 'store_reward_id'],
                'idx_student_store_reward'
            );
            $table->index(
                ['student_id', 'exchange_date'],
                'idx_student_store_reward_date'
            );

            // Restricción única para evitar duplicados
            $table->unique(
                ['student_id', 'store_reward_id'],
                'uq_student_store_reward'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_store_rewards');
    }
};
