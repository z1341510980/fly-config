import { $ } from './jquery.js';
import { i as i18n, g as get, s as set } from './localization.js';
import { b as serial, G as GUI, r as read_serial, M as MspHelper, d as MSP, e as MSPCodes, T as TABS, f as PortUsage, P as PortHandler, u as usbDevices, B as BuildApi, t as tracking, g as get$1, h as set$1 } from './js/main.js';
import { F as FC, C as CONFIGURATOR, c as checkChromeRuntimeError, A as API_VERSION_1_42, h as bit_check, u as urlExists, k as API_VERSION_1_39, e as API_VERSION_1_45, f as API_VERSION_1_46 } from './common.js';
import { g as gui_log } from './gui_log.js';
import { s as semver } from './semver.js';
import { g as generateFilename } from './generate_filename.js';
import { S as Sponsor } from './Sponsor.js';
import './@korzio.js';
import './i18next.js';
import './@babel.js';
import './i18next-xhr-backend.js';
import './window_watchers.js';
import './js/jquery.js';
import './jquery-ui.js';
import './jquery-textcomplete.js';
import './jquery-touchswipe.js';
import './select2.js';
import './multiple-select.js';
import './jbox.js';
import './vue.js';
import './@panter.js';
import './vue-runtime-helpers.js';
import './switchery-latest.js';
import './inflection.js';
import './short-unique-id.js';
import './lodash.debounce.js';
import './crypto-es.js';
import './three.js';
import './d3-transition.js';
import './d3-dispatch.js';
import './d3-timer.js';
import './d3-interpolate.js';
import './d3-color.js';
import './d3-selection.js';
import './d3-ease.js';
import './d3-zoom.js';
import './lru-cache.js';
import './yallist.js';

const CUSTOM_DEFAULTS_POINTER_ADDRESS = 0x08002800;
const BLOCK_SIZE = 16384;

function seek(firmware, address) {
    let index = 0;
    for (; index < firmware.data.length && address >= firmware.data[index].address + firmware.data[index].bytes; index++) {
        // empty for loop to increment index
    }

    const result = {
        lineIndex: index,
    };

    if (firmware.data[index] && address >= firmware.data[index].address) {
        result.byteIndex = address - firmware.data[index].address;
    }

    return result;
}

function readUint32(firmware, index) {
    let result = 0;
    for (let position = 0; position < 4; position++) {
        result += firmware.data[index.lineIndex].data[index.byteIndex++] << (8 * position);
        if (index.byteIndex >= firmware.data[index.lineIndex].bytes) {
            index.lineIndex++;
            index.byteIndex = 0;
        }
    }

    return result;
}

function getCustomDefaultsArea(firmware) {
    const result = {};

    const index = seek(firmware, CUSTOM_DEFAULTS_POINTER_ADDRESS);

    if (index.byteIndex === undefined) {
        return;
    }

    result.startAddress = readUint32(firmware, index);
    result.endAddress = readUint32(firmware, index);

    return result;
}

function generateData(firmware, input, startAddress) {
    let address = startAddress;

    const index = seek(firmware, address);

    if (index.byteIndex !== undefined) {
        throw new Error('Configuration area in firmware not free.');
    }

    let inputIndex = 0;
    while (inputIndex < input.length) {
        const remaining = input.length - inputIndex;
        const line = {
            address: address,
            bytes: BLOCK_SIZE > remaining ? remaining : BLOCK_SIZE,
            data: [],
        };

        if (firmware.data[index.lineIndex] && (line.address + line.bytes) > firmware.data[index.lineIndex].address) {
            throw new Error("Aborting data generation, free area too small.");
        }

        for (let i = 0; i < line.bytes; i++) {
            line.data.push(input.charCodeAt(inputIndex++));
        }

        address = address + line.bytes;

        firmware.data.splice(index.lineIndex++, 0, line);
    }

    firmware.bytes_total += input.length;
}

const CONFIG_LABEL = `Custom defaults inserted in`;

class ConfigInserter {

    insertConfig(firmware, config) {
        console.time(CONFIG_LABEL);

        const input = `# Betaflight\n${config}\0`;
        const customDefaultsArea = getCustomDefaultsArea(firmware);

        if (!customDefaultsArea || customDefaultsArea.endAddress - customDefaultsArea.startAddress === 0) {
            return false;
        } else if (input.length >= customDefaultsArea.endAddress - customDefaultsArea.startAddress) {
            throw new Error(`Custom defaults area too small (${customDefaultsArea.endAddress - customDefaultsArea.startAddress} bytes), ${input.length + 1} bytes needed.`);
        }

        generateData(firmware, input, customDefaultsArea.startAddress);

        console.timeEnd(CONFIG_LABEL);

        return true;
    }
}

/**
 * This seems to be mainly used in firmware flasher parts.
 */
const MSPConnectorImpl = function () {
    this.baud = undefined;
    this.port = undefined;
    this.onConnectCallback = undefined;
    this.onTimeoutCallback = undefined;
    this.onDisconnectCallback = undefined;
};

MSPConnectorImpl.prototype.connect = function (port, baud, onConnectCallback, onTimeoutCallback, onFailureCallback) {

    const self = this;
    self.port = port;
    self.baud = baud;
    self.onConnectCallback = onConnectCallback;
    self.onTimeoutCallback = onTimeoutCallback;
    self.onFailureCallback = onFailureCallback;

    serial.connect(self.port, {bitrate: self.baud}, function (openInfo) {
        if (openInfo) {
            const disconnectAndCleanup = function() {
                serial.disconnect(function(result) {
                    console.log('Disconnected');

                    MSP.clearListeners();

                    self.onTimeoutCallback();
                });

                MSP.disconnect_cleanup();
            };

            FC.resetState();

            // disconnect after 10 seconds with error if we don't get IDENT data
            GUI.timeout_add('msp_connector', function () {
                if (!CONFIGURATOR.connectionValid) {
                    gui_log(i18n.getMessage('noConfigurationReceived'));

                    disconnectAndCleanup();
                }
            }, 10000);

            serial.onReceive.addListener(read_serial);

            const mspHelper = new MspHelper();
            MSP.listen(mspHelper.process_data.bind(mspHelper));

            MSP.send_message(MSPCodes.MSP_API_VERSION, false, false, function () {
                CONFIGURATOR.connectionValid = true;

                GUI.timeout_remove('msp_connector');
                console.log('Connected');

                self.onConnectCallback();
            });
        } else {
            gui_log(i18n.getMessage('serialPortOpenFail'));
            self.onFailureCallback();
        }
    });
};

MSPConnectorImpl.prototype.disconnect = function(onDisconnectCallback) {
    self.onDisconnectCallback = onDisconnectCallback;

    serial.disconnect(function (result) {
        MSP.clearListeners();
        console.log('Disconnected');

        self.onDisconnectCallback(result);
    });

    MSP.disconnect_cleanup();
};

/*
    USB DFU uses:
    control transfers for communicating
    recipient is interface
    request type is class

    Descriptors seems to be broken in current chrome.usb API implementation (writing this while using canary 37.0.2040.0

    General rule to remember is that DFU doesn't like running specific operations while the device isn't in idle state
    that being said, it seems that certain level of CLRSTATUS is required before running another type of operation for
    example switching from DNLOAD to UPLOAD, etc, clearning the state so device is in dfuIDLE is highly recommended.
*/

// Task for the brave ones. There are quite a few shadow variables which clash when
// const or let are used. So need to run thorough tests when chaning `var`
/* eslint-disable no-var */
const STM32DFU_protocol = function () {
    this.callback = null;
    this.hex = null;
    this.verify_hex = [];

    this.handle = null; // connection handle

    this.request = {
        DETACH:     0x00, // OUT, Requests the device to leave DFU mode and enter the application.
        DNLOAD:     0x01, // OUT, Requests data transfer from Host to the device in order to load them into device internal Flash. Includes also erase commands
        UPLOAD:     0x02, // IN,  Requests data transfer from device to Host in order to load content of device internal Flash into a Host file.
        GETSTATUS:  0x03, // IN,  Requests device to send status report to the Host (including status resulting from the last request execution and the state the device will enter immediately after this request).
        CLRSTATUS:  0x04, // OUT, Requests device to clear error status and move to next step
        GETSTATE:   0x05, // IN,  Requests the device to send only the state it will enter immediately after this request.
        ABORT:      0x06,  // OUT, Requests device to exit the current state/operation and enter idle state immediately.
    };

    this.status = {
        OK:                 0x00, // No error condition is present.
        errTARGET:          0x01, // File is not targeted for use by this device.
        errFILE:            0x02, // File is for this device but fails some vendor-specific verification test
        errWRITE:           0x03, // Device is unable to write memory.
        errERASE:           0x04, // Memory erase function failed.
        errCHECK_ERASED:    0x05, // Memory erase check failed.
        errPROG:            0x06, // Program memory function failed.
        errVERIFY:          0x07, // Programmed memory failed verification.
        errADDRESS:         0x08, // Cannot program memory due to received address that is out of range.
        errNOTDONE:         0x09, // Received DFU_DNLOAD with wLength = 0, but device does not think it has all of the data yet.
        errFIRMWARE:        0x0A, // Device's firmware is corrupt. It cannot return to run-time (non-DFU) operations.
        errVENDOR:          0x0B, // iString indicates a vendor-specific error.
        errUSBR:            0x0C, // Device detected unexpected USB reset signaling.
        errPOR:             0x0D, // Device detected unexpected power on reset.
        errUNKNOWN:         0x0E, // Something went wrong, but the device does not know what it was.
        errSTALLEDPKT:      0x0F,  // Device stalled an unexpected request.
    };

    this.state = {
        appIDLE:                0, // Device is running its normal application.
        appDETACH:              1, // Device is running its normal application, has received the DFU_DETACH request, and is waiting for a USB reset.
        dfuIDLE:                2, // Device is operating in the DFU mode and is waiting for requests.
        dfuDNLOAD_SYNC:         3, // Device has received a block and is waiting for the host to solicit the status via DFU_GETSTATUS.
        dfuDNBUSY:              4, // Device is programming a control-write block into its nonvolatile memories.
        dfuDNLOAD_IDLE:         5, // Device is processing a download operation. Expecting DFU_DNLOAD requests.
        dfuMANIFEST_SYNC:       6, // Device has received the final block of firmware from the host and is waiting for receipt of DFU_GETSTATUS to begin the Manifestation phase; or device has completed the Manifestation phase and is waiting for receipt of DFU_GETSTATUS.
        dfuMANIFEST:            7, // Device is in the Manifestation phase. (Not all devices will be able to respond to DFU_GETSTATUS when in this state.)
        dfuMANIFEST_WAIT_RESET: 8, // Device has programmed its memories and is waiting for a USB reset or a power on reset. (Devices that must enter this state clear bitManifestationTolerant to 0.)
        dfuUPLOAD_IDLE:         9, // The device is processing an upload operation. Expecting DFU_UPLOAD requests.
        dfuERROR:               10, // An error has occurred. Awaiting the DFU_CLRSTATUS request.
    };

    this.chipInfo = null; // information about chip's memory
    this.flash_layout = { 'start_address': 0, 'total_size': 0, 'sectors': []};
    this.transferSize = 2048; // Default USB DFU transfer size for F3,F4 and F7
};

STM32DFU_protocol.prototype.connect = function (device, hex, options, callback) {
    const self = this;

    self.hex = hex;
    self.callback = callback;

    self.options = {
        erase_chip: false,
        exitDfu: false,
    };

    if (options.exitDfu) {
        self.options.exitDfu = true;
    } else if (options.erase_chip) {
        self.options.erase_chip = true;
    }

    // reset and set some variables before we start
    self.upload_time_start = new Date().getTime();
    self.verify_hex = [];

    // reset progress bar to initial state
    TABS.firmware_flasher.flashingMessage(null, TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL).flashProgress(0);

    const requestDfuDevice = function () {
        if (typeof chrome.usb.requestDevice !== 'function') {
            console.log('USB DFU not found');
            gui_log(i18n.getMessage('stm32UsbDfuNotFound'));
            callback?.(false);
            return;
        }

        chrome.usb.requestDevice(device, function (requestedDevice) {
            if (checkChromeRuntimeError() || !requestedDevice) {
                console.log('USB DFU not found');
                gui_log(i18n.getMessage('stm32UsbDfuNotFound'));
                callback?.(false);
                return;
            }

            self.openDevice(requestedDevice);
        });
    };

    chrome.usb.getDevices(device, function (result) {
        if (result.length) {
            console.log(`USB DFU detected with ID: ${result[0].device}`);

            self.openDevice(result[0]);
        } else if (typeof chrome.usb.requestDevice === 'function') {
            requestDfuDevice();
        } else {
            console.log('USB DFU not found');
            gui_log(i18n.getMessage('stm32UsbDfuNotFound'));
            callback?.(false);
        }
    });
};

STM32DFU_protocol.prototype.openDevice = function (device) {
    const self = this;

    chrome.usb.openDevice(device, function (handle) {
        if (checkChromeRuntimeError()) {
            console.log('Failed to open USB device!');
            gui_log(i18n.getMessage('usbDeviceOpenFail'));
            if (GUI.operating_system === 'Linux') {
                gui_log(i18n.getMessage('usbDeviceUdevNotice'));
            }
            return;
        }

        self.handle = handle;

        gui_log(i18n.getMessage('usbDeviceOpened', handle.handle.toString()));
        console.log(`Device opened with Handle ID: ${handle.handle}`);
        self.claimInterface(0);
    });
};

STM32DFU_protocol.prototype.closeDevice = function () {
    const self = this;

    chrome.usb.closeDevice(self.handle, function closed() {
        if (checkChromeRuntimeError()) {
            console.log('Failed to close USB device!');
            gui_log(i18n.getMessage('usbDeviceCloseFail'));
        } else {
            gui_log(i18n.getMessage('usbDeviceClosed'));
            console.log(`Device closed with Handle ID: ${self.handle.handle}`);
        }

        self.handle = null;
    });
};

STM32DFU_protocol.prototype.claimInterface = function (interfaceNumber) {
    const self = this;

    chrome.usb.claimInterface(self.handle, interfaceNumber, function claimed() {
        if (checkChromeRuntimeError()) {
            console.log('Failed to claim USB device!');
            self.cleanup();
        } else {
            console.log(`Claimed interface: ${interfaceNumber}`);

            if (self.options.exitDfu) {
                self.leave();
            } else {
                self.upload_procedure(0);
            }
        }
    });
};

STM32DFU_protocol.prototype.releaseInterface = function (interfaceNumber) {
    const self = this;

    chrome.usb.releaseInterface(self.handle, interfaceNumber, function released() {
        if (checkChromeRuntimeError()) {
            console.log(`Could not release interface: ${interfaceNumber}`);
        } else {
            console.log(`Released interface: ${interfaceNumber}`);
        }

        self.closeDevice();
    });
};

STM32DFU_protocol.prototype.resetDevice = function (callback) {
    chrome.usb.resetDevice(this.handle, function (result) {
        if (checkChromeRuntimeError()) {
            console.log(`Could not reset device: ${result}`);
        } else {
            console.log(`Reset Device: ${result}`);
        }

        callback?.();
    });
};

STM32DFU_protocol.prototype.getString = function (index, callback) {
    const self = this;

    chrome.usb.controlTransfer(self.handle, {
        'direction':    'in',
        'recipient':    'device',
        'requestType':  'standard',
        'request':      6,
        'value':        0x300 | index,
        'index':        0,  // specifies language
        'length':       255, // max length to retreive
    }, function (result) {
        if (checkChromeRuntimeError()) {
            console.log(`USB getString failed! ${result.resultCode}`);
            callback("", result.resultCode);
            return;
        }
        const view = new DataView(result.data);
        const length = view.getUint8(0);
        let descriptor = "";

        for (let i = 2; i < length; i += 2) {
            const charCode = view.getUint16(i, true);
            descriptor += String.fromCharCode(charCode);
        }
        callback(descriptor, result.resultCode);
    });
};

// interfaceNum = 0
STM32DFU_protocol.prototype.getInterfaceDescriptors = function (interfaceNum, callback) {
    const self = this;

    chrome.usb.getConfiguration(self.handle, function (config) {
        if (checkChromeRuntimeError()) {
            console.log('USB getConfiguration failed!');
            callback([], -200);
            return;
        }

        console.log(config);

        let interfaceID = 0;
        const descriptorStringArray = [];
        const getDescriptorString = function () {
            if (interfaceID < config.interfaces.length) {
                self.getInterfaceDescriptor(interfaceID, function (descriptor, resultCode) {
                    if (resultCode) {
                        callback([], resultCode);
                        return;
                    }
                    interfaceID++;
                    self.getString(descriptor.iInterface, function (descriptorString, resultCode) {
                        if (resultCode) {
                            callback([], resultCode);
                            return;
                        }
                        if (descriptor.bInterfaceNumber === interfaceNum) {
                            descriptorStringArray.push(descriptorString);
                        }
                        getDescriptorString();
                    });
                });
            } else {
                //console.log(descriptorStringArray);
                callback(descriptorStringArray, 0);
                return;
            }
        };
        getDescriptorString();
    });
};


