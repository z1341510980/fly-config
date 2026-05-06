(function () {
    const root = window;
    const chromeApi = root.chrome = root.chrome || {};

    chromeApi.runtime = chromeApi.runtime || {};
    if (!('lastError' in chromeApi.runtime)) {
        chromeApi.runtime.lastError = null;
    }
    if (typeof chromeApi.runtime.getManifest !== 'function') {
        chromeApi.runtime.getManifest = function () {
            return {
                productName: 'Betaflight Configurator',
                version: '10.10.3',
                gitRevision: 'UMIC',
            };
        };
    }
    if (typeof chromeApi.runtime.getURL !== 'function') {
        chromeApi.runtime.getURL = function (filePath) {
            return new URL(filePath, root.location.href).toString();
        };
    }

    function clearLastError() {
        chromeApi.runtime.lastError = null;
    }

    function setLastError(error) {
        chromeApi.runtime.lastError = error ? { message: error.message || String(error) } : null;
    }

    function getUsbApi() {
        return root.navigator?.usb;
    }

    function getUsbFilters(deviceFilter) {
        if (Array.isArray(deviceFilter)) {
            return deviceFilter;
        }

        return deviceFilter?.filters || [];
    }

    function matchesUsbFilter(device, filter) {
        const filters = Object.entries(filter || {});

        if (!filters.length) {
            return true;
        }

        return filters.every(([key, value]) => device?.[key] === value);
    }

    function matchesUsbFilters(device, deviceFilter) {
        const filters = getUsbFilters(deviceFilter);

        if (!filters.length) {
            return true;
        }

        return filters.some(filter => matchesUsbFilter(device, filter));
    }

    function wrapUsbDevice(device) {
        if (!device) {
            return null;
        }

        if (device.__codexWebUsbWrapper) {
            return device.__codexWebUsbWrapper;
        }

        const wrapper = {
            __webDevice: device,
            device: device.serialNumber || device.productName || `${device.vendorId}:${device.productId}`,
            vendorId: device.vendorId,
            productId: device.productId,
            productName: device.productName,
            manufacturerName: device.manufacturerName,
            serialNumber: device.serialNumber,
        };

        Object.defineProperty(device, '__codexWebUsbWrapper', {
            configurable: true,
            enumerable: false,
            value: wrapper,
        });

        return wrapper;
    }

    function unwrapUsbDevice(device) {
        return device?.__webDevice || device || null;
    }

    const usbHandleMap = new Map();
    let usbHandleCounter = 0;

    function createUsbHandle(device) {
        usbHandleCounter += 1;

        const handle = {
            handle: usbHandleCounter,
            __webDevice: device,
        };

        usbHandleMap.set(handle.handle, device);
        return handle;
    }

    function unwrapUsbHandle(handle) {
        return handle?.__webDevice || usbHandleMap.get(handle?.handle) || null;
    }

    async function ensureUsbDeviceReady(device) {
        if (!device) {
            throw new Error('USB device handle is missing');
        }

        if (!device.opened) {
            await device.open();
        }

        if (!device.configuration) {
            const configurationValue = device.configurations?.[0]?.configurationValue || 1;
            await device.selectConfiguration(configurationValue);
        }

        return device;
    }

    function dataViewToArrayBuffer(dataView) {
        if (!dataView) {
            return new ArrayBuffer(0);
        }

        return dataView.buffer.slice(
            dataView.byteOffset,
            dataView.byteOffset + dataView.byteLength,
        );
    }

    function getUsbResultCode(status) {
        return status === 'ok' ? 0 : -1;
    }

    async function getMatchedUsbDevices(deviceFilter) {
        const usb = getUsbApi();

        if (!usb?.getDevices) {
            return [];
        }

        const devices = await usb.getDevices();
        return devices.filter(device => matchesUsbFilters(device, deviceFilter)).map(wrapUsbDevice);
    }

    if (!chromeApi.usb) {
        chromeApi.usb = {
            async getDevices(deviceFilter, callback) {
                clearLastError();

                try {
                    callback(await getMatchedUsbDevices(deviceFilter));
                } catch (error) {
                    setLastError(error);
                    callback([]);
                }
            },
            async requestDevice(deviceFilter, callback) {
                clearLastError();

                const usb = getUsbApi();
                if (!usb?.requestDevice) {
                    setLastError(new Error('WebUSB is not available in this browser or context'));
                    callback(null);
                    return;
                }

                try {
                    const device = await usb.requestDevice({
                        filters: getUsbFilters(deviceFilter),
                    });
                    callback(wrapUsbDevice(device));
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        setLastError(error);
                    }
                    callback(null);
                }
            },
            async openDevice(deviceOrWrapper, callback) {
                clearLastError();

                try {
                    const device = unwrapUsbDevice(deviceOrWrapper);
                    await ensureUsbDeviceReady(device);
                    callback(createUsbHandle(device));
                } catch (error) {
                    setLastError(error);
                    callback(null);
                }
            },
            async closeDevice(handle, callback) {
                clearLastError();

                try {
                    const device = unwrapUsbHandle(handle);
                    if (device?.opened) {
                        await device.close();
                    }
                    callback?.(true);
                } catch (error) {
                    setLastError(error);
                    callback?.(false);
                }
            },
            async claimInterface(handle, interfaceNumber, callback) {
                clearLastError();

                try {
                    const device = await ensureUsbDeviceReady(unwrapUsbHandle(handle));
                    await device.claimInterface(interfaceNumber);
                    callback?.();
                } catch (error) {
                    setLastError(error);
                    callback?.();
                }
            },
            async releaseInterface(handle, interfaceNumber, callback) {
                clearLastError();

                try {
                    const device = unwrapUsbHandle(handle);
                    if (device?.opened) {
                        await device.releaseInterface(interfaceNumber);
                    }
                    callback?.();
                } catch (error) {
                    setLastError(error);
                    callback?.();
                }
            },
            async resetDevice(handle, callback) {
                clearLastError();

                try {
                    const device = unwrapUsbHandle(handle);
                    if (device?.reset) {
                        await device.reset();
                    }
                    callback?.(true);
                } catch (error) {
                    setLastError(error);
                    callback?.(false);
                }
            },
            async getConfiguration(handle, callback) {
                clearLastError();

                try {
                    const device = unwrapUsbHandle(handle);
                    const configuration = device?.configuration || device?.configurations?.[0] || { interfaces: [] };
                    callback?.(configuration);
                } catch (error) {
                    setLastError(error);
                    callback?.({ interfaces: [] });
                }
            },
            async controlTransfer(handle, transferInfo, callback) {
                clearLastError();

                try {
                    const device = await ensureUsbDeviceReady(unwrapUsbHandle(handle));
                    const setup = {
                        requestType: transferInfo.requestType,
                        recipient: transferInfo.recipient,
                        request: transferInfo.request,
                        value: transferInfo.value,
                        index: transferInfo.index,
                    };

                    if (transferInfo.direction === 'in') {
                        const result = await device.controlTransferIn(setup, transferInfo.length);
                        callback?.({
                            resultCode: getUsbResultCode(result.status),
                            data: dataViewToArrayBuffer(result.data),
                        });
                        return;
                    }

                    const data = transferInfo.data ? new Uint8Array(transferInfo.data) : new Uint8Array(0);
                    const result = await device.controlTransferOut(setup, data);
                    callback?.({
                        resultCode: getUsbResultCode(result.status),
                        bytesWritten: result.bytesWritten || 0,
                    });
                } catch (error) {
                    setLastError(error);
                    callback?.({
                        resultCode: -1,
                        data: new ArrayBuffer(0),
                        bytesWritten: 0,
                    });
                }
            },
        };
    }

    if (chromeApi.fileSystem) {
        return;
    }

    function normalizeExtension(extension) {
        return `.${String(extension).replace(/^\./, '')}`;
    }

    function filePickerTypes(accepts) {
        return (accepts || []).map(accept => {
            const extensions = (accept.extensions || []).map(normalizeExtension);

            return {
                description: accept.description || '',
                accept: {
                    'application/octet-stream': extensions,
                    'text/plain': extensions,
                    'image/*': extensions,
                },
            };
        });
    }

    function acceptAttribute(accepts) {
        return (accepts || [])
            .flatMap(accept => accept.extensions || [])
            .map(normalizeExtension)
            .join(',');
    }

    function downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'download';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function createDownloadWriter(fileName, callback) {
        const writer = {
            length: 0,
            onerror: null,
            onwriteend: null,
            truncate(size) {
                this.length = size;
                queueMicrotask(() => this.onwriteend?.());
            },
            write(blob) {
                try {
                    downloadBlob(blob, fileName);
                    this.length = blob.size;
                    queueMicrotask(() => this.onwriteend?.());
                } catch (error) {
                    this.onerror?.(error);
                }
            },
        };

        callback(writer);
    }

    function createWritableEntry(handle, suggestedName) {
        const fileName = handle?.name || suggestedName || 'download';

        return {
            __webHandle: handle || null,
            name: fileName,
            createWriter(callback, errorCallback) {
                const writer = {
                    length: 0,
                    onerror: null,
                    onwriteend: null,
                    truncate(size) {
                        this.length = size;
                        queueMicrotask(() => this.onwriteend?.());
                    },
                    async write(blob) {
                        try {
                            if (!handle?.createWritable) {
                                downloadBlob(blob, fileName);
                                this.length = blob.size;
                                this.onwriteend?.();
                                return;
                            }
                            const writable = await handle.createWritable();
                            await writable.write(blob);
                            await writable.close();
                            this.length = blob.size;
                            this.onwriteend?.();
                        } catch (error) {
                            this.onerror?.(error);
                        }
                    },
                };

                try {
                    callback(writer);
                } catch (error) {
                    errorCallback?.(error);
                }
            },
        };
    }

    function createReadableEntry(fileOrHandle) {
        const file = fileOrHandle instanceof File ? fileOrHandle : null;

        return {
            __webHandle: fileOrHandle || file || null,
            name: file?.name || fileOrHandle?.name || 'selected-file',
            async file(callback) {
                const selectedFile = file || await fileOrHandle.getFile();
                callback(selectedFile);
            },
        };
    }

    const retainedEntries = new Map();
    let retainedEntryCounter = 0;

    function openFileFallback(options, callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = acceptAttribute(options.accepts);
        input.style.display = 'none';
        input.addEventListener('change', () => {
            setLastError(null);
            callback(input.files?.[0] ? createReadableEntry(input.files[0]) : null);
            input.remove();
        }, { once: true });
        document.body.appendChild(input);
        input.click();
    }

    chromeApi.fileSystem = {
        async chooseEntry(options, callback) {
            setLastError(null);

            try {
                if (options?.type === 'saveFile') {
                    if ('showSaveFilePicker' in root) {
                        const handle = await root.showSaveFilePicker({
                            suggestedName: options.suggestedName,
                            types: filePickerTypes(options.accepts),
                        });
                        callback(createWritableEntry(handle, options.suggestedName));
                    } else {
                        callback(createWritableEntry(null, options.suggestedName));
                    }
                    return;
                }

                if ('showOpenFilePicker' in root) {
                    const handles = await root.showOpenFilePicker({
                        multiple: false,
                        types: filePickerTypes(options?.accepts),
                    });
                    callback(handles[0] ? createReadableEntry(handles[0]) : null);
                    return;
                }

                openFileFallback(options || {}, callback);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setLastError(error);
                }
                callback(null);
            }
        },
        getDisplayPath(entry, callback) {
            callback(entry?.name || '');
        },
        getWritableEntry(entry, callback) {
            callback(entry || null);
        },
        isWritableEntry(_entry, callback) {
            callback(true);
        },
        retainEntry(entry) {
            if (!entry) {
                return null;
            }

            if (!entry.__retainedId) {
                retainedEntryCounter += 1;
                entry.__retainedId = `web-retained-entry-${retainedEntryCounter}`;
            }

            retainedEntries.set(entry.__retainedId, entry);
            return entry.__retainedId;
        },
        restoreEntry(entryId, callback) {
            callback(retainedEntries.get(entryId) || null);
        },
    };
})();
