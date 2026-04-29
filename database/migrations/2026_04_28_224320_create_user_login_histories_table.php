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
        Schema::create('user_login_histories', function (Blueprint $table) {
            // Primary key
            $table->id()->comment('Identificador único del registro de login');

            // User relation (nullable for failed logins with non-existent users)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete()
                ->comment('Referencia al usuario. NULL para logins fallidos de usuarios no existentes');

            // IP Address (45 chars for IPv6 support)
            $table->string('ip_address', 45)
                ->comment('Dirección IP desde donde se realizó el intento de login');

            // User Agent
            $table->text('user_agent')
                ->comment('User-Agent del dispositivo utilizado para el login');

            // Session ID (correlación con tabla sessions)
            $table->string('session_id', 255)
                ->nullable()
                ->comment('ID de sesión de Laravel para correlación');

            // Device Information (parsed from user_agent)
            $table->string('browser', 50)
                ->nullable()
                ->comment('Navegador detectado (Chrome, Firefox, Safari, etc.)');

            $table->string('operating_system', 50)
                ->nullable()
                ->comment('Sistema operativo detectado (Windows, macOS, Android, iOS, etc.)');

            $table->enum('device_type', ['desktop', 'mobile', 'tablet'])
                ->nullable()
                ->comment('Tipo de dispositivo detectado');

            // Geolocation
            $table->string('country', 100)
                ->nullable()
                ->comment('País detectado desde la IP');

            $table->string('city', 100)
                ->nullable()
                ->comment('Ciudad detectada desde la IP');

            // Login status
            $table->enum('status', ['success', 'failed'])
                ->comment('Estado del intento de login: exitoso o fallido');

            // Login timestamp
            $table->timestamp('login_at')
                ->useCurrent()
                ->comment('Fecha y hora del intento de login');

            // Logout tracking
            $table->timestamp('logged_out_at')
                ->nullable()
                ->comment('Fecha y hora de cierre de sesión');

            $table->integer('duration_minutes')
                ->nullable()
                ->comment('Duración de la sesión en minutos (calculado al logout)');

            // Suspicious activity flag
            $table->boolean('is_suspicious')
                ->default(false)
                ->comment('Indica si el login es sospechoso (ej: ubicación inusual)');

            // Failure reason for failed logins
            $table->string('failure_reason', 255)
                ->nullable()
                ->comment('Razón del fallo (ej: password_incorrect, user_not_found)');

            // Timestamps
            $table->timestamps();

            // Indexes for efficient queries
            $table->index('user_id', 'idx_login_histories_user');
            $table->index('ip_address', 'idx_login_histories_ip');
            $table->index('login_at', 'idx_login_histories_date');
            $table->index(['user_id', 'login_at'], 'idx_login_histories_user_date');
            $table->index('status', 'idx_login_histories_status');
            $table->index('is_suspicious', 'idx_login_histories_suspicious');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_login_histories');
    }
};
