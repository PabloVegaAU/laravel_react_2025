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
        Schema::create('learning_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('purpose_learning');
            $table->date('application_date');
            $table->enum('status', ['draft', 'active', 'inactive'])->default('draft');

            $table->foreignId('educational_institution_id')
                ->constrained('educational_institutions')->cascadeOnDelete();
            $table->foreignId('teacher_classroom_curricular_area_id')
                ->constrained('teacher_classroom_curricular_areas')->cascadeOnDelete();
            $table->foreignId('competency_id')
                ->constrained('competencies')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_sessions');
    }
};
