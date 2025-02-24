<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\letsgo2;

class hezret1Controller extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'letsgo2';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new letsgo2());

        $grid->column('id', __('Id'));
        $grid->column('FA', __('FA'));
        $grid->column('Test 1', __('Test 1'));
        $grid->column('Test 2', __('Test 2'));
        $grid->column('Test 3', __('Test 3'));
        $grid->column('Test 4', __('Test 4'));
        $grid->column('Final', __('Final'));

        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(letsgo2::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('FA', __('FA'));
        $show->field('Test 1', __('Test 1'));
        $show->field('Test 2', __('Test 2'));
        $show->field('Test 3', __('Test 3'));
        $show->field('Test 4', __('Test 4'));
        $show->field('Final', __('Final'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new letsgo2());

        $form->text('FA', __('FA'));
        $form->number('Test 1', __('Test 1'));
        $form->number('Test 2', __('Test 2'));
        $form->number('Test 3', __('Test 3'));
        $form->number('Test 4', __('Test 4'));
        $form->number('Final', __('Final'));

        return $form;
    }
}
