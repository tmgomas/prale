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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')->constrained()->onDelete('cascade');
            $table->string('division'); // Manual text entry
            $table->string('officer_name');
            $table->enum('designation', ['AD', 'DYO', 'YSO', 'AYSO']);
            $table->string('epf_number');
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
