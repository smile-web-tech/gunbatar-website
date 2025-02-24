<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\register;

class registerController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'register';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new register());

        $grid->column('id', __('Id'));
        $grid->column('Ady', __('Ady'));
        $grid->column('Telefon', __('Telefon'));
        $grid->column('Email', __('Email'));
        $grid->column('Dersi', __('Dersi'));
        $grid->column('image', __('Image'));
        $grid->column('image2', __('Image2'));
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
        $show = new Show(register::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('Ady', __('Ady'));
        $show->field('Telefon', __('Telefon'));
        $show->field('Email', __('Email'));
        $show->field('Dersi', __('Dersi'));
        $show->field('image', __('Image'));
        $show->field('image2', __('Image2'));
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
        $form = new Form(new register());

        $form->text('Ady', __('Ady'));
        $form->number('Telefon', __('Telefon'));
        $form->email('Email', __('Email'));
        $form->text('Dersi', __('Dersi'));
        $form->image('image', __('Image'));
        $form->text('image2', __('Image2'));

        return $form;
    }
}