<?php

namespace App\Console\Commands;

use App\Http\Controllers\Teacher\LearningSessionController;
use App\Models\LearningSession;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArchiveLearningSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'learning-sessions:archive';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive learning sessions that have expired (application date passed)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Archiving learning sessions that have expired...');

        // Buscar learning sessions que han vencido pero aún están activas
        // Consideramos que una sesión ha vencido si su fecha de aplicación es anterior a hoy
        $sessionsToArchive = LearningSession::where('status', 'active')
            ->where('application_date', '<', now()->toDateString())
            ->get();

        if ($sessionsToArchive->isEmpty()) {
            $this->info('No learning sessions found to archive.');

            return 0;
        }

        $archivedCount = 0;
        $controller = new LearningSessionController;

        DB::transaction(function () use ($sessionsToArchive, &$archivedCount, $controller) {
            foreach ($sessionsToArchive as $session) {
                // Usar el método existente changeStatus() del controller
                $request = new Request;
                $request->merge(['status' => 'archived']);

                // Simular la llamada al método changeStatus del controller
                $controller->changeStatus($request, $session->id);
                $archivedCount++;

                $this->line("Archived session ID: {$session->id} - {$session->name}");
            }
        });

        $this->info("Successfully archived {$archivedCount} learning sessions that have expired.");

        return 0;
    }
}
