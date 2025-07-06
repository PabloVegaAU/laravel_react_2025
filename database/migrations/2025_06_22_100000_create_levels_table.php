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
            $table->id()
                ->comment('Identificador único del nivel');

            $table->unsignedInteger('level')
                ->unique('uq_levels_level')
                ->comment('Nivel numérico (1, 2, 3, ...)');

            $table->decimal('experience_required', 10, 2)
                ->unsigned()
                ->default(0)
                ->comment('Experiencia necesaria para alcanzar este nivel');

            $table->text('description')
                ->nullable()
                ->comment('Descripción del nivel y sus beneficios');

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimizar consultas
            $table->index('experience_required', 'idx_levels_experience');
            $table->index('level', 'idx_levels_level');
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
