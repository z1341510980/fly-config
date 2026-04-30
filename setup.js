import { i as i18n } from './localization.js';
import { s as semver } from './semver.js';
import { d as MSP, e as MSPCodes, G as GUI, F as Features, t as tracking, i as sensor_status, j as update_dataflash_global, m as mspHelper, k as Beepers, l as reinitializeConnection, T as TABS, n as have_sensor, o as isExpertModeEnabled } from './js/main.js';
import { C as CONFIGURATOR, F as FC, c as checkChromeRuntimeError, f as API_VERSION_1_46, e as API_VERSION_1_45, l as API_VERSION_1_41, M as Model, b as API_VERSION_1_43, A as API_VERSION_1_42 } from './common.js';
import { g as gui_log } from './gui_log.js';
import { g as generateFilename } from './generate_filename.js';
import { $ } from './jquery.js';
import './i18next.js';
import './@babel.js';
import './i18next-xhr-backend.js';
import './@korzio.js';
import './lru-cache.js';
import './yallist.js';
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

// code below is highly experimental, although it runs fine on latest firmware
// the data inside nested objects needs to be verified if deep copy works properly
function configuration_backup(callback) {
    let activeProfile = null;

    let version = CONFIGURATOR.version;

    if (version.indexOf(".") === -1) {
        version = `${version}.0.0`;
    }

    const configuration = {
        'generatedBy': version,
        'apiVersion': FC.CONFIG.apiVersion,
        'profiles': [],
    };

    const profileSpecificData = [
        MSPCodes.MSP_PID_CONTROLLER,
        MSPCodes.MSP_PID,
        MSPCodes.MSP_RC_TUNING,
        MSPCodes.MSP_ACC_TRIM,
        MSPCodes.MSP_SERVO_CONFIGURATIONS,
        MSPCodes.MSP_MODE_RANGES,
        MSPCodes.MSP_ADJUSTMENT_RANGES,
        MSPCodes.MSP_SERVO_MIX_RULES,
        MSPCodes.MSP_RC_DEADBAND,
    ];

    MSP.send_message(MSPCodes.MSP_STATUS, false, false, function () {
        activeProfile = FC.CONFIG.profile;
        select_profile();
    });

    function select_profile() {
        if (activeProfile > 0) {
            MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [0], false, fetch_specific_data);
        } else {
            fetch_specific_data();
        }
    }

    function fetch_specific_data() {
        let fetchingProfile = 0;
        let codeKey = 0;

        function fetch_specific_data_item() {
            if (fetchingProfile < FC.CONFIG.numProfiles) {
                MSP.send_message(profileSpecificData[codeKey], false, false, function () {
                    codeKey++;

                    if (codeKey < profileSpecificData.length) {
                        fetch_specific_data_item();
                    } else {
                        configuration.profiles.push({
                            'PID': jQuery.extend(true, {}, FC.PID),
                            'PIDs': jQuery.extend(true, [], FC.PIDS),
                            'RC': jQuery.extend(true, {}, FC.RC_TUNING),
                            'AccTrim': jQuery.extend(true, [], FC.CONFIG.accelerometerTrims),
                            'ServoConfig': jQuery.extend(true, [], FC.SERVO_CONFIG),
                            'ServoRules': jQuery.extend(true, [], FC.SERVO_RULES),
                            'ModeRanges': jQuery.extend(true, [], FC.MODE_RANGES),
                            'AdjustmentRanges': jQuery.extend(true, [], FC.ADJUSTMENT_RANGES),
                        });

                        configuration.profiles[fetchingProfile].RCdeadband = jQuery.extend(true, {}, FC.RC_DEADBAND_CONFIG);

                        codeKey = 0;
                        fetchingProfile++;

                        MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [fetchingProfile], false, fetch_specific_data_item);
                    }
                });
            } else {
                MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [activeProfile], false, fetch_unique_data);
            }
        }

        // start fetching
        fetch_specific_data_item();
    }

    const uniqueData = [
        MSPCodes.MSP_RX_MAP,
        MSPCodes.MSP_CF_SERIAL_CONFIG,
        MSPCodes.MSP_LED_STRIP_CONFIG,
        MSPCodes.MSP_LED_COLORS,
    ];

    function update_unique_data_list() {
        uniqueData.push(MSPCodes.MSP_LOOP_TIME);
        uniqueData.push(MSPCodes.MSP_ARMING_CONFIG);
        uniqueData.push(MSPCodes.MSP_MOTOR_3D_CONFIG);
        uniqueData.push(MSPCodes.MSP_SENSOR_ALIGNMENT);
        uniqueData.push(MSPCodes.MSP_RX_CONFIG);
        uniqueData.push(MSPCodes.MSP_FAILSAFE_CONFIG);
        uniqueData.push(MSPCodes.MSP_RXFAIL_CONFIG);
        uniqueData.push(MSPCodes.MSP_LED_STRIP_MODECOLOR);
        uniqueData.push(MSPCodes.MSP_MOTOR_CONFIG);
        uniqueData.push(MSPCodes.MSP_RSSI_CONFIG);
        uniqueData.push(MSPCodes.MSP_GPS_CONFIG);
        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
            uniqueData.push(MSPCodes.MSP_COMPASS_CONFIG);
        }
        uniqueData.push(MSPCodes.MSP_FEATURE_CONFIG);
        uniqueData.push(MSPCodes.MSP_MODE_RANGES_EXTRA);
    }

    update_unique_data_list();

    function fetch_unique_data() {
        let codeKey = 0;

        function fetch_unique_data_item() {
            if (codeKey < uniqueData.length) {
                MSP.send_message(uniqueData[codeKey], false, false, function () {
                    codeKey++;
                    fetch_unique_data_item();
                });
            } else {
                configuration.RCMAP = jQuery.extend(true, [], FC.RC_MAP);
                configuration.SERIAL_CONFIG = jQuery.extend(true, {}, FC.SERIAL_CONFIG);
                configuration.LED_STRIP = jQuery.extend(true, [], FC.LED_STRIP);
                configuration.LED_COLORS = jQuery.extend(true, [], FC.LED_COLORS);
                configuration.BOARD_ALIGNMENT_CONFIG = jQuery.extend(true, {}, FC.BOARD_ALIGNMENT_CONFIG);
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    configuration.CRAFT_NAME = FC.CONFIG.craftName;
                    configuration.PILOT_NAME = FC.CONFIG.pilotName;
                } else {
                    configuration.CRAFT_NAME = FC.CONFIG.name;
                    configuration.DISPLAY_NAME = FC.CONFIG.displayName;
                }
                configuration.MIXER_CONFIG = jQuery.extend(true, {}, FC.MIXER_CONFIG);
                configuration.SENSOR_CONFIG = jQuery.extend(true, {}, FC.SENSOR_CONFIG);
                configuration.PID_ADVANCED_CONFIG = jQuery.extend(true, {}, FC.PID_ADVANCED_CONFIG);

                configuration.LED_MODE_COLORS = jQuery.extend(true, [], FC.LED_MODE_COLORS);
                configuration.FC_CONFIG = jQuery.extend(true, {}, FC.FC_CONFIG);
                configuration.ARMING_CONFIG = jQuery.extend(true, {}, FC.ARMING_CONFIG);
                configuration.MOTOR_3D_CONFIG = jQuery.extend(true, {}, FC.MOTOR_3D_CONFIG);
                configuration.SENSOR_ALIGNMENT = jQuery.extend(true, {}, FC.SENSOR_ALIGNMENT);
                configuration.RX_CONFIG = jQuery.extend(true, {}, FC.RX_CONFIG);
                configuration.FAILSAFE_CONFIG = jQuery.extend(true, {}, FC.FAILSAFE_CONFIG);
                configuration.RXFAIL_CONFIG = jQuery.extend(true, [], FC.RXFAIL_CONFIG);
                configuration.RSSI_CONFIG = jQuery.extend(true, {}, FC.RSSI_CONFIG);
                configuration.FEATURE_CONFIG = jQuery.extend(true, {}, FC.FEATURE_CONFIG);
                configuration.MOTOR_CONFIG = jQuery.extend(true, {}, FC.MOTOR_CONFIG);
                configuration.GPS_CONFIG = jQuery.extend(true, {}, FC.GPS_CONFIG);
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    configuration.COMPASS_CONFIG = jQuery.extend(true, {}, FC.COMPASS_CONFIG);
                }
                configuration.BEEPER_CONFIG = jQuery.extend(true, {}, FC.BEEPER_CONFIG);
                configuration.MODE_RANGES_EXTRA = jQuery.extend(true, [], FC.MODE_RANGES_EXTRA);

                save();
            }
        }

        if (GUI.configuration_loaded === true) {
            return fetch_unique_data_item();
        }

        MSP.promise(MSPCodes.MSP_ADVANCED_CONFIG)
        .then(() => MSP.promise(MSPCodes.MSP_SENSOR_CONFIG))
        .then(() => semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)
                ? MSP.promise(MSPCodes.MSP2_GET_TEXT, mspHelper.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.CRAFT_NAME))
                : MSP.promise(MSPCodes.MSP_NAME))
        .then(() => semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)
                ? MSP.promise(MSPCodes.MSP2_GET_TEXT, mspHelper.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.PILOT_NAME)) : Promise.resolve(true))
        .then(() => MSP.promise(MSPCodes.MSP_BOARD_ALIGNMENT_CONFIG))
        .then(() => MSP.promise(MSPCodes.MSP_MIXER_CONFIG))
        .then(() => MSP.promise(MSPCodes.MSP_BEEPER_CONFIG))
        .then(() => fetch_unique_data_item());
    }

    function save() {
        let chosenFileEntry = null;

        const prefix = 'backup';
        const suffix = 'json';

        const filename = generateFilename(prefix, suffix);

        const accepts = [{
            description: `${suffix.toUpperCase()} files`, extensions: [suffix],
        }];

        // create or load the file
        chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: filename, accepts: accepts}, function (fileEntry) {
            if (checkChromeRuntimeError()) {
                return;
            }

            if (!fileEntry) {
                console.log('No file selected, backup aborted.');
                return;
            }

            chosenFileEntry = fileEntry;

            // echo/console log path specified
            chrome.fileSystem.getDisplayPath(chosenFileEntry, function (path) {
                console.log(`Backup file path: ${path}`);
            });

            // change file entry from read only to read/write
            chrome.fileSystem.getWritableEntry(chosenFileEntry, function (fileEntryWritable) {
                // check if file is writable
                chrome.fileSystem.isWritableEntry(fileEntryWritable, function (isWritable) {
                    if (isWritable) {
                        chosenFileEntry = fileEntryWritable;

                        // crunch the config object
                        const serializedConfigObject = JSON.stringify(configuration, null, '\t');
                        const blob = new Blob([serializedConfigObject], {type: 'text/plain'}); // first parameter for Blob needs to be an array

                        chosenFileEntry.createWriter(function (writer) {
                            writer.onerror = function (e) {
                                console.error(e);
                            };

                            let truncated = false;
                            writer.onwriteend = function () {
                                if (!truncated) {
                                    // onwriteend will be fired again when truncation is finished
                                    truncated = true;
                                    writer.truncate(blob.size);

                                    return;
                                }

                                tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'Backup');
                                console.log('Write SUCCESSFUL');
                                if (callback) callback();
                            };

                            writer.write(blob);
                        }, function (e) {
                            console.error(e);
                        });
                    } else {
                        // Something went wrong or file is set to read only and cannot be changed
                        console.log('File appears to be read only, sorry.');
                    }
                });
            });
        });
    }

}

