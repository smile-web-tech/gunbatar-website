<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\Result;

class ResultController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Result';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Result());

        $grid->column('id', __('Id'));
        $grid->column('name', __('Name'));
        $grid->column('midterm1', __('Midterm1'));
        $grid->column('midterm2', __('Midterm2'));
        $grid->column('midterm3', __('Midterm3'));
        $grid->column('midterm4', __('Midterm4'));
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
        $show = new Show(Result::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('name', __('Name'));
        $show->field('midterm1', __('Midterm1'));
        $show->field('midterm2', __('Midterm2'));
        $show->field('midterm3', __('Midterm3'));
        $show->field('midterm4', __('Midterm4'));
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
        $form = new Form(new Result());

        $form->text('name', __('Name'));
        $form->number('midterm1', __('Midterm1'));
        $form->number('midterm2', __('Midterm2'));
        $form->number('midterm3', __('Midterm3'));
        $form->number('midterm4', __('Midterm4'));
        $form->number('FINAL', __('FINAL'));

        return $form;
    }
}
