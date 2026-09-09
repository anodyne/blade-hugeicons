<?php

declare(strict_types=1);

use Anodyne\Hugeicons\BladeHugeiconsServiceProvider;
use Illuminate\Support\ServiceProvider;

it('registers the bundled icons for publishing to the public directory', function () {
    $paths = ServiceProvider::pathsToPublish(BladeHugeiconsServiceProvider::class, 'blade-hugeicons');

    expect($paths)->toHaveCount(1);
    expect(realpath(array_key_first($paths)))->toBe(realpath(__DIR__.'/../../resources/svg'))
        ->and(array_values($paths))->toBe([public_path('vendor/blade-hugeicons')]);
});

it('publishes usable SVG assets with the documented artisan command', function () {
    $destination = public_path('vendor/blade-hugeicons');

    try {
        $this->artisan('vendor:publish', ['--tag' => 'blade-hugeicons', '--force' => true])
            ->assertExitCode(0);

        expect(file_get_contents($destination.'/abacus.svg'))
            ->toBe(file_get_contents(__DIR__.'/../../resources/svg/abacus.svg'));
        expect(count(glob($destination.'/*.svg')))
            ->toBe(count(glob(__DIR__.'/../../resources/svg/*.svg')));
    } finally {
        $this->app['files']->deleteDirectory($destination);
    }
});
