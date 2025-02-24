<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\letsgo3;

class letsgo3Controller extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'letsgo3';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new letsgo3());

        $grid->column('id', __('Id'));
        $grid->column('FA', __('FA'));
        $grid->column('Test1', __('Test1'));
        $grid->column('Test2', __('Test2'));
        $grid->column('Test3', __('Test3'));
        $grid->column('Test4', __('Test4'));
        $grid->column('Final', __('Final'));
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));

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
        $show = new Show(letsgo3::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('FA', __('FA'));
        $show->field('Test1', __('Test1'));
        $show->field('Test2', __('Test2'));
        $show->field('Test3', __('Test3'));
        $show->field('Test4', __('Test4'));
        $show->field('Final', __('Final'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new letsgo3());

        $form->text('FA', __('FA'));
        $form->number('Test1', __('Test1'));
        $form->number('Test2', __('Test2'));
        $form->number('Test3', __('Test3'));
        $form->number('Test4', __('Test4'));
        $form->number('Final', __('Final'));

        return $form;
    }
}
