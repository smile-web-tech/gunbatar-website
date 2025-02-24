<?php

namespace App\Admin\Extensions\Nav;

class Links
{
    public function __toString()
    {
        return <<<HTML

<li class="nav-item">
    <a href="#" class="nav-link">
      <i class="icon-envelope"></i>
      <span class="badge bg-success">4</span>
    </a>
</li>

<li class="nav-item">
    <a href="#" class="nav-link">
      <i class="icon-bell"></i>
      <span class="badge bg-warning">7</span>
    </a>
</li>

<li class="nav-item">
    <a href="#" class="nav-link">
      <i class="icon-flag"></i>
      <span class="badge bg-danger">9</span>
    </a>
</li>

HTML;
    }
}