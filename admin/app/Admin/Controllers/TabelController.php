<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\TableTest;

class TabelController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'TableTest';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new TableTest());

        $grid->column('id', __('Id'));
        $grid->column('Name', __('Name'));
        $grid->column('Test1', __('Test1'));
        $grid->column('Tes2', __('Tes2'));

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
        $show = new Show(TableTest::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('Name', __('Name'));
        $show->field('Test1', __('Test1'));
        $show->field('Tes2', __('Tes2'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new TableTest());

        $form->text('Name', __('Name'));
        $form->number('Test1', __('Test1'));
        $form->number('Tes2', __('Tes2'));

        return $form;
    }
}
