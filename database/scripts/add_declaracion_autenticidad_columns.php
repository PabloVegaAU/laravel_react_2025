<?php

/**
 * Script para agregar columnas de declaración de autenticidad a la tabla application_form_responses.
 *
 * Columnas agregadas:
 * - declaracion_autenticidad (boolean, default false)
 * - declaracion_aceptada_at (timestamp, nullable)
 * - declaracion_ip (string, nullable)
 * - declaracion_user_agent (string, nullable)
 *
 * Uso: php database/scripts/add_declaracion_autenticidad_columns.php
 */

require __DIR__.'/../../vendor/autoload.php';

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

$app = require_once __DIR__.'/../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Agregando columnas de declaración de autenticidad a application_form_responses...\n";

try {
    Schema::table('application_form_responses', function (Blueprint $table) {
        $table->boolean('declaracion_autenticidad')
            ->default(false)
            ->comment('Indica si el estudiante aceptó la declaración de autenticidad')
            ->after('graded_at');

        $table->timestamp('declaracion_aceptada_at')
            ->nullable()
            ->comment('Fecha y hora en que el estudiante aceptó la declaración')
            ->after('declaracion_autenticidad');

        $table->string('declaracion_ip')
            ->nullable()
            ->comment('Dirección IP del estudiante al aceptar la declaración')
            ->after('declaracion_aceptada_at');

        $table->string('declaracion_user_agent')
            ->nullable()
            ->comment('User agent del navegador del estudiante al aceptar la declaración')
            ->after('declaracion_ip');
    });

    echo "✓ Columnas agregadas exitosamente.\n";
} catch (\Exception $e) {
    echo '✗ Error: '.$e->getMessage()."\n";
    exit(1);
}
