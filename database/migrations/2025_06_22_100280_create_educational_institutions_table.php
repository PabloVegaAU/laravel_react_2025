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
        Schema::create('educational_institutions', function (Blueprint $table) {
            // General
            $table->id()->comment('ID único de la institución educativa');
            $table->string('name')->comment('Nombre de la institución educativa');
            $table->string('ugel')->comment('Unidad de Gestión Educativa Local a la que pertenece');

            // Metadatos
            $table->timestamps();
            $table->softDeletes()->comment('Fecha de eliminación suave');

            // Relaciones
            // (No hay relaciones foráneas en esta tabla)

            // Índices
            $table->index('name', 'idx_educational_institutions_name');
            $table->index('ugel', 'idx_educational_institutions_ugel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_institutions');
    }
};
