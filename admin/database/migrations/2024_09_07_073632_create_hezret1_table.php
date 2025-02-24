<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHezret1Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hezret1', function (Blueprint $table) {
            $table->increments('id');
            $table->string('FA')->nullable();
            $table->integer('Test 1')->nullable();
            $table->integer('Test 2')->nullable();
            $table->integer('Test 3')->nullable();
            $table->integer('Test 4')->nullable();
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
        Schema::dropIfExists('hezret1');
    }
}
