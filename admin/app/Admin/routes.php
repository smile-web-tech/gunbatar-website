<?php

use Illuminate\Routing\Router;

Admin::routes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
    'as'            => config('admin.route.prefix') . '.',
], function (Router $router) {

    $router->get('/', 'HomeController@index')->name('home');

    $router->resource('results', ResultController::class);

    $router->resource('elementary-as', nartach1Controller::class);
    
    $router->resource('letsgo2s', hezret1Controller::class);
    
    $router->resource('nartach2-models', nartach2Controller::class);
    
    $router->resource('hezretirden1s', hezretirden1Controller::class);
    $router->resource('arzygulb1s', arzygulb1Controller::class);
    $router->resource('kompyuterkids', kompyuterkidsController::class);
    
    $router->resource('elementary-as', elementaryAController::class);
    $router->resource('letsgo3s', letsgo3Controller::class);
    
    $router->resource('letsgo5s', letsgo5Controller::class);
    
    $router->resource('ayna1s', ayna1Controller::class);
    
    $router->resource('bibinyaz1s', bibinyaz1Controller::class);
    
    $router->resource('shohrat1s', shohrat1Controller::class);
    
    $router->resource('annagozel1s', annagozel1Controller::class);
    
    $router->resource('kerven1s', kerven1Controller::class);
    
    $router->resource('rahym1s', rahym1Controller::class);
    
    $router->resource('nurjemal1s', nurjemal1Controller::class);
    
    $router->resource('nartach4s', nartach4Controller::class);
    $router->resource('nartach5s', nartach5Controller::class);
    
    $router->resource('annasoltan1s', annasoltan1Controller::class);
    
    $router->resource('arzygulb2s', arzygulb2Controller::class);
    
    $router->resource('tamila1s', tamila1Controller::class);
    
    $router->resource('bibinyaz2s', bibinyaz2Controller::class);
    
    $router->resource('shohrat2s', shohrat2Controller::class);
    
    $router->resource('rahym2s', rahym2Controller::class);
    
    $router->resource('annagozel2s', annagozel2Controller::class);
    
    $router->resource('yolaman1s', yolaman1Controller::class);
    
    $router->resource('arzygulb3s', arzygulb3Controller::class);
    
    $router->resource('abadan1s', abadan1Controller::class);
    
    $router->resource('nurjemal2s', nurjemal2Controller::class);
    
    $router->resource('amangul1s', amangul1Controller::class);
    
    $router->resource('shohrat3s', shohrat3Controller::class);
    
    $router->resource('nartach6s', nartach6Controller::class);
    
    $router->resource('kerven2s', kerven2Controller::class);
    
    $router->resource('rahym3s', rahym3Controller::class);
    
    $router->resource('gulzada1s', gulzada1Controller::class);
    
    $router->resource('aynur1s', aynur1Controller::class);
    
    $router->resource('nurjemal3s', nurjemal3Controller::class);
    $router->resource('bibinyaz3s', bibinyaz3Controller::class);
    
    $router->resource('shohrat4s', shohrat4Controller::class);
    
    $router->resource('annasoltan2s', annasoltan2Controller::class);
    
    $router->resource('kerven3s', kerven3Controller::class);
    
    $router->resource('rahym5s', rahym5Controller::class);
    
    $router->resource('yazgylych2s', yazgylych2Controller::class);
    
    $router->resource('amangul3s', amangul3Controller::class);
    
    $router->resource('yolaman2s', yolaman2Controller::class);
    $router->resource('shemshat2s', shemshat2Controller::class);
    
    $router->resource('abadan3s', abadan3Controller::class);
    
    $router->resource('shohrat5s', shohrat5Controller::class);
    
    $router->resource('mahri4s', mahri4Controller::class);
    
    $router->resource('kerven4s', kerven4Controller::class);
    
    $router->resource('rahym4s', rahym4Controller::class);

    $router->resource('guljemal2s', guljemal2Controller::class);
    
    $router->resource('bibinyaz5s', bibinyaz5Controller::class);
    
    $router->resource('ejesh2s', ejesh2Controller::class);
    
    $router->resource('ayna3s', ayna3Controller::class);
    
    $router->resource('yazgul3s', yazgul3Controller::class);
    
    $router->resource('shemshat1s', shemshat1Controller::class);
    
    $router->resource('shohrat6s', shohrat6Controller::class);
    
    $router->resource('kerven5s', kerven5Controller::class);
    
    $router->resource('yolaman3s', yolaman3Controller::class);
    
    $router->resource('guljemal3s', guljemal3Controller::class);
  
  $router->resource('images', ImageController::class);
  
  $router->resource('registrations', registrationController::class);
  
  $router->resource('registers', registerController::class);
  
  $router->resource('kerven6s', kerven6Controller::class);
  
  $router->resource('amangul4s', amangul4Controller::class);

$router->resource('nartach3s', nartach3Controller::class);

$router->resource('nartach7s', nartach7Controller::class);

$router->resource('nartach8s', nartach8Controller::class);

$router->resource('hezret3s', hezret3Controller::class);

$router->resource('hezret4s', hezret4Controller::class);

$router->resource('hezret5s', hezret5Controller::class);

$router->resource('hezret6s', hezret6Controller::class);

$router->resource('bibinyaz6s', bibinyaz6Controller::class);

$router->resource('bibinyaz7s', bibinyaz7Controller::class);

$router->resource('ayna4s', ayna4Controller::class);

$router->resource('bibinyaz8s', bibinyaz8Controller::class);

$router->resource('leyla1s', leyla1Controller::class);

$router->resource('ayna5s', ayna5Controller::class);

$router->resource('ayna6s', ayna6Controller::class);

$router->resource('arzygulb5s', arzygul5Controller::class);

$router->resource('arzygulb6s', arzygulb6Controller::class);

$router->resource('bahargul1s', bahargul1Controller::class);
$router->resource('bahargul2s', bahargul2Controller::class);

$router->resource('arzygulm1s', arzygulm1Controller::class);

$router->resource('nartach9s', nartach9Controller::class);

$router->resource('gozel1s', gozel1Controller::class);

$router->resource('resul1s', resul1Controller::class);

$router->resource('annasoltan4s', annasoltan4Controller::class);
$router->resource('nurtach1s', nurtach1Controller::class);
$router->resource('nurtach2s', nurtach2Controller::class);

$router->resource('amangul5s', amangul5Controller::class);
$router->resource('shohrat7s', shohrat7Controller::class);

$router->resource('yolaman4s', yolaman4Controller::class);
$router->resource('shemshat3s', shemshat3Controller::class);
$router->resource('shemshat4s', shemshat4Controller::class);
$router->resource('yolaman5s', yolaman5Controller::class);

$router->resource('mahri2s', mahri2Controller::class);
$router->resource('arzygulb4s', arzygulb4Controller::class);

$router->resource('kerven11s', kerven11Controller::class);
});