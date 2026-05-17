<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CheckSequencesCommand extends Command
{
    /**
     * Command signature
     */
    protected $signature = 'db:check-sequences 
                            {--fix : Automatically fix desynchronized sequences}';

    /**
     * Command description
     */
    protected $description = 'Check and fix PostgreSQL sequences';

    /**
     * Execute command
     */
    public function handle(): int
    {
        $this->info('Checking PostgreSQL sequences...');

        /**
         * Validate database driver
         */
        if (DB::getDriverName() !== 'pgsql') {
            $this->error('This command only works with PostgreSQL.');

            return self::FAILURE;
        }

        /**
         * Get all tables with id column
         */
        $tables = $this->getTablesWithId();

        /**
         * Store desynchronized sequences
         */
        $desynchronized = [];

        foreach ($tables as $table) {

            /**
             * Get real sequence name
             */
            $sequence = $this->getSequenceName($table);

            /**
             * Table does not use sequence
             */
            if (! $sequence) {
                $this->line("{$table}: no sequence found");

                continue;
            }

            /**
             * Get max table id
             */
            $maxId = $this->getMaxId($table);

            /**
             * Get current sequence value
             */
            $sequenceValue = $this->getSequenceLastValue($sequence);

            /**
             * Could not read sequence
             */
            if ($sequenceValue === null) {
                $this->warn("{$table}: could not read sequence");

                continue;
            }

            /**
             * Empty table
             */
            if ($maxId === null) {

                /**
                 * Sequence advanced even if table is empty
                 */
                if ($sequenceValue > 1) {

                    $desynchronized[] = [
                        'table' => $table,
                        'sequence' => $sequence,
                        'max_id' => 0,
                        'sequence_value' => $sequenceValue,
                        'expected_value' => 1,
                        'difference' => $sequenceValue - 1,
                        'problem' => 'Empty table but sequence is advanced',
                        'solution' => 'Reset sequence to 1',
                        'empty' => true,
                    ];

                    $this->warn(
                        "{$table}: EMPTY TABLE | sequence={$sequenceValue} | should be=1"
                    );
                } else {

                    $this->line(
                        "{$table}: OK | empty table | sequence=1"
                    );
                }

                continue;
            }

            /**
             * Sequence behind max ID
             */
            if ($sequenceValue < $maxId) {

                $desynchronized[] = [
                    'table' => $table,
                    'sequence' => $sequence,
                    'max_id' => $maxId,
                    'sequence_value' => $sequenceValue,
                    'expected_value' => $maxId,
                    'difference' => $maxId - $sequenceValue,
                    'problem' => 'Sequence is behind table max ID',
                    'solution' => 'Advance sequence',
                    'empty' => false,
                ];

                $this->warn(
                    "{$table}: OUT OF SYNC | max_id={$maxId} | sequence={$sequenceValue}"
                );

                continue;
            }

            /**
             * Sequence ahead of max ID
             */
            if ($sequenceValue > $maxId) {

                /**
                 * This is not always an error.
                 * PostgreSQL sequences can advance because:
                 * - rolled back transactions
                 * - deleted records
                 * - sequence cache
                 * - failed inserts
                 */
                $difference = $sequenceValue - $maxId;

                /**
                 * Small difference is normal
                 */
                if ($difference <= 10) {

                    $this->line(
                        "{$table}: OK | sequence ahead (normal PostgreSQL behavior)"
                    );

                    continue;
                }

                /**
                 * Large difference may indicate issue
                 */
                $desynchronized[] = [
                    'table' => $table,
                    'sequence' => $sequence,
                    'max_id' => $maxId,
                    'sequence_value' => $sequenceValue,
                    'expected_value' => $maxId,
                    'difference' => $difference,
                    'problem' => 'Sequence is far ahead of max ID',
                    'solution' => 'Optional reset sequence',
                    'empty' => false,
                ];

                $this->warn(
                    "{$table}: SEQUENCE AHEAD | max_id={$maxId} | sequence={$sequenceValue}"
                );

                continue;
            }

            /**
             * Everything OK
             */
            $this->line(
                "{$table}: OK | max_id={$maxId} | sequence={$sequenceValue}"
            );
        }

        /**
         * No issues found
         */
        if (empty($desynchronized)) {

            $this->info('All sequences are synchronized.');

            return self::SUCCESS;
        }

        /**
         * Show summary table
         */
        $this->newLine();

        $this->warn(
            'Found ' . count($desynchronized) . ' sequence issue(s)'
        );

        $this->newLine();

        $this->table(
            [
                'Table',
                'Max ID',
                'Sequence',
                'Difference',
                'Problem',
                'Solution',
            ],
            array_map(function ($item) {

                return [
                    $item['table'],
                    $item['max_id'],
                    $item['sequence_value'],
                    $item['difference'],
                    $item['problem'],
                    $item['solution'],
                ];
            }, $desynchronized)
        );

        /**
         * Only analyze
         */
        if (! $this->option('fix')) {

            $this->newLine();

            $this->line(
                'Run command with --fix to repair sequences.'
            );

            return self::SUCCESS;
        }

        /**
         * Automatically fix sequences
         */
        $this->newLine();

        $this->info('Fixing sequences...');

        foreach ($desynchronized as $item) {

            $this->fixSequence(
                $item['table'],
                $item['sequence']
            );

            $this->info(
                "Fixed {$item['table']}"
            );
        }

        $this->newLine();

        $this->info('All sequences fixed successfully.');

        return self::SUCCESS;
    }

    /**
     * Get all tables with id column
     */
    protected function getTablesWithId(): array
    {
        $tables = [];

        $results = DB::select("
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        ");

        foreach ($results as $row) {

            $table = $row->tablename;

            /**
             * Only tables with id column
             */
            if (Schema::hasColumn($table, 'id')) {
                $tables[] = $table;
            }
        }

        return $tables;
    }

    /**
     * Get PostgreSQL sequence name
     */
    protected function getSequenceName(string $table): ?string
    {
        $result = DB::selectOne("
            SELECT pg_get_serial_sequence(?, 'id') AS sequence_name
        ", [$table]);

        return $result?->sequence_name;
    }

    /**
     * Get table max id
     */
    protected function getMaxId(string $table): ?int
    {
        try {

            $result = DB::table($table)
                ->selectRaw('MAX(id) as max_id')
                ->first();

            return $result?->max_id !== null
                ? (int) $result->max_id
                : null;
        } catch (\Throwable $e) {

            return null;
        }
    }

    /**
     * Get current sequence value
     */
    protected function getSequenceLastValue(
        string $sequence
    ): ?int {

        try {

            $result = DB::selectOne("
                SELECT last_value
                FROM {$sequence}
            ");

            return $result?->last_value !== null
                ? (int) $result->last_value
                : null;
        } catch (\Throwable $e) {

            return null;
        }
    }

    /**
     * Fix sequence
     */
    protected function fixSequence(
        string $table,
        string $sequence
    ): void {

        $maxId = $this->getMaxId($table);

        /**
         * Empty table
         */
        if ($maxId === null) {

            /**
             * Reset sequence to 1
             */
            DB::statement("
                SELECT setval('{$sequence}', 1, false)
            ");

            return;
        }

        /**
         * Synchronize sequence with max id
         */
        DB::statement("
            SELECT setval('{$sequence}', {$maxId}, true)
        ");
    }
}
