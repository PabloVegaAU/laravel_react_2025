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
        Schema::create('student_prizes', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único del registro de canje');

            // Información del canje
            $table->decimal('points_store', 10, 2)
                ->comment('Cantidad de puntos de la tienda utilizados');
            $table->timestamp('exchange_date')
                ->nullable()
                ->comment('Fecha y hora en que se realizó el canje');
            $table->boolean('claimed')
                ->default(false)
                ->comment('Indica si el canje ha sido reclamado');
            $table->timestamp('claimed_at')
                ->nullable()
                ->comment('Fecha y hora en que se reclamo el canje');

            // Relaciones
            $table->foreignId('student_id')
                ->constrained('students', 'user_id')
                ->cascadeOnDelete()
                ->comment('Referencia al estudiante que realizó el canje');

            $table->foreignId('prize_id')
                ->constrained('prizes')
                ->cascadeOnDelete()
                ->comment('Referencia a la recompensa canjeada');

            // Índices
            $table->index(
                ['student_id', 'prize_id'],
                'idx_student_prize'
            );
            $table->index(
                ['student_id', 'exchange_date'],
                'idx_student_prize_date'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_prizes');
    }
};