STM32DFU_protocol.prototype.getInterfaceDescriptor = function (_interface, callback) {
    chrome.usb.controlTransfer(this.handle, {
        'direction':    'in',
        'recipient':    'device',
        'requestType':  'standard',
        'request':      6,
        'value':        0x200,
        'index':        0,
        'length':       18 + _interface * 9,
    }, function (result) {
        if (checkChromeRuntimeError()) {
            console.log(`USB getInterfaceDescriptor failed! ${result.resultCode}`);
            callback({}, result.resultCode);
            return;
        }

        const buf = new Uint8Array(result.data, 9 + _interface * 9);
        const descriptor = {
            'bLength':            buf[0],
            'bDescriptorType':    buf[1],
            'bInterfaceNumber':   buf[2],
            'bAlternateSetting':  buf[3],
            'bNumEndpoints':      buf[4],
            'bInterfaceClass':    buf[5],
            'bInterfaceSubclass': buf[6],
            'bInterfaceProtocol': buf[7],
            'iInterface':         buf[8],
        };

        callback(descriptor, result.resultCode);
    });
};

STM32DFU_protocol.prototype.getFunctionalDescriptor = function (_interface, callback) {
    chrome.usb.controlTransfer(this.handle, {
        'direction':    'in',
        'recipient':    'interface',
        'requestType':  'standard',
        'request':      6,
        'value':        0x2100,
        'index':        0,
        'length':       255,
    }, function (result) {
        if (checkChromeRuntimeError()) {
            console.log(`USB getFunctionalDescriptor failed! ${result.resultCode}`);
            callback({}, result.resultCode);
            return;
        }

        const buf = new Uint8Array(result.data);

        const descriptor = {
            'bLength':            buf[0],
            'bDescriptorType':    buf[1],
            'bmAttributes':       buf[2],
            'wDetachTimeOut':     (buf[4] << 8)|buf[3],
            'wTransferSize':      (buf[6] << 8)|buf[5],
            'bcdDFUVersion':      buf[7],
        };

        callback(descriptor, result.resultCode);
    });
};

STM32DFU_protocol.prototype.getChipInfo = function (_interface, callback) {
    const self = this;

    self.getInterfaceDescriptors(0, function (descriptors, resultCode) {
        if (resultCode) {
            callback({}, resultCode);
            return;
        }

        const parseDescriptor = function(str) {
            // ... 保持原有的 F303/AT32 等特定修正逻辑 ...
            if (str === "@External Flash /0x90000000/1001*128Kg,3*128Kg,20*128Ka") {
                str = "@External Flash /0x90000000/998*128Kg,1*128Kg,4*128Kg,21*128Ka";
            }
            if (str === "@Option byte    /0x1FFFC000/01*4096 g") {
                str = "@Option bytes    /0x1FFFC000/01*4096 g";
            }
            if (str === "@Option byte    /0x1FFFC000/01*512 g") {
                str = "@Option bytes    /0x1FFFC000/01*512 g";
            }

            // 新增：处理复合描述符逻辑
            // 使用正则拆分包含多个 @ 的字符串，例如 "@Internal... @External..."
            // (?=@) 是正向先行断言，表示在 @ 符号前进行拆分，但保留 @ 符号
            const subDescriptors = str.split(/(?=@)/).map(s => s.trim()).filter(s => s.length > 0);

            const results = [];

            subDescriptors.forEach(subStr => {
                const tmp0 = subStr.replace(/[^\x20-\x7E]+/g, "");
                const tmp1 = tmp0.split('/');

                // 只有当单个段落（如 Internal Flash 段）内部结构异常时才裁剪
                if (tmp1.length > 3) {
                    console.log(`parseDescriptor: shrinking long descriptor "${subStr}"`);
                    tmp1.length = 3;
                }

                if (!tmp1[0].startsWith("@")) {
                    return;
                }

                const type = tmp1[0].trim().replace('@', '');
                const start_address = parseInt(tmp1[1]);
                const sectors = [];
                let total_size = 0;
                const tmp2 = tmp1[2].split(',');

                if (tmp2.length >= 1) {
                    for (const tmp2Index of tmp2) {
                        const tmp3 = tmp2Index.split('*');
                        if (tmp3.length !== 2) continue;

                        const num_pages = parseInt(tmp3[0]);
                        let page_size = parseInt(tmp3[1]);

                        if (!page_size) continue;

                        const unit = tmp3[1].slice(-2, -1);
                        switch (unit) {
                            case 'M':
                                page_size *= 1024;
                            case 'K':
                                page_size *= 1024;
                                break;
                        }

                        sectors.push({
                            'num_pages': num_pages,
                            'start_address': start_address + total_size,
                            'page_size': page_size,
                            'total_size': num_pages * page_size,
                        });

                        total_size += num_pages * page_size;
                    }

                    results.push({
                        'type': type,
                        'start_address': start_address,
                        'sectors': sectors,
                        'total_size': total_size,
                    });
                }
            });

            return results; // 返回数组，因为一个 Descriptor 字符串现在可能解析出多个 Memory 对象
        };

        // 修改 reduce 逻辑以处理嵌套的数组
        const chipInfo = descriptors.map(parseDescriptor).reduce(function(o, v) {
            // v 现在是 parseDescriptor 返回的数组
            if (Array.isArray(v)) {
                v.forEach(memory => {
                    const key = memory.type.toLowerCase().trim().replace(/\s+/g, '_');
                    o[key] = memory;
                });
            }
            return o;
        }, {});

        callback(chipInfo, resultCode);
    });
};

STM32DFU_protocol.prototype.controlTransfer = function (direction, request, value, _interface, length, data, callback, _timeout) {
    const self = this;

    // timeout support was added in chrome v43
    let timeout;
    if (typeof _timeout === "undefined") {
        timeout = 0; // default is 0 (according to chrome.usb API)
    } else {
        timeout = _timeout;
    }

    if (direction === 'in') {
        // data is ignored
        chrome.usb.controlTransfer(self.handle, {
            'direction':    'in',
            'recipient':    'interface',
            'requestType':  'class',
            'request':      request,
            'value':        value,
            'index':        _interface,
            'length':       length,
            'timeout':      timeout,
        }, function (result) {
            if (checkChromeRuntimeError()) {
                console.log(`USB controlTransfer IN failed for request ${request}!`);
            }
            if (result.resultCode) console.log(`USB transfer result code: ${result.resultCode}`);

            const buf = new Uint8Array(result.data);
            callback(buf, result.resultCode);
        });
    } else {
        // length is ignored
        let arrayBuf;

        if (data) {
            arrayBuf = new ArrayBuffer(data.length);
            const arrayBufView = new Uint8Array(arrayBuf);
            arrayBufView.set(data);
        } else {
            arrayBuf = new ArrayBuffer(0);
        }

        chrome.usb.controlTransfer(self.handle, {
            'direction':    'out',
            'recipient':    'interface',
            'requestType':  'class',
            'request':      request,
            'value':        value,
            'index':        _interface,
            'data':         arrayBuf,
            'timeout':      timeout,
        }, function (result) {
            if (checkChromeRuntimeError()) {
                console.log(`USB controlTransfer OUT failed for request ${request}!`);
            }
            if (result.resultCode) console.log(`USB transfer result code: ${result.resultCode}`);

            callback(result);
        });
    }
};

// routine calling DFU_CLRSTATUS until device is in dfuIDLE state
STM32DFU_protocol.prototype.clearStatus = function (callback) {
    const self = this;

    function check_status() {
        self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
            let delay = 0;

            if (data[4] === self.state.dfuIDLE) {
                callback(data);
            } else {
                if (data.length) {
                    delay = data[1] | (data[2] << 8) | (data[3] << 16);
                }
                setTimeout(clear_status, delay);
            }
        });
    }

    function clear_status() {
        self.controlTransfer('out', self.request.CLRSTATUS, 0, 0, 0, 0, check_status);
    }

    check_status();
};

STM32DFU_protocol.prototype.loadAddress = function (address, callback, abort) {
    const self = this;

    self.controlTransfer('out', self.request.DNLOAD, 0, 0, 0, [0x21, address & 0xff, (address >> 8) & 0xff, (address >> 16) & 0xff, (address >> 24) & 0xff], function () {
        self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
            if (data[4] === self.state.dfuDNBUSY) {
                const delay = data[1] | (data[2] << 8) | (data[3] << 16);

                setTimeout(function () {
                    self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                        if (data[4] === self.state.dfuDNLOAD_IDLE) {
                            callback(data);
                        } else {
                            console.log('Failed to execute address load');
                            if (typeof abort === "undefined" || abort) {
                                self.cleanup();
                            } else {
                                callback(data);
                            }
                        }
                    });
                }, delay);
            } else {
                console.log('Failed to request address load');
                self.cleanup();
            }
        });
    });
};

// first_array = usually hex_to_flash array
// second_array = usually verify_hex array
// result = true/false
STM32DFU_protocol.prototype.verify_flash = function (first_array, second_array) {
    for (let i = 0; i < first_array.length; i++) {
        if (first_array[i] !== second_array[i]) {
            console.log(`Verification failed on byte: ${i} expected: 0x${first_array[i].toString(16)} received: 0x${second_array[i].toString(16)}`);
            return false;
        }
    }

    console.log(`Verification successful, matching: ${first_array.length} bytes`);

    return true;
};

STM32DFU_protocol.prototype.isBlockUsable = function(startAddress, length) {
    const self = this;

    let result = false;

    let searchAddress = startAddress;
    let remainingLength = length;

    let restart;

    do {
        restart = false;

        for (const sector of self.flash_layout.sectors) {
            const sectorStart = sector.start_address;
            const sectorLength = sector.num_pages * sector.page_size;
            const sectorEnd = sectorStart + sectorLength - 1; // - 1 for inclusive

            const addressInSector = (searchAddress >= sectorStart) && (searchAddress <= sectorEnd);

            if (addressInSector) {
                const endAddress = searchAddress + remainingLength - 1; // - 1 for inclusive

                const endAddressInSector = (endAddress <= sectorEnd);
                if (endAddressInSector) {
                    result = true;
                    restart = false;
                    break;
                }

                // some of the block is in this sector, search for the another sector that contains the next part of the block
                searchAddress = sectorEnd + 1;
                remainingLength -= sectorLength;
                restart = true;
                break;
            }
        }
    } while (restart);

    return result;
};

