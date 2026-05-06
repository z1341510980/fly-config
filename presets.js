import './window_watchers.js';
import { serialAdapter as serial, G as GUI, l as reinitializeConnection, T as TABS, U as UI_PHONES } from './js/main.js';
import { g as get, s as set, i as i18n } from './localization.js';
import { g as generateFilename } from './generate_filename.js';
import { C as CONFIGURATOR, F as FC } from './common.js';
import { $ } from './jquery.js';
import { g as gui_log } from './gui_log.js';
import { m as marked } from './marked.js';
import { p as purify } from './dompurify.js';
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
import './i18next-xhr-backend.js';

const s_maxFavoritePresetsCount = 50;
const s_favoritePresetsListConfigStorageName = "FavoritePresetsList";

class FavoritePreset {
    constructor(presetPath){
        this.presetPath = presetPath;
        this.lastPickDate = Date.now();
    }
}


class FavoritePresetsData {
    constructor() {
        this._favoritePresetsList = [];
    }

    _sort() {
        this._favoritePresetsList.sort((a, b) => (a.lastPickDate - b.lastPickDate));
    }

    _purgeOldPresets() {
        this._favoritePresetsList.splice(s_maxFavoritePresetsCount + 1, this._favoritePresetsList.length);
    }

    loadFromStorage() {
        this._favoritePresetsList = [];
        const obj = get(s_favoritePresetsListConfigStorageName);

        if (obj[s_favoritePresetsListConfigStorageName]) {
            this._favoritePresetsList = obj[s_favoritePresetsListConfigStorageName];
        }
    }

    saveToStorage() {
        const obj = {};
        obj[s_favoritePresetsListConfigStorageName] = this._favoritePresetsList;
        set(obj);
    }

    add(presetPath) {
        let preset = this.findPreset(presetPath);

        if (!preset) {
            preset = new FavoritePreset(presetPath);
            this._favoritePresetsList.push(preset);
        }

        preset.lastPickDate = Date.now();
        this._sort();
        this._purgeOldPresets();

        return preset;
    }

    delete(presetPath) {
        const index = this._favoritePresetsList.findIndex((preset) => preset.presetPath === presetPath);

        if (index >= 0) {
            this._favoritePresetsList.splice(index, 1);
            this._sort();
            this._purgeOldPresets();
        }
    }

    findPreset(presetPath) {
        return this._favoritePresetsList.find((preset) => preset.presetPath === presetPath);
    }
}


class FavoritePresetsClass {
    constructor() {
        this._favoritePresetsData = new FavoritePresetsData();
    }

    add(preset, repo) {
        const favoritePreset = this._favoritePresetsData.add(repo.getPresetOnlineLink(preset));
        preset.lastPickDate = favoritePreset.lastPickDate;
    }

    delete(preset, repo) {
        this._favoritePresetsData.delete(repo.getPresetOnlineLink(preset));
        preset.lastPickDate = undefined;
    }

    addLastPickDate(presets, repo) {
        for (let preset of presets) {
            let favoritePreset = this._favoritePresetsData.findPreset(repo.getPresetOnlineLink(preset));

            if (favoritePreset) {
                preset.lastPickDate = favoritePreset.lastPickDate;
            }
        }
    }

    saveToStorage() {
        this._favoritePresetsData.saveToStorage();
    }

    loadFromStorage() {
        this._favoritePresetsData.loadFromStorage();
    }
}


let favoritePresets; // for export as singleton

if (!favoritePresets) {
    favoritePresets = new FavoritePresetsClass();
    favoritePresets.loadFromStorage();
}

class CliEngine
{
    constructor(currentTab) {
        this._currentTab = currentTab;
        this._lineDelayMs = 15;
        this._profileSwitchDelayMs = 100;
        this._cliBuffer = "";
        this._window = null;
        this._windowWrapper = null;
        this._cliErrorsCount = 0;
        this._sendCommandsProgress = 0;
        this._onSendCommandsProgressChange = undefined;
        this._responseCallback = undefined;
        this._onRowCameCallback = undefined;
    }

    setUi(window, windowWrapper, textarea) {
        this._window = window;
        this._windowWrapper = windowWrapper;
        this._setTextareaListen(textarea);
    }

    get errorsCount() { return this._cliErrorsCount; }

    setProgressCallback(sendCommandsProgressCallBack) {
        this._onSendCommandsProgressChange = sendCommandsProgressCallBack;
    }

    _reportSendCommandsProgress(value) {
        this._sendCommandsProgress = value;
        this._onSendCommandsProgressChange?.(value);
    }

    enterCliMode() {
        const bufferOut = new ArrayBuffer(1);
        const bufView = new Uint8Array(bufferOut);
        this.cliBuffer = "";

        bufView[0] = 0x23;

        serial.send(bufferOut);
    }

    _setTextareaListen(textarea) {
        // Tab key detection must be on keydown,
        // `keypress`/`keyup` happens too late, as `textarea` will have already lost focus.
        textarea.keydown(event => {
            if (event.which === CliEngine.s_tabCode) {
                // prevent default tabbing behaviour
                event.preventDefault();
            }
        });

        textarea.keypress(event => {
            if (event.which === CliEngine.s_enterKeyCode) {
                event.preventDefault(); // prevent the adding of new line
                const outString = textarea.val();
                this.executeCommands(outString);
                textarea.val('');
            }
        });

        // give input element user focus
        textarea.focus();
    }

    close(callback) {
        this.send(this.getCliCommand('exit\r', ""), function () { //this.cliBuffer
            if (callback) {
                callback();
            }
        });
    }

    executeCommands(outString) {
        const outputArray = outString.split("\n");
        return this.executeCommandsArray(outputArray);
    }

    executeCommandsArray(strings) {
        this._reportSendCommandsProgress(0);
        const totalCommandsCount = strings.length;

        return strings.reduce((p, line, index) =>
            p.then((delay) =>
                new Promise((resolve) => {
                    GUI.timeout_add('CLI_send_slowly', () => {
                        let processingDelay = this.lineDelayMs;
                        line = line.trim();

                        if (line.toLowerCase().startsWith('profile')) {
                            processingDelay = this.profileSwitchDelayMs;
                        }

                        const isLastCommand = totalCommandsCount === index + 1;

                        if (isLastCommand && this.cliBuffer) {
                            line = this.getCliCommand(line, this.cliBuffer);
                        }

                        this.sendLine(line, () => { /* empty on-send callback */ }, () => {
                            resolve(processingDelay);
                            this._reportSendCommandsProgress(100.0 * index / totalCommandsCount);
                        });
                    }, delay);
                }),
            ),
            Promise.resolve(0),
        ).then(() => {
            this._reportSendCommandsProgress(100);
        });
    }

    removePromptHash(promptText) {
        return promptText.replace(/^# /, '');
    }

    cliBufferCharsToDelete(command, buffer) {
        let commonChars = 0;
        for (let i = 0; i < buffer.length; i++) {
            if (command[i] === buffer[i]) {
                commonChars++;
            } else {
                break;
            }
        }
        return buffer.length - commonChars;
    }

    commandWithBackSpaces(command, buffer, noOfCharsToDelete) {
        const backspace = String.fromCharCode(127);
        return backspace.repeat(noOfCharsToDelete) + command.substring(buffer.length - noOfCharsToDelete, command.length);
    }

    getCliCommand(command, cliBuffer) {
        const buffer = this.removePromptHash(cliBuffer);
        const bufferRegex = new RegExp(`^${buffer}`, 'g');

        if (command.match(bufferRegex)) {
            return command.replace(bufferRegex, '');
        }

        const noOfCharsToDelete = this.cliBufferCharsToDelete(command, buffer);
        return this.commandWithBackSpaces(command, buffer, noOfCharsToDelete);
    }

    writeToOutput(text) {
        this._windowWrapper.append(text);
        this._window.scrollTop(this._windowWrapper.height());
    }

    writeLineToOutput(text) {
        if (text.startsWith("###ERROR")) {
            this.writeToOutput(`<span class="error_message">${text}</span><br>`);
            this._cliErrorsCount++;
        } else {
            this.writeToOutput(`${text}<br>`);
        }
        this._responseCallback?.();
        this._onRowCameCallback?.(text);
    }

    subscribeOnRowCame(callback) {
        this._onRowCameCallback = callback;
    }

    unsubscribeOnRowCame() {
        this._onRowCameCallback = undefined;
    }

    readSerial(readInfo) {
        /*  Some info about handling line feeds and carriage return

            line feed = LF = \n = 0x0A = 10
            carriage return = CR = \r = 0x0D = 13

            MAC only understands CR
            Linux and Unix only understand LF
            Windows understands (both) CRLF
            Chrome OS currently unknown
        */
        const data = new Uint8Array(readInfo.data ?? readInfo);
        let validateText = "";
        let sequenceCharsToSkip = 0;
        for (const charCode of data) {
            const currentChar = String.fromCharCode(charCode);

            if (!CONFIGURATOR.cliEngineValid) {
                // try to catch part of valid CLI enter message
                validateText += currentChar;
                this.writeToOutput(currentChar);
                continue;
            }

            const escapeSequenceCode = 27;
            const escapeSequenceCharLength = 3;
            if (charCode === escapeSequenceCode && !sequenceCharsToSkip) { // ESC + other
                sequenceCharsToSkip = escapeSequenceCharLength;
            }

            if (sequenceCharsToSkip) {
                sequenceCharsToSkip--;
                continue;
            }

            this._adjustCliBuffer(charCode);

            if (this.cliBuffer === 'Rebooting' && CliEngine.s_backspaceCode !== charCode) {
                CONFIGURATOR.cliEngineActive = false;
                CONFIGURATOR.cliEngineValid = false;
                gui_log(i18n.getMessage('cliReboot'));
                reinitializeConnection(this._currentTab);
            }
        }

        if (!CONFIGURATOR.cliEngineValid && validateText.indexOf('CLI') !== -1) {
            gui_log(i18n.getMessage('cliEnter'));
            CONFIGURATOR.cliEngineValid = true;
        }
    }

    sendLine(line, callback, responseCallback) {
        this.send(`${line}\n`, callback, responseCallback);
    }

    send(line, callback, responseCallback) {
        this._responseCallback = responseCallback;
        const bufferOut = new ArrayBuffer(line.length);
        const bufView = new Uint8Array(bufferOut);

        for (let cKey = 0; cKey < line.length; cKey++) {
            bufView[cKey] = line.charCodeAt(cKey);
        }

        serial.send(bufferOut, callback);
    }

    _adjustCliBuffer(newCharacterCode) {
        const currentChar = String.fromCharCode(newCharacterCode);
        switch (newCharacterCode) {
            case CliEngine.s_lineFeedCode:
                if (GUI.operating_system === "Windows") {
                    this.writeLineToOutput(this.cliBuffer);
                    this.cliBuffer = "";
                }
                break;
            case CliEngine.s_carriageReturnCode:
                if (GUI.operating_system !== "Windows") {
                    this.writeLineToOutput(this.cliBuffer);
                    this.cliBuffer = "";
                }
                break;
            case 60:
                this.cliBuffer += '&lt';
                break;
            case 62:
                this.cliBuffer += '&gt';
                break;
            case CliEngine.s_backspaceCode:
                this.cliBuffer = this.cliBuffer.slice(0, -1);
                break;
            default:
                this.cliBuffer += currentChar;
        }
    }
}

CliEngine.s_backspaceCode = 8;
CliEngine.s_lineFeedCode = 10;
CliEngine.s_carriageReturnCode = 13;
CliEngine.s_tabCode = 9;
CliEngine.s_enterKeyCode = 13;
CliEngine.s_commandDiffAll = "diff all";
CliEngine.s_commandDefaultsNoSave = "defaults nosave";
CliEngine.s_commandSave = "save";
CliEngine.s_commandExit = "exit";

class PickedPreset
{
    constructor(preset, presetCli, presetRepo)
    {
        this.preset = preset;
        this.presetCli = presetCli;
        this.presetRepo = presetRepo;
    }
}

class PresetTitlePanel
{
    constructor(parentDiv, preset, presetRepo, clickable, showPresetRepoName, onLoadedCallback, favoritePresets)
    {
        PresetTitlePanel.s_panelCounter ++;
        this._parentDiv = parentDiv;
        this._onLoadedCallback = onLoadedCallback;
        this._domId = `preset_title_panel_${PresetTitlePanel.s_panelCounter}`;
        this._preset = preset;
        this._presetRepo = presetRepo;
        this._showPresetRepoName = showPresetRepoName;
        this._clickable = clickable;
        this._favoritePresets = favoritePresets;

        this._parentDiv.append(`<div class="${this._domId}"></div>`);
        this._domWrapperDiv = $(`.${this._domId}`);
        this._domWrapperDiv.toggle(false);
        this._starJustClicked = false;
        this._mouseOnStar = false;
        this._mouseOnPanel = false;
        this._clickable = clickable;

        if (clickable) {
            this._domWrapperDiv.addClass("preset_title_panel_border");
            // setting up hover effect here, because if setup in SCC it stops working after background animation like - this._domWrapperDiv.animate({ backgroundColor....
        }
    }

