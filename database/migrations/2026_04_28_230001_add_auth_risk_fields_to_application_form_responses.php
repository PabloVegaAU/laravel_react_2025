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
        Schema::table('application_form_responses', function (Blueprint $table) {
            // Relación con el login que inició la sesión
            $table->foreignId('login_history_id')
                ->nullable()
                ->after('student_id')
                ->constrained('user_login_histories')
                ->nullOnDelete()
                ->comment('Referencia al registro de login que inició esta sesión de trabajo');

            // Campos de riesgo al momento de aceptar declaración
            $table->enum('auth_risk_level', ['normal', 'sospechoso', 'critico'])
                ->nullable()
                ->after('declaracion_user_agent')
                ->comment('Nivel de riesgo al aceptar declaración de autenticidad');

            $table->unsignedTinyInteger('auth_risk_score')
                ->nullable()
                ->after('auth_risk_level')
                ->comment('Puntuación de riesgo al aceptar declaración (0-100+)');

            $table->json('auth_risk_factors')
                ->nullable()
                ->after('auth_risk_score')
                ->comment('Factores de riesgo al aceptar declaración: gps_distance, time_since_login, etc.');

            // GPS al momento de aceptar declaración
            $table->decimal('auth_latitude', 10, 7)
                ->nullable()
                ->after('auth_risk_factors')
                ->comment('Latitud GPS al aceptar declaración de autenticidad');

            $table->decimal('auth_longitude', 10, 7)
                ->nullable()
                ->after('auth_latitude')
                ->comment('Longitud GPS al aceptar declaración de autenticidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_form_responses', function (Blueprint $table) {
            $table->dropForeign(['login_history_id']);
            $table->dropColumn([
                'login_history_id',
                'auth_risk_level',
                'auth_risk_score',
                'auth_risk_factors',
                'auth_latitude',
                'auth_longitude',
            ]);
        });
    }
};