STM32DFU_protocol.prototype.upload_procedure = function (step) {
    const self = this;

    let blocks;
    let address;
    let wBlockNum;

    switch (step) {
        case 0:
            self.getChipInfo(0, function (chipInfo, resultCode) {
                if (resultCode !== 0 || typeof chipInfo === "undefined") {
                    console.log(`Failed to detect chip info, resultCode: ${resultCode}`);
                    self.cleanup();
                } else {
                    console.log(chipInfo);
                    let nextAction;

                    if(typeof chipInfo.internal_flash !== "undefined" && typeof chipInfo.external_flash !== "undefined"){
                        // 情况 A: 两个都有，合并它们
                        nextAction = 1; // 默认使用 internal 的流程（带 Option Bytes 逻辑）
                        self.chipInfo = chipInfo;

                        // 关键：创建一个合并后的布局对象
                        self.flash_layout = {
                            'type': 'Combined Flash',
                            'start_address': chipInfo.internal_flash.start_address,
                            'sectors': [].concat(chipInfo.internal_flash.sectors, chipInfo.external_flash.sectors),
                            'total_size': chipInfo.internal_flash.total_size + chipInfo.external_flash.total_size
                        };

                        console.log("检测到内外 Flash，已合并布局用于校验。总容量: " + (self.flash_layout.total_size / 1024) + "KB");
                        console.log(self.flash_layout);

                        // 容量校验：使用合并后的总容量
                        if (TABS.firmware_flasher.parsed_hex.bytes_total > self.flash_layout.total_size) {
                            const firmwareSize = TABS.firmware_flasher.parsed_hex.bytes_total;
                            const boardSize = self.flash_layout.total_size;
                            console.log(`Firmware size ${firmwareSize} exceeds total memory size ${boardSize}`);
                        }
                    }
                    else if (typeof chipInfo.internal_flash !== "undefined") {
                        // internal flash
                        nextAction = 1;

                        self.chipInfo = chipInfo;
                        self.flash_layout = chipInfo.internal_flash;

                        if (TABS.firmware_flasher.parsed_hex.bytes_total > chipInfo.internal_flash.total_size) {
                            const firmwareSize = TABS.firmware_flasher.parsed_hex.bytes_total;
                            const boardSize = chipInfo.internal_flash.total_size;
                            const bareBoard = TABS.firmware_flasher.bareBoard;
                            console.log(`Firmware size ${firmwareSize} exceeds board memory size ${boardSize} (${bareBoard})`);
                        }

                    }
                    else if (typeof chipInfo.external_flash !== "undefined") {
                        // external flash
                        nextAction = 2; // no option bytes

                        self.chipInfo = chipInfo;
                        self.flash_layout = chipInfo.external_flash;
                    } else {
                        console.log('Failed to detect internal or external flash');
                        self.cleanup();
                    }

                    if (typeof nextAction !== "undefined") {
                        gui_log(i18n.getMessage('dfu_device_flash_info', (self.flash_layout.total_size / 1024).toString()));

                        // // 1. 检查 HEX 文件是否包含以 0x38000000 起始的数据块
                        // const EXTERNAL_FLASH_START = 0x38000000;
                        // const hasExternalData = self.hex.data.some(block => block.address === EXTERNAL_FLASH_START);

                        // if (hasExternalData) {
                        //     console.log("检测到片外 Flash 数据 (0x38000000)，正在动态注入布局...");

                        //     // 2. 构造片外 Flash 规格 (512KB, 4KB/Sector, 128 Sectors)
                        //     // 必须匹配 parseDescriptor 产生的结构以兼容 isBlockUsable
                        //     const PAGE_SIZE = 4096; // 4KB
                        //     const NUM_PAGES = 128;

                        //     const externalSector = {
                        //         'num_pages': NUM_PAGES,           // 128个页面
                        //         'start_address': EXTERNAL_FLASH_START,
                        //         'page_size': PAGE_SIZE,          // 每页 4KB
                        //         'total_size': NUM_PAGES * PAGE_SIZE,    // 总计 512KB
                        //         'is_external': true // 增加一个标记
                        //     }

                        //     // 3. 将新扇区注入到当前的 flash_layout 中
                        //     // 注意：isBlockUsable 遍历的是 self.flash_layout.sectors
                        //     self.flash_layout.sectors.push(externalSector);

                        //     // 更新总大小（可选，主要用于日志显示）
                        //     self.flash_layout.total_size += externalSector.total_size;

                        //     console.log(`已添加片外 Flash 布局: 起始 0x${EXTERNAL_FLASH_START.toString(16)}, 大小 ${externalSector.total_size / 1024}KB`);
                        // }


                        // verify all addresses in the hex are writable.

                        const unusableBlocks = [];

                        for (const block of self.hex.data) {
                            const usable = self.isBlockUsable(block.address, block.bytes);
                            if (!usable) {
                                unusableBlocks.push(block);
                            }
                        }

                        if (unusableBlocks.length > 0) {
                            gui_log(i18n.getMessage('dfu_hex_address_errors'));
                            TABS.firmware_flasher.flashingMessage(i18n.getMessage('dfu_hex_address_errors'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);
                            self.leave();
                        } else {
                            self.getFunctionalDescriptor(0, function (descriptor, resultCode) {
                                self.transferSize = resultCode ? 2048 : descriptor.wTransferSize;
                                console.log(`Using transfer size: ${self.transferSize}`);
                                self.clearStatus(function () {
                                    self.upload_procedure(nextAction);
                                });
                            });
                        }
                    }
                }
            });
            break;
        case 1: {
            if (typeof self.chipInfo.option_bytes === "undefined") {
                console.log('Failed to detect option bytes');
                self.cleanup();
            }

            const unprotect = function() {
                console.log('Initiate read unprotect');
                const messageReadProtected = i18n.getMessage('stm32ReadProtected');
                gui_log(messageReadProtected);
                TABS.firmware_flasher.flashingMessage(messageReadProtected, TABS.firmware_flasher.FLASH_MESSAGE_TYPES.ACTION);

                self.controlTransfer('out', self.request.DNLOAD, 0, 0, 0, [0x92], function () { // 0x92 initiates read unprotect
                    self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                        if (data[4] === self.state.dfuDNBUSY) { // completely normal
                            const delay = data[1] | (data[2] << 8) | (data[3] << 16);
                            const total_delay = delay + 20000; // wait at least 20 seconds to make sure the user does not disconnect the board while erasing the memory
                            let timeSpentWaiting = 0;
                            const incr = 1000; // one sec increments
                            const waitForErase = setInterval(function () {

                                TABS.firmware_flasher.flashProgress(Math.min(timeSpentWaiting / total_delay, 1) * 100);

                                if (timeSpentWaiting < total_delay) {
                                    timeSpentWaiting += incr;
                                    return;
                                }
                                clearInterval(waitForErase);
                                self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data, error) { // should stall/disconnect
                                    if (error) { // we encounter an error, but this is expected. should be a stall.
                                        console.log('Unprotect memory command ran successfully. Unplug flight controller. Connect again in DFU mode and try flashing again.');
                                        gui_log(i18n.getMessage('stm32UnprotectSuccessful'));

                                        const messageUnprotectUnplug = i18n.getMessage('stm32UnprotectUnplug');
                                        gui_log(messageUnprotectUnplug);

                                        TABS.firmware_flasher.flashingMessage(messageUnprotectUnplug, TABS.firmware_flasher.FLASH_MESSAGE_TYPES.ACTION)
                                                             .flashProgress(0);

                                    } else { // unprotecting the flight controller did not work. It did not reboot.
                                        console.log('Failed to execute unprotect memory command');

                                        gui_log(i18n.getMessage('stm32UnprotectFailed'));
                                        TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32UnprotectFailed'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);
                                        console.log(data);
                                        self.cleanup();
                                    }
                                }, 2000); // this should stall/disconnect anyways. so we only wait 2 sec max.
                            }, incr);
                        } else {
                                console.log('Failed to initiate unprotect memory command');
                                let messageUnprotectInitFailed = i18n.getMessage('stm32UnprotectInitFailed');
                                gui_log(messageUnprotectInitFailed);
                                TABS.firmware_flasher.flashingMessage(messageUnprotectInitFailed, TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);
                                self.cleanup();
                        }
                    });
                });
            };

            const tryReadOB = function() {
                // the following should fail if read protection is active
                self.controlTransfer('in', self.request.UPLOAD, 2, 0, self.chipInfo.option_bytes.total_size, 0, function (ob_data, errcode) {
                    if (errcode) {
                        // TODO: this was undefined, guessing with how it usually works it should be 1
                        const errcode1 = 1;
                        console.log(`USB transfer error while reading option bytes: ${errcode1}`);
                        self.cleanup();
                        return;
                    }

                    self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                        if (data[4] === self.state.dfuUPLOAD_IDLE && ob_data.length === self.chipInfo.option_bytes.total_size) {
                            console.log('Option bytes read successfully');
                            console.log('Chip does not appear read protected');
                            gui_log(i18n.getMessage('stm32NotReadProtected'));
                            // it is pretty safe to continue to erase flash
                            self.clearStatus(function() {
                                self.upload_procedure(2);
                            });
                            /* // this snippet is to protect the flash memory (only for the brave)
                            ob_data[1] = 0x0;
                            var writeOB = function() {
                                self.controlTransfer('out', self.request.DNLOAD, 2, 0, 0, ob_data, function () {
                                    self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                                        if (data[4] == self.state.dfuDNBUSY) {
                                        var delay = data[1] | (data[2] << 8) | (data[3] << 16);

                                        setTimeout(function () {
                                            self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                                            if (data[4] == self.state.dfuDNLOAD_IDLE) {
                                                console.log('Failed to write ob');
                                                self.cleanup();
                                            } else {
                                                console.log('Success writing ob');
                                                self.cleanup();
                                            }
                                            });
                                        }, delay);
                                        } else {
                                        console.log('Failed to initiate write ob');
                                        self.cleanup();
                                        }
                                    });
                                });
                            }
                            self.clearStatus(function () {
                                self.loadAddress(self.chipInfo.option_bytes.start_address, function () {
                                    self.clearStatus(writeOB);
                                });
                            }); // */
                        } else {
                            console.log('Option bytes could not be read. Quite possibly read protected.');
                            self.clearStatus(unprotect);
                        }
                    });
                });
            };

            const initReadOB = function (loadAddressResponse) {
                // contrary to what is in the docs. Address load should in theory work even if read protection is active
                // if address load fails with this specific error though, it is very likely bc of read protection
                if (loadAddressResponse[4] === self.state.dfuERROR && loadAddressResponse[0] === self.status.errVENDOR) {
                    // read protected
                    gui_log(i18n.getMessage('stm32AddressLoadFailed'));
                    self.clearStatus(unprotect);
                    return;
                } else if (loadAddressResponse[4] === self.state.dfuDNLOAD_IDLE) {
                    console.log('Address load for option bytes sector succeeded.');
                    self.clearStatus(tryReadOB);
                } else {
                    gui_log(i18n.getMessage('stm32AddressLoadUnknown'));
                    self.cleanup();
                }
            };

            self.clearStatus(function () {
            // load address fails if read protection is active unlike as stated in the docs
            self.loadAddress(self.chipInfo.option_bytes.start_address, initReadOB, false);
            });
            break;
        }
        case 2: {
            // erase
                // find out which pages to erase
                const erase_pages = [];
                for (let i = 0; i < self.flash_layout.sectors.length; i++) {
                    for (let j = 0; j < self.flash_layout.sectors[i].num_pages; j++) {
                        if (self.options.erase_chip) {
                            // full chip erase
                            erase_pages.push({'sector': i, 'page': j});
                        } else {
                            // local erase
                            const page_start = self.flash_layout.sectors[i].start_address + j * self.flash_layout.sectors[i].page_size;
                            const page_end = page_start + self.flash_layout.sectors[i].page_size - 1;
                            for (const hexData of self.hex.data) {
                                const starts_in_page = hexData.address >= page_start && hexData.address <= page_end;
                                const end_address = hexData.address + hexData.bytes - 1;
                                const ends_in_page = end_address >= page_start && end_address <= page_end;
                                const spans_page = hexData.address < page_start && end_address > page_end;

                                if (starts_in_page || ends_in_page || spans_page) {
                                    const idx = erase_pages.findIndex(function (element, index, array) {
                                        return element.sector === i && element.page === j;
                                    });
                                    if (idx === -1)
                                        erase_pages.push({'sector': i, 'page': j});
                                }
                            }
                        }
                    }
                }

                if (erase_pages.length === 0) {
                    console.log('Aborting, No flash pages to erase');
                    TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32InvalidHex'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);
                    self.cleanup();
                    break;
                }


                TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32Erase'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);
                console.log('Executing local chip erase', erase_pages);

                let page = 0;
                let total_erased = 0; // bytes

                const erase_page_next = function() {
                    TABS.firmware_flasher.flashProgress((page + 1) / erase_pages.length * 100);
                    page++;

                    if (page === erase_pages.length) {
                        console.log("Erase: complete");
                        gui_log(i18n.getMessage('dfu_erased_kilobytes', (total_erased / 1024).toString()));
                        self.upload_procedure(4);
                    } else {
                        erase_page();
                    }
                };

                const erase_page = function() {
                    const page_addr = erase_pages[page].page * self.flash_layout.sectors[erase_pages[page].sector].page_size
                            + self.flash_layout.sectors[erase_pages[page].sector].start_address;
                    const cmd = [0x41, page_addr & 0xff, (page_addr >> 8) & 0xff, (page_addr >> 16) & 0xff, (page_addr >> 24) & 0xff];
                    total_erased += self.flash_layout.sectors[erase_pages[page].sector].page_size;
                    console.log(`Erasing. sector ${erase_pages[page].sector}, page ${erase_pages[page].page} @ 0x${page_addr.toString(16)}`);

                    self.controlTransfer('out', self.request.DNLOAD, 0, 0, 0, cmd, function () {
                        self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                            if (data[4] === self.state.dfuDNBUSY) { // completely normal
                                const delay = data[1] | (data[2] << 8) | (data[3] << 16);

                                setTimeout(function () {
                                    self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {

                                        if (data[4] === self.state.dfuDNBUSY) {

                                            //
                                            // H743 Rev.V (probably other H7 Rev.Vs also) remains in dfuDNBUSY state after the specified delay time.
                                            // STM32CubeProgrammer deals with behavior with an undocumented procedure as follows.
                                            //     1. Issue DFU_CLRSTATUS, which ends up with (14,10) = (errUNKNOWN, dfuERROR)
                                            //     2. Issue another DFU_CLRSTATUS which delivers (0,2) = (OK, dfuIDLE)
                                            //     3. Treat the current erase successfully finished.
                                            // Here, we call clarStatus to get to the dfuIDLE state.
                                            //

                                            console.log('erase_page: dfuDNBUSY after timeout, clearing');

                                            self.clearStatus(function() {
                                                self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                                                    if (data[4] === self.state.dfuIDLE) {
                                                        erase_page_next();
                                                    } else {
                                                        console.log(`Failed to erase page 0x${page_addr.toString(16)} (did not reach dfuIDLE after clearing`);
                                                        self.cleanup();
                                                    }
                                                });
                                            });
                                        } else if (data[4] === self.state.dfuDNLOAD_IDLE) {
                                            erase_page_next();
                                        } else {
                                            console.log(`Failed to erase page 0x${page_addr.toString(16)}`);
                                            self.cleanup();
                                        }
                                    });
                                }, delay);
                            } else {
                                console.log(`Failed to initiate page erase, page 0x${page_addr.toString(16)}`);
                                self.cleanup();
                            }
                        });
                    });
                };

                // start
                erase_page();
            break;
        }
        case 4: {
            // upload
            // we dont need to clear the state as we are already using DFU_DNLOAD
            console.log('Writing data ...');
            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32Flashing'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

            blocks = self.hex.data.length - 1;
            let flashing_block = 0;
            address = self.hex.data[flashing_block].address;

            let bytes_flashed = 0;
            let bytes_flashed_total = 0; // used for progress bar
            wBlockNum = 2; // required by DFU

            const write = function () {
                if (bytes_flashed < self.hex.data[flashing_block].bytes) {
                    const bytes_to_write = ((bytes_flashed + self.transferSize) <= self.hex.data[flashing_block].bytes) ? self.transferSize : (self.hex.data[flashing_block].bytes - bytes_flashed);

                    const data_to_flash = self.hex.data[flashing_block].data.slice(bytes_flashed, bytes_flashed + bytes_to_write);

                    address += bytes_to_write;
                    bytes_flashed += bytes_to_write;
                    bytes_flashed_total += bytes_to_write;

                    self.controlTransfer('out', self.request.DNLOAD, wBlockNum++, 0, 0, data_to_flash, function () {
                        self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                            if (data[4] === self.state.dfuDNBUSY) {
                                const delay = data[1] | (data[2] << 8) | (data[3] << 16);

                                setTimeout(function () {
                                    self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                                        if (data[4] === self.state.dfuDNLOAD_IDLE) {
                                            // update progress bar
                                            TABS.firmware_flasher.flashProgress(bytes_flashed_total / (self.hex.bytes_total * 2) * 100);

                                            // flash another page
                                            write();
                                        } else {
                                            console.log(`Failed to write ${bytes_to_write}bytes to 0x${address.toString(16)}`);
                                            self.cleanup();
                                        }
                                    });
                                }, delay);
                            } else {
                                console.log(`Failed to initiate write ${bytes_to_write}bytes to 0x${address.toString(16)}`);
                                self.cleanup();
                            }
                        });
                    });
                } else {
                    if (flashing_block < blocks) {
                        // move to another block
                        flashing_block++;

                        address = self.hex.data[flashing_block].address;
                        bytes_flashed = 0;
                        wBlockNum = 2;

                        self.loadAddress(address, write);
                    } else {
                        // all blocks flashed
                        console.log('Writing: done');

                        // proceed to next step
                        self.upload_procedure(5);
                    }
                }
            };

            // start
            self.loadAddress(address, write);

            break;
        }
        case 5: {
            // verify
            console.log('Verifying data ...');
            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32Verifying'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

            blocks = self.hex.data.length - 1;
            let reading_block = 0;
            address = self.hex.data[reading_block].address;

            let bytes_verified = 0;
            let bytes_verified_total = 0; // used for progress bar
            wBlockNum = 2; // required by DFU

            // initialize arrays
            for (let i = 0; i <= blocks; i++) {
                self.verify_hex.push([]);
            }

            // start
            self.clearStatus(function () {
                self.loadAddress(address, function () {
                    self.clearStatus(read);
                });
            });

            const read = function () {
                if (bytes_verified < self.hex.data[reading_block].bytes) {
                    const bytes_to_read = ((bytes_verified + self.transferSize) <= self.hex.data[reading_block].bytes) ? self.transferSize : (self.hex.data[reading_block].bytes - bytes_verified);

                    self.controlTransfer('in', self.request.UPLOAD, wBlockNum++, 0, bytes_to_read, 0, function (data, code) {
                        for (const piece of data) {
                            self.verify_hex[reading_block].push(piece);
                        }

                        address += bytes_to_read;
                        bytes_verified += bytes_to_read;
                        bytes_verified_total += bytes_to_read;

                        // update progress bar
                        TABS.firmware_flasher.flashProgress((self.hex.bytes_total + bytes_verified_total) / (self.hex.bytes_total * 2) * 100);

                        // verify another page
                        read();
                    });
                } else {
                    if (reading_block < blocks) {
                        // move to another block
                        reading_block++;

                        address = self.hex.data[reading_block].address;
                        bytes_verified = 0;
                        wBlockNum = 2;

                        self.clearStatus(function () {
                            self.loadAddress(address, function () {
                                self.clearStatus(read);
                            });
                        });
                    } else {
                        // all blocks read, verify

                        let verify = true;
                        for (let i = 0; i <= blocks; i++) {
                            verify = self.verify_flash(self.hex.data[i].data, self.verify_hex[i]);

                            if (!verify) break;
                        }

                        if (verify) {
                            console.log('Programming: SUCCESSFUL');
                            // update progress bar
                            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ProgrammingSuccessful'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.VALID);

                            // proceed to next step
                            self.leave();
                        } else {
                            console.log('Programming: FAILED');
                            // update progress bar
                            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ProgrammingFailed'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);

                            // disconnect
                            self.cleanup();
                        }
                    }
                }
            };
            break;
        }
    }
};

STM32DFU_protocol.prototype.leave = function () {
    // leave DFU

    const self = this;

    let address;
    if (self.hex) {
        address = self.hex.data[0].address;
    } else {
        // Assuming we're running off internal flash
        address =  0x08000000;
    }

    self.clearStatus(function () {
        self.loadAddress(address, function () {
            // 'downloading' 0 bytes to the program start address followed by a GETSTATUS is used to trigger DFU exit on STM32
            self.controlTransfer('out', self.request.DNLOAD, 0, 0, 0, 0, function () {
                self.controlTransfer('in', self.request.GETSTATUS, 0, 0, 6, 0, function (data) {
                    self.cleanup();
                });
            });
        });
    });
};

STM32DFU_protocol.prototype.cleanup = function () {
    const self = this;

    self.releaseInterface(0);

    GUI.connect_lock = false;

    const timeSpent = new Date().getTime() - self.upload_time_start;

    console.log(`Script finished after: ${timeSpent / 1000} seconds`);

    if (self.callback) {
        self.callback();
    }
};

// initialize object
const STM32DFU = new STM32DFU_protocol();

/*
    STM32 F103 serial bus seems to properly initialize with quite a huge auto-baud range
    From 921600 down to 1200, i don't recommend getting any lower then that
    Official "specs" are from 115200 to 1200

    popular choices - 921600, 460800, 256000, 230400, 153600, 128000, 115200, 57600, 38400, 28800, 19200
*/

const STM32_protocol = function () {
    this.baud = null;
    this.options = {};
    this.callback = null;
    this.hex = null;
    this.verify_hex = [];

    this.receive_buffer = [];

    this.bytesToRead = 0;
    this.read_callback = null;

    this.upload_time_start = 0;
    this.upload_process_alive = false;

    this.msp_connector = new MSPConnectorImpl();

    this.status = {
        ACK:    0x79, // y
        NACK:   0x1F,
    };

    this.command = {
        get:                    0x00, // Gets the version and the allowed commands supported by the current version of the bootloader
        get_ver_r_protect_s:    0x01, // Gets the bootloader version and the Read Protection status of the Flash memory
        get_ID:                 0x02, // Gets the chip ID
        read_memory:            0x11, // Reads up to 256 bytes of memory starting from an address specified by the application
        go:                     0x21, // Jumps to user application code located in the internal Flash memory or in SRAM
        write_memory:           0x31, // Writes up to 256 bytes to the RAM or Flash memory starting from an address specified by the application
        erase:                  0x43, // Erases from one to all the Flash memory pages
        extended_erase:         0x44, // Erases from one to all the Flash memory pages using two byte addressing mode (v3.0+ usart).
        write_protect:          0x63, // Enables the write protection for some sectors
        write_unprotect:        0x73, // Disables the write protection for all Flash memory sectors
        readout_protect:        0x82, // Enables the read protection
        readout_unprotect:      0x92,  // Disables the read protection
    };

    // Erase (x043) and Extended Erase (0x44) are exclusive. A device may support either the Erase command or the Extended Erase command but not both.

    this.available_flash_size = 0;
    this.page_size = 0;
    this.useExtendedErase = false;
};

