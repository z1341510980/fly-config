import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readProjectFile = filePath => fs.readFileSync(path.join(repoRoot, filePath), 'utf8');

describe('pure web safeguards', () => {
    it('routes legacy serial imports through the web-aware adapter export', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain('serial$1 as b');
        expect(mainJs).not.toContain('serial$3 as b');
    });

    it('keeps a real browser serial device model instead of a single hard-coded webserial pseudo-port', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain('this.ports = []');
        expect(mainJs).toContain('navigator.serial.addEventListener');
        expect(mainJs).toContain('requestPermissionDevice');
        expect(mainJs).not.toContain("path: 'webserial'");
    });

    it('routes the selected browser serial port path through the connect action and supports permission requests', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain("portName.startsWith('requestpermission-serial')");
        expect(mainJs).toContain('await PortHandler$1.requestWebSerialPermission()');
        expect(mainJs).toContain('serial.connect(portName, { baudRate });');
    });

    it('fills browser chrome polyfill gaps used by logging, setup, and vtx flows', () => {
        const polyfillJs = readProjectFile('js/browser_chrome_polyfill.js');

        expect(polyfillJs).toContain('chromeApi.runtime.getURL');
        expect(polyfillJs).toContain('getWritableEntry');
        expect(polyfillJs).toContain('restoreEntry');
        expect(polyfillJs).toContain('retainEntry');
    });

    it('uses relative receiver MSP popup assets so the page works under subpath deployment', () => {
        const receiverMspHtml = readProjectFile('tabs/receiver_msp.html');

        expect(receiverMspHtml).toContain('../js/tabs/receiver_msp.js');
        expect(receiverMspHtml).toContain('../css/theme.css');
        expect(receiverMspHtml).not.toContain('src="/js/tabs/receiver_msp.js"');
        expect(receiverMspHtml).not.toContain('href="/css/theme.css"');
    });

    it('provides a browser popup fallback instead of relying only on chrome app windows', () => {
        const receiverJs = readProjectFile('receiver.js');
        const receiverMspJs = readProjectFile('js/tabs/receiver_msp.js');
        const watcherJs = readProjectFile('window_watchers.js');

        expect(receiverJs).toContain("window.open('./tabs/receiver_msp.html'");
        expect(receiverMspJs).toContain('window.close()');
        expect(watcherJs).toContain('win.contentWindow || win');
    });
});