    _updateHoverEffects() {
        let starMouseHover = false;

        if (this._clickable && this._mouseOnPanel && !this._mouseOnStar) {
            this._domWrapperDiv.css({"background-color": "var(--subtleAccent)"});
        } else {
            this._domWrapperDiv.css({"background-color": "var(--boxBackground)"});
        }

        if (this._mouseOnStar || (this._mouseOnPanel && this._clickable)) {
            this._domStar.css({"background-color": "var(--subtleAccent)"});
            starMouseHover = true;
        } else {
            this._domWrapperDiv.css({"background-color": "var(--boxBackground)"});
            this._domStar.css({"background-color": "var(--boxBackground)"});
        }

        if (this._preset.lastPickDate) {
            this._domStar.css("background-image", "url('../../../images/icons/star_orange.svg')");
        } else if (starMouseHover) {
            this._domStar.css("background-image", "url('../../../images/icons/star_orange_stroke.svg')");
        } else {
            this._domStar.css("background-image", "url('../../../images/icons/star_transparent.svg')");
        }
    }

    load() {
        this._domWrapperDiv.load("./tabs/presets/TitlePanel/PresetTitlePanelBody.html", () => this._setupHtml());
    }

    subscribeClick(presetsDetailedDialog, presetsRepo)
    {
        this._domWrapperDiv.on("click", () => {
            if (!this._starJustClicked) {
                this._showPresetsDetailedDialog(presetsDetailedDialog, presetsRepo);
            }

            this._starJustClicked = false;
        });
    }

    _showPresetsDetailedDialog(presetsDetailedDialog, presetsRepo) {
        presetsDetailedDialog.open(this._preset, presetsRepo, this._showPresetRepoName).then(isPresetPicked => {
            if (isPresetPicked) {
                const color = this._domWrapperDiv.css( "background-color" );
                this._domWrapperDiv.css('background-color', 'green');
                this._domWrapperDiv.animate({ backgroundColor: color }, 2000);
                this.setPicked(true);
            }

            this._updateHoverEffects();
        });
    }

    setPicked(isPicked) {
        if (!this._clickable) {
            return;
        }

        this._preset.isPicked = isPicked;

        if (isPicked) {
            this._domWrapperDiv.css({"border": "2px solid green"});
        } else {
            this._domWrapperDiv.css({"border": "1px solid var(--subtleAccent)"});
        }
    }

    _setupHtml()
    {
        this._readDom();

        this._domCategory.text(this._preset.category);
        this._domTitle.text(this._preset.title);
        this._domTitle.prop("title", this._preset.title);
        this._domAuthor.text(this._preset.author);
        this._domVersions.text(this._preset.firmware_version?.join("; "));
        this._domSourceRepository.text(this._presetRepo.name);
        this._domSourceRepositoryRow.toggle(this._showPresetRepoName);

        this._domKeywords.text(this._preset.keywords?.join("; "));
        this._domKeywords.prop("title", this._preset.keywords?.join("; "));
        this._domStatusOfficial.toggle(this._preset.status === "OFFICIAL");
        this._domStatusCommunity.toggle(this._preset.status === "COMMUNITY");
        this._domStatusExperimental.toggle(this._preset.status === "EXPERIMENTAL");
        this._domOfficialSourceIcon.toggle(this._presetRepo.official);

        this.setPicked(this._preset.isPicked);
        this._setupStar();

        this._domWrapperDiv.on("mouseenter", () => { this._mouseOnPanel = true; this._updateHoverEffects(); });
        this._domWrapperDiv.on("mouseleave", () => { this._mouseOnPanel = false; this._updateHoverEffects(); } );
        this._domStar.on("mouseenter", () => { this._mouseOnStar = true; this._updateHoverEffects(); });
        this._domStar.on("mouseleave", () => { this._mouseOnStar = false; this._updateHoverEffects(); });

        i18n.localizePage();
        this._domWrapperDiv.toggle(true);

        if (typeof this._onLoadedCallback === 'function') {
            this._onLoadedCallback();
        }
    }

    _readDom()
    {
        this._domTitle = this._domWrapperDiv.find('.preset_title_panel_title');
        this._domStar = this._domWrapperDiv.find('.preset_title_panel_star');
        this._domCategory = this._domWrapperDiv.find('.preset_title_panel_category');
        this._domAuthor = this._domWrapperDiv.find('.preset_title_panel_author_text');
        this._domKeywords = this._domWrapperDiv.find('.preset_title_panel_keywords_text');
        this._domSourceRepository = this._domWrapperDiv.find('.preset_title_panel_repository_text');
        this._domSourceRepositoryRow = this._domWrapperDiv.find('.preset_title_panel_repository_row');
        this._domVersions = this._domWrapperDiv.find('.preset_title_panel_versions_text');
        this._domStatusOfficial = this._domWrapperDiv.find('.preset_title_panel_status_official');
        this._domStatusCommunity = this._domWrapperDiv.find('.preset_title_panel_status_community');
        this._domStatusExperimental = this._domWrapperDiv.find('.preset_title_panel_status_experimental');
        this._domOfficialSourceIcon = this._domWrapperDiv.find('.preset_title_panel_betaflight_official');
    }

    _setupStar() {
        this._updateHoverEffects();

        this._domStar.on("click", () => {
            this._starJustClicked = true;
            this._processStarClick();
        });
    }

    _processStarClick() {
        if (this._preset.lastPickDate) {
            this._favoritePresets.delete(this._preset, this._presetRepo);
        } else {
            this._favoritePresets.add(this._preset, this._presetRepo);
        }

        this._favoritePresets.saveToStorage();
        this._updateHoverEffects();
    }

    remove()
    {
        this._domWrapperDiv.remove();
    }
}

PresetTitlePanel.s_panelCounter = 0;

class PresetsDetailedDialog {
    constructor(domDialog, pickedPresetList, onPresetPickedCallback, favoritePresets) {
        this._domDialog = domDialog;
        this._pickedPresetList = pickedPresetList;
        this._finalDialogYesNoSettings = {};
        this._onPresetPickedCallback = onPresetPickedCallback;
        this._openPromiseResolve = undefined;
        this._isDescriptionHtml = false;
        this._favoritePresets = favoritePresets;
    }

    load() {
        return new Promise(resolve => {
            this._domDialog.load("./tabs/presets/DetailedDialog/PresetsDetailedDialog.html", () => {
                this._setupdialog();
                resolve();
            });
        });
    }

    open(preset, presetsRepo, showPresetRepoName) {
        this._presetsRepo = presetsRepo;
        this._preset = preset;
        this._showPresetRepoName = showPresetRepoName;
        this._setLoadingState(true);
        this._domDialog[0].showModal();
        this._optionsShowedAtLeastOnce = false;
        this._isPresetPickedOnClose = false;

        this._presetsRepo.loadPreset(this._preset)
            .then(() => {
                this._loadPresetUi();
                this._setLoadingState(false);
                this._setFinalYesNoDialogSettings();
            })
            .catch(err => {
                console.error(err);
                const msg = i18n.getMessage("presetsLoadError");
                this._showError(msg);
            });

        return new Promise(resolve => this._openPromiseResolve = resolve);
    }

