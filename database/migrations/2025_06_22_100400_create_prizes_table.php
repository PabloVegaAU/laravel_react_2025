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
        Schema::create('prizes', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único de la recompensa');
            $table->string('name')
                ->comment('Nombre de la recompensa');
            $table->string('description')
                ->comment('Descripción de la recompensa');
            $table->string('type')
                ->nullable()
                ->comment('Tipo de recompensa (ej: avatar, fondo, insignia, etc.)');
            $table->string('image')
                ->comment('URL de la imagen de la recompensa');
            $table->integer('stock')
                ->default(0)
                ->comment('Stock de la recompensa');
            $table->decimal('points_cost', 10, 2)
                ->comment('Puntos de la tienda necesarios para canjear la recompensa');
            $table->integer('level_required')
                ->comment('Nivel mínimo requerido para desbloquear la recompensa');
            $table->timestamp('available_until')
                ->nullable()
                ->comment('Fecha y hora en que la recompensa se vence');
            $table->boolean('is_active')
                ->default(true)
                ->comment('Indica si la recompensa está activa');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('type', 'idx_prizes_type');
            $table->index('points_cost', 'idx_prizes_points');
            $table->index('level_required', 'idx_prizes_level_required');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prizes');
    }
};