function configuration_restore(callback) {
    let chosenFileEntry = null;

    const accepts = [{
        description: 'JSON files', extensions: ['json'],
    }];

    // load up the file
    chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function (fileEntry) {
        if (checkChromeRuntimeError()) {
            return;
        }

        if (!fileEntry) {
            console.log('No file selected, restore aborted.');
            return;
        }

        chosenFileEntry = fileEntry;

        // echo/console log path specified
        chrome.fileSystem.getDisplayPath(chosenFileEntry, function (path) {
            console.log(`Restore file path: ${path}`);
        });

        // read contents into variable
        chosenFileEntry.file(function (file) {
            const reader = new FileReader();

            reader.onprogress = function (e) {
                if (e.total > 1048576) { // 1 MB
                    // dont allow reading files bigger then 1 MB
                    console.log('File limit (1 MB) exceeded, aborting');
                    reader.abort();
                }
            };

            reader.onloadend = function (e) {
                if ((e.total != 0 && e.total == e.loaded) || GUI.isCordova()) {
                    // Cordova: Ignore verification : seem to have a bug with progressEvent returned
                    console.log('Read SUCCESSFUL');
                    let configuration;
                    try { // check if string provided is a valid JSON
                        configuration = JSON.parse(e.target.result);
                    } catch (err) {
                        // data provided != valid json object
                        console.log(`Data provided != valid JSON string, restore aborted: ${err}`);

                        return;
                    }

                    // validate
                    if (typeof configuration.generatedBy !== 'undefined' && compareVersions(configuration.generatedBy, CONFIGURATOR.BACKUP_FILE_VERSION_MIN_SUPPORTED)) {
                        if (!compareVersions(configuration.generatedBy, "1.14.0") && !migrate(configuration)) {
                            gui_log(i18n.getMessage('backupFileUnmigratable'));
                            return;
                        }
                        if (configuration.FEATURE_CONFIG.features._featureMask) {
                            const features = new Features(FC.CONFIG);
                            features.setMask(configuration.FEATURE_CONFIG.features._featureMask);
                            configuration.FEATURE_CONFIG.features = features;
                        }

                        tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'Restore');

                        configuration_upload(configuration, callback);
                    } else {
                        gui_log(i18n.getMessage('backupFileIncompatible'));
                    }
                }
            };

            reader.readAsText(file);
        });
    });

    function compareVersions(generated, required) {
        if (generated == undefined) {
            return false;
        }
        return semver.gte(generated, required);
    }


    function migrate(configuration) {
        let appliedMigrationsCount = 0;
        let migratedVersion = configuration.generatedBy;
        gui_log(i18n.getMessage('configMigrationFrom', [migratedVersion]));

        if (!compareVersions(migratedVersion, '0.59.1')) {

            // variable was renamed
            configuration.RSSI_CONFIG.channel = configuration.MISC.rssi_aux_channel;
            configuration.MISC.rssi_aux_channel = undefined;

            migratedVersion = '0.59.1';
            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (!compareVersions(migratedVersion, '0.60.1')) {

            // LED_STRIP support was added.
            if (!configuration.LED_STRIP) {
                configuration.LED_STRIP = [];
            }

            migratedVersion = '0.60.1';
            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (!compareVersions(migratedVersion, '0.61.0')) {

            // Changing PID controller via UI was added.
            if (!configuration.PIDs && configuration.PID) {
                configuration.PIDs = configuration.PID;
                configuration.PID = {
                    controller: 0, // assume pid controller 0 was used.
                };
            }

            migratedVersion = '0.61.0';
            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (!compareVersions(migratedVersion, '0.63.0')) {

            // LED Strip was saved as object instead of array.
            if (typeof(configuration.LED_STRIP) == 'object') {
                const fixedLedStrip = [];

                let index = 0;
                while (configuration.LED_STRIP[index]) {
                    fixedLedStrip.push(configuration.LED_STRIP[index++]);
                }
                configuration.LED_STRIP = fixedLedStrip;
            }

            for (let profileIndex = 0; profileIndex < 3; profileIndex++) {
                const RC = configuration.profiles[profileIndex].RC;
                // TPA breakpoint was added
                if (!RC.dynamic_THR_breakpoint) {
                    RC.dynamic_THR_breakpoint = 1500; // firmware default
                }

                // Roll and pitch rates were split
                RC.roll_rate = RC.roll_pitch_rate;
                RC.pitch_rate = RC.roll_pitch_rate;
            }

            migratedVersion = '0.63.0';
            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (configuration.apiVersion == undefined) {
            configuration.apiVersion = "1.0.0"; // a guess that will satisfy the rest of the code
        }
        // apiVersion previously stored without patchlevel
        if (!semver.parse(configuration.apiVersion)) {
            configuration.apiVersion += ".0";
            if (!semver.parse(configuration.apiVersion)) {
                return false;
            }
        }
        if (compareVersions(migratedVersion, '0.63.0') && !compareVersions(configuration.apiVersion, '1.7.0')) {
            // Serial configuation redesigned, 0.63.0 saves old and new configurations.
            const ports = [];
            for (const port of configuration.SERIAL_CONFIG.ports) {
                const oldPort = port;

                const newPort = {
                    identifier: oldPort.identifier,
                    functions: [],
                    msp_baudrate: String(configuration.SERIAL_CONFIG.mspBaudRate),
                    gps_baudrate: String(configuration.SERIAL_CONFIG.gpsBaudRate),
                    telemetry_baudrate: 'AUTO',
                    blackbox_baudrate: '115200',
                };

                switch(oldPort.scenario) {
                    case 1: // MSP, CLI, TELEMETRY, SMARTPORT TELEMETRY, GPS-PASSTHROUGH
                    case 5: // MSP, CLI, GPS-PASSTHROUGH
                    case 8: // MSP ONLY
                        newPort.functions.push('MSP');
                        break;
                    case 2: // GPS
                        newPort.functions.push('GPS');
                        break;
                    case 3: // RX_SERIAL
                        newPort.functions.push('RX_SERIAL');
                        break;
                    case 10: // BLACKBOX ONLY
                        newPort.functions.push('BLACKBOX');
                        break;
                    case 11: // MSP, CLI, BLACKBOX, GPS-PASSTHROUGH
                        newPort.functions.push('MSP');
                        newPort.functions.push('BLACKBOX');
                        break;
                }

                ports.push(newPort);
            }
            configuration.SERIAL_CONFIG = {
                ports: ports,
            };

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (compareVersions(migratedVersion, '0.63.0') && !compareVersions(configuration.apiVersion, '1.8.0')) {
            // api 1.8 exposes looptime and arming config

            if (configuration.FC_CONFIG == undefined) {
                configuration.FC_CONFIG = {
                    loopTime: 3500,
                };
            }

            if (configuration.ARMING_CONFIG == undefined) {
                configuration.ARMING_CONFIG = {
                    auto_disarm_delay:      5,
                    disarm_kill_switch:     1,
                };
            }

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (compareVersions(migratedVersion, '0.63.0')) {
            // backups created with 0.63.0 for firmwares with api < 1.8 were saved with incorrect looptime
            if (configuration.FC_CONFIG.loopTime == 0) {
                //reset it to the default
                configuration.FC_CONFIG.loopTime = 3500;
            }
        }

        if (semver.lt(migratedVersion, '0.66.0')) {
            // api 1.12 updated servo configuration protocol and added servo mixer rules
            for (let profileIndex = 0; profileIndex < configuration.profiles.length; profileIndex++) {
                if (semver.eq(configuration.apiVersion, '1.10.0')) {
                    // drop two unused servo configurations
                    while (configuration.profiles[profileIndex].ServoConfig.length > 8) {
                        configuration.profiles[profileIndex].ServoConfig.pop();
                    }
                }

                for (let i = 0; i < configuration.profiles[profileIndex].ServoConfig.length; i++) {
                    const servoConfig = configuration.profiles[profileIndex].ServoConfig;

                    servoConfig[i].angleAtMin = 45;
                    servoConfig[i].angleAtMax = 45;
                    servoConfig[i].reversedInputSources = 0;

                    // set the rate to 0 if an invalid value is detected.
                    if (servoConfig[i].rate < -100 || servoConfig[i].rate > 100) {
                        servoConfig[i].rate = 0;
                    }
                }

                configuration.profiles[profileIndex].ServoRules = [];
            }

            migratedVersion = '0.66.0';

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (semver.lt(configuration.apiVersion, '1.14.0') && semver.gte(FC.CONFIG.apiVersion, "1.14.0")) {
            // api 1.14 removed old pid controllers
            for (let profileIndex = 0; profileIndex < configuration.profiles.length; profileIndex++) {
                let newPidControllerIndex = configuration.profiles[profileIndex].PID.controller;
                switch (newPidControllerIndex) {
                    case 3:
                    case 4:
                    case 5:
                        newPidControllerIndex = 0;
                        break;
                }
                configuration.profiles[profileIndex].PID.controller = newPidControllerIndex;
            }

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }


        if (compareVersions(migratedVersion, '0.66.0') && !compareVersions(configuration.apiVersion, '1.14.0')) {
            // api 1.14 exposes 3D configuration

            if (configuration.MOTOR_3D_CONFIG == undefined) {
                configuration.MOTOR_3D_CONFIG = {
                    deadband3d_low:         1406,
                    deadband3d_high:        1514,
                    neutral:                1460,
                    deadband3d_throttle:    50,
                };
            }

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }


        if (compareVersions(migratedVersion, '0.66.0') && !compareVersions(configuration.apiVersion, '1.15.0')) {
            // api 1.15 exposes RCdeadband and sensor alignment

            for (let profileIndex = 0; profileIndex < configuration.profiles.length; profileIndex++) {
                 if (configuration.profiles[profileIndex].RCdeadband == undefined) {
                    configuration.profiles[profileIndex].RCdeadband = {
                    deadband:                0,
                    yaw_deadband:            0,
                    alt_hold_deadband:       40,
                    };
                }
            }
            if (configuration.SENSOR_ALIGNMENT == undefined) {
                    configuration.SENSOR_ALIGNMENT = {
                    align_gyro:              0,
                    align_acc:               0,
                    align_mag:               0,
                    };
            }

            // api 1.15 exposes RX_CONFIG, FAILSAFE_CONFIG and RXFAIL_CONFIG configuration

            if (configuration.RX_CONFIG == undefined) {
                configuration.RX_CONFIG = {
                    serialrx_provider:      0,
                    spektrum_sat_bind:      0,
                    stick_center:           1500,
                    stick_min:              1100,
                    stick_max:              1900,
                    rx_min_usec:            885,
                    rx_max_usec:            2115,
                };
            }

            if (configuration.FAILSAFE_CONFIG == undefined) {
                configuration.FAILSAFE_CONFIG = {
                    failsafe_delay:                 10,
                    failsafe_off_delay:             200,
                    failsafe_throttle:              1000,
                    failsafe_switch_mode:           0,
                    failsafe_throttle_low_delay:    100,
                    failsafe_procedure:             0,
                };
            }

            if (configuration.RXFAIL_CONFIG == undefined) {
                configuration.RXFAIL_CONFIG = [
                    {mode: 0, value: 1500},
                    {mode: 0, value: 1500},
                    {mode: 0, value: 1500},
                    {mode: 0, value: 875},
                ];

                for (let i = 0; i < 14; i++) {
                    const rxfailChannel = {
                        mode:  1,
                        value: 1500,
                    };
                    configuration.RXFAIL_CONFIG.push(rxfailChannel);
                }
            }

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (compareVersions(migratedVersion, '1.2.0')) {
            // old version of the configurator incorrectly had a 'disabled' option for GPS SBAS mode.
            if (FC.GPS_CONFIG.ublox_sbas < 0) {
                FC.GPS_CONFIG.ublox_sbas = 0;
            }
            migratedVersion = '1.2.0';

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (compareVersions(migratedVersion, '1.3.1')) {

            // LED_COLORS & LED_MODE_COLORS support was added.
            if (!configuration.LED_COLORS) {
                configuration.LED_COLORS = [];
            }
            if (!configuration.LED_MODE_COLORS) {
                configuration.LED_MODE_COLORS = [];
            }

            migratedVersion = '1.3.1';

            gui_log(i18n.getMessage('configMigratedTo', [migratedVersion]));
            appliedMigrationsCount++;
        }

        if (appliedMigrationsCount > 0) {
            gui_log(i18n.getMessage('configMigrationSuccessful', [appliedMigrationsCount]));
        }
        return true;
    }

    function configuration_upload(configuration, _callback) {
        function upload() {
            let activeProfile = null;
            let numProfiles = FC.CONFIG.numProfiles;
            if (configuration.profiles.length < numProfiles) {
                numProfiles = configuration.profiles.length;
            }

            const profileSpecificData = [
                MSPCodes.MSP_SET_PID_CONTROLLER,
                MSPCodes.MSP_SET_PID,
                MSPCodes.MSP_SET_RC_TUNING,
                MSPCodes.MSP_SET_ACC_TRIM,
                MSPCodes.MSP_SET_RC_DEADBAND,
            ];

            MSP.send_message(MSPCodes.MSP_STATUS, false, false, function () {
                activeProfile = FC.CONFIG.profile;
                select_profile();
            });

            function select_profile() {
                if (activeProfile > 0) {
                    MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [0], false, upload_specific_data);
                } else {
                    upload_specific_data();
                }
            }

            function upload_specific_data() {
                let savingProfile = 0;
                let codeKey = 0;

                function load_objects(profile) {
                    FC.PID = configuration.profiles[profile].PID;
                    FC.PIDS = configuration.profiles[profile].PIDs;
                    FC.RC_TUNING = configuration.profiles[profile].RC;
                    FC.CONFIG.accelerometerTrims = configuration.profiles[profile].AccTrim;
                    FC.SERVO_CONFIG = configuration.profiles[profile].ServoConfig;
                    FC.SERVO_RULES = configuration.profiles[profile].ServoRules;
                    FC.MODE_RANGES = configuration.profiles[profile].ModeRanges;
                    FC.ADJUSTMENT_RANGES = configuration.profiles[profile].AdjustmentRanges;
                    FC.RC_DEADBAND_CONFIG = configuration.profiles[profile].RCdeadband;
                }

                function upload_using_specific_commands() {
                    MSP.send_message(profileSpecificData[codeKey], mspHelper.crunch(profileSpecificData[codeKey]), false, function () {
                        codeKey++;

                        if (codeKey < profileSpecificData.length) {
                            upload_using_specific_commands();
                        } else {
                            codeKey = 0;
                            savingProfile++;

                            if (savingProfile < numProfiles) {
                                load_objects(savingProfile);

                                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {
                                    MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [savingProfile], false, upload_using_specific_commands);
                                });
                            } else {
                                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function () {
                                    MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [activeProfile], false, upload_unique_data);
                                });
                            }
                        }
                    });
                }

                function upload_servo_configuration() {
                    mspHelper.sendServoConfigurations(upload_mode_ranges);
                }

                function upload_mode_ranges() {
                    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_41)) {
                        if (configuration.MODE_RANGES_EXTRA == undefined) {
                            FC.MODE_RANGES_EXTRA = [];

                            for (let modeIndex = 0; modeIndex < FC.MODE_RANGES.length; modeIndex++) {
                                const defaultModeRangeExtra = {
                                    modeId:     FC.MODE_RANGES[modeIndex].modeId,
                                    modeLogic:  0,
                                    linkedTo:   0,
                                };
                                FC.MODE_RANGES_EXTRA.push(defaultModeRangeExtra);
                            }
                        } else {
                            FC.MODE_RANGES_EXTRA = configuration.MODE_RANGES_EXTRA;
                        }
                    }

                    mspHelper.sendModeRanges(upload_adjustment_ranges);
                }

                function upload_adjustment_ranges() {
                    mspHelper.sendAdjustmentRanges(upload_using_specific_commands);
                }
                // start uploading
                load_objects(0);
                upload_servo_configuration();
            }

            function upload_unique_data() {
                let codeKey = 0;

                const uniqueData = [
                    MSPCodes.MSP_SET_RX_MAP,
                    MSPCodes.MSP_SET_CF_SERIAL_CONFIG,
                ];

                function update_unique_data_list() {
                    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                        uniqueData.push([MSPCodes.MSP2_SET_TEXT, MSPCodes.CRAFT_NAME]);
                        uniqueData.push([MSPCodes.MSP2_SET_TEXT, MSPCodes.PILOT_NAME]);
                    } else {
                        uniqueData.push(MSPCodes.MSP_SET_NAME);
                    }

                    uniqueData.push(MSPCodes.MSP_SET_SENSOR_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_MIXER_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_BEEPER_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_BOARD_ALIGNMENT_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_ADVANCED_CONFIG);

                    uniqueData.push(MSPCodes.MSP_SET_LOOP_TIME);
                    uniqueData.push(MSPCodes.MSP_SET_ARMING_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_MOTOR_3D_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_SENSOR_ALIGNMENT);
                    uniqueData.push(MSPCodes.MSP_SET_RX_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_FAILSAFE_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_FEATURE_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_MOTOR_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_GPS_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_COMPASS_CONFIG);
                    uniqueData.push(MSPCodes.MSP_SET_RSSI_CONFIG);
                }

                function load_objects() {
                    FC.MISC = configuration.MISC;
                    FC.RC_MAP = configuration.RCMAP;
                    FC.SERIAL_CONFIG = configuration.SERIAL_CONFIG;
                    FC.LED_STRIP = configuration.LED_STRIP;
                    FC.LED_COLORS = configuration.LED_COLORS;
                    FC.LED_MODE_COLORS = configuration.LED_MODE_COLORS;
                    FC.ARMING_CONFIG = configuration.ARMING_CONFIG;
                    FC.FC_CONFIG = configuration.FC_CONFIG;
                    FC.MOTOR_3D_CONFIG = configuration.MOTOR_3D_CONFIG;
                    FC.SENSOR_ALIGNMENT = configuration.SENSOR_ALIGNMENT;
                    FC.RX_CONFIG = configuration.RX_CONFIG;
                    FC.FAILSAFE_CONFIG = configuration.FAILSAFE_CONFIG;
                    FC.RXFAIL_CONFIG = configuration.RXFAIL_CONFIG;
                    FC.FEATURE_CONFIG = configuration.FEATURE_CONFIG;
                    FC.MOTOR_CONFIG = configuration.MOTOR_CONFIG;
                    FC.GPS_CONFIG = configuration.GPS_CONFIG;
                    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                        FC.COMPASS_CONFIG = configuration.COMPASS_CONFIG;
                    }
                    FC.RSSI_CONFIG = configuration.RSSI_CONFIG;
                    FC.BOARD_ALIGNMENT_CONFIG = configuration.BOARD_ALIGNMENT_CONFIG;
                    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                        FC.CONFIG.craftName = configuration.CRAFT_NAME;
                        FC.CONFIG.pilotName = configuration.PILOT_NAME;
                    } else {
                        FC.CONFIG.name = configuration.CRAFT_NAME;
                        FC.CONFIG.displayName = configuration.DISPLAY_NAME;
                    }
                    FC.MIXER_CONFIG = configuration.MIXER_CONFIG;
                    FC.SENSOR_CONFIG = configuration.SENSOR_CONFIG;
                    FC.PID_ADVANCED_CONFIG = configuration.PID_ADVANCED_CONFIG;

                    FC.BEEPER_CONFIG.beepers = new Beepers(FC.CONFIG);
                    FC.BEEPER_CONFIG.beepers.setDisabledMask(configuration.BEEPER_CONFIG.beepers._beeperDisabledMask);
                    FC.BEEPER_CONFIG.dshotBeaconTone = configuration.BEEPER_CONFIG.dshotBeaconTone;
                    FC.BEEPER_CONFIG.dshotBeaconConditions = new Beepers(FC.CONFIG, [ "RX_LOST", "RX_SET" ]);
                    FC.BEEPER_CONFIG.dshotBeaconConditions.setDisabledMask(configuration.BEEPER_CONFIG.dshotBeaconConditions._beeperDisabledMask);
                }

                function send_unique_data_item() {
                    if (codeKey < uniqueData.length) {
                        const callback = () => {
                            codeKey++;
                            send_unique_data_item();
                        };

                        if (Array.isArray(uniqueData[codeKey])) {
                            MSP.send_message(uniqueData[codeKey][0], mspHelper.crunch(...uniqueData[codeKey]), false, callback);
                        } else {
                            MSP.send_message(uniqueData[codeKey], mspHelper.crunch(uniqueData[codeKey]), false, callback);
                        }
                    } else {
                        send_led_strip_config();
                    }
                }

                load_objects();

                update_unique_data_list();

                // start uploading
                send_unique_data_item();
            }

            function send_led_strip_config() {
                mspHelper.sendLedStripConfig(send_led_strip_colors);
            }

            function send_led_strip_colors() {
                mspHelper.sendLedStripColors(send_led_strip_mode_colors);
            }

            function send_led_strip_mode_colors() {
                mspHelper.sendLedStripModeColors(send_rxfail_config);
            }

            function send_rxfail_config() {
                mspHelper.sendRxFailConfig(save_to_eeprom);
            }

            function save_to_eeprom() {
                MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, reboot);
            }

            function reboot() {
                gui_log(i18n.getMessage('eeprom_saved_ok'));

                GUI.tab_switch_cleanup(function() {
                    MSP.Promise(MSPCodes.MSP_SET_REBOOT)
                    .then(() => reinitializeConnection())
                    .then(() => _callback());
                });
            }
        }

        if (CONFIGURATOR.virtualMode) {
            FC.resetState();
            FC.CONFIG.apiVersion = CONFIGURATOR.virtualApiVersion;

            sensor_status(FC.CONFIG.activeSensors);
            update_dataflash_global();
        }

        upload();
    }
}