    _setFinalYesNoDialogSettings() {
        this._finalDialogYesNoSettings = {
            title: i18n.getMessage("presetsWarningDialogTitle"),
            text: GUI.escapeHtml(this._preset.completeWarning),
            buttonYesText: i18n.getMessage("presetsWarningDialogYesButton"),
            buttonNoText: i18n.getMessage("presetsWarningDialogNoButton"),
            buttonYesCallback: () => this._pickPresetFwVersionCheck(),
            buttonNoCallback: null,
        };
    }

    _getFinalCliText() {
        const optionsToInclude = this._domOptionsSelect.multipleSelect("getSelects", "value");
        return this._presetsRepo.removeUncheckedOptions(this._preset.originalPresetCliStrings, optionsToInclude);
    }

    _loadPresetUi() {
        this._loadDescription();

        this._domGitHubLink.attr("href", this._presetsRepo.getPresetOnlineLink(this._preset));

        if (this._preset.discussion) {
            this._domDiscussionLink.removeClass(GUI.buttonDisabledClass);
            this._domDiscussionLink.attr("href", this._preset.discussion);
        } else {
            this._domDiscussionLink.addClass(GUI.buttonDisabledClass);
        }

        this._titlePanel.empty();
        const titlePanel = new PresetTitlePanel(this._titlePanel, this._preset, this._presetsRepo, false,
            this._showPresetRepoName, () => this._setLoadingState(false), this._favoritePresets);
        titlePanel.load();
        this._loadOptionsSelect();
        this._updateFinalCliText();
        this._showCliText(false);
    }

    _loadDescription() {
        let text = this._preset.description?.join("\n");

        switch(this._preset.parser) {
            case "MARKED":
                this._isDescriptionHtml = true;
                text = marked.parse(text);
                text = purify.sanitize(text);
                this._domDescriptionHtml.html(text);
                GUI.addLinksTargetBlank(this._domDescriptionHtml);
                break;
            default:
                this._isDescriptionHtml = false;
                this._domDescriptionText.text(text);
                break;
        }
    }

    _updateFinalCliText() {
        this._domCliText.text(this._getFinalCliText().join("\n"));
    }

    _setLoadingState(isLoading) {
        this._domProperties.toggle(!isLoading);
        this._domLoading.toggle(isLoading);
        this._domError.toggle(false);

        if (isLoading) {
            this._domButtonApply.addClass(GUI.buttonDisabledClass);
        } else {
            this._domButtonApply.removeClass(GUI.buttonDisabledClass);
        }
    }

    _showError(msg) {
        this._domError.toggle(true);
        this._domError.text(msg);
        this._domProperties.toggle(false);
        this._domLoading.toggle(false);
        this._domButtonApply.addClass(GUI.buttonDisabledClass);
    }

    _readDom() {
        this._domButtonApply = $('#presets_detailed_dialog_applybtn');
        this._domButtonCancel = $('#presets_detailed_dialog_closebtn');
        this._domLoading = $('#presets_detailed_dialog_loading');
        this._domError = $('#presets_detailed_dialog_error');
        this._domProperties = $('#presets_detailed_dialog_properties');
        this._titlePanel = $('.preset_detailed_dialog_title_panel');
        this._domDescriptionText = $('#presets_detailed_dialog_text_description');
        this._domDescriptionHtml = $('#presets_detailed_dialog_html_description');
        this._domCliText = $('#presets_detailed_dialog_text_cli');
        this._domGitHubLink = this._domDialog.find('#presets_open_online');
        this._domDiscussionLink = this._domDialog.find('#presets_open_discussion');
        this._domOptionsSelect = $('#presets_options_select');
        this._domOptionsSelectPanel = $('#presets_options_panel');
        this._domButtonCliShow = $('#presets_cli_show');
        this._domButtonCliHide = $('#presets_cli_hide');
    }

    _showCliText(value) {
        this._domDescriptionText.toggle(!value && !this._isDescriptionHtml);
        this._domDescriptionHtml.toggle(!value && this._isDescriptionHtml);
        this._domCliText.toggle(value);
        this._domButtonCliShow.toggle(!value);
        this._domButtonCliHide.toggle(value);
    }

    _createOptionsSelect(options) {
        options.forEach(option => {
            if (!option.childs) {
                this._addOption(this._domOptionsSelect, option, false);
            } else {
                this._addOptionGroup(this._domOptionsSelect, option);
            }
        });

        this._domOptionsSelect.multipleSelect({
            placeholder: i18n.getMessage("presetsOptionsPlaceholder"),
            formatSelectAll () { return i18n.getMessage("dropDownSelectAll"); },
            formatAllSelected() { return i18n.getMessage("dropDownAll"); },
            onClick: () => this._optionsSelectionChanged(),
            onCheckAll: () => this._optionsSelectionChanged(),
            onUncheckAll: () => this._optionsSelectionChanged(),
            onOpen: () => this._optionsOpened(),
            hideOptgroupCheckboxes: true,
            singleRadio: true,
            selectAll: false,
            styler: function (row) {
                let style = "";
                if (row.type === 'optgroup') {
                    style = 'font-weight: bold;';
                } else if (row.classes.includes("optionHasParent")) {
                    style = 'padding-left: 22px;';
                }
                return style;
            },
        });
    }

    _optionsOpened() {
        this._optionsShowedAtLeastOnce = true;
    }

    _addOptionGroup(parentElement, optionGroup) {
        const optionGroupElement = $(`<optgroup label="${optionGroup.name}"></optgroup>`);

        optionGroup.childs.forEach(option => {
            this._addOption(optionGroupElement, option, true);
        });

        parentElement.append(optionGroupElement);
    }

    _addOption(parentElement, option, hasParent) {
        let selectedString = "selected=\"selected\"";
        if (!option.checked) {
            selectedString = "";
        }

        let classString = "";
        if (hasParent) {
            classString = "class=\"optionHasParent\"";
        }

        parentElement.append(`<option value="${option.name}" ${selectedString} ${classString}>${option.name}</option>`);
    }

    _optionsSelectionChanged() {
        this._updateFinalCliText();
    }

    _destroyOptionsSelect() {
        this._domOptionsSelect.multipleSelect('destroy');
    }

    _loadOptionsSelect() {

        const optionsVisible = 0 !== this._preset.options.length;
        this._domOptionsSelect.empty();
        this._domOptionsSelectPanel.toggle(optionsVisible);

        if (optionsVisible) {
            this._createOptionsSelect(this._preset.options);
        }

        this._domOptionsSelect.multipleSelect('refresh');
    }

    _setupdialog() {
        i18n.localizePage();
        this._readDom();

        this._domButtonApply.on("click", () => this._onApplyButtonClicked());
        this._domButtonCancel.on("click", () => this._onCancelButtonClicked());
        this._domButtonCliShow.on("click", () => this._showCliText(true));
        this._domButtonCliHide.on("click", () => this._showCliText(false));
        this._domDialog.on("close", () => this._onClose());
    }

    _onApplyButtonClicked() {
        if (this._preset.force_options_review && !this._optionsShowedAtLeastOnce) {
            const dialogOptions = {
                title: i18n.getMessage("warningTitle"),
                text: i18n.getMessage("presetsReviewOptionsWarning"),
                buttonConfirmText: i18n.getMessage("close"),
            };
            GUI.showInformationDialog(dialogOptions);
        } else if (!this._preset.completeWarning) {
            this._pickPresetFwVersionCheck();
        } else {
            GUI.showYesNoDialog(this._finalDialogYesNoSettings);
        }
    }

    _pickPreset() {
        const cliStrings = this._getFinalCliText();
        const pickedPreset = new PickedPreset(this._preset, cliStrings, this._presetsRepo);
        this._pickedPresetList.push(pickedPreset);
        this._onPresetPickedCallback?.();
        this._isPresetPickedOnClose = true;
        this._onCancelButtonClicked();
    }

    _pickPresetFwVersionCheck() {
        let compatitable = false;

        for (const fw of this._preset.firmware_version) {
            if (FC.CONFIG.flightControllerVersion.startsWith(fw)) {
                compatitable = true;
                break;
            }
        }

        if (compatitable) {
            this._pickPreset();
        } else {
            const dialogSettings = {
                title: i18n.getMessage("presetsWarningDialogTitle"),
                text: i18n.getMessage("presetsWarningWrongVersionConfirmation", [this._preset.firmware_version, FC.CONFIG.flightControllerVersion]),
                buttonYesText: i18n.getMessage("presetsWarningDialogYesButton"),
                buttonNoText: i18n.getMessage("presetsWarningDialogNoButton"),
                buttonYesCallback: () => this._pickPreset(),
                buttonNoCallback: null,
            };
            GUI.showYesNoDialog(dialogSettings);
        }
    }

    _onCancelButtonClicked() {
        this._domDialog[0].close();
    }

    _onClose() {
        this._destroyOptionsSelect();
        this._openPromiseResolve?.(this._isPresetPickedOnClose);
    }
}

class PresetParser {
    constructor(settings) {
        this._settings = settings;
    }

    readPresetProperties(preset, strings) {
        const propertiesToRead = ["description", "discussion", "warning", "disclaimer", "include_warning", "include_disclaimer", "discussion", "force_options_review", "parser"];
        const propertiesMetadata = {};
        preset.options = [];

        propertiesToRead.forEach(propertyName => {
            // metadata of each property, name, type, optional true/false; example:
            // keywords: {type: MetadataTypes.WORDS_ARRAY, optional: true}
            propertiesMetadata[propertyName] = this._settings.presetsFileMetadata[propertyName];
            preset[propertyName] = undefined;
        });

        preset._currentOptionGroup = undefined;

        for (const line of strings) {
            if (line.startsWith(this._settings.MetapropertyDirective)) {
                this._parseAttributeLine(preset, line, propertiesMetadata);
            }
        }

        delete preset._currentOptionGroup;
    }

