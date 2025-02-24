<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\gulzada1;

class gulzada1Controller extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'gulzada1';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new gulzada1());

        $grid->column('id', __('Id'));
        $grid->column('Name', __('Name'));
        $grid->column('Test1', __('Test1'));
        $grid->column('Test2', __('Test2'));
        $grid->column('Test3', __('Test3'));
        $grid->column('Test4', __('Test4'));
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
        $show = new Show(gulzada1::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('Name', __('Name'));
        $show->field('Test1', __('Test1'));
        $show->field('Test2', __('Test2'));
        $show->field('Test3', __('Test3'));
        $show->field('Test4', __('Test4'));
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
        $form = new Form(new gulzada1());

        $form->text('Name', __('Name'));
        $form->number('Test1', __('Test1'));
        $form->number('Test2', __('Test2'));
        $form->number('Test3', __('Test3'));
        $form->number('Test4', __('Test4'));
        $form->number('Final', __('Final'));

        return $form;
    }
}
