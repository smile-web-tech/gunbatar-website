<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNartach1Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nartach1', function (Blueprint $table) {
            $table->increments('id');
            $table->string('FA')->nullable();
            $table->integer('Midterm 1')->nullable();
            $table->integer('Midterm 2')->nullable();
            $table->integer('Midterm 3')->nullable();
            $table->integer('Midterm 4')->nullable();
            $table->integer('Final')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('nartach1');
    }
}
