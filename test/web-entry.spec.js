import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readProjectFile = filePath => fs.readFileSync(path.join(repoRoot, filePath), 'utf8');

describe('browser web entry', () => {
    it('uses the original configurator UI assets instead of the missing src entrypoints', () => {
        const indexHtml = readProjectFile('index.html');

        expect(indexHtml).toContain('./css/main.css');
        expect(indexHtml).toContain('./js/main.js');
        expect(indexHtml).toContain('./js/browser_chrome_polyfill.js');
        expect(indexHtml.indexOf('./js/browser_chrome_polyfill.js')).toBeLessThan(
            indexHtml.indexOf('./js/main.js'),
        );
        expect(indexHtml).not.toContain('/src/js/browserMain.js');
        expect(indexHtml).not.toContain('/src/js/utils/common.js');
    });

    it('treats an ordinary browser page as web mode without requiring Vite injection', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain('return !GUI.isNWJS() && !GUI.isCordova();');
        expect(mainJs).not.toContain('return !!import.meta.env;');
    });

    it('initializes a browser-visible Web Serial port option instead of bailing out', () => {
        const mainJs = readProjectFile('js/main.js');
        const portInitializeStart = mainJs.indexOf('PortHandler.initialize = function ()');
        const portReinitializeStart = mainJs.indexOf('PortHandler.reinitialize = function ()');
        const portInitialize = mainJs.slice(portInitializeStart, portReinitializeStart);

        expect(portInitialize).not.toContain("return 'not implemented'");
        expect(mainJs).toContain('PortHandler.initializeWebSerial = function ()');
        expect(portInitialize).toContain('this.initializeWebSerial();');
    });

    it('gives WebSerial a stable connection identity and preserves baudRate', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain("this.connectionType = 'serial';");
        expect(mainJs).toContain("connectionInfo.connectionId || 'webserial'");
        expect(mainJs).toContain('this.bitrate = options.baudRate;');
        expect(mainJs).toContain('new CustomEvent("connect", { detail: this.connectionInfo })');
    });

    it('keeps the WebSerial send API compatible with the existing MSP callback flow', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain('async send(data, callback)');
        expect(mainJs).toContain('callback({ bytesSent: data.byteLength });');
    });
});
