<?php

declare(strict_types=1);

namespace Anodyne\Hugeicons;

use BladeUI\Icons\Factory;
use Illuminate\Support\ServiceProvider;

final class BladeHugeiconsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->callAfterResolving(Factory::class, function (Factory $factory) {
            $factory->add('hugeicons', [
                'path' => __DIR__.'/../resources/svg',
                'prefix' => 'hugeicons',
                'class' => 'hugeicon',
            ]);
        });
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../resources/svg' => public_path('vendor/blade-hugeicons'),
            ], 'blade-hugeicons');
        }
    }
}
