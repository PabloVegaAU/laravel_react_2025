<?php

namespace App\Console\Commands;

use App\Models\ApplicationForm;
use App\Models\LearningSession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ActivateLearningSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'learning-sessions:activate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Activate learning sessions that are within their date range (start date reached)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Activating learning sessions that are within their date range...');

        // Buscar learning sessions que deben activarse
        // Consideramos que una sesión debe activarse si:
        // - status es 'scheduled'
        // - start_date <= now() (ya llegó la fecha de inicio)
        // - end_date >= now() (aún no ha vencido)
        // - deactivated_at es null (no está cancelada)
        $sessionsToActivate = LearningSession::where('status', 'scheduled')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereNull('deactivated_at')
            ->get();

        if ($sessionsToActivate->isEmpty()) {
            $this->info('No learning sessions found to activate.');

            return 0;
        }

        $activatedCount = 0;

        DB::transaction(function () use ($sessionsToActivate, &$activatedCount) {
            foreach ($sessionsToActivate as $session) {
                // Cargar el ApplicationForm relacionado
                $session->load('applicationForm');

                // Cambiar status a active y registration_status a active
                $session->update([
                    'status' => 'active',
                    'registration_status' => 'active',
                ]);

                // Sincronizar con ApplicationForm relacionado
                if ($session->applicationForm) {
                    $session->applicationForm->update([
                        'status' => 'active',
                        'registration_status' => 'active',
                    ]);

                    // Generar ApplicationFormResponses para estudiantes matriculados
                    $applicationFormController = app(ApplicationFormController::class);
                    $applicationFormController->generateApplicationFormResponses($session);

                    $this->line("Activated session ID: {$session->id} - {$session->name} (with ApplicationForm ID: {$session->applicationForm->id})");
                } else {
                    $this->line("Activated session ID: {$session->id} - {$session->name} (no ApplicationForm)");
                }

                $activatedCount++;
            }
        });

        $this->info("Successfully activated {$activatedCount} learning sessions that are within their date range.");

        return 0;
    }
}
