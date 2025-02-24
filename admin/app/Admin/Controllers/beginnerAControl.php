<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\beginnerAmodel;

class beginnerAControl extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'beginnerAmodel';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new beginnerAmodel());

        $grid->column('id', __('Id'));
        $grid->column('Name', __('Name'));
        $grid->column('Midterm1', __('Midterm1'));
        $grid->column('Midterm2', __('Midterm2'));
        $grid->column('Midterm3', __('Midterm3'));
        $grid->column('Midterm4', __('Midterm4'));
        $grid->column('FINAL', __('FINAL'));
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
        $show = new Show(beginnerAmodel::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('Name', __('Name'));
        $show->field('Midterm1', __('Midterm1'));
        $show->field('Midterm2', __('Midterm2'));
        $show->field('Midterm3', __('Midterm3'));
        $show->field('Midterm4', __('Midterm4'));
        $show->field('FINAL', __('FINAL'));
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
        $form = new Form(new beginnerAmodel());

        $form->text('Name', __('Name'));
        $form->number('Midterm1', __('Midterm1'));
        $form->number('Midterm2', __('Midterm2'));
        $form->number('Midterm3', __('Midterm3'));
        $form->number('Midterm4', __('Midterm4'));
        $form->number('FINAL', __('FINAL'));

        return $form;
    }
}