// no input parameters
STM32_protocol.prototype.connect = function (port, baud, hex, options, callback) {
    const self = this;
    self.hex = hex;
    self.port = port;
    self.baud = baud;
    self.callback = callback;

    // we will crunch the options here since doing it inside initialization routine would be too late
    self.options = {
        no_reboot:      false,
        reboot_baud:    false,
        erase_chip:     false,
    };

    if (options.no_reboot) {
        self.options.no_reboot = true;
    } else {
        self.options.reboot_baud = options.reboot_baud;
    }

    if (options.erase_chip) {
        self.options.erase_chip = true;
    }

    if (self.options.no_reboot) {
        serial.connect(port, {bitrate: self.baud, parityBit: 'even', stopBits: 'one'}, function (openInfo) {
            if (openInfo) {
                // we are connected, disabling connect button in the UI
                GUI.connect_lock = true;

                self.initialize();
            } else {
                gui_log(i18n.getMessage('serialPortOpenFail'));
            }
        });
    } else {

        let rebootMode = 0; // FIRMWARE
        const startFlashing = () => {
            if (rebootMode === 0) {
                return;
            }

            // refresh device list
            PortHandler.check_usb_devices(function(dfu_available) {
                if (dfu_available) {
                    STM32DFU.connect(usbDevices, hex, options);
                } else {
                    serial.connect(self.port, {bitrate: self.baud, parityBit: 'even', stopBits: 'one'}, function (openInfo) {
                        if (openInfo) {
                            self.initialize();
                        } else {
                            GUI.connect_lock = false;
                            gui_log(i18n.getMessage('serialPortOpenFail'));
                        }
                    });
                }
            });
        };

        const onDisconnect = disconnectionResult => {
            if (disconnectionResult) {
                // wait until board boots into bootloader mode
                // MacOs may need 5 seconds delay
                function waitForDfu() {
                    if (PortHandler.dfu_available) {
                        console.log(`DFU available after ${failedAttempts / 10} seconds`);
                        clearInterval(dfuWaitInterval);
                        startFlashing();
                    } else {
                        failedAttempts++;
                        if (failedAttempts > 100) {
                            clearInterval(dfuWaitInterval);
                            console.log(`failed to get DFU connection, gave up after 10 seconds`);
                            if (TABS.firmware_flasher?.isWebUsbMode?.()) {
                                TABS.firmware_flasher.showWebUsbDfuRetryDialog(hex, options);
                            } else {
                                gui_log(i18n.getMessage('serialPortOpenFail'));
                                GUI.connect_lock = false;
                            }
                        }
                    }
                }

                let failedAttempts = 0;
                const dfuWaitInterval = setInterval(waitForDfu, 100);
            } else {
                GUI.connect_lock = false;
            }
        };

        const legacyRebootAndFlash = function() {
            serial.connect(self.port, {bitrate: self.options.reboot_baud}, function (openInfo) {
                if (!openInfo) {
                    GUI.connect_lock = false;
                    gui_log(i18n.getMessage('serialPortOpenFail'));
                    return;
                }

                console.log('Using legacy reboot method');

                console.log('Sending ascii "R" to reboot');
                const bufferOut = new ArrayBuffer(1);
                const bufferView = new Uint8Array(bufferOut);

                bufferView[0] = 0x52;

                serial.send(bufferOut, function () {
                    serial.disconnect(disconnectionResult => onDisconnect(disconnectionResult));
                });
            });
        };

        const onConnectHandler = function () {

            gui_log(i18n.getMessage('apiVersionReceived', [FC.CONFIG.apiVersion]));

            if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                self.msp_connector.disconnect(function (disconnectionResult) {

                    // need some time for the port to be closed, serial port does not open if tried immediately
                    setTimeout(legacyRebootAndFlash, 500);
                });
            } else {
                console.log('Looking for capabilities via MSP');

                MSP.send_message(MSPCodes.MSP_BOARD_INFO, false, false, () => {
                    if (bit_check(FC.CONFIG.targetCapabilities, FC.TARGET_CAPABILITIES_FLAGS.HAS_FLASH_BOOTLOADER)) {
                        // Board has flash bootloader
                        gui_log(i18n.getMessage('deviceRebooting_flashBootloader'));
                        console.log('flash bootloader detected');
                        rebootMode = 4; // MSP_REBOOT_BOOTLOADER_FLASH
                    } else {
                        gui_log(i18n.getMessage('deviceRebooting_romBootloader'));
                        console.log('no flash bootloader detected');
                        rebootMode = 1; // MSP_REBOOT_BOOTLOADER_ROM;
                    }

                    const selectedBoard = TABS.firmware_flasher.selectedBoard !== '0' ? TABS.firmware_flasher.selectedBoard : 'NONE';
                    const connectedBoard = FC.CONFIG.boardName ? FC.CONFIG.boardName : 'UNKNOWN';

                    function reboot() {
                        const buffer = [];
                        buffer.push8(rebootMode);
                        setTimeout(() => {
                            MSP.send_message(MSPCodes.MSP_SET_REBOOT, buffer, () => {
                                // if firmware doesn't flush MSP/serial send buffers and gracefully shutdown VCP connections we won't get a reply, so don't wait for it.
                                self.msp_connector.disconnect(disconnectionResult => onDisconnect(disconnectionResult));
                                console.log('Reboot request received by device');
                            });
                        }, 100);
                    }

                    function onAbort() {
                        GUI.connect_lock = false;
                        rebootMode = 0;
                        console.log('User cancelled because selected target does not match verified board');
                        reboot();
                        TABS.firmware_flasher.refresh();
                    }

                    if (selectedBoard !== connectedBoard && !TABS.firmware_flasher.localFirmwareLoaded) {
                        TABS.firmware_flasher.showDialogVerifyBoard(selectedBoard, connectedBoard, onAbort, reboot);
                    } else {
                        reboot();
                    }
                });
            }
        };

        const onTimeoutHandler = function() {
            GUI.connect_lock = false;
            console.log('Looking for capabilities via MSP failed');

            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32RebootingToBootloaderFailed'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);
        };

        const onFailureHandler = function() {
            GUI.connect_lock = false;
            TABS.firmware_flasher.refresh();
        };

        GUI.connect_lock = true;
        TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32RebootingToBootloader'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

        self.msp_connector.connect(self.port, self.options.reboot_baud, onConnectHandler, onTimeoutHandler, onFailureHandler);
    }
};

// initialize certain variables and start timers that oversee the communication
STM32_protocol.prototype.initialize = function () {
    const self = this;

    // reset and set some variables before we start
    self.receive_buffer = [];
    self.verify_hex = [];

    self.upload_time_start = new Date().getTime();
    self.upload_process_alive = false;

    // reset progress bar to initial state
    TABS.firmware_flasher.flashingMessage(null, TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL)
                         .flashProgress(0);

    // lock some UI elements TODO needs rework
    $('select[name="release"]').prop('disabled', true);

    serial.onReceive.addListener(function (info) {
        self.read(info);
    });

    GUI.interval_add('STM32_timeout', function () {
        if (self.upload_process_alive) { // process is running
            self.upload_process_alive = false;
        } else {
            console.log('STM32 - timed out, programming failed ...');

            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32TimedOut'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);

            // protocol got stuck, clear timer and disconnect
            GUI.interval_remove('STM32_timeout');

            // exit
            self.upload_procedure(99);
        }
    }, 2000);

    self.upload_procedure(1);
};

// no input parameters
// this method should be executed every 1 ms via interval timer
STM32_protocol.prototype.read = function (readInfo) {
    // routine that fills the buffer
    const data = new Uint8Array(readInfo.data);

    for (const instance of data) {
        this.receive_buffer.push(instance);
    }

    // routine that fetches data from buffer if statement is true
    if (this.receive_buffer.length >= this.bytesToRead && this.bytesToRead != 0) {
        const fetched = this.receive_buffer.slice(0, this.bytesToRead); // bytes requested
        this.receive_buffer.splice(0, this.bytesToRead); // remove read bytes

        this.bytesToRead = 0; // reset trigger

        this.read_callback(fetched);
    }
};

// we should always try to consume all "proper" available data while using retrieve
STM32_protocol.prototype.retrieve = function (nBytes, callback) {
    if (this.receive_buffer.length >= nBytes) {
        // data that we need are there, process immediately
        const data = this.receive_buffer.slice(0, nBytes);
        this.receive_buffer.splice(0, nBytes); // remove read bytes

        callback(data);
    } else {
        // still waiting for data, add callback
        this.bytesToRead = nBytes;
        this.read_callback = callback;
    }
};

// bytes_to_send = array of bytes that will be send over serial
// bytesToRead = received bytes necessary to trigger read_callback
// callback = function that will be executed after received bytes = bytesToRead
STM32_protocol.prototype.send = function (bytes_to_send, bytesToRead, callback) {
    // flip flag
    this.upload_process_alive = true;

    const bufferOut = new ArrayBuffer(bytes_to_send.length);
    const bufferView = new Uint8Array(bufferOut);

    // set bytes_to_send values inside bufferView (alternative to for loop)
    bufferView.set(bytes_to_send);

    // update references
    this.bytesToRead = bytesToRead;
    this.read_callback = callback;

    // empty receive buffer before next command is out
    this.receive_buffer = [];

    // send over the actual data
    serial.send(bufferOut);
};

// val = single byte to be verified
// data = response of n bytes from mcu (array)
// result = true/false
STM32_protocol.prototype.verify_response = function (val, data) {

    if (val !== data[0]) {
        const message = `STM32 Communication failed, wrong response, expected: ${val} (0x${val.toString(16)}) received: ${data[0]} (0x${data[0].toString(16)})`;
        console.error(message);
        TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32WrongResponse',[val, val.toString(16), data[0], data[0].toString(16)]), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);

        // disconnect
        this.upload_procedure(99);

        return false;
    }

    return true;
};

// input = 16 bit value
// result = true/false
STM32_protocol.prototype.verify_chip_signature = function (signature) {
    switch (signature) {
        case 0x412: // not tested
            console.log('Chip recognized as F1 Low-density');
            break;
        case 0x410:
            console.log('Chip recognized as F1 Medium-density');
            this.available_flash_size = 131072;
            this.page_size = 1024;
            break;
        case 0x414:
            this.available_flash_size =  0x40000;
            this.page_size = 2048;
            console.log('Chip recognized as F1 High-density');
            break;
        case 0x418: // not tested
            console.log('Chip recognized as F1 Connectivity line');
            break;
        case 0x420:  // not tested
            console.log('Chip recognized as F1 Medium-density value line');
            break;
        case 0x428: // not tested
            console.log('Chip recognized as F1 High-density value line');
            break;
        case 0x430: // not tested
            console.log('Chip recognized as F1 XL-density value line');
            break;
        case 0x416: // not tested
            console.log('Chip recognized as L1 Medium-density ultralow power');
            break;
        case 0x436: // not tested
            console.log('Chip recognized as L1 High-density ultralow power');
            break;
        case 0x427: // not tested
            console.log('Chip recognized as L1 Medium-density plus ultralow power');
            break;
        case 0x411: // not tested
            console.log('Chip recognized as F2 STM32F2xxxx');
            break;
        case 0x440: // not tested
            console.log('Chip recognized as F0 STM32F051xx');
            break;
        case 0x444: // not tested
            console.log('Chip recognized as F0 STM32F050xx');
            break;
        case 0x413: // not tested
            console.log('Chip recognized as F4 STM32F40xxx/41xxx');
            break;
        case 0x419: // not tested
            console.log('Chip recognized as F4 STM32F427xx/437xx, STM32F429xx/439xx');
            break;
        case 0x432: // not tested
            console.log('Chip recognized as F3 STM32F37xxx, STM32F38xxx');
            break;
        case 0x422:
            console.log('Chip recognized as F3 STM32F30xxx, STM32F31xxx');
            this.available_flash_size =  0x40000;
            this.page_size = 2048;
            break;
    }

    if (this.available_flash_size > 0) {
        if (this.hex.bytes_total < this.available_flash_size) {
            return true;
        } else {
            console.log(`Supplied hex is bigger then flash available on the chip, HEX: ${this.hex.bytes_total} bytes, limit = ${this.available_flash_size} bytes`);
            return false;
        }
    }

    console.log(`Chip NOT recognized: ${signature}`);

    return false;
};

// firstArray = usually hex_to_flash array
// secondArray = usually verify_hex array
// result = true/false
STM32_protocol.prototype.verify_flash = function (firstArray, secondArray) {
    for (let i = 0; i < firstArray.length; i++) {
        if (firstArray[i] !== secondArray[i]) {
            console.log(`Verification failed on byte: ${i} expected: 0x${firstArray[i].toString(16)} received: 0x${secondArray[i].toString(16)}`);
            return false;
        }
    }

    console.log(`Verification successful, matching: ${firstArray.length} bytes`);

    return true;
};