    _parseAttributeLine(preset, line, propertiesMetadata) {
        line = line.slice(this._settings.MetapropertyDirective.length).trim(); // (#$ DESCRIPTION: foo) -> (DESCRIPTION: foo)
        const lowCaseLine = line.toLowerCase();
        let isProperty = false;

        for (const propertyName in propertiesMetadata) {
            const lineBeginning = `${propertyName.toLowerCase()}:`; // "description:"

            if (lowCaseLine.startsWith(lineBeginning)) {
                line = line.slice(lineBeginning.length).trim(); // (Title: foo) -> (foo)
                this._parseProperty(preset, line, propertyName);
                isProperty = true;
            }
        }

        if (!isProperty && lowCaseLine.startsWith(this._settings.OptionsDirectives.OPTION_DIRECTIVE)) {
            this._parseOptionDirective(preset, line);
        }
    }

    _parseOptionDirective(preset, line) {
        const lowCaseLine = line.toLowerCase();

        if (lowCaseLine.startsWith(this._settings.OptionsDirectives.BEGIN_OPTION_DIRECTIVE)) {
            const option = this._getOption(line);
            if (!preset._currentOptionGroup) {
                preset.options.push(option);
            } else {
                preset._currentOptionGroup.childs.push(option);
            }
        } else if (lowCaseLine.startsWith(this._settings.OptionsDirectives.BEGIN_OPTION_GROUP_DIRECTIVE)) {
            const optionGroup = this._getOptionGroup(line);
            preset._currentOptionGroup = optionGroup;
            preset.options.push(optionGroup);
        } else if (lowCaseLine.startsWith(this._settings.OptionsDirectives.END_OPTION_GROUP_DIRECTIVE)) {
            preset._currentOptionGroup = undefined;
        }
    }

    _getOption(line) {
        const directiveRemoved = line.slice(this._settings.OptionsDirectives.BEGIN_OPTION_DIRECTIVE.length).trim();
        const directiveRemovedLowCase = directiveRemoved.toLowerCase();
        const OptionChecked = this._isOptionChecked(directiveRemovedLowCase);

        const regExpRemoveChecked = new RegExp(this._escapeRegex(this._settings.OptionsDirectives.OPTION_CHECKED), 'gi');
        const regExpRemoveUnchecked = new RegExp(this._escapeRegex(this._settings.OptionsDirectives.OPTION_UNCHECKED), 'gi');
        let optionName = directiveRemoved.replace(regExpRemoveChecked, "");
        optionName = optionName.replace(regExpRemoveUnchecked, "").trim();

        return {
            name: optionName.slice(1).trim(),
            checked: OptionChecked,
        };
    }

    _getOptionGroup(line) {
        const directiveRemoved = line.slice(this._settings.OptionsDirectives.BEGIN_OPTION_GROUP_DIRECTIVE.length).trim();

        return {
            name: directiveRemoved.slice(1).trim(),
            childs: [],
        };
    }

    _isOptionChecked(lowCaseLine) {
        return lowCaseLine.includes(this._settings.OptionsDirectives.OPTION_CHECKED);
    }

    _parseProperty(preset, line, propertyName) {
        switch(this._settings.presetsFileMetadata[propertyName].type) {
            case this._settings.MetadataTypes.STRING_ARRAY:
                this._processArrayProperty(preset, line, propertyName);
                break;
            case this._settings.MetadataTypes.STRING:
                this._processStringProperty(preset, line, propertyName);
                break;
            case this._settings.MetadataTypes.FILE_PATH:
                this._processStringProperty(preset, line, propertyName);
                break;
            case this._settings.MetadataTypes.FILE_PATH_ARRAY:
                this._processArrayProperty(preset, line, propertyName);
                break;
            case this._settings.MetadataTypes.BOOLEAN:
                this._processBooleanProperty(preset, line, propertyName);
                break;
            case this._settings.MetadataTypes.PARSER:
                this._processParserProperty(preset, line, propertyName);
                break;
            default:
                this.console.err(`Parcing preset: unknown property type '${this._settings.presetsFileMetadata[propertyName].type}' for the property '${propertyName}'`);
        }
    }

    _processParserProperty(preset, line, propertyName)
    {
        preset[propertyName] = line;
    }

    _processBooleanProperty(preset, line, propertyName) {
        const trueValues = ["true", "yes"];

        const lineLowCase = line.toLowerCase();
        let result = false;

        if (trueValues.includes(lineLowCase)) {
            result = true;
        }

        preset[propertyName] = result;
    }

    _processArrayProperty(preset, line, propertyName) {
        if (!preset[propertyName]) {
            preset[propertyName] = [];
        }

        preset[propertyName].push(line);
    }

    _processStringProperty(preset, line, propertyName) {
        preset[propertyName] = line;
    }

    _getOptionName(line) {
        const directiveRemoved = line.slice(this._settings.OptionsDirectives.BEGIN_OPTION_DIRECTIVE.length).trim();
        const regExpRemoveChecked = new RegExp(this._escapeRegex(`${this._settings.OptionsDirectives.OPTION_CHECKED}:`), 'gi');
        const regExpRemoveUnchecked = new RegExp(this._escapeRegex(`${this._settings.OptionsDirectives.OPTION_UNCHECKED}:`), 'gi');
        let optionName = directiveRemoved.replace(regExpRemoveChecked, "");
        optionName = optionName.replace(regExpRemoveUnchecked, "").trim();
        return optionName;
    }

    _escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    removeUncheckedOptions(strings, checkedOptions) {
        let resultStrings = [];
        let isCurrentOptionExcluded = false;
        const lowerCasedCheckedOptions = checkedOptions.map(optionName => optionName.toLowerCase());

        strings.forEach(str => {
            if (this._isLineAttribute(str)) {
                const line = this._removeAttributeDirective(str);

                if (this._isOptionBegin(line)) {
                    const optionNameLowCase = this._getOptionName(line).toLowerCase();

                    if (!lowerCasedCheckedOptions.includes(optionNameLowCase)) {
                        isCurrentOptionExcluded = true;
                    }
                } else if (this._isOptionEnd(line)) {
                    isCurrentOptionExcluded = false;
                }
            } else if (!isCurrentOptionExcluded) {
                resultStrings.push(str);
            }
        });

        resultStrings = this._removeExcessiveEmptyLines(resultStrings);

        return resultStrings;
    }

    _removeExcessiveEmptyLines(strings) {
        // removes empty lines if there are two or more in a row leaving just one empty line
        const result = [];
        let lastStringEmpty = false;

        strings.forEach(str => {
            if ("" !== str || !lastStringEmpty) {
                result.push(str);
            }

            if ("" === str) {
                lastStringEmpty = true;
            } else {
                lastStringEmpty = false;
            }
        });

        return result;
    }

    _isLineAttribute(line) {
        return line.trim().startsWith(this._settings.MetapropertyDirective);
    }

    _isOptionBegin(line) {
        const lowCaseLine = line.toLowerCase();
        return lowCaseLine.startsWith(this._settings.OptionsDirectives.BEGIN_OPTION_DIRECTIVE);
    }

    _isOptionEnd(line) {
        const lowCaseLine = line.toLowerCase();
        return lowCaseLine.startsWith(this._settings.OptionsDirectives.END_OPTION_DIRECTIVE);
    }

    _removeAttributeDirective(line) {
        return line.trim().slice(this._settings.MetapropertyDirective.length).trim();
    }

    isIncludeFound(strings) {
        for (const str of strings) {
            const match = PresetParser._sRegExpInclude.exec(str);

            if (match !== null) {
                return true;
            }
        }

        return false;
    }

}

// Reg exp extracts file/path.txt from # include: file/path.txt
PresetParser._sRegExpInclude = /^#\$[ ]+?INCLUDE:[ ]+?(?<filePath>\S+$)/;

class PresetsRepoIndexed {
    constructor(urlRaw, urlViewOnline, official, name) {
        this._urlRaw = urlRaw;
        this._urlViewOnline = urlViewOnline;
        this._index = null;
        this._name = name;
        this._official = official;
    }

    get index() {
        return this._index;
    }

    get official() {
        return this._official;
    }

    get name() {
        return this._name;
    }

    loadIndex() {
        return fetch(`${this._urlRaw}index.json`, {cache: "no-cache"})
            .then(res => res.json())
            .then(out => {
                this._index = out;
                this._settings = this._index.settings;
                this._PresetParser = new PresetParser(this._index.settings);
            });
    }

    getPresetOnlineLink(preset) {
        return this._urlViewOnline + preset.fullPath;
    }

    removeUncheckedOptions(strings, checkedOptions) {
        return this._PresetParser.removeUncheckedOptions(strings, checkedOptions);
    }

    _parceInclude(strings, includeRowIndexes, promises)
    {
           for (let i = 0; i < strings.length; i++) {
            const match = PresetParser._sRegExpInclude.exec(strings[i]);

            if (match !== null) {
                includeRowIndexes.push(i);
                const filePath = this._urlRaw + match.groups.filePath;
                const promise = this._loadPresetText(filePath);
                promises.push(promise);
            }
        }
    }

    _executeIncludeOnce(strings) {
        const includeRowIndexes = []; // row indexes with "#include" statements
        const promises = []; // promises to load included files
        this._parceInclude(strings, includeRowIndexes, promises);

        return Promise.all(promises)
            .then(includedTexts => {
                for (let i = 0; i < includedTexts.length; i++) {
                    strings[includeRowIndexes[i]] = includedTexts[i];
                }

                const text = strings.join('\n');
                return text.split("\n").map(str => str.trim());
            });
    }

    _executeIncludeNested(strings) {
        const isIncludeFound = this._PresetParser.isIncludeFound(strings);

        if (isIncludeFound) {
            return this._executeIncludeOnce(strings)
            .then(resultStrings => this._executeIncludeNested(resultStrings));
        } else {
            return Promise.resolve(strings);
        }
    }

