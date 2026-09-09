<?php

declare(strict_types=1);

namespace Tests;

use Anodyne\Hugeicons\BladeHugeiconsServiceProvider;
use BladeUI\Icons\BladeIconsServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app)
    {
        return [
            BladeIconsServiceProvider::class,
            BladeHugeiconsServiceProvider::class,
        ];
    }
}
