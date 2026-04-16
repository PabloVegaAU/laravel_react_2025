<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Tarea programada para finalizar learning sessions vencidas
Schedule::command('learning-sessions:finalize')
    ->daily()
    ->at('00:01')
    ->description('Finalize learning sessions that have expired (end date passed)');
