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
        Schema::create('cycles', function (Blueprint $table) {
            $table->id()
                ->comment('Identificador único del ciclo');

            $table->string('name', 100)
                ->unique('uq_cycles_name')
                ->comment('Nombre del ciclo (ej: Inicial, Primaria, Secundaria)');

            $table->unsignedInteger('order')
                ->default(0)
                ->comment('Orden de visualización del ciclo');

            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('order', 'idx_cycles_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cycles');
    }
};
