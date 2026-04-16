<?php

namespace App\Console\Commands;

use App\Models\LearningSession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FinalizeLearningSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'learning-sessions:finalize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Finalize learning sessions that have expired (end date passed)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Finalizing learning sessions that have expired...');

        // Buscar learning sessions que han vencido pero aún están activas
        // Consideramos que una sesión ha vencido si su fecha de fin es anterior a hoy
        $sessionsToFinalize = LearningSession::where('status', 'active')
            ->where('end_date', '<', now())
            ->get();

        if ($sessionsToFinalize->isEmpty()) {
            $this->info('No learning sessions found to finalize.');

            return 0;
        }

        $finalizedCount = 0;

        DB::transaction(function () use ($sessionsToFinalize, &$finalizedCount) {
            foreach ($sessionsToFinalize as $session) {
                // Cambiar status a finished y registration_status a inactive
                $session->update([
                    'status' => 'finished',
                    'registration_status' => 'inactive',
                ]);
                $finalizedCount++;

                $this->line("Finalized session ID: {$session->id} - {$session->name}");
            }
        });

        $this->info("Successfully finalized {$finalizedCount} learning sessions that have expired.");

        return 0;
    }
}
