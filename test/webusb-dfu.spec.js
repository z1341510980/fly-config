import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readProjectFile = filePath => fs.readFileSync(path.join(repoRoot, filePath), 'utf8');

describe('webusb dfu support', () => {
    it('provides a browser chrome.usb shim backed by WebUSB primitives', () => {
        const polyfillJs = readProjectFile('js/browser_chrome_polyfill.js');

        expect(polyfillJs).toContain('chromeApi.usb');
        expect(polyfillJs).toContain('usb?.getDevices');
        expect(polyfillJs).toContain('usb?.requestDevice');
        expect(polyfillJs).toContain('controlTransferIn');
        expect(polyfillJs).toContain('controlTransferOut');
    });

    it('keeps a DFU port path available in web mode instead of hard-disabling USB DFU detection', () => {
        const mainJs = readProjectFile('js/main.js');

        expect(mainJs).toContain("path: 'DFU'");
        expect(mainJs).toContain("displayName: 'WebUSB DFU'");
        expect(mainJs).toContain('chrome.usb.getDevices(usbDevices');
    });

    it('falls back to interactive WebUSB device selection when no DFU device is pre-authorized', () => {
        const firmwareFlasherJs = readProjectFile('firmware_flasher.js');

        expect(firmwareFlasherJs).toContain('chrome.usb.requestDevice');
        expect(firmwareFlasherJs).toContain('openDevice(requestedDevice');
    });

    it('waits for a newly appeared DFU device instead of relying only on a stale availability flag', () => {
        const mainJs = readProjectFile('js/main.js');
        const firmwareFlasherJs = readProjectFile('firmware_flasher.js');

        expect(mainJs).toContain('PortHandler.waitForNewDfuDevice = async function');
        expect(mainJs).toContain('const knownDevices = new Map()');
        expect(mainJs).toContain('knownDevices.get(');
        expect(firmwareFlasherJs).toContain('PortHandler.waitForNewDfuDevice(10000, 100)');
    });

    it('guides the user through WebUSB DFU selection and retry flows', () => {
        const firmwareFlasherJs = readProjectFile('firmware_flasher.js');

        expect(firmwareFlasherJs).toContain('firmwareFlasherWebUsbGuideTitle');
        expect(firmwareFlasherJs).toContain('firmwareFlasherWebUsbRetryTitle');
        expect(firmwareFlasherJs).toContain('firmwareFlasherWebUsbChooseDevice');
    });
});
