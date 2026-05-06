import { afterAll, describe, expect, it } from 'vitest';
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testOutDirName = 'dist-test-runtime-assets';
const testOutDir = path.join(repoRoot, testOutDirName);

const requiredRuntimeFiles = [
    'tabs/landing.html',
    'tabs/motors.html',
    'components/MotorOutputReordering/Body.html',
    'components/EscDshotDirection/Body.html',
    'images/light-wide-2.svg',
    'images/icons/cf_icon_position.png',
    'webfonts/fa-solid-900.woff2',
    'assets/opensans-regular-webfont.woff2',
];

afterAll(() => {
    fs.rmSync(testOutDir, { recursive: true, force: true });
});

describe('production build output', () => {
    it(
        'copies the pure web runtime assets into the deployable dist folder',
        async () => {
            await build({
                root: repoRoot,
                configFile: path.join(repoRoot, 'vite.config.js'),
                build: {
                    outDir: testOutDirName,
                    emptyOutDir: true,
                },
            });

            for (const filePath of requiredRuntimeFiles) {
                expect(fs.existsSync(path.join(testOutDir, filePath)), filePath).toBe(true);
            }

            const indexHtml = fs.readFileSync(path.join(testOutDir, 'index.html'), 'utf8');
            expect(indexHtml).toContain('./assets/');
            expect(indexHtml).not.toContain('src="/assets/');
            expect(indexHtml).not.toContain('href="/assets/');
        },
        120000,
    );
});
