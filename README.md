# Blade Hugeicons

<a href="https://github.com/anodyne/blade-hugeicons/actions?query=workflow%3ATests"><img src="https://github.com/anodyne/blade-hugeicons/workflows/Tests/badge.svg" alt="Tests"></a>
<a href="https://packagist.org/packages/anodyne/blade-hugeicons"><img src="https://poser.pugx.org/anodyne/blade-hugeicons/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/anodyne/blade-hugeicons"><img src="https://poser.pugx.org/anodyne/blade-hugeicons/d/total.svg" alt="Total Downloads"></a>

A package to easily make use of [Hugeicons](https://hugeicons.com/) in your Laravel Blade views.

For a full list of available icons see [the SVG directory](resources/svg) or preview them on the [web](https://hugeicons.com/icons/stroke-rounded).

## Requirements

- PHP 8.1 or higher
- Laravel 9.0 or higher

## Installation

```bash
composer require anodyne/blade-hugeicons
```

## Usage

Icons can be used a self-closing Blade components which will be compiled to SVG icons:

```blade
<x-hugeicons-abacus />
```

You can also pass classes to your icon components:

```blade
<x-hugeicons-abacus class="size-6 text-gray-500"/>
```

And even use inline styles:

```blade
<x-hugeicons-abacus style="color: #555"/>
```

### Raw SVG Icons

If you want to use the raw SVG icons as assets, you can publish them using:

```bash
php artisan vendor:publish --tag=blade-hugeicons --force
```

Then use them in your views like:

```blade
<img src="{{ asset('vendor/blade-hugeicons/abacus.svg') }}" width="10" height="10"/>
```

### Blade Icons

Blade Hugeicons uses Blade Icons under the hood. Please refer to [the Blade Icons readme](https://github.com/blade-ui-kit/blade-icons) for additional functionality.

### Enum

Blade Hugeicons includes an enum that maps every icon to an enum case. This allows for easily referencing specific icons from PHP. This is also helpful when using Hugeicons with a system like [Filament](https://filamentphp.com/) for referencing icons.

```php
use Anodyne\Hugeicons\Hugeicons;

svg(Hugeicons::AlertCircle->value);
```

## Changelog

Check out the [CHANGELOG](CHANGELOG.md) in this repository for all the recent changes.

## Maintainers

Blade Hugeicons was developed by [Anodyne Productions](https://anodyne-productions.com).

## License

Blade Hugeicons is open-sourced software licensed under [the MIT license](LICENSE.md).
