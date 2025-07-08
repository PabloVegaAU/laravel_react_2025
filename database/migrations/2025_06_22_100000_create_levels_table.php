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
        Schema::create('levels', function (Blueprint $table) {
            // General
            $table->id()->comment('Identificador único del nivel');
            $table->unsignedInteger('level')
                ->unique('uq_levels_level')
                ->comment('Nivel numérico (1, 2, 3, ...)');
            $table->decimal('experience_max', 10, 2)
                ->unsigned()
                ->default(0)
                ->comment('Experiencia maxima del nivel');
            $table->decimal('experience_required', 10, 2)
                ->unsigned()
                ->default(0)
                ->comment('Experiencia necesaria para alcanzar este nivel');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            // (No hay relaciones directas en esta tabla)

            // Índices
            // (No hay índices adicionales)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