const setup = {
    yaw_fix: 0.0,
};

setup.initialize = function (callback) {
    const self = this;

    if (GUI.active_tab != 'setup') {
        GUI.active_tab = 'setup';
    }

    function load_status() {
        MSP.send_message(MSPCodes.MSP_STATUS_EX, false, false, load_mixer_config);
    }

    function load_mixer_config() {
        MSP.send_message(MSPCodes.MSP_MIXER_CONFIG, false, false, load_html);
    }

    function load_html() {
        $('#content').load("./tabs/setup.html", process_html);
    }

    MSP.send_message(MSPCodes.MSP_ACC_TRIM, false, false, load_status);

    function experimentalBackupRestore() {
        const backupButton = $('#content .backup');
        const restoreButton = $('#content .restore');

        backupButton.on('click', () => configuration_backup(() => gui_log(i18n.getMessage('initialSetupBackupSuccess'))));

        restoreButton.on('click', () => configuration_restore(() => {
            // get latest settings
            TABS.setup.initialize();

            gui_log(i18n.getMessage('initialSetupRestoreSuccess'));
        }));

        if (CONFIGURATOR.virtualMode) {
            // saving and uploading an imaginary config to hardware is a bad idea
            backupButton.addClass('disabled');
        } else {
            restoreButton.addClass('disabled');

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                $('.backupRestore').hide();
            }
        }
    }

    function process_html() {
        // translate to user-selected language
        i18n.localizePage();

        experimentalBackupRestore();

        // initialize 3D Model
        self.initModel();

        // set roll in interactive block
        $('span.roll').text(i18n.getMessage('initialSetupAttitude', [0]));
        // set pitch in interactive block
        $('span.pitch').text(i18n.getMessage('initialSetupAttitude', [0]));
        // set heading in interactive block
        $('span.heading').text(i18n.getMessage('initialSetupAttitude', [0]));

        // check if we have accelerometer and magnetometer
        if (!have_sensor(FC.CONFIG.activeSensors, 'acc')) {
            $('a.calibrateAccel').addClass('disabled');
            $('default_btn').addClass('disabled');
        }

        if (!have_sensor(FC.CONFIG.activeSensors, 'mag')) {
            $('a.calibrateMag').addClass('disabled');
            $('default_btn').addClass('disabled');
        }

        self.initializeInstruments();

        $('#arming-disable-flag').attr('title', i18n.getMessage('initialSetupArmingDisableFlagsTooltip'));

        if (isExpertModeEnabled()) {
            $('.initialSetupRebootBootloader').show();
        } else {
            $('.initialSetupRebootBootloader').hide();
        }

        $('a.rebootBootloader').click(function () {
            const buffer = [];
            buffer.push(FC.boardHasFlashBootloader() ? mspHelper.REBOOT_TYPES.BOOTLOADER_FLASH : mspHelper.REBOOT_TYPES.BOOTLOADER);
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, buffer, false);
        });

        // UI Hooks
        $('a.calibrateAccel').click(function () {
            const _self = $(this);

            if (!_self.hasClass('calibrating')) {
                _self.addClass('calibrating');

                // During this period MCU won't be able to process any serial commands because its locked in a for/while loop
                // until this operation finishes, sending more commands through data_poll() will result in serial buffer overflow
                GUI.interval_pause('setup_data_pull');
                MSP.send_message(MSPCodes.MSP_ACC_CALIBRATION, false, false, function () {
                    gui_log(i18n.getMessage('initialSetupAccelCalibStarted'));
                    $('#accel_calib_running').show();
                    $('#accel_calib_rest').hide();
                });

                GUI.timeout_add('button_reset', function () {
                    GUI.interval_resume('setup_data_pull');

                    gui_log(i18n.getMessage('initialSetupAccelCalibEnded'));
                    _self.removeClass('calibrating');
                    $('#accel_calib_running').hide();
                    $('#accel_calib_rest').show();
                }, 2000);
            }
        });

        $('a.calibrateMag').click(function () {
            const _self = $(this);

            if (!_self.hasClass('calibrating') && !_self.hasClass('disabled')) {
                _self.addClass('calibrating');

                MSP.send_message(MSPCodes.MSP_MAG_CALIBRATION, false, false, function () {
                    gui_log(i18n.getMessage('initialSetupMagCalibStarted'));
                    $('#mag_calib_running').show();
                    $('#mag_calib_rest').hide();
                });

                function magCalibResetButton() {
                    gui_log(i18n.getMessage('initialSetupMagCalibEnded'));
                    _self.removeClass('calibrating');
                    $('#mag_calib_running').hide();
                    $('#mag_calib_rest').show();
                }

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    let cycle = 0;
                    const cycleMax = 45;
                    const interval = 1000;
                    const intervalId = setInterval(function () {
                        if (cycle >= cycleMax || (FC.CONFIG.armingDisableFlags & (1 << 12)) === 0) {
                            clearInterval(intervalId);
                            magCalibResetButton();
                        }
                        cycle++;
                    }, interval);
                } else {
                    GUI.timeout_add('button_reset', magCalibResetButton, 30000);
                }
            }
        });

        const dialogConfirmReset = $('.dialogConfirmReset')[0];

        $('a.resetSettings').click(function () {
            dialogConfirmReset.showModal();
        });

        $('.dialogConfirmReset-cancelbtn').click(function() {
            dialogConfirmReset.close();
        });

        $('.dialogConfirmReset-confirmbtn').click(function() {
            dialogConfirmReset.close();
            MSP.send_message(MSPCodes.MSP_RESET_CONF, false, false, function () {
                gui_log(i18n.getMessage('initialSetupSettingsRestored'));

                GUI.tab_switch_cleanup(function () {
                    TABS.setup.initialize();
                });
            });
        });

        // display current yaw fix value (important during tab re-initialization)
        $('div#interactive_block > a.reset').text(i18n.getMessage('initialSetupButtonResetZaxisValue', [self.yaw_fix]));

        // reset yaw button hook
        $('div#interactive_block > a.reset').click(function () {
            self.yaw_fix = FC.SENSOR_DATA.kinematics[2] * - 1.0;
            $(this).text(i18n.getMessage('initialSetupButtonResetZaxisValue', [self.yaw_fix]));

            console.log(`YAW reset to 0 deg, fix: ${self.yaw_fix} deg`);
        });

        // cached elements
        const bat_voltage_e = $('.bat-voltage'),
            bat_mah_drawn_e = $('.bat-mah-drawn'),
            bat_mah_drawing_e = $('.bat-mah-drawing'),
            rssi_e = $('.rssi'),
            cputemp_e = $('.cpu-temp'),
            arming_disable_flags_e = $('.arming-disable-flags'),
            gpsFix_e = $('.GPS_info span.colorToggle'),
            gpsSats_e = $('.gpsSats'),
            roll_e = $('dd.roll'),
            pitch_e = $('dd.pitch'),
            heading_e = $('dd.heading'),
            sonar_e = $('.sonarAltitude'),
            // Sensor info
            sensor_gyro_e = $('.sensor_gyro_hw'),
            sensor_acc_e = $('.sensor_acc_hw'),
            sensor_mag_e = $('.sensor_mag_hw'),
            sensor_baro_e = $('.sensor_baro_hw'),
            sensor_sonar_e = $('.sensor_sonar_hw'),
            // Firmware info
            msp_api_e = $('.api-version'),
            build_date_e = $('.build-date'),
            build_info_e = $('.build-info');

        // DISARM FLAGS
        // We add all the arming/disarming flags available, and show/hide them if needed.
        // align with betaflight runtime_config.h armingDisableFlags_e
        const prepareDisarmFlags = function() {

            let disarmFlagElements = [
                'NO_GYRO',
                'FAILSAFE',
                'RX_FAILSAFE',
                'BAD_RX_RECOVERY',
                'BOXFAILSAFE',
                'RUNAWAY_TAKEOFF',
                // 'CRASH_DETECTED', only from API 1.42
                'THROTTLE',
                'ANGLE',
                'BOOT_GRACE_TIME',
                'NOPREARM',
                'LOAD',
                'CALIBRATING',
                'CLI',
                'CMS_MENU',
                'BST',
                'MSP',
                'PARALYZE',
                'GPS',
                'RESC',
                'RPMFILTER',
                // 'REBOOT_REQUIRED', only from API 1.42
                // 'DSHOT_BITBANG',   only from API 1.42
                // 'ACC_CALIBRATION', only from API 1.43
                // 'MOTOR_PROTOCOL',  only from API 1.43
                // 'ARM_SWITCH',           // Needs to be the last element, since it's always activated if one of the others is active when arming
            ];

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                disarmFlagElements.splice(disarmFlagElements.indexOf('THROTTLE'), 0, 'CRASH_DETECTED');
                disarmFlagElements = disarmFlagElements.concat(['REBOOT_REQUIRED',
                                                                'DSHOT_BITBANG']);
            }

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                disarmFlagElements = disarmFlagElements.concat(['ACC_CALIBRATION', 'MOTOR_PROTOCOL']);
            }

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                disarmFlagElements.splice(disarmFlagElements.indexOf('RPMFILTER'), 0, 'DSHOT_TELEM');
            }

            // Always the latest element
            disarmFlagElements = disarmFlagElements.concat(['ARM_SWITCH']);

            // Arming allowed flag
            arming_disable_flags_e.append('<span id="initialSetupArmingAllowed" i18n="initialSetupArmingAllowed" style="display: none;"></span>');

            // Arming disabled flags
            for (let i = 0; i < FC.CONFIG.armingDisableCount; i++) {

                // All the known elements but the ARM_SWITCH (it must be always the last element)
                if (i < disarmFlagElements.length - 1) {
                    const messageKey = `initialSetupArmingDisableFlagsTooltip${disarmFlagElements[i]}`;
                    arming_disable_flags_e.append(`<span id="initialSetupArmingDisableFlags${i}" class="cf_tip disarm-flag" title="${i18n.getMessage(messageKey)}" style="display: none;">${disarmFlagElements[i]}</span>`);

                // The ARM_SWITCH, always the last element
                } else if (i == FC.CONFIG.armingDisableCount - 1) {
                    arming_disable_flags_e.append(`<span id="initialSetupArmingDisableFlags${i}" class="cf_tip disarm-flag" title="${i18n.getMessage('initialSetupArmingDisableFlagsTooltipARM_SWITCH')}" style="display: none;">ARM_SWITCH</span>`);

                // Unknown disarm flags
                } else {
                    arming_disable_flags_e.append(`<span id="initialSetupArmingDisableFlags${i}" class="disarm-flag" style="display: none;">${i + 1}</span>`);
                }
            }
        };

        const showSensorInfo = function() {
            const gyroElements = [
                'NONE',
                'DEFAULT',
                'MPU6050',
                'L3G4200D',
                'MPU3050',
                'L3GD20',
                'MPU6000',
                'MPU6500',
                'MPU9250',
                'ICM20601',
                'ICM20602',
                'ICM20608G',
                'ICM20649',
                'ICM20689',
                'ICM42605',
                'ICM42688P',
                'BMI160',
                'BMI270',
                'LSM6DSO',
                'LSM6DSV16X',
                'VIRTUAL',
                "ICM42622P",
            ];

            const accElements = [
                'DEFAULT',
                'NONE',
                'ADXL345',
                'MPU6050',
                'MMA8452',
                'BMA280',
                'LSM303DLHC',
                'MPU6000',
                'MPU6500',
                'MPU9250',
                'ICM20601',
                'ICM20602',
                'ICM20608G',
                'ICM20649',
                'ICM20689',
                'ICM42605',
                'ICM42688P',
                'BMI160',
                'BMI270',
                'LSM6DSO',
                'LSM6DSV16X',
                'VIRTUAL',
                "ICM42622P",
            ];

            const magElements = [
                'DEFAULT',
                'NONE',
                'HMC5883',
                'AK8975',
                'AK8963',
                'QMC5883',
                'LIS2MDL',
                'LIS3MDL',
                'MPU925X_AK8963',
                'IST8310',
            ];

            const baroElements = [
                'DEFAULT',
                'NONE',
                'BMP085',
                'MS5611',
                'BMP280',
                'LPS',
                'QMP6988',
                'BMP388',
                'DPS310',
                '2SMPB_02B',
                'VIRTUAL',
            ];

            const sonarElements = [
                'NONE',
                'HCSR04',
                'TFMINI',
                'TF02',
            ];

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                MSP.send_message(MSPCodes.MSP2_SENSOR_CONFIG_ACTIVE, false, false, function() {
                    // Sensor info
                    const textNA = i18n.getMessage('initialSetupNotInBuild');
                    const textDisabled = i18n.getMessage('initialSetupNotDetected');

                    if (FC.SENSOR_CONFIG_ACTIVE.gyro_hardware == 0xFF) {
                        sensor_gyro_e.text(textNA);
                    } else if (have_sensor(FC.CONFIG.activeSensors, "gyro") && FC.SENSOR_CONFIG_ACTIVE.gyro_hardware > 1) {
                        sensor_gyro_e.text(gyroElements[FC.SENSOR_CONFIG_ACTIVE.gyro_hardware]);
                    } else {
                        sensor_gyro_e.text(textDisabled);
                    }

                    if (FC.SENSOR_CONFIG_ACTIVE.acc_hardware == 0xFF) {
                        sensor_acc_e.text(textNA);
                    } else if (have_sensor(FC.CONFIG.activeSensors, "acc") && FC.SENSOR_CONFIG_ACTIVE.acc_hardware > 1) {
                        sensor_acc_e.text(accElements[FC.SENSOR_CONFIG_ACTIVE.acc_hardware]);
                    } else {
                        sensor_acc_e.text(textDisabled);
                    }

                    if (FC.SENSOR_CONFIG_ACTIVE.baro_hardware == 0xFF) {
                        sensor_baro_e.text(textNA);
                    } else if (have_sensor(FC.CONFIG.activeSensors, "baro") && FC.SENSOR_CONFIG_ACTIVE.baro_hardware > 1) {
                        sensor_baro_e.text(baroElements[FC.SENSOR_CONFIG_ACTIVE.baro_hardware]);
                    } else {
                        sensor_baro_e.text(textDisabled);
                    }

                    if (FC.SENSOR_CONFIG_ACTIVE.mag_hardware == 0xFF) {
                        sensor_mag_e.text(textNA);
                    } else if (have_sensor(FC.CONFIG.activeSensors, "mag") && FC.SENSOR_CONFIG_ACTIVE.mag_hardware > 1) {
                        sensor_mag_e.text(magElements[FC.SENSOR_CONFIG_ACTIVE.mag_hardware]);
                    } else {
                        sensor_mag_e.text(textDisabled);
                    }

                    if (FC.SENSOR_CONFIG_ACTIVE.sonar_hardware == 0xFF) {
                        sensor_sonar_e.text(textNA);
                    } else if (have_sensor(FC.CONFIG.activeSensors, "sonar") && FC.SENSOR_CONFIG_ACTIVE.sonar_hardware > 0) {
                        sensor_sonar_e.text(sonarElements[FC.SENSOR_CONFIG_ACTIVE.sonar_hardware]);
                    } else {
                        sensor_sonar_e.text(textDisabled);
                    }
                });
            }
        };

        function showDialogBuildInfo(title, message) {
            const dialog = $('.dialogBuildInfo')[0];

            $('.dialogBuildInfo-title').html(title);
            $('.dialogBuildInfo-content').html(message);

            if ( ! dialog.hasAttribute('open')) {
                dialog.showModal();
                $('.dialogBuildInfo-closebtn').on('click', function() {
                    dialog.close();
                });
            }
        }

        const showFirmwareInfo = function() {
            // Firmware info
            msp_api_e.text([FC.CONFIG.apiVersion]);
            build_date_e.text([FC.CONFIG.buildInfo]);

            if (navigator.onLine) {
                let buildOptionList = "";

                if (FC.CONFIG.buildOptions.length) {
                    buildOptionList = `<div class="dialogBuildInfoGrid-container">`;
                    for (const buildOptionElement of FC.CONFIG.buildOptions) {
                        buildOptionList += `<div class="dialogBuildInfoGrid-item">${buildOptionElement}</div>`;
                    }
                    buildOptionList += `</div>`;
                    build_info_e.html(`<span class="buildInfoBtn" title="${i18n.getMessage('initialSetupInfoBuildOptions')}">
                        <a class="buildOptions" href=#"><strong>${i18n.getMessage('initialSetupInfoBuildOptionList')}</strong></a></span>`);
                }

                if (FC.CONFIG.buildKey.length === 32) {
                    const buildRoot   = `https://build.betaflight.com/api/builds/${FC.CONFIG.buildKey}`;
                    const buildConfig = `<span class="buildInfoBtn" title="${i18n.getMessage('initialSetupInfoBuildConfig')}: ${buildRoot}/json">
                                         <a href="${buildRoot}/json" target="_blank"><strong>${i18n.getMessage('initialSetupInfoBuildConfig')}</strong></a></span>`;

                    const buildLog =    `<span class="buildInfoBtn" title="${i18n.getMessage('initialSetupInfoBuildLog')}: ${buildRoot}/log">
                                         <a href="${buildRoot}/log" target="_blank"><strong>${i18n.getMessage('initialSetupInfoBuildLog')}</strong></a></span>`;

                    const buildOptions = `<span class="buildInfoBtn" title="${i18n.getMessage('initialSetupInfoBuildOptionList')}">
                                         <a class="buildOptions disabled" href=#"><strong>${i18n.getMessage('initialSetupInfoBuildOptions')}</strong></a></span>`;

                    build_info_e.html(`${buildConfig} ${buildLog} ${buildOptions}`);
                    $('a.buildOptions').on('click', async function() {
                                                    showDialogBuildInfo(`<h3>${i18n.getMessage('initialSetupInfoBuildOptionList')}</h3>`, buildOptionList);
                                                    });
                    $('.build-info a').removeClass('disabled');
                } else {
                    build_info_e.html(i18n.getMessage('initialSetupInfoBuildEmpty'));
                    $('.build-info a').addClass('disabled');
                }
            } else {
                build_info_e.html(i18n.getMessage('initialSetupNotOnline'));
                $('.build-info a').addClass('disabled');
            }
        };

        prepareDisarmFlags();
        showSensorInfo();
        showFirmwareInfo();

        // Show Sonar info box if sensor exist
        if (!have_sensor(FC.CONFIG.activeSensors, 'sonar')) {
            $('.sonarBox').hide();
        }

        function get_slow_data() {

            // Status info is acquired in the background using update_live_status() in serial_backend.js

            $('#initialSetupArmingAllowed').toggle(FC.CONFIG.armingDisableFlags === 0);

            for (let i = 0; i < FC.CONFIG.armingDisableCount; i++) {
                $(`#initialSetupArmingDisableFlags${i}`).css('display',(FC.CONFIG.armingDisableFlags & (1 << i)) === 0 ? 'none':'inline-block');
            }

            // System info is acquired in the background using update_live_status() in serial_backend.js

            bat_voltage_e.text(i18n.getMessage('initialSetupBatteryValue', [FC.ANALOG.voltage]));
            bat_mah_drawn_e.text(i18n.getMessage('initialSetupBatteryMahValue', [FC.ANALOG.mAhdrawn]));
            bat_mah_drawing_e.text(i18n.getMessage('initialSetupBatteryAValue', [FC.ANALOG.amperage.toFixed(2)]));
            rssi_e.text(i18n.getMessage('initialSetupRSSIValue', [((FC.ANALOG.rssi / 1023) * 100).toFixed(0)]));

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46) && FC.CONFIG.cpuTemp) {
                cputemp_e.html(`${FC.CONFIG.cpuTemp.toFixed(0)} &#8451;`);
            } else {
                cputemp_e.text(i18n.getMessage('initialSetupCpuTempNotSupported'));
            }

            // GPS info is acquired in the background using update_live_status() in serial_backend.js
            gpsFix_e.text(FC.GPS_DATA.fix ? i18n.getMessage('gpsFixTrue') : i18n.getMessage('gpsFixFalse'));
            gpsFix_e.toggleClass('ready', FC.GPS_DATA.fix != 0);
            gpsSats_e.text(FC.GPS_DATA.numSat);

            const lat = FC.GPS_DATA.lat / 10000000;
            const lon = FC.GPS_DATA.lon / 10000000;
            const url = `https://maps.google.com/?q=${lat},${lon}`;
            const gpsUnitText = i18n.getMessage('gpsPositionUnit');
            $('.GPS_info td.latLon a').prop('href', url).text(`${lat.toFixed(4)} / ${lon.toFixed(4)} ${gpsUnitText}`);
        }

        function get_fast_data() {
            MSP.send_message(MSPCodes.MSP_ATTITUDE, false, false, function () {
                roll_e.text(i18n.getMessage('initialSetupAttitude', [FC.SENSOR_DATA.kinematics[0]]));
                pitch_e.text(i18n.getMessage('initialSetupAttitude', [FC.SENSOR_DATA.kinematics[1]]));
                heading_e.text(i18n.getMessage('initialSetupAttitude', [FC.SENSOR_DATA.kinematics[2]]));

                self.renderModel();
                self.updateInstruments();
            });
            // get Sonar altitude if sensor exist
            if (have_sensor(FC.CONFIG.activeSensors, 'sonar')) {
                MSP.send_message(MSPCodes.MSP_SONAR, false, false, function () {
                    sonar_e.text(`${FC.SENSOR_DATA.sonar.toFixed(1)} cm`);
                });
            }
        }

        GUI.interval_add('setup_data_pull_fast', get_fast_data, 33, true); // 30 fps
        GUI.interval_add('setup_data_pull_slow', get_slow_data, 250, true); // 4 fps

        GUI.content_ready(callback);
    }
};