    loadPreset(preset) {
        const promiseMainText = this._loadPresetText(this._urlRaw + preset.fullPath);

        return promiseMainText
        .then(text => {
            let strings = text.split("\n");
            strings = strings.map(str => str.trim());
            this._PresetParser.readPresetProperties(preset, strings);
            return strings;
        })
        .then(strings => this._executeIncludeNested(strings))
        .then(strings => {
            preset.originalPresetCliStrings = strings;
            return this._loadPresetWarning(preset);
        });
    }

    _loadPresetWarning(preset) {
        let completeWarning = "";

        if (preset.warning) {
            completeWarning += (completeWarning?"\n":"") + preset.warning;
        }

        if (preset.disclaimer) {
            completeWarning += (completeWarning?"\n":"") + preset.disclaimer;
        }

        const allFiles = [].concat(...[preset.include_warning, preset.include_disclaimer].filter(Array.isArray));

        return this._loadFilesInOneText(allFiles)
            .then(text => {
                completeWarning += (completeWarning?"\n":"") + text;
                preset.completeWarning = completeWarning;
            });
    }

    _loadFilesInOneText(fileUrls) {
        const loadPromises = [];

        fileUrls?.forEach(url => {
            const filePath = this._urlRaw + url;
            loadPromises.push(this._loadPresetText(filePath));
        });

        return Promise.all(loadPromises)
        .then(texts => {
            return texts.join('\n');
        });
    }

