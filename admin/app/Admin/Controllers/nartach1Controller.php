<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\ElementaryA;

class nartach1Controller extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'ElementaryA';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new ElementaryA());

        $grid->column('id', __('Id'));
        $grid->column('FA', __('FA'));
        $grid->column('Midterm 1', __('Midterm 1'));
        $grid->column('Midterm 2', __('Midterm 2'));
        $grid->column('Midterm 3', __('Midterm 3'));
        $grid->column('Midterm 4', __('Midterm 4'));
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
        $show = new Show(ElementaryA::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('FA', __('FA'));
        $show->field('Midterm 1', __('Midterm 1'));
        $show->field('Midterm 2', __('Midterm 2'));
        $show->field('Midterm 3', __('Midterm 3'));
        $show->field('Midterm 4', __('Midterm 4'));
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
        $form = new Form(new ElementaryA());

        $form->text('FA', __('FA'));
        $form->number('Midterm 1', __('Midterm 1'));
        $form->number('Midterm 2', __('Midterm 2'));
        $form->number('Midterm 3', __('Midterm 3'));
        $form->number('Midterm 4', __('Midterm 4'));
        $form->number('Final', __('Final'));

        return $form;
    }
}
