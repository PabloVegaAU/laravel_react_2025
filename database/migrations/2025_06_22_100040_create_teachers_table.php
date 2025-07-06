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
            // Clave foránea que también es clave primaria
            $table->foreignId('user_id')
                ->primary()
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Referencia al usuario que es profesor');

            $table->enum('status', [
                'active',    // Activo
                'inactive',  // Inactivo temporalmente
                'on leave',  // De permiso/licencia
                'retired',    // Jubilado
            ])->default('active')
                ->comment('Estado actual del profesor');

            $table->timestamps();
            $table->softDeletes();

            // Índice para búsquedas por estado
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
