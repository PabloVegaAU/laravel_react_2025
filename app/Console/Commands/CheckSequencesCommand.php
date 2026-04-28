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

            if ($maxId > $sequenceValue) {
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
            ['Table', 'Sequence', 'Max ID', 'Seq Value', 'Diff'],
            array_map(fn ($item) => [
                $item['table'],
                $item['sequence'],
                $item['max_id'],
                $item['sequence_value'],
                $item['diff'],
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

        $allTables = Schema::getAllTables();

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

            return $result[0]->max_id ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    protected function getSequenceValue(string $sequence): ?int
    {
        try {
            $result = DB::select("SELECT last_value FROM {$sequence}");

            return $result[0]->last_value ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    protected function fixSequence(string $table, string $sequence): void
    {
        DB::statement("SELECT setval('{$sequence}', (SELECT MAX(id) FROM {$table}), true)");
    }
}
