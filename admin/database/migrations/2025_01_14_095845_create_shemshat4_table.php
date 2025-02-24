<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShemshat4Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shemshat4', function (Blueprint $table) {
            $table->increments('id');
            $table->string('Name')->nullable();
            $table->string('Test1')->nullable();
            $table->string('Test2')->nullable();
            $table->string('Test3')->nullable();
            $table->string('Test4')->nullable();
            $table->string('Final')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shemshat4');
    }
}
