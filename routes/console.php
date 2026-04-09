<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Tarea programada para archivar learning sessions vencidas
Schedule::command('learning-sessions:archive')
    ->daily()
    ->at('00:01')
    ->description('Archive learning sessions that have expired (application date passed)');
