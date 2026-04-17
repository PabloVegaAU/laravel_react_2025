<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Tarea programada para finalizar learning sessions vencidas
// Ejecuta cada 30 minutos exactamente en las horas y medias horas (ej: 10:00, 10:30, 11:00, 11:30)
Schedule::command('learning-sessions:finalize')
    ->cron('0,30 * * * *')
    ->description('Finalize learning sessions that have expired (end date passed)');
