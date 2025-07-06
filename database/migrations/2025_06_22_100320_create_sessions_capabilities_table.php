<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sessions_capabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_session_id')
                ->constrained('learning_sessions')
                ->cascadeOnDelete();
            $table->foreignId('capability_id')
                ->constrained('capabilities')
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions_capabilities');
    }
};
