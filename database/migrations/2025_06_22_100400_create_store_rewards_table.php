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
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('image');
            $table->decimal('points', 10, 2)
                ->comment('Puntos requeridos para adquirir la recompensa');
            $table->foreignId('level_required')
                ->constrained('levels')
                ->restrictOnDelete()
                ->comment('Nivel mínimo requerido para adquirir la recompensa');
            $table->timestamps();
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
