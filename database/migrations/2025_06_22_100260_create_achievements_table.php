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
        Schema::create('achievements', function (Blueprint $table) {
            // General
            $table->id()->comment('ID único del logro');
            $table->string('name')->comment('Nombre del logro');
            $table->string('description')->comment('Descripción del logro');
            $table->string('image')->comment('Ruta de la imagen del logro');

            // Metadatos
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación suave');

            // Relaciones
            // (No hay relaciones foráneas en esta tabla)

            // Índices
            $table->index('name', 'idx_achievements_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