    _loadPresetText(fullUrl) {
        return new Promise((resolve, reject) => {
            fetch(fullUrl, {cache: "no-cache"})
            .then(res => res.text())
            .then(text => resolve(text))
            .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }
}

class PresetsGithubRepo extends PresetsRepoIndexed {
    constructor(urlRepo, branch, official, name) {
        let correctUrlRepo = urlRepo.trim();

        if (!correctUrlRepo.endsWith("/")) {
            correctUrlRepo += "/";
        }

        let correctBranch = branch.trim();

        if (correctBranch.startsWith("/")) {
            correctBranch = correctBranch.slice(1);
        }

        if (correctBranch.endsWith("/")) {
            correctBranch = correctBranch.slice(0, -1);
        }

        const urlRaw = `https://raw.githubusercontent.com${correctUrlRepo.slice("https://github.com".length)}${correctBranch}/`;
        const urlViewOnline = `${correctUrlRepo}blob/${correctBranch}/`;

        super(urlRaw, urlViewOnline, official, name);
    }
}

class PresetsWebsiteRepo extends PresetsRepoIndexed {
    constructor(url, official, name) {
        let correctUrl = url.trim();

        if (!correctUrl.endsWith("/")) {
            correctUrl += "/";
        }

        const urlRaw = correctUrl;
        const urlViewOnline = correctUrl;

        super(urlRaw, urlViewOnline, official, name);
    }
}

class PresetSource {
    constructor(name, url, gitHubBranch = "") {
        this.name = name;
        this.url = url;
        this.gitHubBranch = gitHubBranch;
        this.official = false;
    }

    static isUrlGithubRepo(url) {
        return url.trim().toLowerCase().startsWith("https://github.com/");
    }
}

class SourcePanel {
    constructor(parentDiv, presetSource) {
        this._parentDiv = parentDiv;
        this._presetSource = presetSource;
        this._active = false;
    }

    get presetSource() {
        return this._presetSource;
    }

    load() {
        SourcePanel.s_panelCounter++;
        this._domId = `source_panel_${SourcePanel.s_panelCounter}`;
        this._parentDiv.append(`<div id="${this._domId}"></div>`);
        this._domWrapperDiv = $(`#${this._domId}`);
        this._domWrapperDiv.toggle(false);

        return new Promise(resolve => {
            this._domWrapperDiv.load("./tabs/presets/SourcesDialog/SourcePanel.html",
            () => {
                this._setupHtml();
                resolve();
            });
        });
    }

    setOnSelectedCallback(onSelectedCallback) {
        // callback with this (SourcePanel) argument
        // so that consumer knew which panel was clicked on
        this._onSelectedCallback = onSelectedCallback;
    }

    setOnDeleteCallback(onDeletedCallback) {
        // callback with this (SourcePanel) argument
        // so that consumer knew which panel was clicked on
        this._onDeletedCallback = onDeletedCallback;
    }

    setOnActivateCallback(onActivateCallback) {
        // callback with this (SourcePanel) argument
        // so that consumer knew which panel was clicked on
        this._onActivateCallback = onActivateCallback;
    }

    setOnDeactivateCallback(onDeactivateCallback) {
        // callback with this (SourcePanel) argument
        // so that consumer knew which panel was clicked on
        this._onDeactivateCallback = onDeactivateCallback;
    }

    setOnSaveCallback(onSaveCallback) {
        // callback with this (SourcePanel) argument
        // so that consumer knew which panel was clicked on
        this._onSaveCallback = onSaveCallback;
    }

    setSelected(isSelected) {
        this._setUiSelected(isSelected);
    }

    get active() {
        return this._active;
    }

    setActive(isActive) {
        this._active = isActive;
        this._domDivSelectedIndicator.toggle(this._active);
        this._domButtonActivate.toggle(!isActive);
        this._domButtonDeactivate.toggle(isActive);
    }

    _setUiOfficial() {
        if (this.presetSource.official){
            this._domButtonSave.toggle(false);
            this._domButtonReset.toggle(false);
            this._domButtonDelete.toggle(false);
            this._domEditName.prop("disabled", true);
            this._domEditUrl.prop("disabled", true);
            this._domEditGitHubBranch.prop("disabled", true);
        }
    }

    _setUiSelected(isSelected) {
        if (this._selected !== isSelected) {
            this._domDivNoEditing.toggle(!isSelected);
            this._domDivEditing.toggle(isSelected);

            this._onResetButtonClick();
            this._updateNoEditingName();

            this._domDivInnerPanel.toggleClass("presets_source_panel_not_selected", !isSelected);
            this._domDivInnerPanel.toggleClass("presets_source_panel_selected", isSelected);
            if (isSelected) {
                this._domDivInnerPanel.off("click");
            } else {
                this._domDivInnerPanel.on("click", () => this._onPanelSelected());
            }

            this._selected = isSelected;
        }
    }

    _updateNoEditingName() {
        this._domDivNoEditingName.text(this._presetSource.name);
    }

    _setupHtml() {
        this._readDom();
        this._setupActions();
        this.setSelected(false);
        this._setIsSaved(true);
        this._checkIfGithub();
        this.setActive(this._active);
        this._setUiOfficial();

        i18n.localizePage();
        this._domWrapperDiv.toggle(true);
    }

    _setupActions() {
        this._domButtonSave.on("click", () => this._onSaveButtonClick());
        this._domButtonReset.on("click", () => this._onResetButtonClick());
        this._domButtonDelete.on("click", () => this._onDeleteButtonClick());
        this._domButtonActivate.on("click", () => this._onActivateButtonClick());
        this._domButtonDeactivate.on("click", () => this._onDeactivateButtonClick());

        this._domEditName.on("input", () => this._onInputChange());
        this._domEditUrl.on("input", () => this._onInputChange());
        this._domEditGitHubBranch.on("input", () => this._onInputChange());
    }

    _onPanelSelected() {
        this._setUiSelected(true);
        this._onSelectedCallback?.(this);
    }

    _checkIfGithub() {
        const isGithubUrl = PresetSource.isUrlGithubRepo(this._domEditUrl.val());
        this._domDivGithubBranch.toggle(isGithubUrl);
    }

    _onInputChange() {
        this._checkIfGithub();
        this._setIsSaved(false);
    }

    _onSaveButtonClick() {
        this._presetSource.name = this._domEditName.val();
        this._presetSource.url = this._domEditUrl.val();
        this._presetSource.gitHubBranch = this._domEditGitHubBranch.val();
        this._setIsSaved(true);
        this._onSaveCallback?.(this);
    }

    _onResetButtonClick() {
        this._domEditName.val(this._presetSource.name);
        this._domEditUrl.val(this._presetSource.url);
        this._domEditGitHubBranch.val(this._presetSource.gitHubBranch);
        this._checkIfGithub();
        this._setIsSaved(true);
    }

    _onDeleteButtonClick() {
        this._domWrapperDiv.remove();
        this._onDeletedCallback?.(this);
    }

    _onActivateButtonClick() {
        this._onSaveButtonClick();
        this.setActive(true);
        this._onActivateCallback?.(this);
    }

    _onDeactivateButtonClick() {
        this._onSaveButtonClick();
        this.setActive(false);
        this._onDeactivateCallback?.(this);
    }

    _setIsSaved(isSaved) {
        if (isSaved) {
            this._domButtonSave.addClass(GUI.buttonDisabledClass);
            this._domButtonReset.addClass(GUI.buttonDisabledClass);
        } else {
            this._domButtonSave.removeClass(GUI.buttonDisabledClass);
            this._domButtonReset.removeClass(GUI.buttonDisabledClass);
        }
    }

    _readDom() {
        this._domDivInnerPanel = this._domWrapperDiv.find(".presets_source_panel");
        this._domDivNoEditing = this._domWrapperDiv.find(".presets_source_panel_no_editing");
        this._domDivEditing = this._domWrapperDiv.find(".presets_source_panel_editing");

        this._domEditName = this._domWrapperDiv.find(".presets_source_panel_editing_name_field");
        this._domEditUrl = this._domWrapperDiv.find(".presets_source_panel_editing_url_field");
        this._domEditGitHubBranch = this._domWrapperDiv.find(".presets_source_panel_editing_branch_field");

        this._domButtonSave = this._domWrapperDiv.find(".presets_source_panel_save");
        this._domButtonReset = this._domWrapperDiv.find(".presets_source_panel_reset");
        this._domButtonActivate = this._domWrapperDiv.find(".presets_source_panel_activate");
        this._domButtonDeactivate = this._domWrapperDiv.find(".presets_source_panel_deactivate");
        this._domButtonDelete = this._domWrapperDiv.find(".presets_source_panel_delete");
        this._domDivGithubBranch = this._domWrapperDiv.find(".presets_source_panel_editing_github_branch");
        this._domDivNoEditingName = this._domWrapperDiv.find(".presets_source_panel_no_editing_name");

        this._domDivSelectedIndicator = this._domWrapperDiv.find(".presets_source_panel_no_editing_selected");
    }
}

SourcePanel.s_panelCounter = 0;

class PresetsSourcesDialog {
    constructor(domDialog) {
        this._domDialog = domDialog;
        this._sourceSelectedPromiseResolve = null;
        this._sourcesPanels = [];
        this._sources = [];
        this._activeSourceIndexes = [0];
    }

    load() {
        return new Promise(resolve => {
            this._domDialog.load("./tabs/presets/SourcesDialog/SourcesDialog.html",
            () => {
                this._setupDialog();
                this._initializeSources();
                resolve();
            });
        });
    }

    show() {
        this._domDialog[0].showModal();
        return new Promise(resolve => this._sourceSelectedPromiseResolve = resolve);
    }

    getActivePresetSources() {
        return this._activeSourceIndexes.map(index => this._sources[index]);
    }

    get isThirdPartyActive() {
        return this.getActivePresetSources().filter(source => !source.official).length > 0;
    }

    _initializeSources() {
        this._sources = this._readSourcesFromStorage();
        this._activeSourceIndexes = this._readActiveSourceIndexFromStorage(this._sources.length);

        for (let i = 0; i < this._sources.length; i++) {
            const isActive = this._activeSourceIndexes.includes(i);
            this._addNewSourcePanel(this._sources[i], isActive, false);
        }
    }

    _readSourcesFromStorage() {
        const officialSource = this._createOfficialSource();
        const officialSourceSecondary = this._createSecondaryOfficialSource();

        const obj = get('PresetSources');
        let sources = obj.PresetSources;

        if (sources && sources.length > 0) {
            sources[0] = officialSource;
        } else {
            sources = [officialSource, officialSourceSecondary];
        }

        if (sources.length === 1) {
            sources.push(officialSourceSecondary);
        }

        return sources;
    }

    _readActiveSourceIndexFromStorage(sourcesCount) {
        const obj = get('PresetSourcesActiveIndexes');
        return obj.PresetSourcesActiveIndexes || [0];
    }

    _createOfficialSource() {
        const officialSource = new PresetSource("Betaflight Official Presets", "https://api.betaflight.com/firmware-presets/", "");
        officialSource.official = true;
        return officialSource;
    }

    _createSecondaryOfficialSource() {
        const officialSource = new PresetSource("Betaflight Presets - GitHub BACKUP", "https://github.com/betaflight/firmware-presets", "backup");
        officialSource.official = false;
        return officialSource;
    }

    _setupDialog() {
        this._readDom();
        this._setupEvents();
        this._domButtonAddNew.on("click", () => this._onAddNewSourceButtonClick());
        i18n.localizePage();
    }

    _onAddNewSourceButtonClick() {
        const presetSource = new PresetSource(i18n.getMessage("presetsSourcesDialogDefaultSourceName"), "", "");
        this._addNewSourcePanel(presetSource).then(() => {
            this._scrollDown();
            this._updateSourcesFromPanels();
        });
    }

    _scrollDown() {
        this._domDivSourcesPanel.stop();
        this._domDivSourcesPanel.animate({scrollTop: `${this._domDivSourcesPanel.prop('scrollHeight')}px`});
    }

    _addNewSourcePanel(presetSource, isActive = false, isSelected = true) {
        const sourcePanel = new SourcePanel(this._domDivSourcesPanel, presetSource);
        this._sourcesPanels.push(sourcePanel);
        return sourcePanel.load().then(() => {
            sourcePanel.setOnSelectedCallback(selectedPanel => this._onSourcePanelSelected(selectedPanel));
            sourcePanel.setOnDeleteCallback(selectedPanel => this._onSourcePanelDeleted(selectedPanel));
            sourcePanel.setOnActivateCallback(selectedPanel => this._onSourcePanelActivated(selectedPanel));
            sourcePanel.setOnDeactivateCallback(selectedPanel => this._onSourcePanelDeactivated(selectedPanel));
            sourcePanel.setOnSaveCallback(() => this._onSourcePanelSaved());
            sourcePanel.setActive(isActive);
            if (isSelected) {
                this._onSourcePanelSelected(sourcePanel);
            }
        });
    }

    _setupEvents() {
        this._domButtonClose.on("click", () => this._onCloseButtonClick());
        this._domDialog.on("close", () => this._onClose());
    }

    _onCloseButtonClick() {
        this._domDialog[0].close();
    }

    _onClose() {
        this._sourceSelectedPromiseResolve?.();
    }

    _readPanels() {
        this._sources = [];
        this._activeSourceIndexes = [];
        for (let i = 0; i < this._sourcesPanels.length; i++) {
            this._sources.push(this._sourcesPanels[i].presetSource);
            if (this._sourcesPanels[i].active) {
                this._activeSourceIndexes.push(i);
            }
        }
    }

    _saveSources() {
        set({'PresetSources': this._sources});
        set({'PresetSourcesActiveIndexes': this._activeSourceIndexes});
    }

    _updateSourcesFromPanels() {
        this._readPanels();
        this._saveSources();
    }

    _onSourcePanelSaved() {
        this._updateSourcesFromPanels();
    }

    _onSourcePanelSelected(selectedPanel) {
        for (const panel of this._sourcesPanels) {
            if (panel !== selectedPanel) {
                panel.setSelected(false);
            } else {
                panel.setSelected(true);
            }
        }
    }

    _onSourcePanelDeleted(selectedPanel) {
        this._sourcesPanels = this._sourcesPanels.filter(panel => panel !== selectedPanel);
        if (selectedPanel.active) {
            this._sourcesPanels[0].setActive(true);
        }
        this._updateSourcesFromPanels();
    }

    _onSourcePanelActivated(selectedPanel) {
        for (const panel of this._sourcesPanels) {
            if (panel === selectedPanel) {
                panel.setActive(true);
            }
        }
        this._updateSourcesFromPanels();
    }

    _onSourcePanelDeactivated(selectedPanel) {
        for (const panel of this._sourcesPanels) {
            if (panel === selectedPanel) {
                panel.setActive(false);
            }
        }
        this._updateSourcesFromPanels();
    }

    _readDom() {
        this._domButtonAddNew = $("#presets_sources_dialog_add_new");
        this._domButtonClose = $("#presets_sources_dialog_close");
        this._domDivSourcesPanel = $(".presets_sources_dialog_sources");
    }
}

const presets = {
    presetsRepo: [],
    cliEngine: null,
    pickedPresetList: [],
    majorVersion: 1,
};

presets.initialize = function (callback) {
    const self = this;

    self.cliEngine = new CliEngine(self);
    self.cliEngine.setProgressCallback(value => this.onApplyProgressChange(value));
    self._presetPanels = [];

    $('#content').load("./tabs/presets/presets.html", () => self.onHtmlLoad(callback));

    if (GUI.active_tab !== 'presets') {
        GUI.active_tab = 'presets';
    }
};

presets.readDom = function() {
    this._divGlobalLoading = $('#presets_global_loading');
    this._divGlobalLoadingError = $('#presets_global_loading_error');
    this._divCli = $('#presets_cli');
    this._divMainContent = $('#presets_main_content');
    this._selectCategory = $('#presets_filter_category');
    this._selectKeyword = $('#presets_filter_keyword');
    this._selectAuthor = $('#presets_filter_author');
    this._selectFirmwareVersion = $('#presets_filter_firmware_version');
    this._selectStatus = $('#presets_filter_status');
    this._inputTextFilter = $('#presets_filter_text');
    this._divPresetList = $('#presets_list');

    this._domButtonSave = $("#presets_save_button");
    this._domButtonCancel = $("#presets_cancel_button");

    this._domReloadButton = $("#presets_reload");
    this._domContentWrapper = $("#presets_content_wrapper");
    this._domProgressDialog = $("#presets_apply_progress_dialog")[0];
    this._domProgressDialogProgressBar = $(".presets_apply_progress_dialog_progress_bar");
    this._domButtonaSaveAnyway = $("#presets_cli_errors_save_anyway_button");
    this._domButtonCliExit = $("#presets_cli_errors_exit_no_save_button");
    this._domDialogCliErrors = $("#presets_cli_errors_dialog");
    this._domButtonSaveBackup = $(".presets_save_config");
    this._domButtonLoadBackup = $(".presets_load_config");
    this._domButtonPresetSources = $(".presets_sources_show");

    this._domWarningNotOfficialSource = $(".presets_warning_not_official_source");
    this._domWarningFailedToLoadRepositories = $(".presets_failed_to_load_repositories");
    this._domWarningBackup = $(".presets_warning_backup");
    this._domButtonHideBackupWarning = $(".presets_warning_backup_button_hide");

    this._domListNoFound = $("#presets_list_no_found");
    this._domListTooManyFound = $("#presets_list_too_many_found");
};

presets.getPickedPresetsCli = function() {
    let result = [];
    this.pickedPresetList.forEach(pickedPreset => {
        result.push(...pickedPreset.presetCli);
    });
    result = result.filter(command => command.trim() !== "");
    return result;
};

presets.onApplyProgressChange = function(value) {
    this._domProgressDialogProgressBar.val(value);
};

presets.applyCommandsList = function(strings) {
    strings.forEach(cliCommand => {
        this.cliEngine.sendLine(cliCommand);
    });
};

presets.onSaveClick = function() {
    this._domProgressDialogProgressBar.val(0);
    this._domProgressDialog.showModal();
    const currentCliErrorsCount = this.cliEngine.errorsCount;

    this.activateCli().then(() => {
        const cliCommandsArray = this.getPickedPresetsCli();
        this.markPickedPresetsAsFavorites();
        this.cliEngine.executeCommandsArray(cliCommandsArray).then(() => {
            const newCliErrorsCount = this.cliEngine.errorsCount;

            if (newCliErrorsCount !== currentCliErrorsCount) {
                this._domProgressDialog.close();
                this._domDialogCliErrors[0].showModal();
                this._domDialogCliErrorsSavePressed = false;
            } else {
                this._domProgressDialog.close();
                this.cliEngine.sendLine(CliEngine.s_commandSave);
                this.disconnectCliMakeSure();
            }
        });
    });
};

presets.markPickedPresetsAsFavorites = function() {
    for (const pickedPreset of this.pickedPresetList) {
        if (pickedPreset.presetRepo !== undefined){
            favoritePresets.add(pickedPreset.preset, pickedPreset.presetRepo);
        }
    }

    favoritePresets.saveToStorage();
};

presets.disconnectCliMakeSure = function() {
    GUI.timeout_add('disconnect', function () {
        $('div.connect_controls a.connect').trigger( "click" );
    }, 500);
};

presets.setupMenuButtons = function() {
    this._domButtonSave.on("click", () => this.onSaveClick());


    this._domButtonCancel.on("click", () => {
        for (const pickedPreset of this.pickedPresetList) {
            pickedPreset.preset.isPicked = false;
        }

        this.updateSearchResults();
        this.pickedPresetList.length = 0;
        this.enableSaveCancelButtons(false);
    });

    this._domButtonCliExit.on("click", () =>{
        this._domDialogCliErrorsSavePressed = false;
        this._domDialogCliErrors[0].close();
    });

    this._domButtonaSaveAnyway.on("click", () => {
        this._domDialogCliErrorsSavePressed = true;
        this._domDialogCliErrors[0].close();
        this.cliEngine.sendLine(CliEngine.s_commandSave, null, () => {
            // In case of batch CLI commands errors Firmware requeires extra "save" comand for CLI safety.
            // No need for this safety in presets as preset tab already detected errors and showed them to the user.
            // At this point user clicked "save anyway".
            this.cliEngine.sendLine(CliEngine.s_commandSave);
        });
        this.disconnectCliMakeSure();
    });

    this._domDialogCliErrors.on("close", () => {
        if(!this._domDialogCliErrorsSavePressed) {
            this._domDialogCliErrorsSavePressed = true;
            this.cliEngine.sendLine(CliEngine.s_commandExit);
            this.disconnectCliMakeSure();
        }
    });

    this._domButtonSaveBackup.on("click", () => this.onSaveConfigClick());
    this._domButtonLoadBackup.on("click", () => this.onLoadConfigClick());
    this._domButtonPresetSources.on("click", () => this.onPresetSourcesShowClick());
    this._domButtonHideBackupWarning.on("click", () => this.onButtonHideBackupWarningClick());

    this._domButtonSave.toggleClass(GUI.buttonDisabledClass, false);
    this._domButtonCancel.toggleClass(GUI.buttonDisabledClass, false);
    this._domReloadButton.on("click", () => this.reload());

    this.enableSaveCancelButtons(false);

};

presets.enableSaveCancelButtons = function (isEnabled) {
    this._domButtonSave.toggleClass(GUI.buttonDisabledClass, !isEnabled);
    this._domButtonCancel.toggleClass(GUI.buttonDisabledClass, !isEnabled);
};

presets.onButtonHideBackupWarningClick = function() {
    this._domWarningBackup.toggle(false);
    set({ 'showPresetsWarningBackup': false });
};

presets.setupBackupWarning = function() {
    const obj = get('showPresetsWarningBackup');
    if (obj.showPresetsWarningBackup === undefined) {
        obj.showPresetsWarningBackup = true;
    }

    const warningVisible = !!obj.showPresetsWarningBackup;
    this._domWarningBackup.toggle(warningVisible);
};

presets.onPresetSourcesShowClick = function() {
    this.presetsSourcesDialog.show().then(() => {
        this.reload();
    });
};

presets.onSaveConfigClick = function() {
    const waitingDialog = GUI.showWaitDialog({title: i18n.getMessage("presetsLoadingDumpAll"), buttonCancelCallback: null});

    const saveFailedDialogSettings = {
        title: i18n.getMessage("warningTitle"),
        text: i18n.getMessage("dumpAllNotSavedWarning"),
        buttonConfirmText: i18n.getMessage("close"),
    };

    this.activateCli()
    .then(() => this.readDumpAll())
    .then(cliStrings => {
        const prefix = 'cli_backup';
        const suffix = 'txt';
        const text = cliStrings.join("\n");
        const filename = generateFilename(prefix, suffix);
        return GUI.saveToTextFileDialog(text, filename, suffix);
    })
    .then(() => {
        waitingDialog.close();
        this.cliEngine.sendLine(CliEngine.s_commandExit);
    })
    .catch(() => {
        waitingDialog.close();
        return GUI.showInformationDialog(saveFailedDialogSettings);
    })
    .then(() => this.cliEngine.sendLine(CliEngine.s_commandExit));
};

presets.readDumpAll = function() {
    let lastCliStringReceived = performance.now();
    const diffAll = [CliEngine.s_commandDefaultsNoSave, ""];
    const readingDumpIntervalName = "PRESETS_READING_DUMP_INTERVAL";

    this.cliEngine.subscribeOnRowCame(str => {
        lastCliStringReceived = performance.now();

        if (CliEngine.s_commandDiffAll !== str && CliEngine.s_commandSave !== str) {
            diffAll.push(str);
        }
    });

    this.cliEngine.sendLine(CliEngine.s_commandDiffAll);

    return new Promise(resolve => {
        GUI.interval_add(readingDumpIntervalName, () => {
            const currentTime = performance.now();
            if (currentTime - lastCliStringReceived > 500) {
                this.cliEngine.unsubscribeOnRowCame();
                GUI.interval_remove(readingDumpIntervalName);
                resolve(diffAll);
            }
        }, 500, false);
    });
};

presets.onLoadConfigClick = function() {
    GUI.readTextFileDialog("txt")
    .then(text => {
        if (text) {
            const cliStrings = text.split("\n");
            const pickedPreset = new PickedPreset({title: "user configuration"}, cliStrings, undefined);
            this.pickedPresetList.push(pickedPreset);
            this.onSaveClick();
        }
    });
};

presets.onHtmlLoad = function(callback) {
    i18n.localizePage();
    TABS.presets.adaptPhones();
    this.readDom();
    this.setupMenuButtons();
    this.setupBackupWarning();
    this._inputTextFilter.attr("placeholder", "example: \"karate race\", or \"5'' freestyle\"");

    this.presetsDetailedDialog = new PresetsDetailedDialog($("#presets_detailed_dialog"), this.pickedPresetList, () => this.onPresetPickedCallback(), favoritePresets);
    this.presetsSourcesDialog = new PresetsSourcesDialog($("#presets_sources_dialog"));

    this.presetsDetailedDialog.load()
    .then(() => this.presetsSourcesDialog.load())
    .then(() => {
        this.tryLoadPresets();
        GUI.content_ready(callback);
    });
};

presets.onPresetPickedCallback = function() {
    this.enableSaveCancelButtons(true);
};

presets.activateCli = function() {
    return new Promise(resolve => {
        CONFIGURATOR.cliEngineActive = true;
        this.cliEngine.setUi($('#presets_cli_window'), $('#presets_cli_window_wrapper'), $('#presets_cli_command'));
        this.cliEngine.enterCliMode();

        GUI.timeout_add('presets_enter_cli_mode_done', () => {
            resolve();
        }, 500);
    });
};

presets.reload = function() {
    this.resetInitialValues();
    this.tryLoadPresets();
};

presets.tryLoadPresets = function() {
    const presetSources = this.presetsSourcesDialog.getActivePresetSources();

    this.presetsRepo = presetSources.map(source => {
        if (PresetSource.isUrlGithubRepo(source.url)) {
            return new PresetsGithubRepo(source.url, source.gitHubBranch, source.official, source.name);
        } else {
            return new PresetsWebsiteRepo(source.url, source.official, source.name);
        }
    });

    this._divMainContent.toggle(false);
    this._divGlobalLoadingError.toggle(false);
    this._divGlobalLoading.toggle(true);
    this._domWarningNotOfficialSource.toggle(this.presetsSourcesDialog.isThirdPartyActive);

    const failedToLoad = [];

    Promise.all(this.presetsRepo.map(p => p.loadIndex().catch((reason => failedToLoad.push(p)))))
    .then(() => {
        this._domWarningFailedToLoadRepositories.toggle(failedToLoad.length > 0);
        this._domWarningFailedToLoadRepositories.html(i18n.getMessage("presetsFailedToLoadRepositories", {"repos": failedToLoad.map(repo => repo.name).join("; ")}));
        this.presetsRepo = this.presetsRepo.filter(repo => !failedToLoad.includes(repo));
        return this.checkPresetSourceVersion();
    })
    .then(() => {
        this.presetsRepo.forEach(p => favoritePresets.addLastPickDate(p.index.presets, p));
        this.prepareFilterFields();
        this._divGlobalLoading.toggle(false);
        this._divMainContent.toggle(true);
    }).catch(err => {
        this._divGlobalLoading.toggle(false);
        this._divGlobalLoadingError.toggle(true);
        console.error(err);
    });
};

presets.multipleSelectComponentScrollFix = function() {
    /*
        A hack for multiple select that fixes scrolling problem
        when the number of items 199+. More details here:
        https://github.com/wenzhixin/multiple-select/issues/552
    */
   return new Promise((resolve) => {
    GUI.timeout_add('hack_fix_multipleselect_scroll', () => {
        this._selectCategory.multipleSelect('refresh');
        this._selectKeyword.multipleSelect('refresh');
        this._selectAuthor.multipleSelect('refresh');
        this._selectFirmwareVersion.multipleSelect('refresh');
        this._selectStatus.multipleSelect('refresh');
        resolve();
    }, 100);
   });
};

presets.checkPresetSourceVersion = function() {
    const self = this;

    return new Promise((resolve, reject) => {
        const differentMajorVersionsRepos = self.presetsRepo.filter(pr => self.majorVersion !== pr.index.majorVersion);
        if (differentMajorVersionsRepos.length === 0) {
            resolve();
        } else {
            const versionRequired = `${self.majorVersion}.X`;
            const versionSource = `${differentMajorVersionsRepos[0].index.majorVersion}.${differentMajorVersionsRepos[0].index.minorVersion}`;

            const dialogSettings = {
                title: i18n.getMessage("presetsWarningDialogTitle"),
                text: i18n.getMessage("presetsVersionMismatch", {"versionRequired": versionRequired, "versionSource":versionSource}),
                buttonYesText: i18n.getMessage("yes"),
                buttonNoText: i18n.getMessage("no"),
                buttonYesCallback: () => resolve(),
                buttonNoCallback: () => reject("Preset source version mismatch"),
            };

            GUI.showYesNoDialog(dialogSettings);
        }
    });
};

function getUniqueValues(objects, extractor) {
    let values = objects.map(extractor);
    let uniqueValues = [...values.reduce((a, b) => new Set([...a, ...b]), new Set())];
    return uniqueValues.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
}

presets.prepareFilterFields = function() {
    this._freezeSearch = true;

    this.prepareFilterSelectField(this._selectCategory, getUniqueValues(this.presetsRepo, x => x.index.uniqueValues.category), 3);
    this.prepareFilterSelectField(this._selectKeyword, getUniqueValues(this.presetsRepo, x => x.index.uniqueValues.keywords), 3);
    this.prepareFilterSelectField(this._selectAuthor, getUniqueValues(this.presetsRepo, x => x.index.uniqueValues.author), 1);
    this.prepareFilterSelectField(this._selectFirmwareVersion, getUniqueValues(this.presetsRepo, x => x.index.uniqueValues.firmware_version), 2);
    this.prepareFilterSelectField(this._selectStatus, getUniqueValues(this.presetsRepo, x => x.index.settings.PresetStatusEnum), 2);

    this.multipleSelectComponentScrollFix().then(() => {
        this.preselectFilterFields();
        this._inputTextFilter.on('input', () => this.updateSearchResults());
        this._freezeSearch = false;
        this.updateSearchResults();
    });
};

presets.preselectFilterFields = function() {
    const currentVersion = FC.CONFIG.flightControllerVersion;
    const selectedVersions = [];

    for (const repo of this.presetsRepo) {
        for (const bfVersion of repo.index.uniqueValues.firmware_version) {
            if (currentVersion.startsWith(bfVersion)) {
                selectedVersions.push(bfVersion);
            }
        }
    }

    this._selectFirmwareVersion.multipleSelect('setSelects', selectedVersions);
};

presets.prepareFilterSelectField = function(domSelectElement, selectOptions, minimumCountSelected) {
    domSelectElement.multipleSelect("destroy");
    domSelectElement.multipleSelect({
        data: selectOptions,
        showClear: true,
        minimumCountSelected : minimumCountSelected,
        placeholder: i18n.getMessage("dropDownFilterDisabled"),
        onClick: () => { this.updateSearchResults(); },
        onCheckAll: () => { this.updateSearchResults(); },
        onUncheckAll: () => { this.updateSearchResults(); },
        formatSelectAll() { return i18n.getMessage("dropDownSelectAll"); },
        formatAllSelected() { return i18n.getMessage("dropDownAll"); },
    });
};

presets.updateSearchResults = function() {
    if (!this._freezeSearch)
    {
        const searchParams = {
            categories: this._selectCategory.multipleSelect("getSelects", "text"),
            keywords: this._selectKeyword.multipleSelect("getSelects", "text"),
            authors: this._selectAuthor.multipleSelect("getSelects", "text"),
            firmwareVersions: this._selectFirmwareVersion.multipleSelect("getSelects", "text"),
            status: this._selectStatus.multipleSelect("getSelects", "text"),
            searchString: this._inputTextFilter.val().trim(),
        };

        this.updateSelectStyle();
        searchParams.authors = searchParams.authors.map(str => str.toLowerCase());
        const fitPresets = this.getFitPresets(searchParams);
        this.displayPresets(fitPresets);
    }
};

presets.updateSelectStyle = function() {
    this.updateSingleSelectStyle(this._selectCategory);
    this.updateSingleSelectStyle(this._selectKeyword);
    this.updateSingleSelectStyle(this._selectAuthor);
    this.updateSingleSelectStyle(this._selectFirmwareVersion);
    this.updateSingleSelectStyle(this._selectStatus);
};

presets.updateSingleSelectStyle = function(select) {
    const selectedOptions = select.multipleSelect("getSelects", "text");
    const isSomethingSelected = (0 !== selectedOptions.length);
    select.parent().find($(".ms-choice")).toggleClass("presets_filter_select_nonempty", isSomethingSelected);
};

presets.displayPresets = function(fitPresets) {
    this._presetPanels.forEach(presetPanel => {
        presetPanel.remove();
    });
    this._presetPanels = [];

    const maxPresetsToShow = 60;
    this._domListTooManyFound.toggle(fitPresets.length > maxPresetsToShow);
    fitPresets.length = Math.min(fitPresets.length, maxPresetsToShow);

    this._domListNoFound.toggle(fitPresets.length === 0);

    fitPresets.forEach(preset => {
        const presetPanel = new PresetTitlePanel(this._divPresetList, preset[0], preset[1], true, this.presetsSourcesDialog.isThirdPartyActive, favoritePresets);
        presetPanel.load();
        this._presetPanels.push(presetPanel);
        presetPanel.subscribeClick(this.presetsDetailedDialog, preset[1]);
    });

    this._domListTooManyFound.appendTo(this._divPresetList);
};


presets.getFitPresets = function(searchParams) {
    const result = [];
    const seenHashes = new Set();
    for (const repo of this.presetsRepo){
        for (const preset of repo.index.presets) {
            if (this.isPresetFitSearch(preset, searchParams) && !seenHashes.has(preset.hash)) {
                result.push([preset, repo]);
                seenHashes.add(preset.hash);
            }
        }
    }

    result.sort((a, b) => this.presetSearchPriorityComparer(a[0], b[0]));

    return result;
};

presets.presetSearchPriorityComparer = function(presetA, presetB) {
    if (presetA.lastPickDate && presetB.lastPickDate) {
        return presetB.lastPickDate - presetA.lastPickDate;
    }

    if (presetA.lastPickDate || presetB.lastPickDate) {
        return (presetA.lastPickDate) ? -1 : 1;
    }

    return (presetA.priority > presetB.priority) ? -1 : 1;
};

presets.isPresetFitSearchStatuses = function(preset, searchParams) {
    return 0 === searchParams.status.length || searchParams.status.includes(preset.status);
};

presets.isPresetFitSearchCategories = function(preset, searchParams) {
    if (0 !== searchParams.categories.length) {
        if (undefined === preset.category) {
            return false;
        }

        if (!searchParams.categories.includes(preset.category)) {
            return false;
        }
    }

    return true;
};

presets.isPresetFitSearchKeywords = function(preset, searchParams) {
    if (0 !== searchParams.keywords.length) {
        if (!Array.isArray(preset.keywords)) {
            return false;
        }

        const keywordsIntersection = searchParams.keywords.filter(value => preset.keywords.includes(value));
        if (0 === keywordsIntersection.length) {
            return false;
        }
    }

    return true;
};

presets.isPresetFitSearchAuthors = function(preset, searchParams) {
    if (0 !== searchParams.authors.length) {
        if (undefined === preset.author) {
            return false;
        }

        if (!searchParams.authors.includes(preset.author.toLowerCase())) {
            return false;
        }
    }

    return true;
};

presets.isPresetFitSearchFirmwareVersions = function(preset, searchParams) {
    if (0 !== searchParams.firmwareVersions.length) {
        if (!Array.isArray(preset.firmware_version)) {
            return false;
        }

        const firmwareVersionsIntersection = searchParams.firmwareVersions.filter(value => preset.firmware_version.includes(value));
        if (0 === firmwareVersionsIntersection.length) {
            return false;
        }
    }

    return true;
};


presets.isPresetFitSearchString = function(preset, searchParams) {
    if (searchParams.searchString) {
        const allKeywords = preset.keywords.join(" ");
        const allVersions = preset.firmware_version.join(" ");
        const totalLine = [preset.description, allKeywords, preset.title, preset.author, allVersions, preset.category].join("\n").toLowerCase().replace("''", "\"");
        const allWords = searchParams.searchString.toLowerCase().replace("''", "\"").split(" ");

        for (const word of allWords) {
            if (!totalLine.includes(word)) {
                return false;
            }
        }
    }

    return true;
};


presets.isPresetFitSearch = function(preset, searchParams) {
    if (preset.hidden) {
        return false;
    }

    if (!this.isPresetFitSearchStatuses(preset, searchParams)) {
        return false;
    }

    if (!this.isPresetFitSearchCategories(preset, searchParams)) {
        return false;
    }

    if (!this.isPresetFitSearchKeywords(preset, searchParams)) {
        return false;
    }

    if (!this.isPresetFitSearchAuthors(preset, searchParams)) {
        return false;
    }

    if (!this.isPresetFitSearchFirmwareVersions(preset, searchParams)) {
        return false;
    }

    if (!this.isPresetFitSearchString(preset, searchParams)) {
        return false;
    }

    return true;
};

presets.adaptPhones = function() {
    if (GUI.isCordova()) {
        UI_PHONES.initToolbar();
    }
};

presets.read = function(readInfo) {
    TABS.presets.cliEngine.readSerial(readInfo);
};

presets.cleanup = function(callback) {
    this.resetInitialValues();

    if (!(CONFIGURATOR.connectionValid && CONFIGURATOR.cliEngineActive && CONFIGURATOR.cliEngineValid)) {
        if (callback) {
            callback();
        }

        return;
    }

    TABS.presets.cliEngine.close(() => {
        if (callback) {
            callback();
        }
    });
};

presets.resetInitialValues = function() {
    CONFIGURATOR.cliEngineActive = false;
    CONFIGURATOR.cliEngineValid = false;
    TABS.presets.presetsRepo = [];
    TABS.presets.pickedPresetList.length = 0;
    this._domProgressDialog.close();
};

TABS.presets = presets;

export { presets };
//# sourceMappingURL=presets.js.map
