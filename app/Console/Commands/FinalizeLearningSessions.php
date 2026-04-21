<?php

namespace App\Console\Commands;

use App\Models\ApplicationForm;
use App\Models\ApplicationFormResponse;
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
                // Cargar el ApplicationForm relacionado
                $session->load('applicationForm');

                // Cambiar status a finished (período terminado por tarea programada)
                // NOTA: No se modifica registration_status - este solo se cambia manualmente
                $session->update([
                    'status' => 'finished',
                ]);

                // Sincronizar con ApplicationForm relacionado
                // NOTA: No se modifica registration_status - este solo se cambia manualmente
                if ($session->applicationForm) {
                    $session->applicationForm->update([
                        'status' => 'finished',
                    ]);

                    // Cambiar el estado de ApplicationFormResponse a 'finalized'
                    // 'finalized' = respuesta bloqueada sin completar por el estudiante
                    // (diferente de 'finished' que es período terminado)
                    ApplicationFormResponse::where('application_form_id', $session->applicationForm->id)
                        ->whereIn('status', ['pending', 'in progress'])
                        ->update(['status' => 'finalized']);
                }

                $finalizedCount++;

                $this->line("Finalized session ID: {$session->id} - {$session->name}");
            }
        });

        $this->info("Successfully finalized {$finalizedCount} learning sessions that have expired.");

        return 0;
    }
}