// step = value depending on current state of upload_procedure
STM32_protocol.prototype.upload_procedure = function (step) {
    const self = this;

    switch (step) {
        case 1:
            // initialize serial interface on the MCU side, auto baud rate settings
            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ContactingBootloader'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

            let sendCounter = 0;
            GUI.interval_add('stm32_initialize_mcu', function () { // 200 ms interval (just in case mcu was already initialized), we need to break the 2 bytes command requirement
                self.send([0x7F], 1, function (reply) {
                    if (reply[0] === 0x7F || reply[0] === self.status.ACK || reply[0] === self.status.NACK) {
                        GUI.interval_remove('stm32_initialize_mcu');
                        console.log('STM32 - Serial interface initialized on the MCU side');

                        // proceed to next step
                        self.upload_procedure(2);
                    } else {
                        TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ContactingBootloaderFailed'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);

                        GUI.interval_remove('stm32_initialize_mcu');

                        // disconnect
                        self.upload_procedure(99);
                    }
                });

                if (sendCounter++ > 3) {
                    // stop retrying, its too late to get any response from MCU
                    console.log('STM32 - no response from bootloader, disconnecting');

                    TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ResponseBootloaderFailed'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);

                    GUI.interval_remove('stm32_initialize_mcu');
                    GUI.interval_remove('STM32_timeout');

                    // exit
                    self.upload_procedure(99);
                }
            }, 250, true);

            break;
        case 2:
            // get version of the bootloader and supported commands
            self.send([self.command.get, 0xFF], 2, function (data) { // 0x00 ^ 0xFF
                if (self.verify_response(self.status.ACK, data)) {
                    self.retrieve(data[1] + 1 + 1, function (data) { // data[1] = number of bytes that will follow [– 1 except current and ACKs]
                        console.log(`STM32 - Bootloader version: ${(parseInt(data[0].toString(16)) / 10).toFixed(1)}`); // convert dec to hex, hex to dec and add floating point

                        self.useExtendedErase = (data[7] === self.command.extended_erase);

                        // proceed to next step
                        self.upload_procedure(3);
                    });
                }
            });

            break;
        case 3:
            // get ID (device signature)
            self.send([self.command.get_ID, 0xFD], 2, function (data) { // 0x01 ^ 0xFF
                if (self.verify_response(self.status.ACK, data)) {
                    self.retrieve(data[1] + 1 + 1, function (data) { // data[1] = number of bytes that will follow [– 1 (N = 1 for STM32), except for current byte and ACKs]
                        const signature = (data[0] << 8) | data[1];
                        console.log(`STM32 - Signature: 0x${signature.toString(16)}`); // signature in hex representation

                        if (self.verify_chip_signature(signature)) {
                            // proceed to next step
                            self.upload_procedure(4);
                        } else {
                            // disconnect
                            self.upload_procedure(99);
                        }
                    });
                }
            });

            break;
        case 4:
            // erase memory

            if (self.useExtendedErase) {
                if (self.options.erase_chip) {

                    const message = 'Executing global chip erase (via extended erase)';
                    console.log(message);
                    TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32GlobalEraseExtended'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

                    self.send([self.command.extended_erase, 0xBB], 1, function (reply) {
                        if (self.verify_response(self.status.ACK, reply)) {
                            self.send( [0xFF, 0xFF, 0x00], 1, function (reply) {
                                if (self.verify_response(self.status.ACK, reply)) {
                                    console.log('Executing global chip extended erase: done');
                                    self.upload_procedure(5);
                                }
                            });
                        }
                    });

                } else {
                    const message = 'Executing local erase (via extended erase)';
                    console.log(message);
                    TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32LocalEraseExtended'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

                    self.send([self.command.extended_erase, 0xBB], 1, function (reply) {
                        if (self.verify_response(self.status.ACK, reply)) {

                            // For reference: https://code.google.com/p/stm32flash/source/browse/stm32.c#723

                            const maxAddress = self.hex.data[self.hex.data.length - 1].address + self.hex.data[self.hex.data.length - 1].bytes - 0x8000000;
                            const erasePagesN = Math.ceil(maxAddress / self.page_size);
                            const buff = [];
                            let checksum = 0;

                            let pgByte;

                            pgByte = (erasePagesN - 1) >> 8;
                            buff.push(pgByte);
                            checksum ^= pgByte;
                            pgByte = (erasePagesN - 1) & 0xFF;
                            buff.push(pgByte);
                            checksum ^= pgByte;


                            for (let i = 0; i < erasePagesN; i++) {
                                pgByte = i >> 8;
                                buff.push(pgByte);
                                checksum ^= pgByte;
                                pgByte = i & 0xFF;
                                buff.push(pgByte);
                                checksum ^= pgByte;
                            }

                            buff.push(checksum);
                            console.log(`Erasing. pages: 0x00 - 0x${erasePagesN.toString(16)}, checksum: 0x${checksum.toString(16)}`);

                            self.send(buff, 1, function (_reply) {
                                if (self.verify_response(self.status.ACK, _reply)) {
                                    console.log('Erasing: done');
                                    // proceed to next step
                                    self.upload_procedure(5);
                                }
                            });
                        }
                    });


                }
                break;
            }

            if (self.options.erase_chip) {
                const message = 'Executing global chip erase' ;
                console.log(message);
                TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32GlobalErase'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

                self.send([self.command.erase, 0xBC], 1, function (reply) { // 0x43 ^ 0xFF
                    if (self.verify_response(self.status.ACK, reply)) {
                        self.send([0xFF, 0x00], 1, function (reply) {
                            if (self.verify_response(self.status.ACK, reply)) {
                                console.log('Erasing: done');
                                // proceed to next step
                                self.upload_procedure(5);
                            }
                        });
                    }
                });
            } else {
                const message = 'Executing local erase';
                console.log(message);
                TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32LocalErase'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

                self.send([self.command.erase, 0xBC], 1, function (reply) { // 0x43 ^ 0xFF
                    if (self.verify_response(self.status.ACK, reply)) {
                        // the bootloader receives one byte that contains N, the number of pages to be erased – 1
                        const maxAddress = self.hex.data[self.hex.data.length - 1].address + self.hex.data[self.hex.data.length - 1].bytes - 0x8000000;
                        const erasePagesN = Math.ceil(maxAddress / self.page_size);
                        const buff = [];
                        let checksum = erasePagesN - 1;

                        buff.push(erasePagesN - 1);

                        for (let ii = 0; ii < erasePagesN; ii++) {
                            buff.push(ii);
                            checksum ^= ii;
                        }

                        buff.push(checksum);

                        self.send(buff, 1, function (reply) {
                            if (self.verify_response(self.status.ACK, reply)) {
                                console.log('Erasing: done');
                                // proceed to next step
                                self.upload_procedure(5);
                            }
                        });
                    }
                });
            }

            break;
        case 5:
            // upload
            console.log('Writing data ...');
            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32Flashing'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

            let blocks = self.hex.data.length - 1,
                flashing_block = 0,
                address = self.hex.data[flashing_block].address,
                bytes_flashed = 0,
                bytes_flashed_total = 0; // used for progress bar

            const write = function () {
                if (bytes_flashed < self.hex.data[flashing_block].bytes) {
                    const bytesToWrite = ((bytes_flashed + 256) <= self.hex.data[flashing_block].bytes) ? 256 : (self.hex.data[flashing_block].bytes - bytes_flashed);

                    // console.log('STM32 - Writing to: 0x' + address.toString(16) + ', ' + bytesToWrite + ' bytes');

                    self.send([self.command.write_memory, 0xCE], 1, function (reply) { // 0x31 ^ 0xFF
                        if (self.verify_response(self.status.ACK, reply)) {
                            // address needs to be transmitted as 32 bit integer, we need to bit shift each byte out and then calculate address checksum
                            const addressArray = [(address >> 24), (address >> 16), (address >> 8), address];
                            const addressChecksum = addressArray[0] ^ addressArray[1] ^ addressArray[2] ^ addressArray[3];
                            // write start address + checksum
                            self.send([addressArray[0], addressArray[1], addressArray[2], addressArray[3], addressChecksum], 1, function (_reply) {
                                if (self.verify_response(self.status.ACK, _reply)) {
                                    const arrayOut = Array.from(bytesToWrite + 2); // 2 byte overhead [N, ...., checksum]
                                    arrayOut[0] = bytesToWrite - 1; // number of bytes to be written (to write 128 bytes, N must be 127, to write 256 bytes, N must be 255)

                                    let checksum = arrayOut[0];
                                    for (let ii = 0; ii < bytesToWrite; ii++) {
                                        arrayOut[ii + 1] = self.hex.data[flashing_block].data[bytes_flashed]; // + 1 because of the first byte offset
                                        checksum ^= self.hex.data[flashing_block].data[bytes_flashed];

                                        bytes_flashed++;
                                    }
                                    arrayOut[arrayOut.length - 1] = checksum; // checksum (last byte in the arrayOut array)

                                    address += bytesToWrite;
                                    bytes_flashed_total += bytesToWrite;

                                    self.send(arrayOut, 1, function (response) {
                                        if (self.verify_response(self.status.ACK, response)) {
                                            // flash another page
                                            write();
                                        }
                                    });

                                    // update progress bar
                                    TABS.firmware_flasher.flashProgress(Math.round(bytes_flashed_total / (self.hex.bytes_total * 2) * 100));
                                }
                            });
                        }
                    });
                } else {
                    // move to another block
                    if (flashing_block < blocks) {
                        flashing_block++;

                        address = self.hex.data[flashing_block].address;
                        bytes_flashed = 0;

                        write();
                    } else {
                        // all blocks flashed
                        console.log('Writing: done');

                        // proceed to next step
                        self.upload_procedure(6);
                    }
                }
            };

            // start writing
            write();

            break;
        case 6:
            // verify
            console.log('Verifying data ...');
            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32Verifying'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.NEUTRAL);

            blocks = self.hex.data.length - 1;
            let readingBlock = 0;
            address = self.hex.data[readingBlock].address;
            let bytesVerified = 0;
            let bytesVerifiedTotal = 0; // used for progress bar

            // initialize arrays
            for (let i = 0; i <= blocks; i++) {
                self.verify_hex.push([]);
            }

            const reading = function () {
                if (bytesVerified < self.hex.data[readingBlock].bytes) {
                    const bytesToRead = ((bytesVerified + 256) <= self.hex.data[readingBlock].bytes) ? 256 : (self.hex.data[readingBlock].bytes - bytesVerified);

                    // console.log('STM32 - Reading from: 0x' + address.toString(16) + ', ' + bytesToRead + ' bytes');

                    self.send([self.command.read_memory, 0xEE], 1, function (reply) { // 0x11 ^ 0xFF
                        if (self.verify_response(self.status.ACK, reply)) {
                            const addressArray = [(address >> 24), (address >> 16), (address >> 8), address];
                            const addressChecksum = addressArray[0] ^ addressArray[1] ^ addressArray[2] ^ addressArray[3];

                            self.send([addressArray[0], addressArray[1], addressArray[2], addressArray[3], addressChecksum], 1, function (_reply) { // read start address + checksum
                                if (self.verify_response(self.status.ACK, _reply)) {
                                    const bytesToReadN = bytesToRead - 1;
                                    // bytes to be read + checksum XOR(complement of bytesToReadN)
                                    self.send([bytesToReadN, (~bytesToReadN) & 0xFF], 1, function (response) {
                                        if (self.verify_response(self.status.ACK, response)) {
                                            self.retrieve(bytesToRead, function (data) {
                                                for (const instance of data) {
                                                    self.verify_hex[readingBlock].push(instance);
                                                }

                                                address += bytesToRead;
                                                bytesVerified += bytesToRead;
                                                bytesVerifiedTotal += bytesToRead;

                                                // verify another page
                                                reading();
                                            });
                                        }
                                    });

                                    // update progress bar
                                    TABS.firmware_flasher.flashProgress(Math.round((self.hex.bytes_total + bytesVerifiedTotal) / (self.hex.bytes_total * 2) * 100));
                                }
                            });
                        }
                    });
                } else {
                    // move to another block
                    if (readingBlock < blocks) {
                        readingBlock++;

                        address = self.hex.data[readingBlock].address;
                        bytesVerified = 0;

                        reading();
                    } else {
                        // all blocks read, verify

                        let verify = true;
                        for (let i = 0; i <= blocks; i++) {
                            verify = self.verify_flash(self.hex.data[i].data, self.verify_hex[i]);

                            if (!verify) break;
                        }

                        if (verify) {
                            console.log('Programming: SUCCESSFUL');
                            // update progress bar
                            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ProgrammingSuccessful'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.VALID);

                            // proceed to next step
                            self.upload_procedure(7);
                        } else {
                            console.log('Programming: FAILED');
                            // update progress bar
                            TABS.firmware_flasher.flashingMessage(i18n.getMessage('stm32ProgrammingFailed'), TABS.firmware_flasher.FLASH_MESSAGE_TYPES.INVALID);

                            // disconnect
                            self.upload_procedure(99);
                        }
                    }
                }
            };

            // start reading
            reading();

            break;
        case 7:
            // go
            // memory address = 4 bytes, 1st high byte, 4th low byte, 5th byte = checksum XOR(byte 1, byte 2, byte 3, byte 4)
            console.log('Sending GO command: 0x8000000');

            self.send([self.command.go, 0xDE], 1, function (reply) { // 0x21 ^ 0xFF
                if (self.verify_response(self.status.ACK, reply)) {
                    const gtAddress = 0x8000000;
                    address = [(gtAddress >> 24), (gtAddress >> 16), (gtAddress >> 8), gtAddress];
                    const addressChecksum = address[0] ^ address[1] ^ address[2] ^ address[3];

                    self.send([address[0], address[1], address[2], address[3], addressChecksum], 1, function (response) {
                        if (self.verify_response(self.status.ACK, response)) {
                            // disconnect
                            self.upload_procedure(99);
                        }
                    });
                }
            });

            break;
        case 99:
            // disconnect
            GUI.interval_remove('STM32_timeout'); // stop STM32 timeout timer (everything is finished now)

            // close connection
            if (serial.connectionId) {
                serial.disconnect(self.cleanup);
            } else {
                self.cleanup();
            }

            break;
    }
};

STM32_protocol.prototype.cleanup = function () {
    PortUsage.reset();

    // unlocking connect button
    GUI.connect_lock = false;

    // unlock some UI elements TODO needs rework
    $('select[name="release"]').prop('disabled', false);

    // handle timing
    const timeSpent = new Date().getTime() - self.upload_time_start;

    console.log(`Script finished after: ${(timeSpent / 1000)} seconds`);

    if (self.callback) {
        self.callback();
    }
};

// initialize object
const STM32 = new STM32_protocol();

const firmware_flasher = {
    targets: null,
    buildApi: new BuildApi(),
    sponsor: new Sponsor(),
    localFirmwareLoaded: false,
    selectedBoard: undefined,
    boardNeedsVerification: false,
    allowBoardDetection: true,
    cloudBuildKey: null,
    cloudBuildOptions: null,
    isFlashing: false,
    intel_hex: undefined, // standard intel hex in string format
    parsed_hex: undefined, // parsed raw hex in array format
    isConfigLocal: false, // Set to true if the user loads one locally
    filename: null,
    configFilename: null,
    config: {},
    developmentFirmwareLoaded: false, // Is the firmware to be flashed from the development branch?
    cancelBuild: false,
};

