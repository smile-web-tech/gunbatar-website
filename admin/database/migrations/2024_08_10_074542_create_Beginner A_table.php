<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBeginnerATable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Beginner A', function (Blueprint $table) {
            $table->increments('id');
            $table->string('Name')->nullable();
            $table->integer('Midterm1')->nullable();
            $table->integer('Midterm2')->nullable();
            $table->integer('Midterm3')->nullable();
            $table->integer('Midterm4')->nullable();
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
        Schema::dropIfExists('Beginner A');
    }
}
