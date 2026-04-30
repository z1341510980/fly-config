import { G as GUI, T as TABS } from './js/main.js';
import { i as i18n } from './localization.js';
import { S as Sponsor } from './Sponsor.js';
import { $ } from './jquery.js';
import './window_watchers.js';
import './js/jquery.js';
import './@korzio.js';
import './jquery-ui.js';
import './jquery-textcomplete.js';
import './jquery-touchswipe.js';
import './select2.js';
import './multiple-select.js';
import './jbox.js';
import './i18next.js';
import './@babel.js';
import './vue.js';
import './@panter.js';
import './vue-runtime-helpers.js';
import './common.js';
import './semver.js';
import './lru-cache.js';
import './yallist.js';
import './three.js';
import './gui_log.js';
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
import './i18next-xhr-backend.js';

const landing = {
    sponsor: new Sponsor(),
};

landing.initialize = function (callback) {
    const self = this;

    if (GUI.active_tab != 'landing') {
        GUI.active_tab = 'landing';
    }

    $('#content').load("./tabs/landing.html", () => {
        function showLang(newLang) {
            bottomSection = $('.languageSwitcher');
            bottomSection.find('a').each(function(index) {
                const element = $(this);
                const languageSelected = element.attr('lang');
                if (newLang == languageSelected) {
                    element.removeClass('selected_language');
                    element.addClass('selected_language');
                } else {
                    element.removeClass('selected_language');
                }
            });
        }

        let bottomSection = $('.languageSwitcher');
        bottomSection.html(' <span i18n="language_choice_message"></span>');
        bottomSection.append(' <a href="#" i18n="language_default_pretty" lang="DEFAULT"></a>');
        const languagesAvailables = i18n.getLanguagesAvailables();

        languagesAvailables.forEach((element) => {
            bottomSection.append(` <a href="#" lang="${element}" i18n="language_${element}"></a>`);
        });

        bottomSection.find('a').each((index, element) => {
            $(element).click(() => {
                const languageSelected = $(element).attr('lang');
                if (!languageSelected) { return; }
                if (i18n.selectedLanguage != languageSelected) {
                    i18n.changeLanguage(languageSelected);
                    showLang(languageSelected);
                }
            });
        });

        showLang(i18n.selectedLanguage);
        // translate to user-selected language
        i18n.localizePage();

        self.sponsor.loadSponsorTile('landing', $('div.tab_sponsor'));

        GUI.content_ready(callback);
    });
};

landing.cleanup = function (callback) {
    if (callback) {
        callback();
    }
};

// TODO: remove after all is using modules
TABS.landing = landing;

export { landing };
//# sourceMappingURL=landing.js.map
