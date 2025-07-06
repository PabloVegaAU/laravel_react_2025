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
        Schema::create('students', function (Blueprint $table) {
            // Clave foránea que también es clave primaria
            $table->foreignId('user_id')
                ->primary()
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Referencia al usuario que es estudiante');

            // Información académica
            $table->date('entry_date')
                ->comment('Fecha de ingreso del estudiante a la institución');

            $table->enum('status', [
                'active',    // Activo
                'inactive',  // Inactivo temporalmente
                'graduated', // Graduado
                'withdrawn', // Retirado
                'suspended',  // Suspendido
            ])->default('active')
                ->comment('Estado actual del estudiante');

            // Progreso y logros
            $table->decimal('experience_achieved', 10, 2)
                ->unsigned()
                ->default(0)
                ->comment('Experiencia total acumulada');

            $table->decimal('points_achieved', 10, 2)
                ->unsigned()
                ->default(0)
                ->comment('Puntos de la tienda acumulados');

            $table->decimal('total_score', 10, 2)
                ->default(0)
                ->comment('Puntuación total acumulada');

            // Relaciones
            $table->foreignId('level_id')
                ->constrained('levels')
                ->restrictOnDelete()
                ->comment('Nivel actual del estudiante');

            $table->foreignId('range_id')
                ->constrained('ranges')
                ->restrictOnDelete()
                ->comment('Rango actual del estudiante');

            $table->date('graduation_date')
                ->nullable()
                ->comment('Fecha de graduación (si aplica)');

            // Índices optimizados
            $table->index(['level_id', 'range_id'], 'idx_student_level_range');
            $table->index('experience_achieved', 'idx_student_experience');
            $table->index('status', 'idx_student_status');
            $table->index('entry_date', 'idx_student_entry_date');

            $table->timestamps();
            $table->softDeletes();
            $table->index('points_achieved', 'idx_student_points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
