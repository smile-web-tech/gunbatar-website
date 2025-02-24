<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKompyuter2Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kompyuter-2', function (Blueprint $table) {
            $table->increments('id');
            $table->string('FA')->nullable();
            $table->integer('MIDTERM-1')->nullable();
            $table->integer('MIDTERM-2')->nullable();
            $table->integer('MIDTERM-3')->nullable();
            $table->integer('MIDTERM-4')->nullable();
            $table->integer('FINAL')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kompyuter-2');
    }
}
