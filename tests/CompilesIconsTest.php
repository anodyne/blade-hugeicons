<?php

declare(strict_types=1);

namespace Tests;

use Anodyne\Hugeicons\BladeHugeiconsServiceProvider;
use BladeUI\Icons\BladeIconsServiceProvider;
use Orchestra\Testbench\TestCase;

class CompilesIconsTest extends TestCase
{
    /** @test */
    public function it_compiles_a_single_anonymous_component()
    {
        $result = svg('hugeicons-abacus')->toHtml();

        // Note: the empty class here seems to be a Blade components bug.
        $expected = <<<SVG
        <svg class="hugeicon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9h3.5M17 9h1m-6-1v2m2.5-2v2m3.5 5h-6m-5 0H6m3.5-1v2"/></svg>
        SVG;

        $this->assertStringMatchesFormat($result, $expected);
    }

    /** @test */
    public function it_can_add_classes_to_icons()
    {
        $result = svg('hugeicons-abacus', 'w-6 h-6 text-gray-500')->toHtml();

        $expected = <<<SVG
        <svg class="hugeicon w-6 h-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9h3.5M17 9h1m-6-1v2m2.5-2v2m3.5 5h-6m-5 0H6m3.5-1v2"/></svg>
        SVG;

        $this->assertStringMatchesFormat($expected, $result);
    }

    /** @test */
    public function it_can_add_styles_to_icons()
    {
        $result = svg('hugeicons-abacus', ['style' => 'color: #555'])->toHtml();

        $expected = <<<SVG
        <svg style="color: #555" class="hugeicon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9h3.5M17 9h1m-6-1v2m2.5-2v2m3.5 5h-6m-5 0H6m3.5-1v2"/></svg>
        SVG;

        $this->assertStringMatchesFormat($expected, $result);
    }

    protected function getPackageProviders($app)
    {
        return [
            BladeIconsServiceProvider::class,
            BladeHugeiconsServiceProvider::class,
        ];
    }
}
