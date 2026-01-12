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
        Schema::create('financial_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            // Income
            $table->decimal('income_head_office', 12, 2)->nullable()->default(0);
            $table->decimal('income_external_sources', 12, 2)->nullable()->default(0);
            $table->decimal('total_income', 12, 2)->nullable()->default(0); // Computed
            // Expenses
            $table->decimal('expense_team_sports', 12, 2)->nullable()->default(0);
            $table->decimal('expense_track_field', 12, 2)->nullable()->default(0);
            $table->decimal('total_expense', 12, 2)->nullable()->default(0); // Computed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_data');
    }
};
