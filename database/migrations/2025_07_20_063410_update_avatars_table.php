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
        Schema::table('avatars', function (Blueprint $table) {
            $table->renameColumn('image', 'image_url');
            $table->renameColumn('points_store', 'price');
            $table->dropColumn('level_required');

            // Add is_active if it doesn't exist (it should from the previous migration)
            if (! Schema::hasColumn('avatars', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('avatars', function (Blueprint $table) {
            $table->renameColumn('image_url', 'image');
            $table->renameColumn('price', 'points_store');
            $table->integer('level_required')->default(1);
        });
    }
};
