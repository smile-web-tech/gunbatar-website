<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateElementaryANartachTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('elementaryANartach', function (Blueprint $table) {
            $table->increments('id');
            $table->string('FA')->nullable();
            $table->integer('MIDTERM1')->nullable();
            $table->integer('MIDTERM2')->nullable();
            $table->integer('MIDTERM3')->nullable();
            $table->integer('MIDTERM4')->nullable();
            $table->integer('FINAL')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('elementaryANartach');
    }
}
