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

    if (chromeApi.fileSystem) {
        return;
    }

    function setLastError(error) {
        chromeApi.runtime.lastError = error ? { message: error.message || String(error) } : null;
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
            name: file?.name || fileOrHandle?.name || 'selected-file',
            async file(callback) {
                const selectedFile = file || await fileOrHandle.getFile();
                callback(selectedFile);
            },
        };
    }

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
        isWritableEntry(_entry, callback) {
            callback(true);
        },
    };
})();
