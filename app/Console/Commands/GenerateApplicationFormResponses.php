<?php

namespace App\Console\Commands;

use App\Http\Controllers\Teacher\ApplicationFormController;
use App\Models\ApplicationForm;
use App\Models\LearningSession;
use Illuminate\Console\Command;

class GenerateApplicationFormResponses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'application-forms:generate-responses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate ApplicationFormResponses for active application forms that are missing student responses';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Searching for active application forms with missing responses...');

        // Buscar ApplicationForms que cumplan con los criterios:
        // - status = 'active'
        // - registration_status = 'active'
        // - start_date <= now()
        // - end_date >= now()
        // - deactivated_at es null
        $activeForms = ApplicationForm::where('status', 'active')
            ->where('registration_status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereNull('deactivated_at')
            ->with(['learningSession', 'questions', 'responses'])
            ->get();

        if ($activeForms->isEmpty()) {
            $this->info('No active application forms found within date range.');

            return 0;
        }

        $this->info("Found {$activeForms->count()} active application forms.");

        $formsProcessed = 0;
        $totalResponsesCreated = 0;
        $formsSkipped = 0;

        foreach ($activeForms as $applicationForm) {
            $this->line("Processing ApplicationForm ID: {$applicationForm->id} - {$applicationForm->name}");

            // Verificar que tenga preguntas
            if ($applicationForm->questions->isEmpty()) {
                $this->warn('  Skipped: No questions found');
                $formsSkipped++;

                continue;
            }

            // Verificar que tenga LearningSession
            if (! $applicationForm->learningSession) {
                $this->warn('  Skipped: No LearningSession found');
                $formsSkipped++;

                continue;
            }

            // Obtener el LearningSession con las relaciones necesarias
            $learningSession = LearningSession::with('teacherClassroomCurricularAreaCycle.classroom')
                ->findOrFail($applicationForm->learningSession->id);

            // Verificar que tenga classroom
            if (! $learningSession->teacherClassroomCurricularAreaCycle ||
                ! $learningSession->teacherClassroomCurricularAreaCycle->classroom) {
                $this->warn('  Skipped: No classroom found');
                $formsSkipped++;

                continue;
            }

            // Contar respuestas actuales
            $currentResponseCount = $applicationForm->responses->count();
            $this->line("  Current responses: {$currentResponseCount}");

            // Llamar al método generateApplicationFormResponses
            // Este método maneja la generación incremental (solo para estudiantes sin respuestas)
            $applicationFormController = app(ApplicationFormController::class);
            $applicationFormController->generateApplicationFormResponses($learningSession);

            // Recargar para verificar cuántas respuestas se crearon
            $newResponseCount = ApplicationForm::find($applicationForm->id)->responses()->count();
            $responsesCreated = $newResponseCount - $currentResponseCount;

            if ($responsesCreated > 0) {
                $this->info("  Created {$responsesCreated} new responses");
                $totalResponsesCreated += $responsesCreated;
            } else {
                $this->line('  No new responses needed (all students already have responses)');
            }

            $formsProcessed++;
        }

        $this->newLine();
        $this->info('Summary:');
        $this->line("  Application forms processed: {$formsProcessed}");
        $this->line("  Application forms skipped: {$formsSkipped}");
        $this->line("  Total responses created: {$totalResponsesCreated}");

        return 0;
    }
}
