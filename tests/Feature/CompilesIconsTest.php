<?php

declare(strict_types=1);

use Anodyne\Hugeicons\Hugeicons;
use BladeUI\Icons\Exceptions\SvgNotFound;
use Illuminate\Support\Facades\Blade;

function expectedAbacusSvg(string $attributes = 'class="hugeicon"'): string
{
    return str_replace('class="hugeicon"', $attributes, <<<'SVG'
<svg class="hugeicon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 9h3.5M17 9h1m-6-1v2m2.5-2v2m3.5 5h-6m-5 0H6m3.5-1v2"/></svg>
SVG);
}

it('renders an icon with the default class', function () {
    expect(svg('hugeicons-abacus')->toHtml())->toBe(expectedAbacusSvg());
});

it('adds classes to icons', function () {
    expect(svg('hugeicons-abacus', 'w-6 h-6 text-gray-500')->toHtml())
        ->toBe(expectedAbacusSvg('class="hugeicon w-6 h-6 text-gray-500"'));
});

it('adds inline styles to icons', function () {
    expect(svg('hugeicons-abacus', ['style' => 'color: #555'])->toHtml())
        ->toBe(expectedAbacusSvg('style="color: #555" class="hugeicon"'));
});

it('renders an icon referenced by its enum value', function () {
    expect(svg(Hugeicons::Abacus->value)->toHtml())->toBe(expectedAbacusSvg());
});

it('compiles a Blade icon component', function () {
    expect(trim(Blade::render('<x-hugeicons-abacus />')))->toBe(expectedAbacusSvg());
});

it('passes classes and styles through Blade components', function () {
    $result = Blade::render('<x-hugeicons-abacus class="w-6 h-6" style="color: #555" />');
    $document = new DOMDocument;
    expect($document->loadXML(trim($result)))->toBeTrue();
    expect($document->documentElement->getAttribute('class'))->toBe('hugeicon w-6 h-6')
        ->and($document->documentElement->getAttribute('style'))->toBe('color: #555')
        ->and($document->getElementsByTagName('path')->length)->toBe(2);
});

it('compiles the Blade svg directive', function () {
    expect(trim(Blade::render("@svg('hugeicons-abacus')")))->toBe(expectedAbacusSvg());
});

it('rejects an unknown icon', function () {
    svg('hugeicons-this-icon-does-not-exist');
})->throws(SvgNotFound::class);
