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
        Schema::table('user_login_histories', function (Blueprint $table) {
            // Nivel de riesgo calculado
            $table->enum('risk_level', ['normal', 'sospechoso', 'critico'])
                ->default('normal')
                ->after('is_suspicious')
                ->comment('Nivel de riesgo del login: normal, sospechoso o critico');

            // Puntuación numérica de riesgo (0-100+)
            $table->unsignedTinyInteger('risk_score')
                ->default(0)
                ->after('risk_level')
                ->comment('Puntuación de riesgo (0-100+). Umbral: 0-20=normal, 21-50=sospechoso, 51+=critico');

            // Factores que contribuyeron al riesgo (JSON)
            $table->json('risk_factors')
                ->nullable()
                ->after('risk_score')
                ->comment('Factores de riesgo detectados en formato JSON: ip_changed, device_changed, etc.');

            // Referencia al login anterior para comparación
            $table->foreignId('comparison_login_id')
                ->nullable()
                ->after('risk_factors')
                ->constrained('user_login_histories')
                ->nullOnDelete()
                ->comment('Referencia al login anterior contra el que se comparó para calcular riesgo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_login_histories', function (Blueprint $table) {
            $table->dropForeign(['comparison_login_id']);
            $table->dropColumn([
                'risk_level',
                'risk_score',
                'risk_factors',
                'comparison_login_id',
            ]);
        });
    }
};