firmware_flasher.initialize = function (callback) {
    const self = this;

    if (GUI.active_tab !== 'firmware_flasher') {
        GUI.active_tab = 'firmware_flasher';
    }

    // reset on tab change
    self.selectedBoard = undefined;
    self.allowBoardDetection = true;

    self.cloudBuildKey = null;
    self.cloudBuildOptions = null;

    self.localFirmwareLoaded = false;
    self.isConfigLocal = false;
    self.intel_hex = undefined;
    self.parsed_hex = undefined;

    function onDocumentLoad() {
        console.log('enter hex parse!');

        function parseHex(str, callback) {
            // parsing hex in different thread
            const worker = new Worker('./js/workers/hex_parser.js');

            // "callback"
            worker.onmessage = function (event) {
                callback(event.data);
            };

            // send data/string over for processing
            worker.postMessage(str);
        }

        function showLoadedHex(filename) {
            self.filename = filename;

            if (self.localFirmwareLoaded) {
                self.flashingMessage(i18n.getMessage('firmwareFlasherFirmwareLocalLoaded', { filename: filename, bytes: self.parsed_hex.bytes_total }), self.FLASH_MESSAGE_TYPES.NEUTRAL);
            } else {
                self.flashingMessage(`<a class="save_firmware" href="#" title="Save Firmware">${i18n.getMessage('firmwareFlasherFirmwareOnlineLoaded', { filename: filename, bytes: self.parsed_hex.bytes_total })}</a>`, self.FLASH_MESSAGE_TYPES.NEUTRAL);
            }
            self.enableFlashButton(true);

            tracking.sendEvent(tracking.EVENT_CATEGORIES.FLASHING, 'FirmwareLoaded', {
                firmwareSize: self.parsed_hex.bytes_total,
                firmwareName: filename,
                firmwareSource: self.localFirmwareLoaded ? 'file' : 'http',
                selectedTarget: self.targetDetail?.target,
                selectedRelease: self.targetDetail?.release,
            });
        }

        function showReleaseNotes(summary) {
            if (summary.manufacturer) {
                $('div.release_info #manufacturer').text(summary.manufacturer);
                $('div.release_info #manufacturerInfo').show();
            } else {
                $('div.release_info #manufacturerInfo').hide();
            }

            $('div.release_info .target').text(summary.target);
            $('div.release_info .name').text(summary.release).prop('href', summary.releaseUrl);
            $('div.release_info .date').text(summary.date);
            $('div.release_info #targetMCU').text(summary.mcu);
            $('div.release_info .configFilename').text(self.isConfigLocal ? self.configFilename : "[default]");

            if (summary.cloudBuild) {
                $('div.release_info #cloudTargetInfo').show();
                $('div.release_info #cloudTargetLog').text('');
                $('div.release_info #cloudTargetStatus').text('pending');
            } else {
                $('div.release_info #cloudTargetInfo').hide();
            }

            if (self.targets) {
                $('div.release_info').slideDown();
                $('.tab-firmware_flasher .content_wrapper').animate({ scrollTop: $('div.release_info').position().top }, 1000);
            }
        }

        function clearBoardConfig() {
            self.config = {};
            self.isConfigLocal = false;
            self.configFilename = null;
        }

        function setBoardConfig(config, filename) {
            self.config = config.join('\n');
            self.isConfigLocal = filename !== undefined;
            self.configFilename = filename !== undefined ? filename : null;
        }

        function processHex(data, key) {
            console.log("enter processHex function");
            self.intel_hex = data;

            parseHex(self.intel_hex, function (data) {
                self.parsed_hex = data;

                if (self.parsed_hex) {
                    showLoadedHex(key);
                } else {
                    self.flashingMessage(i18n.getMessage('firmwareFlasherHexCorrupted'), self.FLASH_MESSAGE_TYPES.INVALID);
                    self.enableFlashButton(false);
                }
            });
        }

        function onLoadSuccess(data, key) {
            console.log("enter onLoadSuccess");
            self.localFirmwareLoaded = false;

            processHex(data, key);
            self.enableLoadRemoteFileButton(true);
            $("a.load_remote_file").text(i18n.getMessage('firmwareFlasherButtonLoadOnline'));
        }

        function loadTargetList(targets) {
            if (!targets || !navigator.onLine) {
                $('select[name="board"]').empty().append('<option value="0">Offline</option>');
                $('select[name="firmware_version"]').empty().append('<option value="0">Offline</option>');

                return;
            }

            const boards_e = $('select[name="board"]');
            boards_e.empty();
            boards_e.append($(`<option value='0'>${i18n.getMessage("firmwareFlasherOptionLabelSelectBoard")}</option>`));

            const versions_e = $('select[name="firmware_version"]');
            versions_e.empty();
            versions_e.append($(`<option value='0'>${i18n.getMessage("firmwareFlasherOptionLabelSelectFirmwareVersion")}</option>`));

            Object.keys(targets)
                .sort((a,b) => a.target - b.target)
                .forEach(function(target, i) {
                    const descriptor = targets[target];
                    const select_e = $(`<option value='${descriptor.target}'>${descriptor.target}</option>`);
                    boards_e.append(select_e);
                });

            TABS.firmware_flasher.targets = targets;


            // For discussion. Rather remove build configuration and let user use auto-detect. Often I think already had pressed the button.
            $('div.build_configuration').slideUp();
        }

        function buildOptionsList(select_e, options) {
            select_e.empty();
            options.forEach((option) => {
                if (option.default) {
                    select_e.append($(`<option value='${option.value}' selected>${option.name}</option>`));
                } else {
                    select_e.append($(`<option value='${option.value}'>${option.name}</option>`));
                }
            });
        }

        function toggleTelemetryProtocolInfo() {
            const radioProtocol = $('select[name="radioProtocols"] option:selected').val();
            const hasTelemetryEnabledByDefault = [
                'USE_SERIALRX_CRSF',
                'USE_SERIALRX_FPORT',
                'USE_SERIALRX_GHST',
            ].includes(radioProtocol);

            $('select[name="telemetryProtocols"]').attr('disabled', hasTelemetryEnabledByDefault);

            if (hasTelemetryEnabledByDefault) {
                if ($('select[name="telemetryProtocols"] option[value="-1"]').length === 0) {
                    $('select[name="telemetryProtocols"]').prepend($('<option>', {
                        value: '-1',
                        selected: 'selected',
                        text: i18n.getMessage('firmwareFlasherOptionLabelTelemetryProtocolIncluded'),
                    }));
                } else {
                    $('select[name="telemetryProtocols"] option:first').attr('selected', 'selected').text(i18n.getMessage('firmwareFlasherOptionLabelTelemetryProtocolIncluded'));
                }
            } else if ($('select[name="telemetryProtocols"] option[value="-1"]').length) {
                $('select[name="telemetryProtocols"] option:first').remove();
            }
        }

        function buildOptions(data) {
            if (!navigator.onLine) {
                return;
            }

            buildOptionsList($('select[name="radioProtocols"]'), data.radioProtocols);
            buildOptionsList($('select[name="telemetryProtocols"]'), data.telemetryProtocols);
            buildOptionsList($('select[name="options"]'), data.generalOptions);
            buildOptionsList($('select[name="motorProtocols"]'), data.motorProtocols);

            if (!self.validateBuildKey()) {
                preselectRadioProtocolFromStorage();
            }

            toggleTelemetryProtocolInfo();
        }

        function preselectRadioProtocolFromStorage() {
            const storedRadioProtocol = get("ffRadioProtocol").ffRadioProtocol;
            if (storedRadioProtocol) {
                const valueExistsInSelect = $('select[name="radioProtocols"] option').filter(function (i, o) {return o.value === storedRadioProtocol;}).length !== 0;
                if (valueExistsInSelect) {
                    $('select[name="radioProtocols"]').val(storedRadioProtocol);
                }
            }
        }

        let buildTypesToShow;
        const buildType_e = $('select[name="build_type"]');
        function buildBuildTypeOptionsList() {
            buildType_e.empty();
            buildTypesToShow.forEach(({ tag, title }, index) => {
                buildType_e.append($(`<option value='${index}'>${tag ? i18n.getMessage(tag) : title}</option>`));
            });
        }

        const buildTypes = [
            {
                tag: 'firmwareFlasherOptionLabelBuildTypeRelease',
            },
            {
                tag: 'firmwareFlasherOptionLabelBuildTypeReleaseCandidate',
            },
            {
                tag: "firmwareFlasherOptionLabelBuildTypeDevelopment",
            },
        ];

        function showOrHideBuildTypes() {
            const showExtraReleases = $(this).is(':checked');

            if (showExtraReleases) {
                $('tr.build_type').show();
            } else {
                $('tr.build_type').hide();
                buildType_e.val(0).trigger('change');
            }
        }

        function showOrHideExpertMode() {
            const expertModeChecked = $(this).is(':checked');

            if (expertModeChecked) {
                buildTypesToShow = buildTypes;
            } else {
                buildTypesToShow = buildTypes.slice(0,2);
            }

            buildBuildTypeOptionsList();
            buildType_e.val(0).trigger('change');

            setTimeout(() => {
                $('tr.expertOptions').toggle(expertModeChecked);
                $('div.expertOptions').toggle(expertModeChecked);
            }, 0);

            set({'expertMode': expertModeChecked});
        }

        const expertMode_e = $('.tab-firmware_flasher input.expert_mode');
        const expertMode = get('expertMode').expertMode;

        expertMode_e.prop('checked', expertMode);
        expertMode_e.on('change', showOrHideExpertMode).trigger('change');

        $('input.show_development_releases').change(showOrHideBuildTypes).change();

        // translate to user-selected language
        i18n.localizePage();

        self.sponsor.loadSponsorTile('flash', $('div.tab_sponsor'));

        buildType_e.on('change', function() {
            self.enableLoadRemoteFileButton(false);

            const build_type = buildType_e.val();

            $('select[name="board"]').empty()
                .append($(`<option value='0'>${i18n.getMessage("firmwareFlasherOptionLoading")}</option>`));

            $('select[name="firmware_version"]').empty()
                .append($(`<option value='0'>${i18n.getMessage("firmwareFlasherOptionLoading")}</option>`));

            if (!GUI.connect_lock) {
                try {
                    self.buildApi.loadTargets(loadTargetList);
                } catch (err) {
                    console.error(err);
                }
            }

            set({'selected_build_type': build_type});
        });

        function selectFirmware(release) {
            $('div.build_configuration').slideUp();
            $('div.release_info').slideUp();

            if (!self.localFirmwareLoaded) {
                self.enableFlashButton(false);
                self.flashingMessage(i18n.getMessage('firmwareFlasherLoadFirmwareFile'), self.FLASH_MESSAGE_TYPES.NEUTRAL);
                if (self.parsed_hex && self.parsed_hex.bytes_total) {
                    // Changing the board triggers a version change, so we need only dump it here.
                    console.log('throw out loaded hex');
                    self.intel_hex = undefined;
                    self.parsed_hex = undefined;
                }
            }

            const target = $('select[name="board"] option:selected').val();

            function onTargetDetail(response) {
                self.targetDetail = response;

                if (response.cloudBuild === true) {
                    $('div.build_configuration').slideDown();

                    const expertMode = expertMode_e.is(':checked');
                    if (expertMode) {
                        if (response.releaseType === 'Unstable') {
                            self.buildApi.loadCommits(response.release, (commits) => {
                                const select_e = $('select[name="commits"]');
                                select_e.empty();
                                commits.forEach((commit) => {
                                    select_e.append($(`<option value='${commit.sha}'>${commit.message}</option>`));
                                });
                            });

                            $('div.commitSelection').show();
                        } else {
                            $('div.commitSelection').hide();
                        }
                    }

                    $('div.expertOptions').toggle(expertMode);
                    // Need to reset core build mode
                    $('input.corebuild_mode').trigger('change');
                }

                if (response.configuration && !self.isConfigLocal) {
                    setBoardConfig(response.configuration);
                }

                self.enableLoadRemoteFileButton(true);
            }

            self.buildApi.loadTarget(target, release, onTargetDetail);

            const OnInvalidBuildKey = () => self.buildApi.loadOptions(release, buildOptions);

            if (self.validateBuildKey()) {
                self.buildApi.loadOptionsByBuildKey(release, self.cloudBuildKey, buildOptions, OnInvalidBuildKey);
            } else {
                OnInvalidBuildKey();
            }
        }

        function populateReleases(versions_element, target) {
            const sortReleases = function (a, b) {
                return -semver.compareBuild(a.release, b.release);
            };

            versions_element.empty();
            const releases = target.releases;
            if (releases.length > 0) {
                versions_element.append(
                    $(
                        `<option value='0'>${i18n.getMessage(
                            "firmwareFlasherOptionLabelSelectFirmwareVersionFor",
                        )} ${target.target}</option>`,
                    ),
                );

                const build_type = $('select[name="build_type"]').val();

                releases
                    .sort(sortReleases)
                    .filter(r => {
                        return (r.type === 'Unstable' && build_type > 1) ||
                               (r.type === 'ReleaseCandidate' && build_type > 0) ||
                               (r.type === 'Stable');
                    })
                    .forEach(function(release) {
                        const releaseName = release.release;

                        const select_e = $(`<option value='${releaseName}'>${releaseName} [${release.label}]</option>`);
                        const summary = `${target}/${release}`;
                        select_e.data('summary', summary);
                        versions_element.append(select_e);
                    });

                // Assume flashing latest, so default to it.
                versions_element.prop("selectedIndex", 1);
                selectFirmware(versions_element.val());
            }
        }

        function clearBufferedFirmware() {
            clearBoardConfig();
            self.intel_hex = undefined;
            self.parsed_hex = undefined;
            self.localFirmwareLoaded = false;
        }

        $('select[name="board"]').select2();
        $('select[name="radioProtocols"]').select2();
        $('select[name="telemetryProtocols"]').select2();
        $('select[name="motorProtocols"]').select2();
        $('select[name="options"]').select2({ tags: false, closeOnSelect: false });
        $('select[name="commits"]').select2({ tags: true });

        $('select[name="options"]')
        .on('select2:opening', function() {
            const searchfield = $(this).parent().find('.select2-search__field');
            searchfield.prop('disabled', false);
        })
        .on('select2:closing', function() {
            const searchfield = $(this).parent().find('.select2-search__field');
            searchfield.prop('disabled', true);
        });

        $('select[name="radioProtocols"]').on("select2:select", function() {
            const selectedProtocol = $('select[name="radioProtocols"] option:selected').first().val();
            if (selectedProtocol) {
                set({"ffRadioProtocol" : selectedProtocol});
            }

            toggleTelemetryProtocolInfo();
        });

        $('select[name="board"]').on('change', function() {
            self.enableLoadRemoteFileButton(false);
            let target = $(this).val();

            // exception for board flashed with local custom firmware
            if (target === null) {
                target = '0';
                $(this).val(target).trigger('change');
            }

            if (!GUI.connect_lock) {
                self.selectedBoard = target;
                console.log('board changed to', target);

                self.flashingMessage(i18n.getMessage('firmwareFlasherLoadFirmwareFile'), self.FLASH_MESSAGE_TYPES.NEUTRAL)
                    .flashProgress(0);

                $('div.release_info').slideUp();
                $('div.build_configuration').slideUp();

                if (!self.localFirmwareLoaded) {
                    self.enableFlashButton(false);
                }

                const versions_e = $('select[name="firmware_version"]');
                if (target === '0') {
                    // target is 0 is the "Choose a Board" option. Throw out anything loaded
                    clearBufferedFirmware();

                    versions_e.empty();
                    versions_e.append(
                        $(
                            `<option value='0'>${i18n.getMessage(
                                "firmwareFlasherOptionLabelSelectFirmwareVersion",
                            )}</option>`,
                        ),
                    );
                } else {
                    // Show a loading message as there is a delay in loading a configuration
                    versions_e.empty();
                    versions_e.append(
                        $(
                            `<option value='0'>${i18n.getMessage(
                                "firmwareFlasherOptionLoading",
                            )}</option>`,
                        ),
                    );

                    self.buildApi.loadTargetReleases(target, (data) => populateReleases(versions_e, data));
                }
            }
        });
        // when any of the select2 elements is opened, force a focus on that element's search box
        const select2Elements = [
            'select[name="board"]',
            'select[name="radioProtocols"]',
            'select[name="telemetryProtocols"]',
            'select[name="motorProtocols"]',
            'select[name="options"]',
            'select[name="commits"]',
        ];

        $(document).on('select2:open', select2Elements.join(','), () => {
            const allFound = document.querySelectorAll('.select2-container--open .select2-search__field');
            $(this).one('mouseup keyup', () => {
                setTimeout(() => {
                    allFound[allFound.length - 1].focus();
                }, 0);
            });
        });

        function cleanUnifiedConfigFile(input) {
            let output = [];
            let inComment = false;
            for (let i = 0; i < input.length; i++) {
                if (input.charAt(i) === "\n" || input.charAt(i) === "\r") {
                    inComment = false;
                }

                if (input.charAt(i) === "#") {
                    inComment = true;
                }

                if (!inComment && input.charCodeAt(i) > 255) {
                    self.flashingMessage(i18n.getMessage('firmwareFlasherConfigCorrupted'), self.FLASH_MESSAGE_TYPES.INVALID);
                    gui_log(i18n.getMessage('firmwareFlasherConfigCorruptedLogMessage'));
                    return null;
                }

                if (input.charCodeAt(i) > 255) {
                    output.push('_');
                } else {
                    output.push(input.charAt(i));
                }
            }
            return output.join('').split('\n');
        }

        const portPickerElement = $('div#port-picker #port');

        function flashFirmware(firmware) {
            const options = {};
            if ($('input.erase_chip').is(':checked') || expertMode_e.is(':not(:checked)')) {
                options.erase_chip = true;
            }

            if (!$('option:selected', portPickerElement).data().isDFU) {
                if (String(portPickerElement.val()) !== '0') {
                    const port = String(portPickerElement.val());

                    if ($('input.updating').is(':checked')) {
                        options.no_reboot = true;
                    } else {
                        options.reboot_baud = parseInt($('div#port-picker #baud').val());
                    }

                    let baud = 115200;
                    if ($('input.flash_manual_baud').is(':checked')) {
                        baud = parseInt($('#flash_manual_baud_rate').val());
                    }

                    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLASHING, 'Flashing', { filename: self.filename || null });

                    STM32.connect(port, baud, firmware, options);
                } else {
                    console.log('Please select valid serial port');
                    gui_log(i18n.getMessage('firmwareFlasherNoValidPort'));
                }
            } else {
                const startDfuFlash = () => {
                    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLASHING, 'DFU Flashing', { filename: self.filename || null });
                    STM32DFU.connect(usbDevices, firmware, options);
                };

                if (self.isWebUsbMode() && !PortHandler.dfu_available) {
                    self.showWebUsbDfuGuideDialog(startDfuFlash);
                } else {
                    startDfuFlash();
                }
            }

            self.isFlashing = false;
        }

        let result = get('erase_chip');
        $('input.erase_chip').prop('checked', result.erase_chip); // users can override this during the session

        $('input.erase_chip').change(function () {
            set({'erase_chip': $(this).is(':checked')});
        }).change();

        result = get('show_development_releases');
        $('input.show_development_releases')
        .prop('checked', result.show_development_releases)
        .change(function () {
            set({'show_development_releases': $(this).is(':checked')});
        }).change();

        result = get('selected_build_type');
        // ensure default build type is selected
        buildType_e.val(result.selected_build_type || 0).trigger('change');

        result = get('no_reboot_sequence');
        if (result.no_reboot_sequence) {
            $('input.updating').prop('checked', true);
            $('.flash_on_connect_wrapper').show();
        } else {
            $('input.updating').prop('checked', false);
        }

        // bind UI hook so the status is saved on change
        $('input.updating').change(function() {
            const status = $(this).is(':checked');

            if (status) {
                $('.flash_on_connect_wrapper').show();
            } else {
                $('input.flash_on_connect').prop('checked', false).change();
                $('.flash_on_connect_wrapper').hide();
            }

            set({'no_reboot_sequence': status});
        });

        $('input.updating').change();

        result = get('flash_manual_baud');
        if (result.flash_manual_baud) {
            $('input.flash_manual_baud').prop('checked', true);
        } else {
            $('input.flash_manual_baud').prop('checked', false);
        }

        $('input.corebuild_mode').change(function () {
            const status = $(this).is(':checked');

            $('.hide-in-core-build-mode').toggle(!status);
            $('div.expertOptions').toggle(!status && expertMode_e.is(':checked'));
        });
        $('input.corebuild_mode').change();

        // bind UI hook so the status is saved on change
        $('input.flash_manual_baud').change(function() {
            const status = $(this).is(':checked');
            set({'flash_manual_baud': status});
        });

        $('input.flash_manual_baud').change();

        result = get('flash_manual_baud_rate');
        $('#flash_manual_baud_rate').val(result.flash_manual_baud_rate);

        // bind UI hook so the status is saved on change
        $('#flash_manual_baud_rate').change(function() {
            const baud = parseInt($('#flash_manual_baud_rate').val());
            set({'flash_manual_baud_rate': baud});
        });

        $('input.flash_manual_baud_rate').change();

        // UI Hooks
        $('a.load_file').on('click', function () {
            // Reset button when loading a new firmware
            self.enableFlashButton(false);
            self.enableLoadRemoteFileButton(false);

            self.developmentFirmwareLoaded = false;

            chrome.fileSystem.chooseEntry({
                type: 'openFile',
                accepts: [
                    {
                        description: 'target files',
                        extensions: ['hex', 'config'],
                    },
                ],
            }, function (fileEntry) {
                if (checkChromeRuntimeError()) {
                    return;
                }

                $('div.build_configuration').slideUp();

                chrome.fileSystem.getDisplayPath(fileEntry, function (path) {
                    console.log('Loading file from:', path);

                    fileEntry.file(function (file) {
                        const reader = new FileReader();

                        reader.onloadend = function(e) {
                            if (e.total !== 0 && e.total === e.loaded) {
                                console.log(`File loaded (${e.loaded})`);

                                if (file.name.split('.').pop() === "hex") {
                                    self.intel_hex = e.target.result;

                                    parseHex(self.intel_hex, function (data) {
                                        function logHexResult(result) {
                                            if (!result) {
                                                console.error("解析失败：result 为空");
                                                return;
                                            }

                                            console.log("%c --- Intel HEX 解析摘要 --- ", "background: #222; color: #bada55; font-size: 14px;");
                                            console.log(`总字节数: %c${result.bytes_total}`, "color: blue; font-weight: bold;");
                                            console.log(`文件结束符: ${result.end_of_file ? "✅ 已读到" : "❌ 未找到"}`);
                                            console.log(`程序起始地址 (Entry Point): 0x${result.start_linear_address.toString(16).toUpperCase()}`);

                                            // 处理每一节的数据详情（不打印 data 数组本身）
                                            const summary = result.data.map((block, index) => {
                                                const startAddr = block.address;
                                                const endAddr = block.address + block.bytes - 1;

                                                return {
                                                    "分节 (Index)": index,
                                                    "起始地址 (Hex)": `0x${startAddr.toString(16).toUpperCase().padStart(8, '0')}`,
                                                    "起始地址 (Dec)": startAddr,
                                                    "结束地址 (Hex)": `0x${endAddr.toString(16).toUpperCase().padStart(8, '0')}`,
                                                    "字节大小 (Bytes)": block.bytes,
                                                    "占比": ((block.bytes / result.bytes_total) * 100).toFixed(2) + "%"
                                                };
                                            });

                                            // 以表格形式展示，非常清晰
                                            console.table(summary);
                                        }
                                        logHexResult(data);
                                        if (data) {
                                            const BASE_ADDRESS_OFFSET = 0x08000000;
                                            const UPPER_BOUND = 0x80000; // 0x80000 (不包含)

                                            // 遍历数据分节进行局部偏移
                                            data.data.forEach(block => {
                                                /**
                                                 * 仅作用于地址在 0x0 到 0x7FFFF 之间的数据
                                                 */

                                                if (block.address >= 0 && block.address < UPPER_BOUND) {
                                                    const oldAddr = block.address;
                                                    block.address += BASE_ADDRESS_OFFSET;

                                                    console.log(`数据块地址偏移: 0x${oldAddr.toString(16)} -> 0x${block.address.toString(16)}`);
                                                }
                                            });

                                            // 最后赋值给全局变量
                                            self.parsed_hex = data;
                                        }
                                        logHexResult(self.parsed_hex);

                                        if (self.parsed_hex) {
                                            self.localFirmwareLoaded = true;

                                            showLoadedHex(file.name);
                                        } else {
                                            self.flashingMessage(i18n.getMessage('firmwareFlasherHexCorrupted'), self.FLASH_MESSAGE_TYPES.INVALID);
                                        }
                                    });
                                } else {
                                    clearBufferedFirmware();

                                    let config = cleanUnifiedConfigFile(e.target.result);
                                    if (config !== null) {
                                        setBoardConfig(config, file.name);

                                        if (self.isConfigLocal && !self.parsed_hex) {
                                            self.flashingMessage(i18n.getMessage('firmwareFlasherLoadedConfig'), self.FLASH_MESSAGE_TYPES.NEUTRAL);
                                        }

                                        if ((self.isConfigLocal && self.parsed_hex && !self.localFirmwareLoaded) || self.localFirmwareLoaded) {
                                            self.enableFlashButton(true);
                                            self.flashingMessage(i18n.getMessage('firmwareFlasherFirmwareLocalLoaded', self.parsed_hex.bytes_total), self.FLASH_MESSAGE_TYPES.NEUTRAL);
                                        }
                                    }
                                }
                            }
                        };

                        reader.readAsText(file);
                    });
                });
            });
        });

        /**
         * Lock / Unlock the firmware download button according to the firmware selection dropdown.
         */
        $('select[name="firmware_version"]').change((evt) => {
                selectFirmware($("option:selected", evt.target).val());
            },
        );

        $('a.cloud_build_cancel').on('click', function (evt) {
            $('a.cloud_build_cancel').toggleClass('disabled', true);
            self.cancelBuild = true;
        });

        $('a.load_remote_file').on('click', function (evt) {
            if (!self.selectedBoard) {
                return;
            }

            // Reset button when loading a new firmware
            self.enableFlashButton(false);
            self.enableLoadRemoteFileButton(false);

            self.localFirmwareLoaded = false;
            self.developmentFirmwareLoaded = buildTypesToShow[$('select[name="build_type"]').val()].tag === 'firmwareFlasherOptionLabelBuildTypeDevelopment';

            if ($('select[name="firmware_version"]').val() === "0") {
                gui_log(i18n.getMessage('firmwareFlasherNoFirmwareSelected'));
                return;
            }

            function onLoadFailed() {
                $('span.progressLabel').attr('i18n','firmwareFlasherFailedToLoadOnlineFirmware').removeClass('i18n-replaced');
                self.enableLoadRemoteFileButton(true);
                $("a.load_remote_file").text(i18n.getMessage('firmwareFlasherButtonLoadOnline'));
                i18n.localizePage();
            }

            function updateStatus(status, key, val, showLog) {
                if (showLog === true) {
                    $('div.release_info #cloudTargetLog').text(i18n.getMessage(`firmwareFlasherCloudBuildLogUrl`)).prop('href', `https://build.betaflight.com/api/builds/${key}/log`);
                }
                $('div.release_info #cloudTargetStatus').text(i18n.getMessage(`firmwareFlasherCloudBuild${status}`));
                $('.buildProgress').val(val);
            }

            function processBuildSuccess(response, statusResponse, suffix) {
                if (statusResponse.status !== 'success') {
                    return;
                }
                updateStatus(`Success${suffix}`, response.key, 100, true);
                if (statusResponse.configuration !== undefined && !self.isConfigLocal) {
                    setBoardConfig(statusResponse.configuration);
                }
                self.buildApi.loadTargetHex(response.url, (hex) => onLoadSuccess(hex, response.file), onLoadFailed);
            }

            function processBuildFailure(key, suffix) {
                updateStatus(`Fail${suffix}`, key, 0, true);
                onLoadFailed();
            }

            function requestCloudBuild(targetDetail) {
                let request = {
                    target: targetDetail.target,
                    release: targetDetail.release,
                    options: [],
                };

                const coreBuild = (targetDetail.cloudBuild !== true) || $('input[name="coreBuildModeCheckbox"]').is(':checked');
                if (coreBuild === true) {
                    request.options.push("CORE_BUILD");
                } else {
                    request.options.push("CLOUD_BUILD");
                    $('select[name="radioProtocols"] option:selected').each(function () {
                        request.options.push($(this).val());
                    });

                    $('select[name="telemetryProtocols"] option:selected').each(function () {
                        request.options.push($(this).val());
                    });

                    $('select[name="options"] option:selected').each(function () {
                        request.options.push($(this).val());
                    });

                    $('select[name="motorProtocols"] option:selected').each(function () {
                        request.options.push($(this).val());
                    });

                    if ($('input[name="expertModeCheckbox"]').is(':checked')) {
                        if (targetDetail.releaseType === "Unstable") {
                            request.commit = $('select[name="commits"] option:selected').val();
                        }

                        $('input[name="customDefines"]').val().split(' ').map(element => element.trim()).forEach(v => {
                            request.options.push(v);
                        });
                    }
                }

                console.info("Build request:", request);
                self.buildApi.requestBuild(request, (response) => {
                    console.info("Build response:", response);

                    // Complete the summary object to be used later
                    self.targetDetail.file = response.file;

                    if (!targetDetail.cloudBuild) {
                        // it is a previous release, so simply load the hex
                        self.buildApi.loadTargetHex(response.url, (hex) => onLoadSuccess(hex, response.file), onLoadFailed);
                        return;
                    }

                    updateStatus('Pending', response.key, 0, false);
                    self.cancelBuild = false;

                    self.buildApi.requestBuildStatus(response.key, (statusResponse) => {
                        if (statusResponse.status === "success") {
                            // will be cached already, no need to wait.
                            processBuildSuccess(response, statusResponse, "Cached");
                            return;
                        }

                        self.enableCancelBuildButton(true);
                        const retrySeconds = 5;
                        let retries = 1;
                        let processing = false;
                        let timeout = 120;
                        const timer = setInterval(() => {
                            self.buildApi.requestBuildStatus(response.key, (statusResponse) => {
                                if (statusResponse.timeOut !== undefined) {
                                    if (!processing) {
                                        processing = true;
                                        retries = 1;
                                    }
                                    timeout = statusResponse.timeOut;
                                }
                                const retryTotal = timeout / retrySeconds;

                                if (statusResponse.status !== 'queued' || retries > retryTotal || self.cancelBuild) {
                                    self.enableCancelBuildButton(false);
                                    clearInterval(timer);

                                    if (statusResponse.status === 'success') {
                                        processBuildSuccess(response, statusResponse, "");
                                        return;
                                    }

                                    let suffix = "";
                                    if (retries > retryTotal) {
                                        suffix = "TimeOut";
                                    }

                                    if (self.cancelBuild) {
                                        suffix = "Cancel";
                                    }
                                    processBuildFailure(response.key, suffix);
                                    return;
                                }

                                if (processing) {
                                    updateStatus('Processing', response.key, retries * (100 / retryTotal), false);
                                }
                                retries++;
                            });
                        }, retrySeconds * 1000);
                    });
                }, () => {
                    updateStatus('FailRequest', '', 0, false);
                    onLoadFailed();
                });
            }

            if (self.targetDetail) { // undefined while list is loading or while running offline
                $("a.load_remote_file").text(i18n.getMessage('firmwareFlasherButtonDownloading'));
                self.enableLoadRemoteFileButton(false);

                showReleaseNotes(self.targetDetail);

                requestCloudBuild(self.targetDetail);
            } else {
                $('span.progressLabel').attr('i18n','firmwareFlasherFailedToLoadOnlineFirmware').removeClass('i18n-replaced');
                i18n.localizePage();
            }
        });

        const exitDfuElement = $('a.exit_dfu');

        exitDfuElement.on('click', function () {
            self.enableDfuExitButton(false);

            if (!GUI.connect_lock) { // button disabled while flashing is in progress
                tracking.sendEvent(tracking.EVENT_CATEGORIES.FLASHING, 'ExitDfu', null);
                try {
                    console.log('Closing DFU');
                    STM32DFU.connect(usbDevices, self.parsed_hex, { exitDfu: true });
                } catch (e) {
                    console.log(`Exiting DFU failed: ${e.message}`);
                }
            }
        });

        portPickerElement.on('change', function () {
            if (GUI.active_tab === 'firmware_flasher') {
                if (!GUI.connect_lock) {
                    if ($('option:selected', this).data().isDFU) {
                        self.enableDfuExitButton(true);
                    } else {
                        if (!self.isFlashing) {
                            // Porthandler resets board on port detect
                            if (self.allowBoardDetection && self.boardNeedsVerification) {
                                // reset to prevent multiple calls
                                self.boardNeedsVerification = false;
                                self.verifyBoard();
                            }
                            if (self.selectedBoard) {
                                self.enableLoadRemoteFileButton(true);
                                self.enableLoadFileButton(true);
                            }
                        }
                        self.enableDfuExitButton(false);
                        self.updateDetectBoardButton();
                    }
                }
            }
        }).trigger('change');

        const targetSupportInfo = $('#targetSupportInfoUrl');

        targetSupportInfo.on('click', function() {
            let urlSupport = 'https://betaflight.com/docs/wiki/boards/archive/Missing';                 // general board missing
            const urlBoard = `https://betaflight.com/docs/wiki/boards/current/${self.selectedBoard}`;   // board description
            if (urlExists(urlBoard)) {
                urlSupport = urlBoard;
            }
            targetSupportInfo.attr("href", urlSupport);
        });

        const detectBoardElement = $('a.detect-board');

        detectBoardElement.on('click', () => {
            detectBoardElement.toggleClass('disabled', true);
            self.boardNeedsVerification = false;

            self.verifyBoard();
            // prevent spamming the button
            setTimeout(() => detectBoardElement.toggleClass('disabled', false), 1000);
        });

        $('a.flash_firmware').on('click', function () {
            self.isFlashing = true;
            const isFlashOnConnect = $('input.flash_on_connect').is(':checked');

            self.enableFlashButton(false);
            self.enableDfuExitButton(false);
            self.enableLoadRemoteFileButton(false);
            self.enableLoadFileButton(false);

            function initiateFlashing() {
                if (self.developmentFirmwareLoaded && !isFlashOnConnect) {
                    checkShowAcknowledgementDialog();
                } else {
                    startFlashing();
                }
            }

            // Backup not available in DFU, manual or virtual mode.
            // When flash on connect is enabled, the backup dialog is not shown.
            if (self.isSerialPortAvailable() && !isFlashOnConnect) {
                GUI.showYesNoDialog(
                    {
                        title: i18n.getMessage('firmwareFlasherRemindBackupTitle'),
                        text: i18n.getMessage('firmwareFlasherRemindBackup'),
                        buttonYesText: i18n.getMessage('firmwareFlasherBackup'),
                        buttonNoText: i18n.getMessage('firmwareFlasherBackupIgnore'),
                        buttonYesCallback: () => firmware_flasher.backupConfig(initiateFlashing),
                        buttonNoCallback: initiateFlashing,
                    },
                );
            } else {
                initiateFlashing();
            }
        });

        function checkShowAcknowledgementDialog() {
            const DAY_MS = 86400 * 1000;
            const storageTag = 'lastDevelopmentWarningTimestamp';

            function setAcknowledgementTimestamp() {
                const storageObj = {};
                storageObj[storageTag] = Date.now();
                set$1(storageObj);
            }

            result = get$1(storageTag);
            if (!result[storageTag] || Date.now() - result[storageTag] > DAY_MS) {

                showAcknowledgementDialog(setAcknowledgementTimestamp);
            } else {
                startFlashing();
            }
        }

        function showAcknowledgementDialog(acknowledgementCallback) {
            const dialog = $('#dialogUnstableFirmwareAcknowledgement')[0];
            const flashButtonElement = $('#dialogUnstableFirmwareAcknowledgement-flashbtn');
            const acknowledgeCheckboxElement = $('input[name="dialogUnstableFirmwareAcknowledgement-acknowledge"]');

            acknowledgeCheckboxElement.change(function () {
                if ($(this).is(':checked')) {
                    flashButtonElement.removeClass('disabled');
                } else {
                    flashButtonElement.addClass('disabled');
                }
            });

            flashButtonElement.click(function() {
                dialog.close();

                if (acknowledgeCheckboxElement.is(':checked')) {
                    if (acknowledgementCallback) {
                        acknowledgementCallback();
                    }

                    startFlashing();
                }
            });

            $('#dialogUnstableFirmwareAcknowledgement-cancelbtn').click(function() {
                dialog.close();
            });

            dialog.addEventListener('close', function () {
                acknowledgeCheckboxElement.prop('checked', false).change();
            });

            dialog.showModal();
        }

        function startFlashing() {
            if (!GUI.connect_lock) { // button disabled while flashing is in progress
                if (self.parsed_hex) {
                    try {
                        if (self.config && !self.parsed_hex.configInserted) {
                            const configInserter = new ConfigInserter();

                            if (configInserter.insertConfig(self.parsed_hex, self.config)) {
                                self.parsed_hex.configInserted = true;
                            } else {
                                console.log('Firmware does not support custom defaults.');
                                clearBoardConfig();
                            }
                        }

                        flashFirmware(self.parsed_hex);
                    } catch (e) {
                        console.log(`Flashing failed: ${e.message}`);
                    }
                    // Disable flash on connect after flashing to prevent continuous flashing
                    $('input.flash_on_connect').prop('checked', false).change();
                } else {
                    $('span.progressLabel').attr('i18n','firmwareFlasherFirmwareNotLoaded').removeClass('i18n-replaced');
                    i18n.localizePage();
                }
            }
        }

        $('span.progressLabel').on('click', 'a.save_firmware', function () {
            chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: self.targetDetail.file, accepts: [{description: 'HEX files', extensions: ['hex']}]}, function (fileEntry) {
                if (checkChromeRuntimeError()) {
                    return;
                }

                chrome.fileSystem.getDisplayPath(fileEntry, function (path) {
                    console.log('Saving firmware to:', path);

                    // check if file is writable
                    chrome.fileSystem.isWritableEntry(fileEntry, function (isWritable) {
                        if (isWritable) {
                            const blob = new Blob([self.intel_hex], {type: 'text/plain'});

                            fileEntry.createWriter(function (writer) {
                                let truncated = false;

                                writer.onerror = function (e) {
                                    console.error(e);
                                };

                                writer.onwriteend = function() {
                                    if (!truncated) {
                                        // onwriteend will be fired again when truncation is finished
                                        truncated = true;
                                        writer.truncate(blob.size);

                                        return;
                                    }

                                    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLASHING, 'SaveFirmware', { path: path });
                                };

                                writer.write(blob);
                            }, function (e) {
                                console.error(e);
                            });
                        } else {
                            console.log('You don\'t have write permissions for this file, sorry.');
                            gui_log(i18n.getMessage('firmwareFlasherWritePermissions'));
                        }
                    });
                });
            });
        });

        $('input.flash_on_connect').change(function () {
            const status = $(this).is(':checked');

            if (status) {
                const catch_new_port = function () {
                    PortHandler.port_detected('flash_detected_device', function (resultPort) {
                        const port = resultPort[0];

                        if (!GUI.connect_lock) {
                            gui_log(i18n.getMessage('firmwareFlasherFlashTrigger', [port]));
                            console.log(`Detected: ${port} - triggering flash on connect`);

                            // Trigger regular Flashing sequence
                            GUI.timeout_add('initialization_timeout', function () {
                                $('a.flash_firmware').click();
                            }, 100); // timeout so bus have time to initialize after being detected by the system
                        } else {
                            gui_log(i18n.getMessage('firmwareFlasherPreviousDevice', [port]));
                        }

                        // Since current port_detected request was consumed, create new one
                        catch_new_port();
                    }, false, true);
                };

                catch_new_port();
            } else {
                // Cancel the flash on connect
                GUI.timeout_remove('initialization_timeout');

                PortHandler.flush_callbacks();
            }
        }).change();

        self.flashingMessage(i18n.getMessage('firmwareFlasherLoadFirmwareFile'), self.FLASH_MESSAGE_TYPES.NEUTRAL);

        GUI.content_ready(callback);
    }

    self.buildApi.loadTargets(() => {
       $('#content').load("./tabs/firmware_flasher.html", onDocumentLoad);
    });
};


