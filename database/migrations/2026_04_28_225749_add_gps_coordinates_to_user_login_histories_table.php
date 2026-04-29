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
        Schema::table('user_login_histories', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)
                ->nullable()
                ->after('city')
                ->comment('Latitud GPS del dispositivo');

            $table->decimal('longitude', 10, 7)
                ->nullable()
                ->after('latitude')
                ->comment('Longitud GPS del dispositivo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_login_histories', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
