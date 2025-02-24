<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
class AppServiceProvider extends ServiceProvider{
    public function register()
    {
        
    }
    
    public function boot()
    {
        // if($this->app->environment('production')) {
        //   URL::forceScheme('https');  
        // };
        
       
            URL::forceScheme('https');
        
        // resolve(\Illuminate\Routing\UrlGenerator::class)->forceScheme('https');

    }
}