// Helper functions


firmware_flasher.isSerialPortAvailable = function() {
    return PortHandler.port_available && !GUI.connect_lock;
};

firmware_flasher.isWebUsbMode = function() {
    return typeof navigator !== 'undefined' && 'usb' in navigator && !GUI.isNWJS() && !GUI.isCordova();
};

firmware_flasher.restoreFlashUi = function() {
    GUI.connect_lock = false;
    this.isFlashing = false;
    this.enableFlashButton(!!this.parsed_hex);
    this.enableLoadRemoteFileButton(!!this.selectedBoard);
    this.enableLoadFileButton(true);
    this.enableDfuExitButton(!!$('option:selected', $('div#port-picker #port')).data().isDFU);
};

firmware_flasher.showWebUsbDfuGuideDialog = function(onContinue) {
    GUI.showYesNoDialog({
        title: i18n.getMessage('firmwareFlasherWebUsbGuideTitle'),
        text: i18n.getMessage('firmwareFlasherWebUsbGuideText'),
        buttonYesText: i18n.getMessage('firmwareFlasherWebUsbChooseDevice'),
        buttonNoText: i18n.getMessage('cancel'),
        buttonYesCallback: onContinue,
        buttonNoCallback: () => this.restoreFlashUi(),
    });
};

firmware_flasher.showWebUsbDfuRetryDialog = function(firmware, options) {
    GUI.showYesNoDialog({
        title: i18n.getMessage('firmwareFlasherWebUsbRetryTitle'),
        text: i18n.getMessage('firmwareFlasherWebUsbRetryText'),
        buttonYesText: i18n.getMessage('firmwareFlasherWebUsbChooseDevice'),
        buttonNoText: i18n.getMessage('cancel'),
        buttonYesCallback: () => {
            GUI.connect_lock = true;
            this.isFlashing = true;
            STM32DFU.connect(usbDevices, firmware, options);
        },
        buttonNoCallback: () => this.restoreFlashUi(),
    });
};

