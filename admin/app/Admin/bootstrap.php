<?php

/**
 * Open-admin - admin builder based on Laravel.
 * @author z-song <https://github.com/z-song>
 *
 * Bootstraper for Admin.
 *
 * Here you can remove builtin form field:
 * OpenAdmin\Admin\Form::forget(['map', 'editor']);
 *
 * Or extend custom form field:
 * OpenAdmin\Admin\Form::extend('php', PHPEditor::class);
 *
 * Or require js and css assets:
 * Admin::css('/packages/prettydocs/css/styles.css');
 * Admin::js('/packages/prettydocs/js/main.js');
 *
 */

OpenAdmin\Admin\Form::forget(['editor']);

use OpenAdmin\Admin\Facades\Admin;
use OpenAdmin\Admin\Grid;

Admin::js('/vendor/chartjs/dist/Chart.min.js');


Grid::init(function (Grid $grid) {

    // $grid->disableActions();
    
});


// Вставьте ваш код здесь
OpenAdmin\Admin\Form::init(function (OpenAdmin\Admin\Form $form) {
    // $form->disableEditingCheck();
    // $form->disableCreatingCheck();
    $form->disableViewCheck();
    $form->disableReset();

    $form->tools(function (OpenAdmin\Admin\Form\Tools $tools) {
        $tools->disableDelete();
        $tools->disableView();
        $tools->disableList();
        
    });
});

Admin::navbar(function (\OpenAdmin\Admin\Widgets\Navbar $navbar) {
    // adds fullscreen option
    $navbar->right(new OpenAdmin\Admin\Widgets\Navbar\Fullscreen());

    // adds ajax refresh button
    $navbar->right(new OpenAdmin\Admin\Widgets\Navbar\RefreshButton());
});