setup.initializeInstruments = function() {
    const options = {size:90, showBox : false, img_directory: 'images/flightindicators/'};
    const attitude = $.flightIndicator('#attitude', 'attitude', options);
    const heading = $.flightIndicator('#heading', 'heading', options);

    this.updateInstruments = function() {
        attitude.setRoll(FC.SENSOR_DATA.kinematics[0]);
        attitude.setPitch(FC.SENSOR_DATA.kinematics[1]);
        heading.setHeading(FC.SENSOR_DATA.kinematics[2]);
    };
};

setup.initModel = function () {
    this.model = new Model($('.model-and-info #canvas_wrapper'), $('.model-and-info #canvas'));

    $(window).on('resize', $.proxy(this.model.resize, this.model));
};

setup.renderModel = function () {
    const x = (FC.SENSOR_DATA.kinematics[1] * -1.0) * 0.017453292519943295,
        y = ((FC.SENSOR_DATA.kinematics[2] * -1.0) - this.yaw_fix) * 0.017453292519943295,
        z = (FC.SENSOR_DATA.kinematics[0] * -1.0) * 0.017453292519943295;

    this.model.rotateTo(x, y, z);
};

setup.cleanup = function (callback) {
    if (this.model) {
        $(window).off('resize', $.proxy(this.model.resize, this.model));
        this.model.dispose();
    }

    if (callback) callback();
};

TABS.setup = setup;

export { setup };
//# sourceMappingURL=setup.js.map
