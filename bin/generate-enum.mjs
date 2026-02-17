#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

const iconDirectoryInput = process.argv[2] ?? 'resources/svg';
const enumFileInput = process.argv[3] ?? 'src/Hugeicons.php';

const iconDirectory = path.resolve(projectRoot, iconDirectoryInput);
const enumFile = path.resolve(projectRoot, enumFileInput);

const phpReservedWords = new Set([
    '__halt_compiler',
    'abstract',
    'and',
    'array',
    'as',
    'break',
    'callable',
    'case',
    'catch',
    'class',
    'clone',
    'const',
    'continue',
    'declare',
    'default',
    'die',
    'do',
    'echo',
    'else',
    'elseif',
    'empty',
    'enddeclare',
    'endfor',
    'endforeach',
    'endif',
    'endswitch',
    'endwhile',
    'enum',
    'eval',
    'exit',
    'extends',
    'final',
    'finally',
    'fn',
    'for',
    'foreach',
    'function',
    'global',
    'goto',
    'if',
    'implements',
    'include',
    'include_once',
    'instanceof',
    'insteadof',
    'interface',
    'isset',
    'list',
    'match',
    'namespace',
    'new',
    'or',
    'print',
    'private',
    'protected',
    'public',
    'readonly',
    'require',
    'require_once',
    'return',
    'self',
    'static',
    'switch',
    'throw',
    'trait',
    'try',
    'unset',
    'use',
    'var',
    'while',
    'xor',
    'yield',
    'int',
    'float',
    'bool',
    'string',
    'true',
    'false',
    'null',
    'void',
    'iterable',
    'object',
    'mixed',
    'never',
]);

const toStudlyCase = (slug) => slug
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

const toEnumCaseName = (slug) => {
    let caseName = toStudlyCase(slug);

    if (caseName === '') {
        caseName = 'Icon';
    }

    if (!/^[A-Za-z_]/.test(caseName)) {
        caseName = `Icon${caseName}`;
    }

    if (phpReservedWords.has(caseName.toLowerCase())) {
        caseName = `Icon${caseName}`;
    }

    return caseName;
};

const generateEnum = async () => {
    try {
        await fs.access(iconDirectory);
    } catch {
        throw new Error(`Icon directory does not exist: ${iconDirectory}`);
    }

    const iconFiles = (await fs.readdir(iconDirectory, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
        .map((entry) => entry.name)
        .sort();

    if (iconFiles.length === 0) {
        throw new Error(`No SVG icon files found in: ${iconDirectory}`);
    }

    const usedCaseNames = new Map();
    const cases = [];

    for (const iconFile of iconFiles) {
        const iconName = iconFile.replace(/\.svg$/i, '');
        const caseName = toEnumCaseName(iconName);
        const existing = usedCaseNames.get(caseName);

        if (existing && existing !== iconName) {
            throw new Error(`Enum case collision for "${caseName}" from "${existing}" and "${iconName}"`);
        }

        usedCaseNames.set(caseName, iconName);
        cases.push({ caseName, iconName });
    }

    const caseLines = cases.map(({ caseName, iconName }) => `    case ${caseName} = 'hugeicons-${iconName}';`);
    const fileContents = [
        '<?php',
        '',
        'declare(strict_types=1);',
        '',
        'namespace Anodyne\\Hugeicons;',
        '',
        'enum Hugeicons: string',
        '{',
        ...caseLines,
        '}',
        '',
    ].join('\n');

    await fs.mkdir(path.dirname(enumFile), { recursive: true });
    await fs.writeFile(enumFile, fileContents, 'utf8');

    console.log(`Generated ${cases.length} enum cases in ${enumFile}`);
};

generateEnum().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
