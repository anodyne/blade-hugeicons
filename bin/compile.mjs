#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

const sourceInput = process.argv[2] ?? 'node_modules/@hugeicons/core-free-icons/dist/esm';
const outputInput = process.argv[3] ?? 'resources/svg';

const sourceDir = path.resolve(projectRoot, sourceInput);
const outputDir = path.resolve(projectRoot, outputInput);

const svgRootAttributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
};

const toKebabCase = (value) => value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .toLowerCase();

const attributeNameMap = new Map([
    ['clipRule', 'clip-rule'],
    ['fillRule', 'fill-rule'],
    ['strokeDasharray', 'stroke-dasharray'],
    ['strokeDashoffset', 'stroke-dashoffset'],
    ['strokeLinecap', 'stroke-linecap'],
    ['strokeLinejoin', 'stroke-linejoin'],
    ['strokeMiterlimit', 'stroke-miterlimit'],
    ['strokeWidth', 'stroke-width'],
]);

const normalizeAttributeName = (name) => attributeNameMap.get(name) ?? name;

const escapeAttributeValue = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');

const serializeAttributes = (attributes) => Object.entries(attributes)
    .filter(([name, value]) => name !== 'key' && value !== undefined && value !== null)
    .map(([name, value]) => `${normalizeAttributeName(name)}="${escapeAttributeValue(value)}"`)
    .join(' ');

const serializeNode = (node) => {
    if (!Array.isArray(node) || node.length !== 2) {
        throw new Error(`Icon node is malformed: ${JSON.stringify(node)}`);
    }

    const [tagName, attributes] = node;

    if (typeof tagName !== 'string' || typeof attributes !== 'object' || attributes === null) {
        throw new Error(`Icon node is malformed: ${JSON.stringify(node)}`);
    }

    const attributeString = serializeAttributes(attributes);

    return attributeString === '' ? `<${tagName} />` : `<${tagName} ${attributeString} />`;
};

const clearOutputDirectory = async (directory) => {
    await fs.mkdir(directory, { recursive: true });

    const entries = await fs.readdir(directory, { withFileTypes: true });
    const svgFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.svg'));

    await Promise.all(svgFiles.map((entry) => fs.unlink(path.join(directory, entry.name))));
};

const compileIcons = async () => {
    try {
        await fs.access(sourceDir);
    } catch {
        throw new Error(`Source directory does not exist: ${sourceDir}`);
    }

    const iconModuleFiles = (await fs.readdir(sourceDir))
        .filter((file) => file.endsWith('Icon.js'))
        .sort();

    if (iconModuleFiles.length === 0) {
        throw new Error(`No icon modules were found in: ${sourceDir}`);
    }

    await clearOutputDirectory(outputDir);

    const rootAttributeString = serializeAttributes(svgRootAttributes);
    let compiledCount = 0;

    for (const iconModuleFile of iconModuleFiles) {
        const modulePath = path.join(sourceDir, iconModuleFile);
        const moduleUrl = pathToFileURL(modulePath).href;
        const iconModule = await import(moduleUrl);
        const iconNodes = iconModule.default;

        if (!Array.isArray(iconNodes)) {
            throw new Error(`Icon module does not export an icon array: ${iconModuleFile}`);
        }

        const iconName = iconModuleFile.replace(/Icon\.js$/, '');
        const outputFilename = `${toKebabCase(iconName)}.svg`;
        const outputPath = path.join(outputDir, outputFilename);

        const iconBody = iconNodes.map(serializeNode).join('');
        const svg = `<svg ${rootAttributeString}>${iconBody}</svg>\n`;

        await fs.writeFile(outputPath, svg, 'utf8');
        compiledCount += 1;
    }

    console.log(`Compiled ${compiledCount} icons to ${outputDir}`);
};

compileIcons().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
