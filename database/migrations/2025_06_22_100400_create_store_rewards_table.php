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
        Schema::create('store_rewards', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único de la recompensa');
            $table->string('name')
                ->comment('Nombre de la recompensa');
            $table->string('type')
                ->comment('Tipo de recompensa (ej: avatar, fondo, insignia, etc.)');
            $table->string('image')
                ->comment('URL de la imagen de la recompensa');
            $table->decimal('points_store', 10, 2)
                ->comment('Puntos de la tienda necesarios para canjear la recompensa');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->integer('level_required')
                ->comment('Nivel mínimo requerido para desbloquear la recompensa');

            // Índices
            $table->index('type', 'idx_store_rewards_type');
            $table->index('points_store', 'idx_store_rewards_points');
            $table->index('level_required', 'idx_store_rewards_level_required');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_rewards');
    }
};
