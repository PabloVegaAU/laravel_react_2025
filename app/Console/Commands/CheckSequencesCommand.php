<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CheckSequencesCommand extends Command
{
    protected $signature = 'db:check-sequences {--fix : Automatically fix desynchronized sequences}';

    protected $description = 'Check and optionally fix PostgreSQL sequences that are out of sync with their table max IDs';

    public function handle()
    {
        $this->info('Checking PostgreSQL sequences...');

        $driver = DB::getDriverName();

        if ($driver !== 'pgsql') {
            $this->warn('This command only works with PostgreSQL. Current driver: '.$driver);

            return self::FAILURE;
        }

        $tables = $this->getTablesWithSequences();
        $desynchronized = [];

        foreach ($tables as $table) {
            $sequenceName = $table.'_id_seq';
            $maxId = $this->getMaxId($table);
            $sequenceValue = $this->getSequenceValue($sequenceName);

            if ($sequenceValue === null) {
                $this->line("  {$table}: Sequence not found, skipping");

                continue;
            }

            if ($maxId === null) {
                if ($sequenceValue > 1) {
                    $desynchronized[] = [
                        'table' => $table,
                        'sequence' => $sequenceName,
                        'max_id' => 0,
                        'sequence_value' => $sequenceValue,
                        'diff' => 0,
                        'empty' => true,
                    ];
                    $this->warn("  {$table}: Empty table (seq: {$sequenceValue}, should be 1)");
                } else {
                    $this->line("  {$table}: Empty table (seq: {$sequenceValue})");
                }
            } elseif ($maxId > $sequenceValue) {
                $desynchronized[] = [
                    'table' => $table,
                    'sequence' => $sequenceName,
                    'max_id' => $maxId,
                    'sequence_value' => $sequenceValue,
                    'diff' => $maxId - $sequenceValue,
                ];
            } elseif ($maxId < $sequenceValue) {
                $this->warn("  {$table}: Sequence ahead of max ID (seq: {$sequenceValue}, max: {$maxId})");
            } else {
                $this->line("  {$table}: OK (max: {$maxId})");
            }
        }

        if (empty($desynchronized)) {
            $this->info('All sequences are synchronized.');

            return self::SUCCESS;
        }

        $this->warn("\nFound ".count($desynchronized).' desynchronized sequence(s):');

        $this->table(
            ['Table', 'Sequence', 'Max ID', 'Seq Value', 'Diff', 'Action'],
            array_map(fn ($item) => [
                $item['table'],
                $item['sequence'],
                $item['empty'] ? '(empty)' : $item['max_id'],
                $item['sequence_value'],
                $item['empty'] ? 'reset to 1' : $item['diff'],
                $item['empty'] ? 'Reset sequence' : 'Advance sequence',
            ], $desynchronized)
        );

        if ($this->option('fix')) {
            if ($this->confirm('Do you want to fix these sequences?')) {
                foreach ($desynchronized as $item) {
                    $this->fixSequence($item['table'], $item['sequence']);
                    $this->info("  Fixed: {$item['table']}");
                }
                $this->info('All sequences fixed successfully.');
            }
        } else {
            // ✅ FIX AQUÍ
            $this->line("\nRun with --fix to automatically fix these sequences.");
        }

        return self::SUCCESS;
    }

    protected function getTablesWithSequences(): array
    {
        $tables = [];

        $allTables = DB::select("SELECT tablename as table_name FROM pg_tables WHERE schemaname = 'public'");

        foreach ($allTables as $table) {
            $tableName = is_array($table)
                ? $table['table_name']
                : (is_object($table) ? $table->table_name : $table);

            if (Schema::hasColumn($tableName, 'id')) {
                $tables[] = $tableName;
            }
        }

        return $tables;
    }

    protected function getMaxId(string $table): ?int
    {
        try {
            $result = DB::select("SELECT MAX(id) as max_id FROM {$table}");

            return isset($result[0]->max_id) ? (int) $result[0]->max_id : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    protected function getSequenceValue(string $sequence): ?int
    {
        try {
            $result = DB::select("SELECT last_value FROM {$sequence}");

            return isset($result[0]->last_value) ? (int) $result[0]->last_value : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    protected function fixSequence(string $table, string $sequence): void
    {
        $maxId = $this->getMaxId($table);

        if ($maxId === null) {
            // Table is empty, reset sequence to 1
            DB::statement("SELECT setval('{$sequence}', 1, false)");
        } else {
            // Set sequence to current max ID
            DB::statement("SELECT setval('{$sequence}', {$maxId}, true)");
        }
    }
}
