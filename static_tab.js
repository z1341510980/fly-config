import { i as i18n } from './localization.js';
import { G as GUI, T as TABS } from './js/main.js';
import { $ } from './jquery.js';
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
import './common.js';
import './semver.js';
import './lru-cache.js';
import './yallist.js';
import './three.js';
import './switchery-latest.js';
import './inflection.js';
import './short-unique-id.js';
import './lodash.debounce.js';
import './crypto-es.js';
import './d3-transition.js';
import './d3-dispatch.js';
import './d3-timer.js';
import './d3-interpolate.js';
import './d3-color.js';
import './d3-selection.js';
import './d3-ease.js';
import './d3-zoom.js';

const staticTab = {};
staticTab.initialize = function (staticTabName, callback) {

    if (GUI.active_tab != staticTabName) {
        GUI.active_tab = staticTabName;
    }
    const tabFile = `./tabs/${staticTabName}.html`;

    $('#content').html('<div id="tab-static"><div id="tab-static-contents"></div>');
    $('#tab-static-contents').load(tabFile, function () {
        // translate to user-selected language
        i18n.localizePage();

        GUI.content_ready(callback);
    });

};
// Just noting that other tabs have cleanup functions.

// TODO: remove when modules are in place
TABS.staticTab = staticTab;

export { staticTab };
//# sourceMappingURL=static_tab.js.map
