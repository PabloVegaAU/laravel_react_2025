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
        Schema::create('learning_session_capabilities', function (Blueprint $table) {
            // General
            $table->id()->comment('ID único de la relación entre sesión y capacidad');

            // Relaciones
            $table->foreignId('learning_session_id')
                ->constrained('learning_sessions')
                ->cascadeOnDelete()
                ->comment('Referencia a la sesión de aprendizaje');

            $table->foreignId('capability_id')
                ->constrained('capabilities')
                ->cascadeOnDelete()
                ->comment('Referencia a la capacidad trabajada en la sesión');

            // Metadatos
            $table->timestamps();

            // Índices
            $table->index('learning_session_id', 'idx_sessions_capabilities_session');
            $table->index('capability_id', 'idx_sessions_capabilities_capability');

            // Clave única compuesta para evitar duplicados
            $table->unique(
                ['learning_session_id', 'capability_id'],
                'uq_session_capability'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_session_capabilities');
    }
};
