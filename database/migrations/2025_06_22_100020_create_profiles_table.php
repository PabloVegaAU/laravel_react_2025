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
        Schema::create('profiles', function (Blueprint $table) {
            // Clave foránea que también es clave primaria
            $table->foreignId('user_id')
                ->primary()
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Referencia al usuario al que pertenece este perfil');

            // Información personal
            $table->string('first_name', 100)
                ->comment('Nombre(s) del usuario');

            $table->string('last_name', 100)
                ->comment('Apellido(s) del usuario');

            $table->string('second_last_name', 100)
                ->nullable()
                ->comment('Segundo apellido (opcional)');

            $table->date('birth_date')
                ->nullable()
                ->comment('Fecha de nacimiento del usuario');

            $table->string('phone', 20)
                ->nullable()
                ->comment('Número de teléfono de contacto');

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimizar búsquedas
            $table->index(
                ['first_name', 'last_name', 'second_last_name'],
                'idx_profile_full_name'
            );

            $table->index('birth_date', 'idx_profile_birth_date');

            // Índice para búsqueda por nombre completo
            $table->rawIndex(
                "(first_name || ' ' || last_name || ' ' || COALESCE(second_last_name, ''))",
                'idx_profile_full_text_search'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
