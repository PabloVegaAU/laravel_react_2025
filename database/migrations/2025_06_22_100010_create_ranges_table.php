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
        Schema::create('ranges', function (Blueprint $table) {
            $table->id()
                ->comment('Identificador único del rango');

            $table->string('name')
                ->unique('uq_ranges_name')
                ->comment('Nombre del rango (ej: Novato, Aprendiz, Experto)');

            $table->foreignId('level_required')
                ->constrained('levels')
                ->restrictOnDelete()
                ->comment('Nivel mínimo requerido para alcanzar este rango');

            $table->string('color', 50)
                ->comment('Código de color hexadecimal para el rango');

            $table->string('image')
                ->nullable()
                ->comment('URL de la imagen representativa del rango');

            $table->text('description')
                ->nullable()
                ->comment('Descripción del rango y sus beneficios');

            $table->unsignedInteger('order')
                ->default(0)
                ->comment('Orden de visualización de los rangos');

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimizar consultas
            $table->index('level_required', 'idx_ranges_level_required');
            $table->index('order', 'idx_ranges_order');

            // Índice compuesto para ordenación por nivel y orden
            $table->index(
                ['level_required', 'order'],
                'idx_ranges_level_order'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ranges');
    }
};
