import { i as i18n, g as get, s as set } from './localization.js';
import { G as GUI, T as TABS, c as checkForConfiguratorUpdates, a as checkSetupAnalytics, C as CliAutoComplete, P as PortHandler, D as DarkTheme, s as setDarkTheme } from './js/main.js';
import { $ } from './jquery.js';
import { C as CONFIGURATOR } from './common.js';
import './i18next.js';
import './@babel.js';
import './i18next-xhr-backend.js';
import './gui_log.js';
import './window_watchers.js';
import './js/jquery.js';
import './@korzio.js';
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
import './semver.js';
import './lru-cache.js';
import './yallist.js';
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

const options = {};
options.initialize = function (callback) {
    if (GUI.active_tab !== 'options') {
        GUI.active_tab = 'options';
    }

    $('#content').load("./tabs/options.html", function () {
        i18n.localizePage();

        TABS.options.initRememberLastTab();
        TABS.options.initCheckForConfiguratorUnstableVersions();
        TABS.options.initAnalyticsOptOut();
        TABS.options.initCliAutoComplete();
        TABS.options.initShowAllSerialDevices();
        TABS.options.initUseMdnsBrowser();
        TABS.options.initShowVirtualMode();
        TABS.options.initCordovaForceComputerUI();
        TABS.options.initDarkTheme();
        TABS.options.initShowDevToolsOnStartup();

        TABS.options.initShowWarnings();

        GUI.content_ready(callback);
    });
};

options.cleanup = function (callback) {
    if (callback) {
        callback();
    }
};

options.initShowWarnings = function () {
    const result = get('showPresetsWarningBackup');
    if (result.showPresetsWarningBackup) {
        $('div.presetsWarningBackup input').prop('checked', true);
    }

    $('div.presetsWarningBackup input').change(function () {
        const checked = $(this).is(':checked');
        set({'showPresetsWarningBackup': checked});
    }).change();
};

options.initRememberLastTab = function () {
    const result = get('rememberLastTab');
    $('div.rememberLastTab input')
        .prop('checked', !!result.rememberLastTab)
        .change(function() { set({rememberLastTab: $(this).is(':checked')}); })
        .change();
};

options.initCheckForConfiguratorUnstableVersions = function () {
    const result = get('checkForConfiguratorUnstableVersions');
    if (result.checkForConfiguratorUnstableVersions) {
        $('div.checkForConfiguratorUnstableVersions input').prop('checked', true);
    }

    $('div.checkForConfiguratorUnstableVersions input').change(function () {
        const checked = $(this).is(':checked');

        set({'checkForConfiguratorUnstableVersions': checked});

        checkForConfiguratorUpdates();
    });
};

options.initAnalyticsOptOut = function () {
    const result = get('analyticsOptOut');
    if (result.analyticsOptOut) {
        $('div.analyticsOptOut input').prop('checked', true);
    }

    $('div.analyticsOptOut input').change(function () {
        const checked = $(this).is(':checked');

        set({'analyticsOptOut': checked});

        checkSetupAnalytics(function (analyticsService) {
            if (checked) {
                analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'OptOut');
            }

            analyticsService.setOptOut(checked);

            if (!checked) {
                analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'OptIn');
            }
        });
    }).change();
};

options.initCliAutoComplete = function () {
    $('div.cliAutoComplete input')
        .prop('checked', CliAutoComplete.configEnabled)
        .change(function () {
            const checked = $(this).is(':checked');

            set({'cliAutoComplete': checked});
            CliAutoComplete.setEnabled(checked);
        }).change();
};

options.initAutoConnectConnectionTimeout = function () {
    const result = get('connectionTimeout');
    if (result.connectionTimeout) {
        $('#connectionTimeoutSelect').val(result.connectionTimeout);
    }
    $('#connectionTimeoutSelect').on('change', function () {
        const value = parseInt($(this).val());
        set({'connectionTimeout': value});
    });
};

options.initShowAllSerialDevices = function() {
    const showAllSerialDevicesElement = $('div.showAllSerialDevices input');
    const result = get('showAllSerialDevices');
    showAllSerialDevicesElement
        .prop('checked', !!result.showAllSerialDevices)
        .on('change', () => {
            set({ showAllSerialDevices: showAllSerialDevicesElement.is(':checked') });
            PortHandler.reinitialize();
        });
};

options.initShowVirtualMode = function() {
    const showVirtualModeElement = $('div.showVirtualMode input');
    const result = get('showVirtualMode');
    showVirtualModeElement
        .prop('checked', !!result.showVirtualMode)
        .on('change', () => {
            set({ showVirtualMode: showVirtualModeElement.is(':checked') });
            PortHandler.reinitialize();
        });
};

options.initUseMdnsBrowser = function() {
    const useMdnsBrowserElement = $('div.useMdnsBrowser input');
    const result = get('useMdnsBrowser');
    useMdnsBrowserElement
        .prop('checked', !!result.useMdnsBrowser)
        .on('change', () => {
            set({ useMdnsBrowser: useMdnsBrowserElement.is(':checked') });
            PortHandler.reinitialize();
        });
};

options.initCordovaForceComputerUI = function () {
    if (GUI.isCordova() && cordovaUI.canChangeUI) {
        const result = get('cordovaForceComputerUI');
        if (result.cordovaForceComputerUI) {
            $('div.cordovaForceComputerUI input').prop('checked', true);
        }

        $('div.cordovaForceComputerUI input').change(function () {
            const checked = $(this).is(':checked');

            set({'cordovaForceComputerUI': checked});

            if (typeof cordovaUI.set === 'function') {
                cordovaUI.set();
            }
        });
    } else {
        $('div.cordovaForceComputerUI').hide();
    }
};

options.initDarkTheme = function () {
    $('#darkThemeSelect')
        .val(DarkTheme.configSetting)
        .change(function () {
            const value = parseInt($(this).val());

            set({'darkTheme': value});
            setDarkTheme(value);
        }).change();
};

options.initShowDevToolsOnStartup = function () {
    if (!(CONFIGURATOR.isDevVersion() && GUI.isNWJS())) {
        $('div.showDevToolsOnStartup').hide();
        return;
    }
    const result = get('showDevToolsOnStartup');
    $('div.showDevToolsOnStartup input')
        .prop('checked', !!result.showDevToolsOnStartup)
        .change(function () { set({ showDevToolsOnStartup: $(this).is(':checked') }); })
        .change();
};

// TODO: remove when modules are in place
TABS.options = options;

export { options };
//# sourceMappingURL=options.js.map
