<?php

declare(strict_types=1);

use Anodyne\Hugeicons\Hugeicons;

it('keeps enum values in sync with every bundled SVG', function () {
    $icons = array_map(
        fn (string $path) => 'hugeicons-'.basename($path, '.svg'),
        glob(__DIR__.'/../../resources/svg/*.svg'),
    );
    $values = array_map(fn (Hugeicons $icon) => $icon->value, Hugeicons::cases());

    sort($icons);
    sort($values);

    expect($icons)->not->toBeEmpty()
        ->and($values)->toBe($icons);
});

it('ships valid SVG documents with a consistent view box', function () {
    foreach (glob(__DIR__.'/../../resources/svg/*.svg') as $path) {
        $document = new DOMDocument;
        $this->assertTrue($document->load($path), $path);
        $this->assertSame('svg', $document->documentElement->localName, $path);
        $this->assertSame('http://www.w3.org/2000/svg', $document->documentElement->namespaceURI, $path);
        $this->assertSame('0 0 24 24', $document->documentElement->getAttribute('viewBox'), $path);
        $this->assertGreaterThan(0, $document->documentElement->childNodes->length, $path);
    }
});
