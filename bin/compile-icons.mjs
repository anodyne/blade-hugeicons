#!/usr/bin/env bun

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

const sourceInput = process.argv[2] ?? 'node_modules/@hugeicons/core-free-icons/dist/esm';
const outputInput = process.argv[3] ?? 'resources/svg';
const enumFileInput = process.argv[4] ?? 'src/Hugeicons.php';

const outputDir = path.resolve(projectRoot, outputInput);

const runScript = (scriptPath, args = []) => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
        cwd: projectRoot,
        stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('close', (code) => {
        if (code === 0) {
            resolve();
            return;
        }

        reject(new Error(`${path.basename(scriptPath)} exited with code ${code ?? 'unknown'}`));
    });
});

const optimizeSvgs = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const svgFiles = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))
        .map((entry) => path.join(directory, entry.name))
        .sort();

    for (const svgFile of svgFiles) {
        const original = await fs.readFile(svgFile, 'utf8');
        const optimized = optimize(original, {
            path: svgFile,
            multipass: true,
            plugins: ['preset-default'],
        });

        await fs.writeFile(svgFile, optimized.data, 'utf8');
    }
};

const main = async () => {
    console.log('Compiling Hugeicons...');
    await runScript(path.join(projectRoot, 'bin/compile.mjs'), [sourceInput, outputInput]);

    console.log('Optimizing SVGs...');
    await optimizeSvgs(outputDir);

    console.log('Generating enum...');
    await runScript(path.join(projectRoot, 'bin/generate-enum.mjs'), [outputInput, enumFileInput]);

    console.log('All done!');
};

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
