<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBibinyaz5Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bibinyaz5', function (Blueprint $table) {
            $table->increments('id');
            $table->string('Name')->nullable();
            $table->integer('Test1')->nullable();
            $table->integer('Test2')->nullable();
            $table->integer('Test3')->nullable();
            $table->integer('Test4')->nullable();
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
        Schema::dropIfExists('bibinyaz5');
    }
}
