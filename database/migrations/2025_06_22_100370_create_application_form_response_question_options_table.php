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
        Schema::create('application_form_response_question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_form_response_question_id')
                ->constrained('application_form_response_question')
                ->cascadeOnDelete()
                ->comment('Referencia a la respuesta de la práctica');
            $table->foreignId('question_option_id')
                ->constrained('question_options')
                ->cascadeOnDelete()
                ->comment('Referencia a la opción seleccionada');

            $table->decimal('score', 10, 2)->default(0);
            $table->boolean('is_correct');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_form_response_question_options');
    }
};
