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
        Schema::create('teachers', function (Blueprint $table) {
            // General
            $table->enum('status', [
                'active',    // Activo
                'inactive',  // Inactivo
                'on leave',  // De permiso/licencia
                'retired',   // Jubilado
            ])->default('active')
                ->comment('Estado actual del profesor');

            // Metadatos
            $table->timestamps();
            $table->softDeletes();

            // Relaciones
            $table->foreignId('user_id')
                ->primary()
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Referencia al usuario que es profesor');

            // Índices
            $table->index('status', 'idx_teacher_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
