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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();            
            $table->string('number_reference');
            $table->foreignId('project_id')->onDelete('cascade')->constrained();
            $table->foreignId('supplier_id')->onDelete('cascade')->constrained();
            $table->foreignId('user_id')->onDelete('cascade')->constrained();
            $table->foreignId('article_id')->onDelete('cascade')->constrained();
            $table->text('observation')->nullable();
            $table->string('amount')->nullable();
            $table->string('total')->nullable();
            $table->string('tva')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