firmware_flasher.updateDetectBoardButton = function() {
    $('a.detect-board').toggleClass('disabled', !this.isSerialPortAvailable() && this.boardNeedsVerification && this.allowBoardDetection);
};

firmware_flasher.validateBuildKey = function() {
    return this.cloudBuildKey?.length === 32 && navigator.onLine;
};

/**
 *
 *    Auto-detect board and set the dropdown to the correct value
 */

firmware_flasher.verifyBoard = function() {
    const self = this;

    const isFlashOnConnect = $('input.flash_on_connect').is(':checked');

    if (!self.isSerialPortAvailable() || isFlashOnConnect) {
        // return silently as port-picker will trigger again when port becomes available
        return;
    }

    function onClose(success) {
        if (!success) {
            gui_log(i18n.getMessage('firmwareFlasherBoardVerificationFail'));
        }

        serial.disconnect(function () {
            MSP.clearListeners();
            MSP.disconnect_cleanup();
        });

        // re-enable auto-detect
        self.allowBoardDetection = true;
    }

    function onFinish() {
        const board = FC.CONFIG.boardName;
        const boardSelect = $('select[name="board"]');
        const boardSelectOptions = $('select[name="board"] option');
        const target = boardSelect.val();
        let targetAvailable = false;

        if (board) {
            boardSelectOptions.each((_, e) => {
                if ($(e).text() === board) {
                    targetAvailable = true;
                }
            });

            if (board !== target) {
                boardSelect.val(board).trigger('change');
            }

            gui_log(i18n.getMessage(targetAvailable ? 'firmwareFlasherBoardVerificationSuccess' : 'firmwareFlasherBoardVerficationTargetNotAvailable', { boardName: board }));
        }

        onClose(targetAvailable);
    }

    function requestBoardInformation(onSucces, onFail) {
        MSP.send_message(MSPCodes.MSP_API_VERSION, false, false, () => {
            gui_log(i18n.getMessage('apiVersionReceived', FC.CONFIG.apiVersion));

            if (FC.CONFIG.apiVersion.includes('null') || semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_39)) {
                onFail(); // not supported
            } else {
                MSP.send_message(MSPCodes.MSP_FC_VARIANT, false, false, onSucces);
            }
        });
    }

    function getBoardInfo() {
        MSP.send_message(MSPCodes.MSP_BOARD_INFO, false, false, function() {
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                FC.processBuildOptions();
                self.cloudBuildOptions = FC.CONFIG.buildOptions;
            }
            onFinish();
        });
    }

    function getCloudBuildOptions(options) {
        // Do not use FC.CONFIG.buildOptions here as the object gets destroyed.
        self.cloudBuildOptions = options.Request.Options;

        getBoardInfo();
    }

    async function getBuildInfo() {
        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45) && FC.CONFIG.flightControllerIdentifier === 'BTFL') {
            await MSP.promise(MSPCodes.MSP2_GET_TEXT, mspHelper.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.BUILD_KEY));
            await MSP.promise(MSPCodes.MSP2_GET_TEXT, mspHelper.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.CRAFT_NAME));
            await MSP.promise(MSPCodes.MSP_BUILD_INFO);

            // store FC.CONFIG.buildKey as the object gets destroyed after disconnect
            self.cloudBuildKey = FC.CONFIG.buildKey;

            // 3/21/2024 is the date when the build key was introduced
            const supportedDate = new Date('3/21/2024');
            const buildDate = new Date(FC.CONFIG.buildInfo);

            if (self.validateBuildKey() && (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_46) || buildDate < supportedDate)) {
                self.buildApi.requestBuildOptions(self.cloudBuildKey, getCloudBuildOptions, getBoardInfo);
            } else {
                getBoardInfo();
            }
        } else {
            getBoardInfo();
        }
    }

    function onConnect(openInfo) {
        if (openInfo) {
            serial.onReceive.addListener(data => MSP.read(data));
            mspHelper = new MspHelper();
            MSP.listen(mspHelper.process_data.bind(mspHelper));
            requestBoardInformation(getBuildInfo, onClose);
        } else {
            gui_log(i18n.getMessage('serialPortOpenFail'));
        }
    }

    let mspHelper;
    const port = String($('div#port-picker #port').val());
    const baud = $('input.flash_manual_baud').is(':checked') ? parseInt($('#flash_manual_baud_rate').val()) : 115200;
    const isLoaded = self.targets ? Object.keys(self.targets).length > 0 : false;

    if (!isLoaded) {
        console.log('Releases not loaded yet');
        gui_log(i18n.getMessage('firmwareFlasherNoTargetsLoaded'));
        return;
    }

    if (!(serial.connected || serial.connectionId)) {
        // Prevent auto-detect during board verification
        self.allowBoardDetection = false;
        gui_log(i18n.getMessage('firmwareFlasherDetectBoardQuery'));
        serial.connect(port, {bitrate: baud}, onConnect);
    } else {
        console.warn('Attempting to connect while there still is a connection', serial.connected, serial.connectionId, serial.openCanceled);
    }
};

firmware_flasher.getPort = function () {
    return String($('div#port-picker #port').val());
};

/**
 *
 * Bacup the current configuration to a file before flashing in serial mode
 */

firmware_flasher.backupConfig = function (callback) {
    let mspHelper;
    let cliBuffer = '';
    let catchOutputCallback = null;

    function readOutput(callback) {
        catchOutputCallback = callback;
    }

    function writeOutput(text) {
        if (catchOutputCallback) {
            catchOutputCallback(text);
        }
    }

    function readSerial(readInfo) {
        const data = new Uint8Array(readInfo.data);

        for (const charCode of data) {
            const currentChar = String.fromCharCode(charCode);

            switch (charCode) {
                case 10:
                    if (GUI.operating_system === "Windows") {
                        writeOutput(cliBuffer);
                        cliBuffer = '';
                    }
                    break;
                case 13:
                    if (GUI.operating_system !== "Windows") {
                        writeOutput(cliBuffer);
                        cliBuffer = '';
                    }
                    break;
                default:
                    cliBuffer += currentChar;
            }
        }
    }

    function activateCliMode() {
        return new Promise(resolve => {
            const bufferOut = new ArrayBuffer(1);
            const bufView = new Uint8Array(bufferOut);

            cliBuffer = '';
            bufView[0] = 0x23;

            serial.send(bufferOut);

            GUI.timeout_add('enter_cli_mode_done', () => {
                resolve();
            }, 500);
        });
    }

    function sendSerial(line, callback) {
        const bufferOut = new ArrayBuffer(line.length);
        const bufView = new Uint8Array(bufferOut);

        for (let cKey = 0; cKey < line.length; cKey++) {
            bufView[cKey] = line.charCodeAt(cKey);
        }

        serial.send(bufferOut, callback);
    }

    function sendCommand(line, callback) {
        sendSerial(`${line}\n`, callback);
    }

    function readCommand() {
        let timeStamp = performance.now();
        const output = [];
        const commandInterval = "COMMAND_INTERVAL";

        readOutput(str => {
            timeStamp = performance.now();
            output.push(str);
        });

        sendCommand("diff all defaults");

        return new Promise(resolve => {
            GUI.interval_add(commandInterval, () => {
                const currentTime = performance.now();
                if (currentTime - timeStamp > 500) {
                    catchOutputCallback = null;
                    GUI.interval_remove(commandInterval);
                    resolve(output);
                }
            }, 500, false);
        });
    }

    function onFinishClose() {
        MSP.clearListeners();

        // Include timeout in count
        let count = 15;
        // Allow reboot after CLI exit
        const waitOnReboot = () => {
            const disconnect = setInterval(function() {
                if (PortHandler.port_available) {
                    console.log(`Connection ready for flashing in ${count / 10} seconds`);
                    clearInterval(disconnect);
                    // Allow auto-detect after CLI reset
                    self.allowBoardDetection = true;
                    if (callback) {
                        callback();
                    }
                }
                count++;
            }, 100);
        };

        // PortHandler has a 500ms timer - so triple for safety
        setTimeout(waitOnReboot, 1500);
    }

    function onClose() {
        serial.disconnect(onFinishClose);
        MSP.disconnect_cleanup();
    }

    function onSaveConfig() {
        // Prevent auto-detect after CLI reset
        TABS.firmware_flasher.allowBoardDetection = false;

        activateCliMode()
        .then(readCommand)
        .then(output => {
            const prefix = 'cli_backup';
            const suffix = 'txt';
            const text = output.join("\n");
            const filename = generateFilename(prefix, suffix);

            return GUI.saveToTextFileDialog(text, filename, suffix);
        })
        .then(() => sendCommand("exit", onClose));
    }

    function onConnect(openInfo) {
        if (openInfo) {
            mspHelper = new MspHelper();
            serial.onReceive.addListener(readSerial);
            MSP.listen(mspHelper.process_data.bind(mspHelper));

            onSaveConfig();
        } else {
            gui_log(i18n.getMessage('serialPortOpenFail'));

            if (callback) {
                callback();
            }
        }
    }

    const port = this.getPort();

    if (port !== '0') {
        // Prevent auto-detect during backup
        self.allowBoardDetection = false;
        const baud = parseInt($('#flash_manual_baud_rate').val()) || 115200;
        serial.connect(port, {bitrate: baud}, onConnect);
    } else {
        gui_log(i18n.getMessage('firmwareFlasherNoPortSelected'));
    }
};



firmware_flasher.cleanup = function (callback) {
    PortHandler.flush_callbacks();

    // unbind "global" events
    $(document).unbind('keypress');
    $(document).off('click', 'span.progressLabel a');

    if (callback) callback();
};

firmware_flasher.enableCancelBuildButton = function (enabled) {
    $('a.cloud_build_cancel').toggleClass('disabled', !enabled);
    self.cancelBuild = false; // remove the semaphore
};

firmware_flasher.enableFlashButton = function (enabled) {
    $('a.flash_firmware').toggleClass('disabled', !enabled);
};

firmware_flasher.enableLoadRemoteFileButton = function (enabled) {
    $('a.load_remote_file').toggleClass('disabled', !enabled);
};

firmware_flasher.enableLoadFileButton = function (enabled) {
    $('a.load_file').toggleClass('disabled', !enabled);
};

firmware_flasher.enableDfuExitButton = function (enabled) {
    $('a.exit_dfu').toggleClass('disabled', !enabled);
};

firmware_flasher.refresh = function (callback) {
    const self = this;

    GUI.tab_switch_cleanup(function() {
        self.initialize();

        if (callback) {
            callback();
        }
    });
};

firmware_flasher.showDialogVerifyBoard = function (selected, verified, onAbort, onAccept) {
    const dialogVerifyBoard = $('#dialog-verify-board')[0];

    $('#dialog-verify-board-content').html(i18n.getMessage('firmwareFlasherVerifyBoard', {selected_board: selected, verified_board: verified}));

    if (!dialogVerifyBoard.hasAttribute('open')) {
        dialogVerifyBoard.showModal();
        $('#dialog-verify-board-abort-confirmbtn').click(function() {
            dialogVerifyBoard.close();
            onAbort();
        });
        $('#dialog-verify-board-continue-confirmbtn').click(function() {
            dialogVerifyBoard.close();
            onAccept();
        });
    }
};

firmware_flasher.FLASH_MESSAGE_TYPES = {
    NEUTRAL : 'NEUTRAL',
    VALID   : 'VALID',
    INVALID : 'INVALID',
    ACTION  : 'ACTION',
};

firmware_flasher.flashingMessage = function(message, type) {
    let self = this;

    let progressLabel_e = $('span.progressLabel');
    switch (type) {
        case self.FLASH_MESSAGE_TYPES.VALID:
            progressLabel_e.removeClass('invalid actionRequired')
                           .addClass('valid');
            break;
        case self.FLASH_MESSAGE_TYPES.INVALID:
            progressLabel_e.removeClass('valid actionRequired')
                           .addClass('invalid');
            break;
        case self.FLASH_MESSAGE_TYPES.ACTION:
            progressLabel_e.removeClass('valid invalid')
                           .addClass('actionRequired');
            break;
        case self.FLASH_MESSAGE_TYPES.NEUTRAL:
        default:
            progressLabel_e.removeClass('valid invalid actionRequired');
            break;
    }
    if (message !== null) {
        progressLabel_e.html(message);
    }

    return self;
};

firmware_flasher.flashProgress = function(value) {
    $('.progress').val(value);

    return this;
};

firmware_flasher.injectTargetInfo = function (targetConfig, targetName, manufacturerId, commitInfo) {
    const targetInfoLineRegex = /^# config: manufacturer_id: .*, board_name: .*, version: .*$, date: .*\n/gm;

    const config = targetConfig.replace(targetInfoLineRegex, '');

    const targetInfo = `# config: manufacturer_id: ${manufacturerId}, board_name: ${targetName}, version: ${commitInfo.commitHash}, date: ${commitInfo.date}`;

    const lines = config.split('\n');
    lines.splice(1, 0, targetInfo);
    return lines.join('\n');
};

TABS.firmware_flasher = firmware_flasher;

export { firmware_flasher };
//# sourceMappingURL=firmware_flasher.js.map
