<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('track_field_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->date('event_date')->nullable();
            $table->string('venue')->nullable();
            $table->string('event_name')->nullable();
            $table->integer('teams_male')->nullable()->default(0);
            $table->integer('teams_female')->nullable()->default(0);
            $table->integer('players_male')->nullable()->default(0);
            $table->integer('players_female')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_field_data');
    }
};
