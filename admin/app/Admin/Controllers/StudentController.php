<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\StudentModel;

class StudentController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'StudentModel';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new StudentModel());

        $grid->column('id', __('Id'));
        $grid->column('Name', __('Name'));
        $grid->column('Phone number', __('Phone number'));
        $grid->column('Email', __('Email'));
        $grid->column('Adress', __('Adress'));
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
        $show = new Show(StudentModel::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('Name', __('Name'));
        $show->field('Phone number', __('Phone number'));
        $show->field('Email', __('Email'));
        $show->field('Adress', __('Adress'));
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
        $form = new Form(new StudentModel());

        $form->text('Name', __('Name'));
        $form->number('Phone number', __('Phone number'));
        $form->email('Email', __('Email'));
        $form->text('Adress', __('Adress'));

        return $form;
    }
}
