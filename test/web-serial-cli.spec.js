import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readProjectFile = filePath => fs.readFileSync(path.join(repoRoot, filePath), 'utf8');

describe('web serial CLI integration', () => {
    it('exports a web-aware serial adapter for command-driven tabs', () => {
        const mainJs = readProjectFile('js/main.js');
        const cliJs = readProjectFile('cli.js');
        const presetsJs = readProjectFile('presets.js');

        expect(mainJs).toContain('serial$1 as serialAdapter');
        expect(cliJs).toContain('serialAdapter as serial');
        expect(presetsJs).toContain('serialAdapter as serial');
    });

    it('normalizes WebSerial receive events back to the legacy { data } shape', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain('read_serial({ data:');
        expect(mainJs).toContain('event.detail?.buffer ?? event.detail');
    });

    it('lets CLI readers accept either legacy readInfo.data or raw ArrayBuffer input', () => {
        const cliJs = readProjectFile('cli.js');
        const presetsJs = readProjectFile('presets.js');

        expect(cliJs).toContain('new Uint8Array(readInfo.data ?? readInfo)');
        expect(presetsJs).toContain('new Uint8Array(readInfo.data ?? readInfo)');
    });
});
