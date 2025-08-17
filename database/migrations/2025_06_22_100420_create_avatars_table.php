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
        Schema::create('avatars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image_url');
            $table->integer('level_required')
                ->comment('Nivel mínimo requerido para adquirir el avatar');
            $table->decimal('price', 10, 2)
                ->comment('Puntos requeridos para adquirir el avatar');
            $table->boolean('is_active')
                ->default(true)
                ->comment('Indica si el avatar está activo');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avatars');
    }
};
