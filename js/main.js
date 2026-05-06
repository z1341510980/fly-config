import { w as windowWatcherUtil } from '../window_watchers.js';
import { $ as $$1 } from '../jquery.js';
import { j as jBox } from '../jbox.js';
import { g as get$1, i as i18n$1, s as set$1 } from '../localization.js';
import { i as i18next } from '../i18next.js';
import { V as Vue } from '../vue.js';
import { V as VueI18n } from '../@panter.js';
import { n as normalizeComponent, c as createInjector } from '../vue-runtime-helpers.js';
import { c as checkChromeRuntimeError, g as generateVirtualApiVersions, F as FC, a as getTextWidth, C as CONFIGURATOR, A as API_VERSION_1_42, b as API_VERSION_1_43, d as API_VERSION_1_44, e as API_VERSION_1_45, f as API_VERSION_1_46, h as bit_check, i as bit_set, j as bit_clear } from '../common.js';
import { S as Switchery } from '../switchery-latest.js';
import { g as gui_log } from '../gui_log.js';
import { i as inflection } from '../inflection.js';
import { s as semver } from '../semver.js';
import { S as ShortUniqueId } from '../short-unique-id.js';
import { d as debounce } from '../lodash.debounce.js';
import { C as CryptoES } from '../crypto-es.js';
import { R as REVISION } from '../three.js';
import '../d3-transition.js';
import '../d3-zoom.js';
import './jquery.js';
import '../jquery-ui.js';
import '../jquery-textcomplete.js';
import '../jquery-touchswipe.js';
import '../select2.js';
import '../@korzio.js';
import '../multiple-select.js';
import '../i18next-xhr-backend.js';
import '../@babel.js';
import '../lru-cache.js';
import '../yallist.js';
import '../d3-dispatch.js';
import '../d3-timer.js';
import '../d3-interpolate.js';
import '../d3-color.js';
import '../d3-selection.js';
import '../d3-ease.js';

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

Array.prototype.push8 = function(val) {
  this.push(0xFF & val);
  return this;
};

Array.prototype.push16 = function(val) {
  // low byte
  this.push(0x00FF & val);
  // high byte
  this.push(val >> 8);
  // chainable
  return this;
};

Array.prototype.push32 = function(val) {
    this.push8(val)
        .push8(val >> 8)
        .push8(val >> 16)
        .push8(val >> 24);
    return this;
};

DataView.prototype.offset = 0;
DataView.prototype.readU8 = function() {
    if (this.byteLength >= this.offset+1) {
        return this.getUint8(this.offset++);
    } else {
        return null;
    }
};

DataView.prototype.readU16 = function() {
    if (this.byteLength >= this.offset+2) {
        return this.readU8() + this.readU8()*256;
    } else {
        return null;
    }
};

DataView.prototype.readU32 = function() {
    if (this.byteLength >= this.offset+4) {
        return this.readU16() + this.readU16()*65536;
    } else {
        return null;
    }
};

DataView.prototype.read8 = function() {
    if (this.byteLength >= this.offset+1) {
        return this.getInt8(this.offset++, 1);
    } else {
        return null;
    }
};

DataView.prototype.read16 = function() {
    this.offset += 2;
    if (this.byteLength >= this.offset) {
        return this.getInt16(this.offset-2, 1);
    } else {
        return null;
    }
};

DataView.prototype.read32 = function() {
    this.offset += 4;
    if (this.byteLength >= this.offset) {
        return this.getInt32(this.offset-4, 1);
    } else {
        return null;
    }
};

DataView.prototype.remaining = function() {
    return this.byteLength - this.offset;
};

Vue.use(VueI18n);

const vueI18n = new VueI18n(i18next);

//
//
//
//
//

const NO_BATTERY_VOLTAGE_MAXIMUM$1 = 1.8; // Maybe is better to add a call to MSP_BATTERY_STATE but is not available for all versions

var script$6 = {
  props: {
    voltage: {
      type: Number,
      default: 0,
    },
    vbatmaxcellvoltage: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    reading() {
      let nbCells = Math.floor(this.voltage / this.vbatmaxcellvoltage) + 1;

      if (this.voltage === 0) {
        nbCells = 1;
      }

      const cellsText =
        this.voltage > NO_BATTERY_VOLTAGE_MAXIMUM$1 ? `${nbCells}S` : "USB";
      return `${this.voltage.toFixed(2)}V (${cellsText})`;
    },
  },
};

/* script */
const __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "battery-legend" }, [
    _vm._v("\n  " + _vm._s(_vm.reading) + "\n"),
  ])
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-99351a9a_0", { source: "\n.battery-legend {\r\n  display: inline;\r\n  position: relative;\r\n  top: -2px;\r\n  margin-top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  width: 40px;\r\n  text-align: left;\r\n  color: silver;\r\n  margin-left: -8px;\r\n  padding-right: 4px;\n}\r\n", map: {"version":3,"sources":["D:\\Project\\GXW\\BF\\betaflight-configurator\\src\\components\\quad-status\\BatteryLegend.vue"],"names":[],"mappings":";AAoCA;EACA,eAAA;EACA,kBAAA;EACA,SAAA;EACA,aAAA;EACA,OAAA;EACA,QAAA;EACA,WAAA;EACA,gBAAA;EACA,aAAA;EACA,iBAAA;EACA,kBAAA;AACA","file":"BatteryLegend.vue","sourcesContent":["<template>\r\n  <div class=\"battery-legend\">\r\n    {{ reading }}\r\n  </div>\r\n</template>\r\n<script>\r\nconst NO_BATTERY_VOLTAGE_MAXIMUM = 1.8; // Maybe is better to add a call to MSP_BATTERY_STATE but is not available for all versions\r\n\r\nexport default {\r\n  props: {\r\n    voltage: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    vbatmaxcellvoltage: {\r\n      type: Number,\r\n      default: 1,\r\n    },\r\n  },\r\n  computed: {\r\n    reading() {\r\n      let nbCells = Math.floor(this.voltage / this.vbatmaxcellvoltage) + 1;\r\n\r\n      if (this.voltage === 0) {\r\n        nbCells = 1;\r\n      }\r\n\r\n      const cellsText =\r\n        this.voltage > NO_BATTERY_VOLTAGE_MAXIMUM ? `${nbCells}S` : \"USB\";\r\n      return `${this.voltage.toFixed(2)}V (${cellsText})`;\r\n    },\r\n  },\r\n};\r\n</script>\r\n\r\n<style>\r\n.battery-legend {\r\n  display: inline;\r\n  position: relative;\r\n  top: -2px;\r\n  margin-top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  width: 40px;\r\n  text-align: left;\r\n  color: silver;\r\n  margin-left: -8px;\r\n  padding-right: 4px;\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    createInjector,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script$5 = {
  props: {
    configuratorVersion: {
      type: String,
      required: true,
    },
    firmwareVersion: {
      type: String,
      default: '',
    },
    firmwareId: {
      type: String,
      default: '',
    },
    hardwareId: {
      type: String,
      default: '',
    },
  },
};

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "logo" }, [
    _c("div", { staticClass: "logo_text" }, [
      _c("span", [
        _vm._v(
          "\n      " +
            _vm._s(_vm.$t("versionLabelConfigurator")) +
            ": " +
            _vm._s(_vm.configuratorVersion) +
            "\n    "
        ),
      ]),
      _vm._v(" "),
      _vm.firmwareVersion && _vm.firmwareId
        ? _c("span", [
            _vm._v(
              "\n      " +
                _vm._s(_vm.$t("versionLabelFirmware")) +
                ": " +
                _vm._s(_vm.firmwareVersion) +
                "\n      " +
                _vm._s(_vm.firmwareId) +
                "\n    "
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.hardwareId
        ? _c("span", [
            _vm._v(
              "\n      " +
                _vm._s(_vm.$t("versionLabelTarget")) +
                ": " +
                _vm._s(_vm.hardwareId) +
                "\n    "
            ),
          ])
        : _vm._e(),
    ]),
  ])
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-fa8520a6_0", { source: "\n.logo {\r\n  height: 70px;\r\n  width: 240px;\r\n  background-image: url(../../images/light-wide-2.svg);\r\n  background-repeat: no-repeat;\r\n  background-position: left center;\r\n  background-size: contain;\r\n  position: relative;\r\n  margin-top: -25px;\n}\n.logo_text {\r\n  position: absolute;\r\n  left: 80px;\r\n  top: 49px;\r\n  color: #949494;\r\n  opacity: 0.5;\r\n  font-size: 10px;\r\n  min-width: 210px;\r\n  display: flex;\r\n  flex-direction: column;\n}\n.tab_container .logo {\r\n  display: none;\n}\n@media all and (max-width: 575px) {\n.logo {\r\n    height: 24px;\r\n    width: 150px;\r\n    background-image: url(../../images/light-wide-2-compact.svg);\r\n    background-position: left center;\r\n    order: 2;\r\n    margin-top: 0;\n}\n.logo_text {\r\n    display: none !important;\n}\n.tab_container .logo {\r\n    display: block;\r\n    background-image: url(../../images/light-wide-2.svg);\r\n    background-repeat: no-repeat;\r\n    background-position: center 20px;\r\n    background-position-x: 12px;\r\n    background-size: 80%;\r\n    height: 120px;\r\n    width: auto;\r\n    margin-top: unset;\r\n    position: relative;\r\n    border-bottom: 1px solid rgba(0, 0, 0, 0.3);\n}\n.tab_container .logo .logo_text {\r\n    display: flex !important;\r\n    left: 82px;\r\n    top: 62px;\n}\n}\n@media all and (min-width: 1125px) {\n.logo {\r\n    width: 340px;\n}\n.logo_text {\r\n    font-size: inherit;\r\n    position: relative;\n}\n}\r\n", map: {"version":3,"sources":["D:\\Project\\GXW\\BF\\betaflight-configurator\\src\\components\\betaflight-logo\\BetaflightLogo.vue"],"names":[],"mappings":";AAyCA;EACA,YAAA;EACA,YAAA;EACA,oDAAA;EACA,4BAAA;EACA,gCAAA;EACA,wBAAA;EACA,kBAAA;EACA,iBAAA;AACA;AAEA;EACA,kBAAA;EACA,UAAA;EACA,SAAA;EACA,cAAA;EACA,YAAA;EACA,eAAA;EACA,gBAAA;EACA,aAAA;EACA,sBAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;AACA;IACA,YAAA;IACA,YAAA;IACA,4DAAA;IACA,gCAAA;IACA,QAAA;IACA,aAAA;AACA;AACA;IACA,wBAAA;AACA;AACA;IACA,cAAA;IACA,oDAAA;IACA,4BAAA;IACA,gCAAA;IACA,2BAAA;IACA,oBAAA;IACA,aAAA;IACA,WAAA;IACA,iBAAA;IACA,kBAAA;IACA,2CAAA;AACA;AACA;IACA,wBAAA;IACA,UAAA;IACA,SAAA;AACA;AACA;AAEA;AACA;IACA,YAAA;AACA;AAEA;IACA,kBAAA;IACA,kBAAA;AACA;AACA","file":"BetaflightLogo.vue","sourcesContent":["<template>\r\n  <div class=\"logo\">\r\n    <div class=\"logo_text\">\r\n      <span>\r\n        {{ $t(\"versionLabelConfigurator\") }}: {{ configuratorVersion }}\r\n      </span>\r\n      <span v-if=\"firmwareVersion && firmwareId\">\r\n        {{ $t(\"versionLabelFirmware\") }}: {{ firmwareVersion }}\r\n        {{ firmwareId }}\r\n      </span>\r\n      <span v-if=\"hardwareId\">\r\n        {{ $t(\"versionLabelTarget\") }}: {{ hardwareId }}\r\n      </span>\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  props: {\r\n    configuratorVersion: {\r\n      type: String,\r\n      required: true,\r\n    },\r\n    firmwareVersion: {\r\n      type: String,\r\n      default: '',\r\n    },\r\n    firmwareId: {\r\n      type: String,\r\n      default: '',\r\n    },\r\n    hardwareId: {\r\n      type: String,\r\n      default: '',\r\n    },\r\n  },\r\n};\r\n</script>\r\n\r\n<style>\r\n.logo {\r\n  height: 70px;\r\n  width: 240px;\r\n  background-image: url(../../images/light-wide-2.svg);\r\n  background-repeat: no-repeat;\r\n  background-position: left center;\r\n  background-size: contain;\r\n  position: relative;\r\n  margin-top: -25px;\r\n}\r\n\r\n.logo_text {\r\n  position: absolute;\r\n  left: 80px;\r\n  top: 49px;\r\n  color: #949494;\r\n  opacity: 0.5;\r\n  font-size: 10px;\r\n  min-width: 210px;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.tab_container .logo {\r\n  display: none;\r\n}\r\n\r\n@media all and (max-width: 575px) {\r\n  .logo {\r\n    height: 24px;\r\n    width: 150px;\r\n    background-image: url(../../images/light-wide-2-compact.svg);\r\n    background-position: left center;\r\n    order: 2;\r\n    margin-top: 0;\r\n  }\r\n  .logo_text {\r\n    display: none !important;\r\n  }\r\n  .tab_container .logo {\r\n    display: block;\r\n    background-image: url(../../images/light-wide-2.svg);\r\n    background-repeat: no-repeat;\r\n    background-position: center 20px;\r\n    background-position-x: 12px;\r\n    background-size: 80%;\r\n    height: 120px;\r\n    width: auto;\r\n    margin-top: unset;\r\n    position: relative;\r\n    border-bottom: 1px solid rgba(0, 0, 0, 0.3);\r\n  }\r\n  .tab_container .logo .logo_text {\r\n    display: flex !important;\r\n    left: 82px;\r\n    top: 62px;\r\n  }\r\n}\r\n\r\n@media all and (min-width: 1125px) {\r\n  .logo {\r\n    width: 340px;\r\n  }\r\n\r\n  .logo_text {\r\n    font-size: inherit;\r\n    position: relative;\r\n  }\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    createInjector,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//

var script$4 = {
  props: {
    configuratorVersion: {
      type: String,
      default: "",
    },
    firmwareVersion: {
      type: String,
      default: "",
    },
    firmwareId: {
      type: String,
      default: "",
    },
    hardwareId: {
      type: String,
      default: "",
    },
  },
};

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "version" }, [
    _vm._v(
      "\n  " +
        _vm._s(_vm.$t("versionLabelConfigurator")) +
        ": " +
        _vm._s(_vm.configuratorVersion) +
        "\n  "
    ),
    _vm.firmwareVersion && _vm.firmwareId
      ? _c("span", [
          _vm._v(
            "\n    , " +
              _vm._s(_vm.$t("versionLabelFirmware")) +
              ": " +
              _vm._s(_vm.firmwareVersion) +
              "\n    " +
              _vm._s(_vm.firmwareId) +
              "\n  "
          ),
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.hardwareId
      ? _c("span", [
          _vm._v(
            "\n    , " +
              _vm._s(_vm.$t("versionLabelTarget")) +
              ": " +
              _vm._s(_vm.hardwareId) +
              "\n  "
          ),
        ])
      : _vm._e(),
  ])
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-7bd8c1dd_0", { source: "\n.version {\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0;\r\n  margin-left: auto;\n}\r\n", map: {"version":3,"sources":["D:\\Project\\GXW\\BF\\betaflight-configurator\\src\\components\\status-bar\\StatusBarVersion.vue"],"names":[],"mappings":";AAqCA;EACA,SAAA;EACA,UAAA;EACA,SAAA;EACA,iBAAA;AACA","file":"StatusBarVersion.vue","sourcesContent":["<template>\r\n  <div class=\"version\">\r\n    {{ $t(\"versionLabelConfigurator\") }}: {{ configuratorVersion }}\r\n    <span v-if=\"firmwareVersion && firmwareId\">\r\n      , {{ $t(\"versionLabelFirmware\") }}: {{ firmwareVersion }}\r\n      {{ firmwareId }}\r\n    </span>\r\n    <span v-if=\"hardwareId\">\r\n      , {{ $t(\"versionLabelTarget\") }}: {{ hardwareId }}\r\n    </span>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  props: {\r\n    configuratorVersion: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n    firmwareVersion: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n    firmwareId: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n    hardwareId: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n  },\r\n};\r\n</script>\r\n\r\n<style>\r\n.version {\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0;\r\n  margin-left: auto;\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    createInjector,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//

var script$3 = {
  props: {
    message: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "",
    },
  },
};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("span", [
    _c("span", [_vm._v(_vm._s(_vm.$t(_vm.message)))]),
    _vm._v(" "),
    _c("span", [_vm._v(_vm._s(_vm.value))]),
    _vm._v(" "),
    _vm.unit ? _c("span", [_vm._v(_vm._s(_vm.unit))]) : _vm._e(),
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var script$2 = {
  components: {
    ReadingStat: __vue_component__$3,
  },
  props: {
    usageDown: {
      type: Number,
      default: 0,
    },
    usageUp: {
      type: Number,
      default: 0,
    },
  },
};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("span", [_vm._v(_vm._s(_vm.$t("statusbar_port_utilization")))]),
      _vm._v(" "),
      _c("ReadingStat", {
        attrs: {
          message: "statusbar_usage_download",
          value: _vm.usageDown,
          unit: "%",
        },
      }),
      _vm._v(" "),
      _c("ReadingStat", {
        attrs: {
          message: "statusbar_usage_upload",
          value: _vm.usageUp,
          unit: "%",
        },
      }),
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var script$1 = {
  components: {
    PortUtilization: __vue_component__$2,
    ReadingStat: __vue_component__$3,
    StatusBarVersion: __vue_component__$4,
  },
  props: {
    portUsageDown: {
      type: Number,
      default: 0,
    },
    portUsageUp: {
      type: Number,
      default: 0,
    },
    packetError: {
      type: Number,
      default: 0,
    },
    i2cError: {
      type: Number,
      default: 0,
    },
    cycleTime: {
      type: Number,
      default: 0,
    },
    cpuLoad: {
      type: Number,
      default: 0,
    },

    configuratorVersion: {
      type: String,
      default: "",
    },
    firmwareVersion: {
      type: String,
      default: "",
    },
    firmwareId: {
      type: String,
      default: "",
    },
    hardwareId: {
      type: String,
      default: "",
    },
  },
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { attrs: { id: "status-bar" } },
    [
      _c("PortUtilization", {
        attrs: { "usage-down": _vm.portUsageDown, "usage-up": _vm.portUsageUp },
      }),
      _vm._v(" "),
      _c("ReadingStat", {
        attrs: { message: "statusbar_packet_error", value: _vm.packetError },
      }),
      _vm._v(" "),
      _c("ReadingStat", {
        attrs: { message: "statusbar_i2c_error", value: _vm.i2cError },
      }),
      _vm._v(" "),
      _c("ReadingStat", {
        attrs: { message: "statusbar_cycle_time", value: _vm.cycleTime },
      }),
      _vm._v(" "),
      _c("ReadingStat", {
        attrs: { message: "statusbar_cpu_load", value: _vm.cpuLoad, unit: "%" },
      }),
      _vm._v(" "),
      _c("StatusBarVersion", {
        attrs: {
          "configurator-version": _vm.configuratorVersion,
          "firmware-version": _vm.firmwareVersion,
          "firmware-id": _vm.firmwareId,
          "hardware-id": _vm.hardwareId,
        },
      }),
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-705caefa_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n/** Status bar **/\n#status-bar {\r\n  position: fixed;\r\n  display: flex;\r\n  gap: 10px;\r\n  bottom: 0;\r\n  width: calc(100% - 20px);\r\n  height: 20px;\r\n  line-height: 20px;\r\n  padding: 0 10px 0 10px;\r\n  border-top: 1px solid #7d7d79;\r\n  background-color: #bfbeb5;\n}\n#status-bar > * ~ * {\r\n  padding-left: 10px;\r\n  border-left: 1px solid #7d7d79;\n}\r\n\r\n/** Status bar (phones) **/\n@media all and (max-width: 575px) {\n#status-bar {\r\n    display: none;\n}\n}\r\n", map: {"version":3,"sources":["D:\\Project\\GXW\\BF\\betaflight-configurator\\src\\components\\status-bar\\StatusBar.vue"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AA0FA,iBAAA;AACA;EACA,eAAA;EACA,aAAA;EACA,SAAA;EACA,SAAA;EACA,wBAAA;EACA,YAAA;EACA,iBAAA;EACA,sBAAA;EACA,6BAAA;EACA,yBAAA;AACA;AAEA;EACA,kBAAA;EACA,8BAAA;AACA;;AAEA,0BAAA;AACA;AACA;IACA,aAAA;AACA;AACA","file":"StatusBar.vue","sourcesContent":["<template>\r\n  <div id=\"status-bar\">\r\n    <PortUtilization\r\n      :usage-down=\"portUsageDown\"\r\n      :usage-up=\"portUsageUp\"\r\n    />\r\n    <ReadingStat\r\n      message=\"statusbar_packet_error\"\r\n      :value=\"packetError\"\r\n    />\r\n    <ReadingStat\r\n      message=\"statusbar_i2c_error\"\r\n      :value=\"i2cError\"\r\n    />\r\n    <ReadingStat\r\n      message=\"statusbar_cycle_time\"\r\n      :value=\"cycleTime\"\r\n    />\r\n    <ReadingStat\r\n      message=\"statusbar_cpu_load\"\r\n      :value=\"cpuLoad\"\r\n      unit=\"%\"\r\n    />\r\n    <StatusBarVersion\r\n      :configurator-version=\"configuratorVersion\"\r\n      :firmware-version=\"firmwareVersion\"\r\n      :firmware-id=\"firmwareId\"\r\n      :hardware-id=\"hardwareId\"\r\n    />\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport StatusBarVersion from \"./StatusBarVersion.vue\";\r\nimport ReadingStat from \"./ReadingStat.vue\";\r\nimport PortUtilization from \"./PortUtilization.vue\";\r\n\r\nexport default {\r\n  components: {\r\n    PortUtilization,\r\n    ReadingStat,\r\n    StatusBarVersion,\r\n  },\r\n  props: {\r\n    portUsageDown: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    portUsageUp: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    packetError: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    i2cError: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    cycleTime: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    cpuLoad: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n\r\n    configuratorVersion: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n    firmwareVersion: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n    firmwareId: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n    hardwareId: {\r\n      type: String,\r\n      default: \"\",\r\n    },\r\n  },\r\n};\r\n</script>\r\n\r\n<style>\r\n/** Status bar **/\r\n#status-bar {\r\n  position: fixed;\r\n  display: flex;\r\n  gap: 10px;\r\n  bottom: 0;\r\n  width: calc(100% - 20px);\r\n  height: 20px;\r\n  line-height: 20px;\r\n  padding: 0 10px 0 10px;\r\n  border-top: 1px solid #7d7d79;\r\n  background-color: #bfbeb5;\r\n}\r\n\r\n#status-bar > * ~ * {\r\n  padding-left: 10px;\r\n  border-left: 1px solid #7d7d79;\r\n}\r\n\r\n/** Status bar (phones) **/\r\n@media all and (max-width: 575px) {\r\n  #status-bar {\r\n    display: none;\r\n  }\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//

const NO_BATTERY_VOLTAGE_MAXIMUM = 1.8; // Maybe is better to add a call to MSP_BATTERY_STATE but is not available for all versions

var script = {
  props: {
    voltage: {
      type: Number,
      default: 0,
    },
    vbatmincellvoltage: {
      type: Number,
      default: 1,
    },
    vbatmaxcellvoltage: {
      type: Number,
      default: 1,
    },
    vbatwarningcellvoltage: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    nbCells() {
      let nbCells = Math.floor(this.voltage / this.vbatmaxcellvoltage) + 1;
      if (this.voltage === 0) {
        nbCells = 1;
      }
      return nbCells;
    },
    min() {
      return this.vbatmincellvoltage * this.nbCells;
    },
    max() {
      return this.vbatmaxcellvoltage * this.nbCells;
    },
    warn() {
      return this.vbatwarningcellvoltage * this.nbCells;
    },
    isEmpty() {
      return (
        this.voltage < this.min && this.voltage > NO_BATTERY_VOLTAGE_MAXIMUM
      );
    },
    classes() {
      if (this.batteryState) {
        return {
          "state-ok": this.batteryState === 0,
          "state-warning": this.batteryState === 1,
          "state-empty": this.batteryState === 2,
          // TODO: BATTERY_NOT_PRESENT
          // TODO: BATTERY_INIT
        };
      }
      const isWarning = this.voltage < this.warn;
      return {
        "state-empty": this.isEmpty,
        "state-warning": isWarning,
        "state-ok": !this.isEmpty && !isWarning,
      };
    },
    batteryWidth() {
      return this.isEmpty
        ? 100
        : ((this.voltage - this.min) / (this.max - this.min)) * 100;
    },
  },
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "battery-icon" }, [
    _c("div", { staticClass: "quad-status-contents" }, [
      _c("div", {
        staticClass: "battery-status",
        class: _vm.classes,
        style: { width: _vm.batteryWidth + "%" },
      }),
    ]),
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-58f19d4a_0", { source: "\n.quad-status-contents {\r\n  display: inline-block;\r\n  margin-top: 10px;\r\n  margin-left: 14px;\r\n  height: 10px;\r\n  width: 31px;\n}\n.quad-status-contents progress::-webkit-progress-bar {\r\n  height: 12px;\r\n  background-color: #eee;\n}\n.quad-status-contents progress::-webkit-progress-value {\r\n  background-color: #bcf;\n}\n.battery-icon {\r\n  background-image: url(../../images/icons/cf_icon_bat_grey.svg);\r\n  background-size: contain;\r\n  background-position: center;\r\n  display: inline-block;\r\n  height: 30px;\r\n  width: 60px;\r\n  transition: none;\r\n  margin-top: 4px;\r\n  margin-left: -4px;\r\n  background-repeat: no-repeat;\n}\n.battery-status {\r\n  height: 11px;\n}\n@keyframes error-blinker {\n0% {\r\n    background-color: transparent;\n}\n50% {\r\n    background-color: var(--error);\n}\n}\n.battery-status.state-ok {\r\n  background-color: #59aa29;\n}\n.battery-status.state-warning {\r\n  background-color: var(--error);\n}\n.battery-status.state-empty {\r\n  animation: error-blinker 1s linear infinite;\n}\r\n", map: {"version":3,"sources":["D:\\Project\\GXW\\BF\\betaflight-configurator\\src\\components\\quad-status\\BatteryIcon.vue"],"names":[],"mappings":";AAkFA;EACA,qBAAA;EACA,gBAAA;EACA,iBAAA;EACA,YAAA;EACA,WAAA;AACA;AAEA;EACA,YAAA;EACA,sBAAA;AACA;AAEA;EACA,sBAAA;AACA;AAEA;EACA,8DAAA;EACA,wBAAA;EACA,2BAAA;EACA,qBAAA;EACA,YAAA;EACA,WAAA;EACA,gBAAA;EACA,eAAA;EACA,iBAAA;EACA,4BAAA;AACA;AAEA;EACA,YAAA;AACA;AAEA;AACA;IACA,6BAAA;AACA;AACA;IACA,8BAAA;AACA;AACA;AAEA;EACA,yBAAA;AACA;AACA;EACA,8BAAA;AACA;AAEA;EACA,2CAAA;AACA","file":"BatteryIcon.vue","sourcesContent":["<template>\r\n  <div class=\"battery-icon\">\r\n    <div class=\"quad-status-contents\">\r\n      <div\r\n        class=\"battery-status\"\r\n        :class=\"classes\"\r\n        :style=\"{ width: batteryWidth + '%' }\"\r\n      />\r\n    </div>\r\n  </div>\r\n</template>\r\n<script>\r\nconst NO_BATTERY_VOLTAGE_MAXIMUM = 1.8; // Maybe is better to add a call to MSP_BATTERY_STATE but is not available for all versions\r\n\r\nexport default {\r\n  props: {\r\n    voltage: {\r\n      type: Number,\r\n      default: 0,\r\n    },\r\n    vbatmincellvoltage: {\r\n      type: Number,\r\n      default: 1,\r\n    },\r\n    vbatmaxcellvoltage: {\r\n      type: Number,\r\n      default: 1,\r\n    },\r\n    vbatwarningcellvoltage: {\r\n      type: Number,\r\n      default: 1,\r\n    },\r\n  },\r\n  computed: {\r\n    nbCells() {\r\n      let nbCells = Math.floor(this.voltage / this.vbatmaxcellvoltage) + 1;\r\n      if (this.voltage === 0) {\r\n        nbCells = 1;\r\n      }\r\n      return nbCells;\r\n    },\r\n    min() {\r\n      return this.vbatmincellvoltage * this.nbCells;\r\n    },\r\n    max() {\r\n      return this.vbatmaxcellvoltage * this.nbCells;\r\n    },\r\n    warn() {\r\n      return this.vbatwarningcellvoltage * this.nbCells;\r\n    },\r\n    isEmpty() {\r\n      return (\r\n        this.voltage < this.min && this.voltage > NO_BATTERY_VOLTAGE_MAXIMUM\r\n      );\r\n    },\r\n    classes() {\r\n      if (this.batteryState) {\r\n        return {\r\n          \"state-ok\": this.batteryState === 0,\r\n          \"state-warning\": this.batteryState === 1,\r\n          \"state-empty\": this.batteryState === 2,\r\n          // TODO: BATTERY_NOT_PRESENT\r\n          // TODO: BATTERY_INIT\r\n        };\r\n      }\r\n      const isWarning = this.voltage < this.warn;\r\n      return {\r\n        \"state-empty\": this.isEmpty,\r\n        \"state-warning\": isWarning,\r\n        \"state-ok\": !this.isEmpty && !isWarning,\r\n      };\r\n    },\r\n    batteryWidth() {\r\n      return this.isEmpty\r\n        ? 100\r\n        : ((this.voltage - this.min) / (this.max - this.min)) * 100;\r\n    },\r\n  },\r\n};\r\n</script>\r\n\r\n<style>\r\n.quad-status-contents {\r\n  display: inline-block;\r\n  margin-top: 10px;\r\n  margin-left: 14px;\r\n  height: 10px;\r\n  width: 31px;\r\n}\r\n\r\n.quad-status-contents progress::-webkit-progress-bar {\r\n  height: 12px;\r\n  background-color: #eee;\r\n}\r\n\r\n.quad-status-contents progress::-webkit-progress-value {\r\n  background-color: #bcf;\r\n}\r\n\r\n.battery-icon {\r\n  background-image: url(../../images/icons/cf_icon_bat_grey.svg);\r\n  background-size: contain;\r\n  background-position: center;\r\n  display: inline-block;\r\n  height: 30px;\r\n  width: 60px;\r\n  transition: none;\r\n  margin-top: 4px;\r\n  margin-left: -4px;\r\n  background-repeat: no-repeat;\r\n}\r\n\r\n.battery-status {\r\n  height: 11px;\r\n}\r\n\r\n@keyframes error-blinker {\r\n  0% {\r\n    background-color: transparent;\r\n  }\r\n  50% {\r\n    background-color: var(--error);\r\n  }\r\n}\r\n\r\n.battery-status.state-ok {\r\n  background-color: #59aa29;\r\n}\r\n.battery-status.state-warning {\r\n  background-color: var(--error);\r\n}\r\n\r\n.battery-status.state-empty {\r\n  animation: error-blinker 1s linear infinite;\r\n}\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

const TABS = {};

const GUI_MODES = {
    NWJS: "NW.js",
    Cordova: "Cordova",
    Other: "Other",
};

class GuiControl {
    constructor() {
        this.auto_connect = false;
        this.connecting_to = false;
        this.connected_to = false;
        this.connect_lock = false;
        this.active_tab = null;
        this.tab_switch_in_progress = false;
        this.operating_system = null;
        this.interval_array = [];
        this.timeout_array = [];
        this.buttonDisabledClass = "disabled";

        this.defaultAllowedTabsWhenDisconnected = [
            'landing',
            'firmware_flasher',
            'privacy_policy',
            'options',
            'help',
        ];

        this.defaultAllowedTabs = [
            'setup',
            'failsafe',
            'power',
            'adjustments',
            'auxiliary',
            'presets',
            'cli',
            'configuration',
            'logging',
            'onboard_logging',
            'modes',
            'motors',
            'pid_tuning',
            'ports',
            'receiver',
            'sensors',
            'vtx',
        ];

        this.defaultCloudBuildTabOptions = [
            'gps',
            'led_strip',
            'osd',
            'servos',
            'transponder',
        ];

        this.defaultAllowedFCTabsWhenConnected = [ ...this.defaultAllowedTabs, ...this.defaultCloudBuildTabOptions];

        this.allowedTabs = this.defaultAllowedTabsWhenDisconnected;

        // check which operating system is user running
        this.operating_system = GUI_checkOperatingSystem();

        // Check the method of execution
        this.nwGui = null;
        try {
            this.nwGui = require('nw.gui');
            this.Mode = GUI_MODES.NWJS;
        } catch (ex) {
            if (typeof cordovaApp !== 'undefined') {
                this.Mode = GUI_MODES.Cordova;
            } else {
                this.Mode = GUI_MODES.Other;
            }
        }
    }
    // Timer managing methods
    // name = string
    // code = function reference (code to be executed)
    // interval = time interval in miliseconds
    // first = true/false if code should be ran initially before next timer interval hits
    interval_add(name, code, interval, first) {
        const data = { 'name': name, 'timer': null, 'code': code, 'interval': interval, 'fired': 0, 'paused': false };

        if (first === true) {
            code(); // execute code

            data.fired++; // increment counter
        }

        data.timer = setInterval(function () {
            code(); // execute code

            data.fired++; // increment counter
        }, interval);

        this.interval_array.push(data); // push to primary interval array

        return data;
    }
    // name = string
    // code = function reference (code to be executed)
    // interval = time interval in miliseconds
    // first = true/false if code should be ran initially before next timer interval hits
    // condition = function reference with true/false result, a condition to be checked before every interval code execution
    interval_add_condition(name, code, interval, first, condition) {
        this.interval_add(name, () => {
            if (condition()) {
                code();
            } else {
                this.interval_remove(name);
            }
        }, interval, first);
    }
    // name = string
    interval_remove(name) {
        for (let i = 0; i < this.interval_array.length; i++) {
            if (this.interval_array[i].name === name) {
                clearInterval(this.interval_array[i].timer); // stop timer

                this.interval_array.splice(i, 1); // remove element/object from array

                return true;
            }
        }

        return false;
    }
    // name = string
    interval_pause(name) {
        for (let i = 0; i < this.interval_array.length; i++) {
            if (this.interval_array[i].name === name) {
                clearInterval(this.interval_array[i].timer);
                this.interval_array[i].paused = true;

                return true;
            }
        }

        return false;
    }
    // name = string
    interval_resume(name) {

        function executeCode(obj) {
            obj.code(); // execute code
            obj.fired++; // increment counter
        }

        for (let i = 0; i < this.interval_array.length; i++) {
            if (this.interval_array[i].name === name && this.interval_array[i].paused) {
                const obj = this.interval_array[i];

                obj.timer = setInterval(executeCode, obj.interval, obj);

                obj.paused = false;

                return true;
            }
        }

        return false;
    }
    // input = array of timers thats meant to be kept, or nothing
    // return = returns timers killed in last call
    interval_kill_all(keepArray) {
        const self = this;
        let timersKilled = 0;

        for (let i = (this.interval_array.length - 1); i >= 0; i--) { // reverse iteration
            let keep = false;
            if (keepArray) { // only run through the array if it exists
                keepArray.forEach(function (name) {
                    if (self.interval_array[i].name === name) {
                        keep = true;
                    }
                });
            }

            if (!keep) {
                clearInterval(this.interval_array[i].timer); // stop timer

                this.interval_array.splice(i, 1); // remove element/object from array

                timersKilled++;
            }
        }

        return timersKilled;
    }
    // name = string
    // code = function reference (code to be executed)
    // timeout = timeout in miliseconds
    timeout_add(name, code, timeout) {
        const self = this;
        const data = {
            'name': name,
            'timer': null,
            'timeout': timeout,
        };

        // start timer with "cleaning" callback
        data.timer = setTimeout(function () {
            code(); // execute code


            // remove object from array
            const index = self.timeout_array.indexOf(data);
            if (index > -1) {
                self.timeout_array.splice(index, 1);
            }
        }, timeout);

        self.timeout_array.push(data); // push to primary timeout array

        return data;
    }
    // name = string
    timeout_remove(name) {
        for (let i = 0; i < this.timeout_array.length; i++) {
            if (this.timeout_array[i].name === name) {
                clearTimeout(this.timeout_array[i].timer); // stop timer

                this.timeout_array.splice(i, 1); // remove element/object from array

                return true;
            }
        }

        return false;
    }
    // no input parameters
    // return = returns timers killed in last call
    timeout_kill_all() {
        let timersKilled = 0;

        for (let i = 0; i < this.timeout_array.length; i++) {
            clearTimeout(this.timeout_array[i].timer); // stop timer

            timersKilled++;
        }

        this.timeout_array = []; // drop objects

        return timersKilled;
    }

    // Method is called every time a valid tab change event is received
    // callback = code to run when cleanup is finished
    // default switch doesn't require callback to be set
    tab_switch_cleanup(callback) {
        MSP$1.callbacks_cleanup(); // we don't care about any old data that might or might not arrive
        this.interval_kill_all(); // all intervals (mostly data pulling) needs to be removed on tab switch

        if (this.active_tab && TABS[this.active_tab]) {
            TABS[this.active_tab].cleanup(callback);
        } else {
            callback();
        }
    }
    switchery() {

        const COLOR_ACCENT = 'var(--accent)';
        const COLOR_SWITCHERY_SECOND = 'var(--switcherysecond)';

        $$1('.togglesmall').each(function (index, elem) {
            const switchery = new Switchery(elem, {
                size: 'small',
                color: COLOR_ACCENT,
                secondaryColor: COLOR_SWITCHERY_SECOND,
            });
            $$1(elem).on("change", function () {
                switchery.setPosition();
            });
            $$1(elem).removeClass('togglesmall');
        });

        $$1('.toggle').each(function (index, elem) {
            const switchery = new Switchery(elem, {
                color: COLOR_ACCENT,
                secondaryColor: COLOR_SWITCHERY_SECOND,
            });
            $$1(elem).on("change", function () {
                switchery.setPosition();
            });
            $$1(elem).removeClass('toggle');
        });

        $$1('.togglemedium').each(function (index, elem) {
            const switchery = new Switchery(elem, {
                className: 'switcherymid',
                color: COLOR_ACCENT,
                secondaryColor: COLOR_SWITCHERY_SECOND,
            });
            $$1(elem).on("change", function () {
                switchery.setPosition();
            });
            $$1(elem).removeClass('togglemedium');
        });
    }
    content_ready(callback) {

        this.switchery();

        const tRex = GUI.active_tab.replaceAll('_', '-').toLowerCase();

        $$1('div#content #button-documentation')
        .html(i18n.getMessage('betaflightSupportButton'))
        .attr("href", `https://betaflight.com/docs/wiki/configurator/${tRex}-tab`);

        // loading tooltip
        $$1(function () {

            new jBox('Tooltip', {
                attach: '.cf_tip',
                trigger: 'mouseenter',
                closeOnMouseleave: true,
                closeOnClick: 'body',
                delayOpen: 100,
                delayClose: 100,
                position: {
                    x: 'right',
                    y: 'center',
                },
                outside: 'x',
            });

            new jBox('Tooltip', {
                theme: 'Widetip',
                attach: '.cf_tip_wide',
                trigger: 'mouseenter',
                closeOnMouseleave: true,
                closeOnClick: 'body',
                delayOpen: 100,
                delayClose: 100,
                position: {
                    x: 'right',
                    y: 'center',
                },
                outside: 'x',
            });
        });

        if (callback) {
            callback();
        }
    }
    selectDefaultTabWhenConnected() {
        const result = get$1(['rememberLastTab', 'lastTab']);
        const tab = result.rememberLastTab && result.lastTab && this.allowedTabs.includes(result.lastTab.substring(4)) ? result.lastTab : 'tab_setup';

        $$1(`#tabs ul.mode-connected .${tab} a`).trigger('click');
    }
    isNWJS() {
        return this.Mode === GUI_MODES.NWJS;
    }
    isCordova() {
        return this.Mode === GUI_MODES.Cordova;
    }
    isOther() {
        return this.Mode === GUI_MODES.Other;
    }
    showYesNoDialog(yesNoDialogSettings) {
        // yesNoDialogSettings:
        // title, text, buttonYesText, buttonNoText, buttonYesCallback, buttonNoCallback
        const dialog = $$1(".dialogYesNo");
        const title = dialog.find(".dialogYesNoTitle");
        const content = dialog.find(".dialogYesNoContent");
        const buttonYes = dialog.find(".dialogYesNo-yesButton");
        const buttonNo = dialog.find(".dialogYesNo-noButton");

        title.html(yesNoDialogSettings.title);
        content.html(yesNoDialogSettings.text);
        buttonYes.html(yesNoDialogSettings.buttonYesText);
        buttonNo.html(yesNoDialogSettings.buttonNoText);

        buttonYes.off("click");
        buttonNo.off("click");

        buttonYes.on("click", () => {
            dialog[0].close();
            yesNoDialogSettings.buttonYesCallback?.();
        });

        buttonNo.on("click", () => {
            dialog[0].close();
            yesNoDialogSettings.buttonNoCallback?.();
        });

        dialog[0].showModal();
    }
    showWaitDialog(waitDialogSettings) {
        // waitDialogSettings:
        // title, buttonCancelCallback
        const dialog = $$1(".dialogWait")[0];
        const title = $$1(".dialogWaitTitle");
        const buttonCancel = $$1(".dialogWait-cancelButton");

        title.html(waitDialogSettings.title);
        buttonCancel.toggle(!!waitDialogSettings.buttonCancelCallback);

        buttonCancel.off("click");

        buttonCancel.on("click", () => {
            dialog.close();
            waitDialogSettings.buttonCancelCallback?.();
        });

        dialog.showModal();
        return dialog;
    }
    showInformationDialog(informationDialogSettings) {
        // informationDialogSettings:
        // title, text, buttonConfirmText
        return new Promise(resolve => {
            const dialog = $$1(".dialogInformation");
            const title = dialog.find(".dialogInformationTitle");
            const content = dialog.find(".dialogInformationContent");
            const buttonConfirm = dialog.find(".dialogInformation-confirmButton");

            title.html(informationDialogSettings.title);
            content.html(informationDialogSettings.text);
            buttonConfirm.html(informationDialogSettings.buttonConfirmText);

            buttonConfirm.off("click");

            buttonConfirm.on("click", () => {
                dialog[0].close();
                resolve();
            });

            dialog[0].showModal();
        });
    }
    saveToTextFileDialog(textToSave, suggestedFileName, extension) {
        return new Promise((resolve, reject) => {
            const accepts = [{ description: `${extension.toUpperCase()} files`, extensions: [extension] }];

            chrome.fileSystem.chooseEntry(
                {
                    type: 'saveFile',
                    suggestedName: suggestedFileName,
                    accepts: accepts,
                },
                entry => this._saveToTextFileDialogFileSelected(entry, textToSave, resolve, reject),
            );
        });
    }
    _saveToTextFileDialogFileSelected(entry, textToSave, resolve, reject) {
        checkChromeRuntimeError();

        if (!entry) {
            console.log('No file selected for saving');
            resolve(false);
            return;
        }

        entry.createWriter(writer => {
            writer.onerror = () => {
                reject();
                console.error('Failed to write file');
            };

            writer.onwriteend = () => {
                if (textToSave.length > 0 && writer.length === 0) {
                    writer.write(new Blob([textToSave], { type: 'text/plain' }));
                } else {
                    resolve(true);
                    console.log('File write complete');
                }
            };

            writer.truncate(0);
        },
            () => {
                reject();
                console.error('Failed to get file writer');
            });
    }
    readTextFileDialog(extension) {
        const accepts = [{ description: `${extension.toUpperCase()} files`, extensions: [extension] }];

        return new Promise((resolve, reject) => {
            chrome.fileSystem.chooseEntry({ type: 'openFile', accepts: accepts }, function (entry) {
                checkChromeRuntimeError();

                if (!entry) {
                    console.log('No file selected for loading');
                    resolve(false);
                    return;
                }

                entry.file((file) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => {
                        console.error(reader.error);
                        reject();
                    };
                    reader.readAsText(file);
                });
            });
        });
    }
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    addLinksTargetBlank(element) {
        element.find('a').each(function () {
            $$1(this).attr('target', '_blank');
        });
    }
}

function GUI_checkOperatingSystem() {
    return navigator?.userAgentData?.platform || 'Android';
}

const GUI = new GuiControl();

function isWeb() {
    return !GUI.isNWJS() && !GUI.isCordova();
}

const MDNS_INTERVAL = 10000;
const TCP_CHECK_INTERVAL = 5000;
const TCP_TIMEOUT = 2000;

const MdnsDiscovery = new function() {
    this.mdnsBrowser = {
        services: [],
        browser: null,
    };

    this.tcpCheckLock = false;
};

MdnsDiscovery.initialize = function() {
    const self = this;

    if (GUI.isCordova()) {
        const zeroconf = cordova.plugins.zeroconf;

        function reinit() {
            zeroconf.registerAddressFamily = 'ipv4'; // or 'ipv6' ('any' by default)
            zeroconf.watchAddressFamily = 'ipv4'; // or 'ipv6' ('any' by default)
            zeroconf.watch("_http._tcp.", "local.", (result) => {
                const action = result.action;
                const service = result.service;

                if (action === 'resolved' && service.name.includes("elrs_rx")) {
                    console.log("Zeroconf Service Changed", service);
                    self.mdnsBrowser.services.push({
                        addresses: service.ipv4Addresses,
                        txt: service.txtRecord,
                        fqdn: `${service.name}._http._tcp.local.`,
                        ready: true,
                    });
                } else if (action === 'added' && service.name.includes("elrs_rx")) {
                    //restart zeroconf if service ip doesn't arrive in 1000ms
                    setTimeout(() => {
                        if (self.mdnsBrowser.services.length === 0 || self.mdnsBrowser.services.filter(s => s.fqdn === `${service.name}._http._tcp.local.`)[0].ready === false) {
                            zeroconf.close();
                            reinit();
                        }
                    },1000);
                }
            });
        }

        reinit();
    } else {
        if(!isWeb()) {
            import('../bonjour.js').then(function (n) { return n.i; }).then(({ default: bonjour  }) => {
                self.mdnsBrowser.browser = bonjour.find({ type: 'http' }, service => {
                    console.log("Found HTTP service", service);
                    self.mdnsBrowser.services.push({
                        addresses: service.addresses,
                        txt: service.txt,
                        fqdn: service.fqdn,
                        ready: true,
                    });
                });
            });
        }
    }

    setInterval(() => {
        if (GUI.isCordova() && self.mdnsBrowser.services.length > 0) {
            //ping removed services and enable them if they are online
            const inactiveServices = self.mdnsBrowser.services.filter(s => s.ready === false);
            inactiveServices.forEach(function (service) {
                $.ajax({
                    url: `http://${service.addresses[0]}`,
                    success: () => {
                        self.mdnsBrowser.services = self.mdnsBrowser.services
                        .map(s => {
                            if (s.fqdn === service.fqdn) {
                                return {...s, ready: true};
                            }
                            return s;
                        });
                    },
                    error: () => {},
                    timeout: TCP_TIMEOUT,
                });
            });
        }
        else if (!GUI.connected_to && self.mdnsBrowser.browser) {
            self.mdnsBrowser.browser.update();
        }
    }, MDNS_INTERVAL);

    setInterval(() => {
        self.tcpCheck();
    }, TCP_CHECK_INTERVAL);
};

MdnsDiscovery.tcpCheck = function() {
    const self = this;

    if (!self.tcpCheckLock) {
        self.tcpCheckLock = true;
        if (PortHandler$1.initialPorts?.length > 0) {
            const tcpPorts = PortHandler$1.initialPorts.filter(p => p.path.startsWith('tcp://'));
            tcpPorts.forEach(function (port) {
                const removePort = () => {
                    if (GUI.isCordova()) {
                        //disable offline services instead of removing them
                        self.mdnsBrowser.services = self.mdnsBrowser.services
                        .map(s => {
                            if (s.fqdn === port.fqdn) {
                                return {...s, ready: false};
                              }
                              return s;
                            });
                    }
                    else {
                        self.mdnsBrowser.browser._removeService(port.fqdn);
                        self.mdnsBrowser.services = self.mdnsBrowser.services.filter(s => s.fqdn !== port.fqdn);
                    }
                };
                $.ajax({
                    url: `http://${port.path.split('//').pop()}`,
                    error: removePort,
                    timeout: TCP_TIMEOUT,
                });
            });

            //timeout is 2000ms for every found port, so wait that time before checking again
            setTimeout(() => {
                self.tcpCheckLock = false;
            }, Math.min(tcpPorts.length, 1) * (TCP_TIMEOUT + 1));
        } else {
            self.tcpCheckLock = false;
        }
    }
};

const TIMEOUT_CHECK = 500 ; // With 250 it seems that it produces a memory leak and slowdown in some versions, reason unknown

const usbDevices = { filters: [
    {'vendorId': 1155, 'productId': 57105}, // STM Device in DFU Mode || Digital Radio in USB mode
    {'vendorId': 10473, 'productId': 393},  // GD32 DFU Bootloader
    {'vendorId': 0x2E3C, 'productId': 0xDF11},  // AT32F435 DFU Bootloader
    {'vendorId': 12619, 'productId': 262}, // APM32 DFU Bootloader
    {'vendorId': 0x396A, 'productId': 0xDF00}, // MICU DFU Bootloader
] };

const PortHandler = new function () {
    this.initialPorts = false;
    this.port_detected_callbacks = [];
    this.port_removed_callbacks = [];
    this.dfu_available = false;
    this.port_available = false;
    this.showAllSerialDevices = false;
    this.useMdnsBrowser = false;
    this.showVirtualMode = false;
};

PortHandler.initialize = function () {
    const self = this;

    const portPickerElementSelector = "div#port-picker #port";
    self.portPickerElement = $$1(portPickerElementSelector);
    self.selectList = document.querySelector(portPickerElementSelector);
    self.initialWidth = self.selectList.offsetWidth + 12;

    // fill dropdown with version numbers
    generateVirtualApiVersions();

    if (isWeb()) {
        this.initializeWebSerial();
        return;
    }

    this.reinitialize();    // just to prevent code redundancy
};

PortHandler.initializeWebSerial = function () {
    if (this.usbCheckLoop) {
        clearTimeout(this.usbCheckLoop);
    }

    this.initialPorts = [];
    this.dfu_available = false;
    this.showVirtualMode = get$1('showVirtualMode').showVirtualMode;

    const webSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;
    const webUsbSupported = typeof navigator !== 'undefined' && 'usb' in navigator;
    const webPorts = [{
        path: 'webserial',
        displayName: webSerialSupported ? 'Web Serial' : 'Web Serial unavailable - use HTTPS in Chrome or Edge',
    }];

    if (webUsbSupported) {
        webPorts.push({
            path: 'DFU',
            displayName: 'WebUSB DFU',
            isDFU: true,
            isWebUsb: true,
        });
    }

    this.updatePortSelect(webPorts);
    this.portPickerElement.val('webserial').trigger('change');
    this.initialPorts = webPorts;
    this.port_available = webSerialSupported;

    if (webUsbSupported) {
        const self = this;
        const pollUsbDevices = function() {
            self.check_usb_devices();
            self.usbCheckLoop = setTimeout(pollUsbDevices, TIMEOUT_CHECK);
        };

        pollUsbDevices();
    }
};

PortHandler.reinitialize = function () {
    if (isWeb()) {
        this.initializeWebSerial();
        return;
    }

    this.initialPorts = false;

    if (this.usbCheckLoop) {
        clearTimeout(this.usbCheckLoop);
    }

    this.showVirtualMode = get$1('showVirtualMode').showVirtualMode;
    this.showAllSerialDevices = get$1('showAllSerialDevices').showAllSerialDevices;
    this.useMdnsBrowser = get$1('useMdnsBrowser').useMdnsBrowser;

    if (this.useMdnsBrowser) {
        MdnsDiscovery.initialize();
    }

    this.check();   // start listening, check after TIMEOUT_CHECK ms
};

PortHandler.check = function () {
    const self = this;

    // if (!self.port_available) {
    //     self.check_usb_devices();
    // }
    self.check_usb_devices();

    if (!self.dfu_available) {
        self.check_serial_devices();
    }

    self.usbCheckLoop = setTimeout(() => {
        self.check();
    }, TIMEOUT_CHECK);
};

PortHandler.check_serial_devices = function () {
    const self = this;

    serial$3.getDevices(function(cp) {
        let currentPorts = [];

        if (self.useMdnsBrowser) {
            currentPorts = [
                ...cp,
                ...(MdnsDiscovery.mdnsBrowser.services?.filter(s => s.txt?.vendor === 'elrs' && s.txt?.type === 'rx' && s.ready === true)
                    .map(s => s.addresses.map(a => ({
                        path: `tcp://${a}`,
                        displayName: `${s.txt?.target} - ${s.txt?.version}`,
                        fqdn: s.fqdn,
                        vendorId: 0,
                        productId: 0,
                    }))).flat() ?? []),
            ].filter(Boolean);
        } else {
            currentPorts = cp;
        }

        // auto-select port (only during initialization)
        if (!self.initialPorts) {
            currentPorts = self.updatePortSelect(currentPorts);
            self.selectPort(currentPorts);
            self.initialPorts = currentPorts;
            GUI.updateManualPortVisibility();
        } else {
            self.removePort(currentPorts);
            self.detectPort(currentPorts);
        }
    });
};

PortHandler.check_usb_devices = function (callback) {
    const self = this;
    if (isWeb()) {
        if (!(typeof navigator !== 'undefined' && 'usb' in navigator)) {
            self.dfu_available = false;
            if (callback) {
                callback(false);
            }
            return;
        }

        chrome.usb.getDevices(usbDevices, function (result) {
            const selectedPath = self.portPickerElement.val();
            const hasMatchingDfuDevice = result.length > 0;
            const webSerialPort = {
                path: 'webserial',
                displayName: typeof navigator !== 'undefined' && 'serial' in navigator
                    ? 'Web Serial'
                    : 'Web Serial unavailable - use HTTPS in Chrome or Edge',
            };
            const ports = [webSerialPort, {
                path: 'DFU',
                displayName: hasMatchingDfuDevice
                    ? `DFU - ${result[0].productName || 'WebUSB Device'}`
                    : 'WebUSB DFU',
                isDFU: true,
                isWebUsb: true,
            }];

            self.updatePortSelect(ports);
            self.initialPorts = ports;
            self.dfu_available = hasMatchingDfuDevice;

            if (selectedPath && self.portPickerElement.children(`[value="${selectedPath}"]`).length) {
                self.portPickerElement.val(selectedPath);
            } else {
                self.portPickerElement.val('webserial');
            }

            if (callback) {
                callback(self.dfu_available);
            }
        });
        return;
    }

    chrome.usb.getDevices(usbDevices, function (result) {

        const dfuElement = self.portPickerElement.children("[value='DFU']");
        if (result.length) {
            if (!dfuElement.length) {
                self.portPickerElement.empty();
                let usbText;
                if (result[0].productName) {
                    usbText = (`DFU - ${result[0].productName}`);
                } else {
                    usbText = "DFU";
                }

                self.portPickerElement.append($$1('<option/>', {
                    value: "DFU",
                    text: usbText,
                    data: {isDFU: true},
                }));

                self.portPickerElement.append($$1('<option/>', {
                    value: 'manual',
                    text: i18n$1.getMessage('portsSelectManual'),
                    data: {isManual: true},
                }));

                self.portPickerElement.val('DFU').trigger('change');
                self.setPortsInputWidth();
                self.dfu_available = true;
            }
        } else if (dfuElement.length) {
            dfuElement.remove();
            self.setPortsInputWidth();
            self.dfu_available = false;
        }
        if (!$$1('option:selected', self.portPickerElement).data().isDFU) {
            if (!(GUI.connected_to || GUI.connect_lock)) {
                FC.resetState();
            }

            if (self.dfu_available) {
                self.portPickerElement.trigger('change');
            }
        }

        if (callback) {
            callback(self.dfu_available);
        }
    });
};

PortHandler.removePort = function(currentPorts) {
    const self = this;
    const removePorts = self.array_difference(self.initialPorts, currentPorts);

    if (removePorts.length) {
        console.log(`PortHandler - Removed: ${JSON.stringify(removePorts)}`);
        self.port_available = false;
        // disconnect "UI" - routine can't fire during atmega32u4 reboot procedure !!!
        if (GUI.connected_to) {
            for (let i = 0; i < removePorts.length; i++) {
                if (removePorts[i].path === GUI.connected_to) {
                    $$1('div.connect_controls a.connect').click();
                    $$1('div.connect_controls a.connect.active').click();
                }
            }
        }
        // trigger callbacks (only after initialization)
        for (let i = (self.port_removed_callbacks.length - 1); i >= 0; i--) {
            const obj = self.port_removed_callbacks[i];

            // remove timeout
            clearTimeout(obj.timer);

            // trigger callback
            obj.code(removePorts);

            // remove object from array
            const index = self.port_removed_callbacks.indexOf(obj);
            if (index > -1) {
                self.port_removed_callbacks.splice(index, 1);
            }
        }
        for (let i = 0; i < removePorts.length; i++) {
            self.initialPorts.splice(self.initialPorts.indexOf(removePorts[i]), 1);
        }
        self.updatePortSelect(self.initialPorts);
        self.portPickerElement.trigger('change');
    }
};

PortHandler.detectPort = function(currentPorts) {
    const self = this;
    const newPorts = self.array_difference(currentPorts, self.initialPorts);

    if (newPorts.length) {
        currentPorts = self.updatePortSelect(currentPorts);
        console.log(`PortHandler - Found: ${JSON.stringify(newPorts)}`);

        if (newPorts.length === 1) {
            self.portPickerElement.val(newPorts[0].path);
        } else if (newPorts.length > 1) {
            self.selectPort(currentPorts);
        }

        self.port_available = true;
        // Signal board verification
        if (GUI.active_tab === 'firmware_flasher' && TABS.firmware_flasher.allowBoardDetection) {
            TABS.firmware_flasher.boardNeedsVerification = true;
        }

        self.portPickerElement.trigger('change');

        // auto-connect if enabled
        if (GUI.auto_connect && !GUI.connecting_to && !GUI.connected_to) {
            // start connect procedure. We need firmware flasher protection over here
            if (GUI.active_tab !== 'firmware_flasher') {
                $$1('div.connect_controls a.connect').click();
            }
        }
        // trigger callbacks
        for (let i = (self.port_detected_callbacks.length - 1); i >= 0; i--) {
            const obj = self.port_detected_callbacks[i];

            // remove timeout
            clearTimeout(obj.timer);

            // trigger callback
            obj.code(newPorts);

            // remove object from array
            const index = self.port_detected_callbacks.indexOf(obj);
            if (index > -1) {
                self.port_detected_callbacks.splice(index, 1);
            }
        }
        self.initialPorts = currentPorts;
    }
};

PortHandler.sortPorts = function(ports) {
    return ports.sort(function(a, b) {
        return a.path.localeCompare(b.path, window.navigator.language, {
            numeric: true,
            sensitivity: 'base',
        });
    });
};

PortHandler.updatePortSelect = function (ports) {
    ports = this.sortPorts(ports);
    this.portPickerElement.empty();

    for (let i = 0; i < ports.length; i++) {
        let portText;
        if (ports[i].displayName) {
            portText = (`${ports[i].path} - ${ports[i].displayName}`);
        } else {
            portText = ports[i].path;
        }

        this.portPickerElement.append($$1("<option/>", {
            value: ports[i].path,
            text: portText,
            data: {
                isManual: !!ports[i].isManual,
                isVirtual: !!ports[i].isVirtual,
                isDFU: !!ports[i].isDFU,
                isWebUsb: !!ports[i].isWebUsb,
            },
        }));
    }

    if (this.showVirtualMode) {
        this.portPickerElement.append($$1("<option/>", {
            value: 'virtual',
            text: i18n$1.getMessage('portsSelectVirtual'),
            data: {isVirtual: true},
        }));
    }

    this.portPickerElement.append($$1("<option/>", {
        value: 'manual',
        text: i18n$1.getMessage('portsSelectManual'),
        data: {isManual: true},
    }));

    this.setPortsInputWidth();
    return ports;
};

PortHandler.selectPort = function(ports) {
    const OS = GUI.operating_system;
    for (let i = 0; i < ports.length; i++) {
        const portName = ports[i].displayName;
        if (portName) {
            const pathSelect = ports[i].path;
            const isWindows = (OS === 'Windows');
            const isTty = pathSelect.includes('tty');
            const deviceRecognized = portName.includes('STM') || portName.includes('CP210') || portName.startsWith('SPR');
            const legacyDeviceRecognized = portName.includes('usb');
            if (isWindows && deviceRecognized || isTty && (deviceRecognized || legacyDeviceRecognized)) {
                this.portPickerElement.val(pathSelect);
                this.port_available = true;
                console.log(`Porthandler detected device ${portName} on port: ${pathSelect}`);
            }
        }
    }
};

PortHandler.setPortsInputWidth = function() {

    function findMaxLengthOption(selectEl) {
        let max = 0;

        $$1(selectEl.options).each(function () {
            const textSize = getTextWidth(this.textContent);
            if (textSize > max) {
                max = textSize;
            }
        });

        return max;
    }

    const correction = 32; // account for up/down button and spacing
    let width = findMaxLengthOption(this.selectList) + correction;

    width = (width > this.initialWidth) ? width : this.initialWidth;

    const portsInput = document.querySelector("div#port-picker #portsinput");
    portsInput.style.width = `${width}px`;
};

PortHandler.port_detected = function(name, code, timeout, ignore_timeout) {
    const self = this;
    const obj = {'name': name,
                 'code': code,
                 'timeout': (timeout) ? timeout : 10000,
                };

    if (!ignore_timeout) {
        obj.timer = setTimeout(function() {
            console.log(`PortHandler - timeout - ${obj.name}`);

            // trigger callback
            code(false);

            // remove object from array
            const index = self.port_detected_callbacks.indexOf(obj);
            if (index > -1) {
                self.port_detected_callbacks.splice(index, 1);
            }
        }, (timeout) ? timeout : 10000);
    } else {
        obj.timer = false;
        obj.timeout = false;
    }

    this.port_detected_callbacks.push(obj);

    return obj;
};

PortHandler.port_removed = function (name, code, timeout, ignore_timeout) {
    const self = this;
    const obj = {'name': name,
                 'code': code,
                 'timeout': (timeout) ? timeout : 10000,
                };

    if (!ignore_timeout) {
        obj.timer = setTimeout(function () {
            console.log(`PortHandler - timeout - ${obj.name}`);

            // trigger callback
            code(false);

            // remove object from array
            const index = self.port_removed_callbacks.indexOf(obj);
            if (index > -1) {
                self.port_removed_callbacks.splice(index, 1);
            }
        }, (timeout) ? timeout : 10000);
    } else {
        obj.timer = false;
        obj.timeout = false;
    }

    this.port_removed_callbacks.push(obj);

    return obj;
};

// accepting single level array with "value" as key
PortHandler.array_difference = function (firstArray, secondArray) {
    const cloneArray = [];

    // create hardcopy
    for (let i = 0; i < firstArray.length; i++) {
        cloneArray.push(firstArray[i]);
    }

    for (let i = 0; i < secondArray.length; i++) {
        const elementExists = cloneArray.findIndex(element => element.path === secondArray[i].path);
        if (elementExists !== -1) {
            cloneArray.splice(elementExists, 1);
        }
    }

    return cloneArray;
};

PortHandler.flush_callbacks = function () {
    let killed = 0;

    for (let i = this.port_detected_callbacks.length - 1; i >= 0; i--) {
        if (this.port_detected_callbacks[i].timer) {
            clearTimeout(this.port_detected_callbacks[i].timer);
        }
        this.port_detected_callbacks.splice(i, 1);

        killed++;
    }

    for (let i = this.port_removed_callbacks.length - 1; i >= 0; i--) {
        if (this.port_removed_callbacks[i].timer) {
            clearTimeout(this.port_removed_callbacks[i].timer);
        }
        this.port_removed_callbacks.splice(i, 1);

        killed++;
    }

    return killed;
};

// temp workaround till everything is in modules
window.PortHandler = PortHandler;
var PortHandler$1 = PortHandler;

const serialDevices = [
    { vendorId: 1027, productId: 24577 }, // FT232R USB UART
    { vendorId: 1155, productId: 22336 }, // STM Electronics Virtual COM Port
    { vendorId: 4292, productId: 60000 }, // CP210x
    { vendorId: 4292, productId: 60001 }, // CP210x
    { vendorId: 4292, productId: 60002 }, // CP210x
    { vendorId: 0x2e3c, productId: 0x5740 }, // AT32 VCP
    { vendorId: 0x396A, productId: 0x1000 }, // MICU
];

const webSerialDevices = serialDevices.map(
    ({ vendorId, productId }) => ({
        usbVendorId: vendorId,
        usbProductId: productId,
    }),
);

const serial$2 = {
    connected:      false,
    connectionId:   false,
    openCanceled:   false,
    bitrate:        0,
    bytesReceived:  0,
    bytesSent:      0,
    failed:         0,
    connectionType: 'serial', // 'serial' or 'tcp' or 'virtual'
    connectionIP:   '127.0.0.1',
    connectionPort: 5761,

    transmitting:   false,
    outputBuffer:   [],

    serialDevices,

    connect: function (path, options, callback) {
        const self = this;
        const testUrl = path.match(/^tcp:\/\/([A-Za-z0-9\.-]+)(?:\:(\d+))?$/);

        if (testUrl) {
            self.connectTcp(testUrl[1], testUrl[2], options, callback);
        } else if (path === 'virtual') {
            self.connectVirtual(callback);
        } else {
            self.connectSerial(path, options, callback);
        }
    },
    connectSerial: function (path, options, callback) {
        const self = this;
        self.connectionType = 'serial';

        chrome.serial.connect(path, options, function (connectionInfo) {
            self.failed = checkChromeRuntimeError();
            if (connectionInfo && !self.openCanceled && !self.failed) {
                self.connected = true;
                self.connectionId = connectionInfo.connectionId;
                self.bitrate = connectionInfo.bitrate;
                self.bytesReceived = 0;
                self.bytesSent = 0;
                self.failed = 0;

                self.onReceive.addListener(function log_bytesReceived(info) {
                    self.bytesReceived += info.data.byteLength;
                });

                self.onReceiveError.addListener(function watch_for_on_receive_errors(info) {
                    switch (info.error) {
                        case 'system_error': // we might be able to recover from this one
                            if (!self.failed++) {
                                chrome.serial.setPaused(self.connectionId, false, function () {
                                    self.getInfo(function (getInfo) {
                                        checkChromeRuntimeError();
                                        if (getInfo) {
                                            if (!getInfo.paused) {
                                                console.log(`${self.connectionType}: connection recovered from last onReceiveError`);
                                                self.failed = 0;
                                            } else {
                                                console.log(`${self.connectionType}: connection did not recover from last onReceiveError, disconnecting`);
                                                gui_log(i18n$1.getMessage('serialUnrecoverable'));
                                                self.errorHandler(getInfo.error, 'receive');
                                            }
                                        }
                                    });
                                });
                            }
                            break;

                        case 'overrun':
                            // wait 50 ms and attempt recovery
                            self.error = info.error;
                            setTimeout(function() {
                                chrome.serial.setPaused(info.connectionId, false, function() {
                                    checkChromeRuntimeError();
                                    self.getInfo(function (getInfo) {
                                        if (getInfo) {
                                            if (getInfo.paused) {
                                                // assume unrecoverable, disconnect
                                                console.log(`${self.connectionType}: connection did not recover from ${self.error} condition, disconnecting`);
                                                gui_log(i18n$1.getMessage('serialUnrecoverable'));
                                                self.errorHandler(getInfo.error, 'receive');
                                            }
                                            else {
                                                console.log(`${self.connectionType}: connection recovered from ${self.error} condition`);
                                            }
                                        }
                                    });
                                });
                            }, 50);
                            break;

                        case 'timeout':
                            // No data has been received for receiveTimeout milliseconds.
                            // We will do nothing.
                            break;

                        case 'frame_error':
                        case 'parity_error':
                            gui_log(i18n$1.getMessage(`serialError${inflection.camelize(info.error)}`));
                            self.errorHandler(info.error, 'receive');
                            break;
                        case 'break': // This seems to be the error that is thrown under NW.js in Windows when the device reboots after typing 'exit' in CLI
                        case 'disconnected':
                        case 'device_lost':
                        default:
                            self.errorHandler(info.error, 'receive');
                            break;
                    }
                });

                console.log(`${self.connectionType}: connection opened with ID: ${connectionInfo.connectionId} , Baud: ${connectionInfo.bitrate}`);

                if (callback) {
                    callback(connectionInfo);
                }

            } else {

                if (connectionInfo && self.openCanceled) {
                    // connection opened, but this connect sequence was canceled
                    // we will disconnect without triggering any callbacks
                    self.connectionId = connectionInfo.connectionId;
                    console.log(`${self.connectionType}: connection opened with ID: ${connectionInfo.connectionId} , but request was canceled, disconnecting`);

                    // some bluetooth dongles/dongle drivers really doesn't like to be closed instantly, adding a small delay
                    setTimeout(function initialization() {
                        self.openCanceled = false;
                        self.disconnect(function resetUI() {
                            console.log(`${self.connectionType}: connect sequence was cancelled, disconnecting...`);
                        });
                    }, 150);
                } else if (self.openCanceled) {
                    // connection didn't open and sequence was canceled, so we will do nothing
                    console.log(`${self.connectionType}: connection didn\'t open and request was canceled`);
                    self.openCanceled = false;
                } else {
                    console.log(`${self.connectionType}: failed to open serial port`);
                }
                if (callback) {
                    callback(false);
                }
            }
        });
    },
    connectTcp: function (ip, port, options, callback) {
        const self = this;
        self.connectionIP = ip;
        self.connectionPort = port || 5761;
        self.connectionPort = parseInt(self.connectionPort);
        self.connectionType = 'tcp';

        chrome.sockets.tcp.create({
            persistent: false,
            name: 'Betaflight',
            bufferSize: 65535,
        }, function(createInfo) {
            if (createInfo && !self.openCanceled || !checkChromeRuntimeError()) {
                self.connectionId = createInfo.socketId;
                self.bitrate = 115200; // fake
                self.bytesReceived = 0;
                self.bytesSent = 0;
                self.failed = 0;

                chrome.sockets.tcp.connect(createInfo.socketId, self.connectionIP, self.connectionPort, function (result) {
                    if (result === 0 || !checkChromeRuntimeError()) {
                        chrome.sockets.tcp.setNoDelay(createInfo.socketId, true, function (noDelayResult) {
                            if (noDelayResult === 0 || !checkChromeRuntimeError()) {
                                self.onReceive.addListener(function log_bytesReceived(info) {
                                    self.bytesReceived += info.data.byteLength;
                                });
                                self.onReceiveError.addListener(function watch_for_on_receive_errors(info) {
                                    if (info.socketId !== self.connectionId) return;

                                    if (self.connectionType === 'tcp' && info.resultCode < 0) {
                                        self.errorHandler(info.resultCode, 'receive');
                                    }
                                });
                                self.connected = true;
                                console.log(`${self.connectionType}: connection opened with ID ${createInfo.socketId} , url: ${self.connectionIP}:${self.connectionPort}`);
                                if (callback) {
                                    callback(createInfo);
                                }
                            }
                        });
                    } else {
                        console.log(`${self.connectionType}: failed to connect with result ${result}`);
                        if (callback) {
                            callback(false);
                        }
                    }
                });
            }
        });
    },
    connectVirtual: function (callback) {
        const self = this;
        self.connectionType = 'virtual';

        if (!self.openCanceled) {
            self.connected = true;
            self.connectionId = 'virtual';
            self.bitrate = 115200;
            self.bytesReceived = 0;
            self.bytesSent = 0;
            self.failed = 0;

            callback();
        }
    },
    disconnect: function (callback) {
        const self = this;
        const id = self.connectionId;
        self.connected = false;
        self.emptyOutputBuffer();

        if (self.connectionId) {
            // remove listeners
            for (let i = (self.onReceive.listeners.length - 1); i >= 0; i--) {
                self.onReceive.removeListener(self.onReceive.listeners[i]);
            }

            for (let i = (self.onReceiveError.listeners.length - 1); i >= 0; i--) {
                self.onReceiveError.removeListener(self.onReceiveError.listeners[i]);
            }

            let status = true;
            if (self.connectionType !== 'virtual') {
                if (self.connectionType === 'tcp') {
                    chrome.sockets.tcp.disconnect(self.connectionId, function () {
                        checkChromeRuntimeError();
                        console.log(`${self.connectionType}: disconnecting socket.`);
                    });
                }

                const disconnectFn = (self.connectionType === 'serial') ? chrome.serial.disconnect : chrome.sockets.tcp.close;
                disconnectFn(self.connectionId, function (result) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                    }
                    result = result || self.connectionType === 'tcp';
                    console.log(`${self.connectionType}: ${result ? 'closed' : 'failed to close'} connection with ID: ${id}, Sent: ${self.bytesSent} bytes, Received: ${self.bytesReceived} bytes`);
                    status = result;
                });
            } else {
                CONFIGURATOR.virtualMode = false;
                self.connectionType = false;
            }
            self.connectionId = false;
            self.bitrate = 0;

            if (callback) {
                callback(status);
            }
        } else {
            // connection wasn't opened, so we won't try to close anything
            // instead we will rise canceled flag which will prevent connect from continueing further after being canceled
            self.openCanceled = true;
        }
    },
    getDevices: function (callback) {
        const self = this;

        chrome.serial.getDevices(function (devices_array) {
            const devices = [];

            devices_array.forEach(function (device) {
                const isKnownSerialDevice = self.serialDevices.some(el => el.vendorId === device.vendorId) && self.serialDevices.some(el => el.productId === device.productId);

                if (isKnownSerialDevice || PortHandler$1.showAllSerialDevices) {
                    devices.push({
                        path: device.path,
                        displayName: device.displayName,
                        vendorId: device.vendorId,
                        productId: device.productId,
                    });
                }
            });

            callback(devices);
        });
    },
    getInfo: function (callback) {
        const chromeType = (this.connectionType === 'serial') ? chrome.serial : chrome.sockets.tcp;
        chromeType.getInfo(this.connectionId, callback);
    },
    send: function (data, callback) {
        const self = this;
        self.outputBuffer.push({'data': data, 'callback': callback});

        function _send() {
            // store inside separate variables in case array gets destroyed
            const _data = self.outputBuffer[0].data;
            const _callback = self.outputBuffer[0].callback;

            if (!self.connected) {
                console.log(`${self.connectionType}: attempting to send when disconnected. ID: ${self.connectionId}`);

                if (_callback) {
                    _callback({
                        bytesSent: 0,
                        error: 'undefined',
                    });
                }
                return;
            }

            const sendFn = (self.connectionType === 'serial') ? chrome.serial.send : chrome.sockets.tcp.send;
            sendFn(self.connectionId, _data, function (sendInfo) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                }

                if (sendInfo === undefined) {
                    console.log('undefined send error');
                    if (_callback) {
                        _callback({
                            bytesSent: 0,
                            error: 'undefined',
                        });
                    }
                    return;
                }

                if (self.connectionType === 'tcp' && sendInfo.resultCode < 0) {
                    self.errorHandler(sendInfo.resultCode, 'send');
                    return;
                }

                // track sent bytes for statistics
                self.bytesSent += sendInfo.bytesSent;

                // fire callback
                if (_callback) {
                    _callback(sendInfo);
                }

                // remove data for current transmission from the buffer
                self.outputBuffer.shift();

                // if there is any data in the queue fire send immediately, otherwise stop trasmitting
                if (self.outputBuffer.length) {
                    // keep the buffer withing reasonable limits
                    if (self.outputBuffer.length > 100) {
                        let counter = 0;

                        while (self.outputBuffer.length > 100) {
                            self.outputBuffer.pop();
                            counter++;
                        }

                        console.log(`${self.connectionType}: send buffer overflowing, dropped: ${counter}`);
                    }

                    _send();
                } else {
                    self.transmitting = false;
                }
            });
        }

        if (!self.transmitting && self.connected) {
            self.transmitting = true;
            _send();
        }
    },
    onReceive: {
        listeners: [],

        addListener: function (function_reference) {
            const chromeType = (serial$2.connectionType === 'serial') ? chrome.serial : chrome.sockets.tcp;
            chromeType.onReceive.addListener(function_reference);
            this.listeners.push(function_reference);
        },
        removeListener: function (function_reference) {
            const chromeType = (serial$2.connectionType === 'serial') ? chrome.serial : chrome.sockets.tcp;
            for (let i = (this.listeners.length - 1); i >= 0; i--) {
                if (this.listeners[i] == function_reference) {
                    chromeType.onReceive.removeListener(function_reference);

                    this.listeners.splice(i, 1);
                    break;
                }
            }
        },
    },
    onReceiveError: {
        listeners: [],

        addListener: function (function_reference) {
            const chromeType = (serial$2.connectionType === 'serial') ? chrome.serial : chrome.sockets.tcp;
            chromeType.onReceiveError.addListener(function_reference);
            this.listeners.push(function_reference);
        },
        removeListener: function (function_reference) {
            const chromeType = (serial$2.connectionType === 'serial') ? chrome.serial : chrome.sockets.tcp;
            for (let i = (this.listeners.length - 1); i >= 0; i--) {
                if (this.listeners[i] == function_reference) {
                    chromeType.onReceiveError.removeListener(function_reference);

                    this.listeners.splice(i, 1);
                    break;
                }
            }
        },
    },
    emptyOutputBuffer: function () {
        this.outputBuffer = [];
        this.transmitting = false;
    },
    errorHandler: function (result, direction) {
        const self = this;

        self.connected = false;
        FC.CONFIG.armingDisabled = false;
        FC.CONFIG.runawayTakeoffPreventionDisabled = false;

        let message;
        if (self.connectionType === 'tcp') {
            switch (result){
                case -15:
                    // connection is lost, cannot write to it anymore, preventing further disconnect attempts
                    message = 'error: ERR_SOCKET_NOT_CONNECTED';
                    console.log(`${self.connectionType}: ${direction} ${message}: ${result}`);
                    self.connectionId = false;
                    return;
                case -21:
                    message = 'error: NETWORK_CHANGED';
                    break;
                case -100:
                    message = 'error: CONNECTION_CLOSED';
                    break;
                case -102:
                    message = 'error: CONNECTION_REFUSED';
                    break;
                case -105:
                    message = 'error: NAME_NOT_RESOLVED';
                    break;
                case -106:
                    message = 'error: INTERNET_DISCONNECTED';
                    break;
                case -109:
                    message = 'error: ADDRESS_UNREACHABLE';
                    break;
            }
        }
        const resultMessage = message ? `${message} ${result}` : result;
        console.warn(`${self.connectionType}: ${resultMessage} ID: ${self.connectionId} (${direction})`);

        if (GUI.connected_to || GUI.connecting_to) {
            $$1('a.connect').trigger('click');
        } else {
            serial$2.disconnect();
        }
    },
};

var serial$3 = serial$2;

async function* streamAsyncIterable(reader, keepReadingFlag) {
    try {
        while (keepReadingFlag()) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    } finally {
        reader.releaseLock();
    }
}

class WebSerial extends EventTarget {
    constructor() {
        super();
        this.connected = false;
        this.openRequested = false;
        this.openCanceled = false;
        this.transmitting = false;
        this.connectionInfo = null;

        this.bitrate = 0;
        this.bytesSent = 0;
        this.bytesReceived = 0;
        this.failed = 0;
        this.connectionType = 'serial';

        this.logHead = "SERIAL: ";

        this.port = null;
        this.reader = null;
        this.writer = null;
        this.reading = false;
        this.legacyReceiveListeners = new Map();
        this.legacyReceiveErrorListeners = new Set();

        this.onReceive = {
            addListener: listener => this.addLegacyReceiveListener(listener),
            removeListener: listener => this.removeLegacyReceiveListener(listener),
        };

        this.onReceiveError = {
            addListener: listener => this.legacyReceiveErrorListeners.add(listener),
            removeListener: listener => this.legacyReceiveErrorListeners.delete(listener),
        };

        this.connect = this.connect.bind(this);
    }

    toLegacyReadInfo(detail) {
        const view = detail instanceof Uint8Array ? detail : new Uint8Array(detail);
        const data = (view.byteOffset === 0 && view.byteLength === view.buffer.byteLength)
            ? view.buffer
            : view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);

        return { data };
    }

    addLegacyReceiveListener(listener) {
        if (this.legacyReceiveListeners.has(listener)) {
            return;
        }

        const wrappedListener = event => listener(this.toLegacyReadInfo(event.detail));
        this.legacyReceiveListeners.set(listener, wrappedListener);
        this.addEventListener('receive', wrappedListener);
    }

    removeLegacyReceiveListener(listener) {
        const wrappedListener = this.legacyReceiveListeners.get(listener);

        if (!wrappedListener) {
            return;
        }

        this.removeEventListener('receive', wrappedListener);
        this.legacyReceiveListeners.delete(listener);
    }

    normalizeConnectArguments(pathOrOptions, maybeOptions, maybeCallback) {
        const callback = typeof maybeCallback === 'function'
            ? maybeCallback
            : (typeof maybeOptions === 'function' ? maybeOptions : null);

        const rawOptions = (typeof pathOrOptions === 'object' && pathOrOptions !== null)
            ? pathOrOptions
            : ((typeof maybeOptions === 'object' && maybeOptions !== null) ? maybeOptions : {});

        const normalizedOptions = {
            baudRate: rawOptions.baudRate ?? rawOptions.bitrate ?? 115200,
            dataBits: rawOptions.dataBits ?? 8,
            stopBits: rawOptions.stopBits === 'two' ? 2 : 1,
            parity: rawOptions.parity ?? rawOptions.parityBit ?? 'none',
        };

        return { callback, options: normalizedOptions };
    }

    handleReceiveBytes(info) {
        this.bytesReceived += info.detail.byteLength;
    }

    handleDisconnect() {
        this.removeEventListener('receive', this.handleReceiveBytes);
        this.removeEventListener('disconnect', this.handleDisconnect);
    }

    async connect(pathOrOptions, maybeOptions, maybeCallback) {
        const { callback, options } = this.normalizeConnectArguments(pathOrOptions, maybeOptions, maybeCallback);
        this.openRequested = true;
        if (!navigator.serial) {
            console.warn(`${this.logHead}Web Serial is not available in this browser or context`);
            this.openRequested = false;
            callback?.(false);
            this.dispatchEvent(new CustomEvent("connect", { detail: false }));
            return;
        }

        try {
            this.port = await navigator.serial.requestPort({
                filters: webSerialDevices,
            });

            await this.port.open(options);
            const connectionInfo = this.port.getInfo();
            this.connectionInfo = {
                ...connectionInfo,
                connectionId: connectionInfo.connectionId || 'webserial',
            };
            this.writer = this.port.writable.getWriter();
            this.reader = this.port.readable.getReader();
        } catch (error) {
            if (error.name !== 'NotFoundError') {
                console.error(error);
            }
            this.openRequested = false;
            callback?.(false);
            this.dispatchEvent(new CustomEvent("connect", { detail: false }));
            return;
        }

        if (this.connectionInfo && !this.openCanceled) {
            this.connected = true;
            this.connectionId = this.connectionInfo.connectionId;
            this.bitrate = options.baudRate;
            this.bytesReceived = 0;
            this.bytesSent = 0;
            this.failed = 0;
            this.openRequested = false;

            this.addEventListener("receive", this.handleReceiveBytes);
            this.addEventListener('disconnect', this.handleDisconnect);

            console.log(
                `${this.logHead} Connection opened with ID: ${this.connectionInfo.connectionId}, Baud: ${options.baudRate}`,
            );

            callback?.(this.connectionInfo);
            this.dispatchEvent(
                new CustomEvent("connect", { detail: this.connectionInfo }),
            );
            // Check if we need the helper function or could polyfill
            // the stream async iterable interface:
            // https://web.dev/streams/#asynchronous-iteration


            this.reading = true;
            for await (let value of streamAsyncIterable(this.reader, () => this.reading)) {
                this.dispatchEvent(
                    new CustomEvent("receive", { detail: value }),
                );
            }
        } else if (this.connectionInfo && this.openCanceled) {
            this.connectionId = this.connectionInfo.connectionId;

            console.log(
                `${this.logHead} Connection opened with ID: ${this.connectionInfo.connectionId}, but request was canceled, disconnecting`,
            );
            // some bluetooth dongles/dongle drivers really doesn't like to be closed instantly, adding a small delay
            setTimeout(() => {
                this.openRequested = false;
                this.openCanceled = false;
                this.disconnect(() => {
                    callback?.(false);
                    this.dispatchEvent(new CustomEvent("connect", { detail: false }));
                });
            }, 150);
        } else if (this.openCanceled) {
            console.log(
                `${this.logHead} Connection didn't open and request was canceled`,
            );
            this.openRequested = false;
            this.openCanceled = false;
            callback?.(false);
            this.dispatchEvent(new CustomEvent("connect", { detail: false }));
        } else {
            this.openRequested = false;
            console.log(`${this.logHead} Failed to open serial port`);
            callback?.(false);
            this.dispatchEvent(new CustomEvent("connect", { detail: false }));
        }
    }

    async disconnect(callback) {
        this.connected = false;
        this.transmitting = false;
        this.reading = false;
        this.bytesReceived = 0;
        this.bytesSent = 0;

        const doCleanup = async () => {
            if (this.reader) {
                this.reader.releaseLock();
                this.reader = null;
            }
            if (this.writer) {
                await this.writer.releaseLock();
                this.writer = null;
            }
            if (this.port) {
                await this.port.close();
                this.port = null;
            }
        };

        try {
            await doCleanup();

            console.log(
                `${this.logHead}Connection with ID: ${this.connectionId} closed, Sent: ${this.bytesSent} bytes, Received: ${this.bytesReceived} bytes`,
            );

            this.connectionId = false;
            this.bitrate = 0;
            callback?.(true);
            this.dispatchEvent(new CustomEvent("disconnect", { detail: true }));
        } catch (error) {
            console.error(error);
            console.error(
                `${this.logHead}Failed to close connection with ID: ${this.connectionId} closed, Sent: ${this.bytesSent} bytes, Received: ${this.bytesReceived} bytes`,
            );
            callback?.(false);
            this.dispatchEvent(new CustomEvent("disconnect", { detail: false }));
        } finally {
            if (this.openCanceled) {
                this.openCanceled = false;
            }
        }
    }

    async send(data, callback) {
        // TODO: previous serial implementation had a buffer of 100, do we still need it with streams?
        if (this.writer) {
            await this.writer.write(data);
            this.bytesSent += data.byteLength;
            if (callback) {
                callback({ bytesSent: data.byteLength });
            }
        } else {
            console.error(
                `${this.logHead}Failed to send data, serial port not open`,
            );
            if (callback) {
                callback({
                    bytesSent: 0,
                    error: 'undefined',
                });
            }
        }
        return {
            bytesSent: this.bytesSent,
        };
    }

    getInfo(callback) {
        callback?.({
            ...this.connectionInfo,
            bitrate: this.bitrate,
            connectionId: this.connectionId,
        });
    }
}

var serialWeb = new WebSerial();

const serial$1 = isWeb() ? serialWeb : serial$3;

const MSP = {
    symbols: {
        BEGIN: '$'.charCodeAt(0),
        PROTO_V1: 'M'.charCodeAt(0),
        PROTO_V2: 'X'.charCodeAt(0),
        FROM_MWC: '>'.charCodeAt(0),
        TO_MWC: '<'.charCodeAt(0),
        UNSUPPORTED: '!'.charCodeAt(0),
    },
    constants: {
        PROTOCOL_V1:                1,
        PROTOCOL_V2:                2,
        JUMBO_FRAME_MIN_SIZE:       255,
    },
    decoder_states: {
        IDLE:                       0,
        PROTO_IDENTIFIER:           1,
        DIRECTION_V1:               2,
        DIRECTION_V2:               3,
        FLAG_V2:                    4,
        PAYLOAD_LENGTH_V1:          5,
        PAYLOAD_LENGTH_JUMBO_LOW:   6,
        PAYLOAD_LENGTH_JUMBO_HIGH:  7,
        PAYLOAD_LENGTH_V2_LOW:      8,
        PAYLOAD_LENGTH_V2_HIGH:     9,
        CODE_V1:                    10,
        CODE_JUMBO_V1:              11,
        CODE_V2_LOW:                12,
        CODE_V2_HIGH:               13,
        PAYLOAD_V1:                 14,
        PAYLOAD_V2:                 15,
        CHECKSUM_V1:                16,
        CHECKSUM_V2:                17,
    },
    state:                      0,
    message_direction:          1,
    code:                       0,
    dataView:                   0,
    message_length_expected:    0,
    message_length_received:    0,
    message_buffer:             null,
    message_buffer_uint8_view:  null,
    message_checksum:           0,
    messageIsJumboFrame:        false,
    crcError:                   false,

    callbacks:                  [],
    packet_error:               0,
    unsupported:                0,

    MIN_TIMEOUT:                100,
    MAX_TIMEOUT:                2000,
    timeout:                    200,

    last_received_timestamp:   null,
    listeners:                  [],

    JUMBO_FRAME_SIZE_LIMIT:     255,

    read(readInfo) {
        if (CONFIGURATOR.virtualMode) {
            return;
        }

        const data = new Uint8Array(readInfo.data ?? readInfo);

        for (const chunk of data) {
            switch (this.state) {
            case this.decoder_states.IDLE: // sync char 1
                if (chunk === this.symbols.BEGIN) {
                    this.state = this.decoder_states.PROTO_IDENTIFIER;
                }
                break;
            case this.decoder_states.PROTO_IDENTIFIER: // sync char 2
                switch (chunk) {
                    case this.symbols.PROTO_V1:
                        this.state = this.decoder_states.DIRECTION_V1;
                        break;
                    case this.symbols.PROTO_V2:
                        this.state = this.decoder_states.DIRECTION_V2;
                        break;
                    default:
                        console.log(`Unknown protocol char ${String.fromCharCode(chunk)}`);
                        this.state = this.decoder_states.IDLE;
                }
                break;
            case this.decoder_states.DIRECTION_V1: // direction (should be >)
            case this.decoder_states.DIRECTION_V2:
                this.unsupported = 0;
                switch (chunk) {
                    case this.symbols.FROM_MWC:
                        this.message_direction = 1;
                        break;
                    case this.symbols.TO_MWC:
                        this.message_direction = 0;
                        break;
                    case this.symbols.UNSUPPORTED:
                        this.unsupported = 1;
                        break;
                }
                this.state = this.state === this.decoder_states.DIRECTION_V1 ?
                        this.decoder_states.PAYLOAD_LENGTH_V1 :
                        this.decoder_states.FLAG_V2;
                break;
            case this.decoder_states.FLAG_V2:
                // Ignored for now
                this.state = this.decoder_states.CODE_V2_LOW;
                break;
            case this.decoder_states.PAYLOAD_LENGTH_V1:
                this.message_length_expected = chunk;

                if (this.message_length_expected === this.constants.JUMBO_FRAME_MIN_SIZE) {
                    this.state = this.decoder_states.CODE_JUMBO_V1;
                } else {
                    this._initialize_read_buffer();
                    this.state = this.decoder_states.CODE_V1;
                }

                break;
            case this.decoder_states.PAYLOAD_LENGTH_V2_LOW:
                this.message_length_expected = chunk;
                this.state = this.decoder_states.PAYLOAD_LENGTH_V2_HIGH;
                break;
            case this.decoder_states.PAYLOAD_LENGTH_V2_HIGH:
                this.message_length_expected |= chunk << 8;
                this._initialize_read_buffer();
                this.state = this.message_length_expected > 0 ?
                    this.decoder_states.PAYLOAD_V2 :
                    this.decoder_states.CHECKSUM_V2;
                break;
            case this.decoder_states.CODE_V1:
            case this.decoder_states.CODE_JUMBO_V1:
                this.code = chunk;
                if (this.message_length_expected > 0) {
                    // process payload
                    if (this.state === this.decoder_states.CODE_JUMBO_V1) {
                        this.state = this.decoder_states.PAYLOAD_LENGTH_JUMBO_LOW;
                    } else {
                        this.state = this.decoder_states.PAYLOAD_V1;
                    }
                } else {
                    // no payload
                    this.state = this.decoder_states.CHECKSUM_V1;
                }
                break;
            case this.decoder_states.CODE_V2_LOW:
                this.code = chunk;
                this.state = this.decoder_states.CODE_V2_HIGH;
                break;
            case this.decoder_states.CODE_V2_HIGH:
                this.code |= chunk << 8;
                this.state = this.decoder_states.PAYLOAD_LENGTH_V2_LOW;
                break;
            case this.decoder_states.PAYLOAD_LENGTH_JUMBO_LOW:
                this.message_length_expected = chunk;
                this.state = this.decoder_states.PAYLOAD_LENGTH_JUMBO_HIGH;
                break;
            case this.decoder_states.PAYLOAD_LENGTH_JUMBO_HIGH:
                this.message_length_expected |= chunk << 8;
                this._initialize_read_buffer();
                this.state = this.decoder_states.PAYLOAD_V1;
                break;
            case this.decoder_states.PAYLOAD_V1:
            case this.decoder_states.PAYLOAD_V2:
                this.message_buffer_uint8_view[this.message_length_received] = chunk;
                this.message_length_received++;

                if (this.message_length_received >= this.message_length_expected) {
                    this.state = this.state === this.decoder_states.PAYLOAD_V1 ?
                        this.decoder_states.CHECKSUM_V1 :
                        this.decoder_states.CHECKSUM_V2;
                }
                break;
            case this.decoder_states.CHECKSUM_V1:
                if (this.message_length_expected >= this.constants.JUMBO_FRAME_MIN_SIZE) {
                    this.message_checksum = this.constants.JUMBO_FRAME_MIN_SIZE;
                } else {
                    this.message_checksum = this.message_length_expected;
                }
                this.message_checksum ^= this.code;
                if (this.message_length_expected >= this.constants.JUMBO_FRAME_MIN_SIZE) {
                    this.message_checksum ^= this.message_length_expected & 0xFF;
                    this.message_checksum ^= (this.message_length_expected & 0xFF00) >> 8;
                }
                for (let ii = 0; ii < this.message_length_received; ii++) {
                    this.message_checksum ^= this.message_buffer_uint8_view[ii];
                }
                this._dispatch_message(chunk);
                break;
            case this.decoder_states.CHECKSUM_V2:
                this.message_checksum = 0;
                this.message_checksum = this.crc8_dvb_s2(this.message_checksum, 0); // flag
                this.message_checksum = this.crc8_dvb_s2(this.message_checksum, this.code & 0xFF);
                this.message_checksum = this.crc8_dvb_s2(this.message_checksum, (this.code & 0xFF00) >> 8);
                this.message_checksum = this.crc8_dvb_s2(this.message_checksum, this.message_length_expected & 0xFF);
                this.message_checksum = this.crc8_dvb_s2(this.message_checksum, (this.message_length_expected & 0xFF00) >> 8);
                for (let ii = 0; ii < this.message_length_received; ii++) {
                    this.message_checksum = this.crc8_dvb_s2(this.message_checksum, this.message_buffer_uint8_view[ii]);
                }
                this._dispatch_message(chunk);
                break;
            default:
                console.log(`Unknown state detected: ${this.state}`);
            }
        }
        this.last_received_timestamp = Date.now();
    },
    _initialize_read_buffer() {
        this.message_buffer = new ArrayBuffer(this.message_length_expected);
        this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);
    },
    _dispatch_message(expectedChecksum) {
        if (this.message_checksum === expectedChecksum) {
            // message received, store dataview
            this.dataView = new DataView(this.message_buffer, 0, this.message_length_expected);
        } else {
            this.packet_error++;
            this.crcError = true;
            this.dataView = new DataView(new ArrayBuffer(0));
        }
        this.notify();
        // Reset variables
        this.message_length_received = 0;
        this.state = 0;
        this.messageIsJumboFrame = false;
        this.crcError = false;
    },
    notify() {
        this.listeners.forEach((listener) => {
            listener(this);
        });
    },
    listen(listener) {
        if (this.listeners.indexOf(listener) == -1) {
            this.listeners.push(listener);
        }
    },
    clearListeners() {
        this.listeners = [];
    },
    crc8_dvb_s2(crc, ch) {
        crc ^= ch;
        for (let ii = 0; ii < 8; ii++) {
            if (crc & 0x80) {
                crc = ((crc << 1) & 0xFF) ^ 0xD5;
            } else {
                crc = (crc << 1) & 0xFF;
            }
        }
        return crc;
    },
    crc8_dvb_s2_data(data, start, end) {
        let crc = 0;
        for (let ii = start; ii < end; ii++) {
            crc = this.crc8_dvb_s2(crc, data[ii]);
        }
        return crc;
    },
    encode_message_v1(code, data) {
        const dataLength = data ? data.length : 0;
        // always reserve 6 bytes for protocol overhead !
        const bufferSize = dataLength + 6;
        let bufferOut = new ArrayBuffer(bufferSize);
        let bufView = new Uint8Array(bufferOut);

        bufView[0] = 36; // $
        bufView[1] = 77; // M
        bufView[2] = 60; // <
        bufView[3] = dataLength;
        bufView[4] = code;

        let checksum = bufView[3] ^ bufView[4];

        for (let i = 0; i < dataLength; i++) {
            bufView[i + 5] = data[i];
            checksum ^= bufView[i + 5];
        }

        bufView[5 + dataLength] = checksum;
        return bufferOut;
    },
    encode_message_v2(code, data) {
        const dataLength = data ? data.length : 0;
        // 9 bytes for protocol overhead
        const bufferSize = dataLength + 9;
        const bufferOut = new ArrayBuffer(bufferSize);
        const bufView = new Uint8Array(bufferOut);
        bufView[0] = 36; // $
        bufView[1] = 88; // X
        bufView[2] = 60; // <
        bufView[3] = 0;  // flag
        bufView[4] = code & 0xFF;
        bufView[5] = (code >> 8) & 0xFF;
        bufView[6] = dataLength & 0xFF;
        bufView[7] = (dataLength >> 8) & 0xFF;
        for (let ii = 0; ii < dataLength; ii++) {
            bufView[8 + ii] = data[ii];
        }
        bufView[bufferSize - 1] = this.crc8_dvb_s2_data(bufView, 3, bufferSize - 1);
        return bufferOut;
    },
    send_message(code, data, callback_sent, callback_msp, doCallbackOnError) {
        const connected = isWeb() ? serial$1.connected : serial$1.connectionId;

        if (code === undefined || !connected || CONFIGURATOR.virtualMode) {
            if (callback_msp) {
                callback_msp();
            }
            return false;
        }

        let requestExists = false;
        for (const instance of this.callbacks) {
            if (instance.code === code) {
                requestExists = true;

                break;
            }
        }

        const bufferOut = code <= 254 ? this.encode_message_v1(code, data) : this.encode_message_v2(code, data);

        const obj = {
            'code': code,
            'requestBuffer': bufferOut,
            'callback': callback_msp,
            'callbackOnError': doCallbackOnError,
            'start': performance.now(),
        };

        if (!requestExists) {
            obj.timer = setTimeout(() => {
                console.warn(`MSP: data request timed-out: ${code} ID: ${serial$1.connectionId} TAB: ${GUI.active_tab} TIMEOUT: ${this.timeout} QUEUE: ${this.callbacks.length} (${this.callbacks.map((e) => e.code)})`);
                serial$1.send(bufferOut, (_sendInfo) => {
                    obj.stop = performance.now();
                    const executionTime = Math.round(obj.stop - obj.start);
                    this.timeout = Math.max(this.MIN_TIMEOUT, Math.min(executionTime, this.MAX_TIMEOUT));
                });
            }, this.timeout);
        }

        this.callbacks.push(obj);

        // always send messages with data payload (even when there is a message already in the queue)
        if (data || !requestExists) {
            if (this.timeout > this.MIN_TIMEOUT) {
                this.timeout--;
            }

            serial$1.send(bufferOut, (sendInfo) => {
                if (sendInfo.bytesSent === bufferOut.byteLength) {
                    if (callback_sent) {
                        callback_sent();
                    }
                }
            });
        }

        return true;
    },

    /**
     * resolves: {command: code, data: data, length: message_length}
     */
    async promise(code, data) {
        return new Promise((resolve) => {
            this.send_message(code, data, false, (_data) => {
                resolve(_data);
            });
        });
    },
    callbacks_cleanup() {
        for (const callback of this.callbacks) {
            clearTimeout(callback.timer);
        }

        this.callbacks = [];
    },
    disconnect_cleanup() {
        this.state = 0; // reset packet state for "clean" initial entry (this is only required if user hot-disconnects)
        this.packet_error = 0; // reset CRC packet error counter for next session

        this.callbacks_cleanup();
    },
};

MSP.SDCARD_STATE_NOT_PRESENT = 0;
MSP.SDCARD_STATE_FATAL       = 1;
MSP.SDCARD_STATE_CARD_INIT   = 2;
MSP.SDCARD_STATE_FS_INIT     = 3;
MSP.SDCARD_STATE_READY       = 4;

window.MSP = MSP;
var MSP$1 = MSP;

const PortUsage = {
    previous_received:  0,
    previous_sent:      0,
    port_usage_down:    0,
    port_usage_up:      0,

    initialize: function() {
        const self = this;

        self.main_timer_reference = setInterval(function() {
            self.update();
        }, 1000);
    },
    update: function() {
        if (serial$3.bitrate) {
            const port_usage_down = parseInt(((serial$3.bytesReceived - this.previous_received) * 10 / serial$3.bitrate) * 100);
            const port_usage_up = parseInt(((serial$3.bytesSent - this.previous_sent) * 10 / serial$3.bitrate) * 100);

            this.previous_received = serial$3.bytesReceived;
            this.previous_sent = serial$3.bytesSent;
            this.port_usage_down = port_usage_down;
            this.port_usage_up = port_usage_up;

        } else {
            this.port_usage_down = 0;
            this.port_usage_up = 0;
        }
    },
    reset: function() {
        this.previous_received = 0;
        this.previous_sent = 0;

        this.port_usage_down = 0;
        this.port_usage_up = 0;
    },
};

// drop these after all is in modules
window.PortUsage = PortUsage;

// This modules is imported and has side effect of attaching the
// `i18n` helper to window and setting up `i18next`
// in the future it should be pure. This means it should
// explicitly export things used by other parts of the app.

// Most of the global objects can go here at first.
// It's a bit of overkill for simple components,
// but these instance would eventually have more children
// which would find the use for those extra properties.
const betaflightModel = {
    CONFIGURATOR,
    FC,
    MSP: MSP$1,
    PortUsage,
};

i18next.on('initialized', function() {

    console.log("i18n initialized, starting Vue framework");

    new Vue({
        i18n: vueI18n,
        el: '#main-wrapper',
        components: {
            BatteryLegend: __vue_component__$6,
            BetaflightLogo: __vue_component__$5,
            StatusBar: __vue_component__$1,
            BatteryIcon: __vue_component__,
        },
        data: betaflightModel,
    });
});


// Not strictly necessary here, but if needed
// it's always possible to modify this model in
// jquery land to trigger updates in vue
window.vm = betaflightModel;

function update_dataflash_global() {
    function formatFilesize(bytes) {
        if (bytes < 1024) {
            return `${bytes}B`;
        }
        const kilobytes = bytes / 1024;

        if (kilobytes < 1024) {
            return `${Math.round(kilobytes)}kB`;
        }

        const megabytes = kilobytes / 1024;

        return `${megabytes.toFixed(1)}MB`;
    }

    const supportsDataflash = FC.DATAFLASH.totalSize > 0;

    if (supportsDataflash){
        $$1(".noflash_global").css({
           display: 'none',
        });

        $$1(".dataflash-contents_global").css({
           display: 'block',
        });

        $$1(".dataflash-free_global").css({
           width: `${100-(FC.DATAFLASH.totalSize - FC.DATAFLASH.usedSize) / FC.DATAFLASH.totalSize * 100}%`,
           display: 'block',
        });
        $$1(".dataflash-free_global div").text(`Dataflash: free ${formatFilesize(FC.DATAFLASH.totalSize - FC.DATAFLASH.usedSize)}`);
     } else {
        $$1(".noflash_global").css({
           display: 'block',
        });

        $$1(".dataflash-contents_global").css({
           display: 'none',
        });
     }
}

const VtxDeviceTypes = {
    VTXDEV_UNSUPPORTED: 0, // reserved for MSP
    VTXDEV_RTC6705: 1,
    // 2 reserved
    VTXDEV_SMARTAUDIO: 3,
    VTXDEV_TRAMP: 4,
    VTXDEV_MSP: 5,
    VTXDEV_UNKNOWN:  0xFF,
};

class VtxDeviceStatus
{
    constructor(dataView)
    {
        this._deviceIsReady = dataView.readU8();
        const bandAndChannelAvailable = Boolean(dataView.readU8());
        this._band = dataView.readU8();
        this._channel = dataView.readU8();

        if (!bandAndChannelAvailable) {
            this._band = undefined;
            this._channel = undefined;
        }

        const powerIndexAvailable = Boolean(dataView.readU8());
        this._powerIndex = dataView.readU8();

        if (!powerIndexAvailable) {
            this._powerIndex = undefined;
        }

        const frequencyAvailable = Boolean(dataView.readU8());
        this._frequency = dataView.readU16();

        if (!frequencyAvailable) {
            this._frequency = undefined;
        }

        const vtxStatusAvailable = Boolean(dataView.readU8());
        this._vtxStatus = dataView.readU32(); // pitmode and/or locked

        if (!vtxStatusAvailable) {
            this._vtxStatus = undefined;
        }

        this._readPowerLevels(dataView);
    }

    _readPowerLevels(dataView)
    {
        this._levels = [];
        this._powers = [];
        const powerLevelCount = dataView.readU8();

        for (let i = 0; i < powerLevelCount; i++)
        {
            this._levels.push(dataView.readU16());
            this._powers.push(dataView.readU16());
        }
    }

    get deviceIsReady()
    {
        return this._deviceIsReady;
    }

    // overload this function in subclasses
    static get staticDeviceStatusType()
    {
        return VtxDeviceTypes.VTXDEV_UNKNOWN;
    }

    get deviceStatusType()
    {
        // returns result of overloaded static function "staticDeviceStatusType"
        return this.constructor.staticDeviceStatusType;
    }
}

class VtxDeviceStatusSmartAudio extends VtxDeviceStatus {
    constructor(dataView)
    {
        super(dataView);

        dataView.readU8(); // custom device status size

        this._version = dataView.readU8();
        this._mode = dataView.readU8();
        this._orfreq = dataView.readU16();
        this._willBootIntoPitMode = Boolean(dataView.readU8());
    }

    get smartAudioVersion()
    {
        this._version * 100 + this._mode;
        let result = "";

        switch (this._version) {
            case 1:
                result = "1.0";
                break;
            case 2:
                result = "2.0";
                break;
            case 3:
                result = "2.1";
                break;
            default:
                // unknown SA version
                result = i18n$1.getMessage("vtxType_255");
        }

        if (16 == this._mode) {
            result = i18n$1.getMessage("vtxSmartAudioUnlocked", {"version": result});
        }

        return result;
    }

    static get staticDeviceStatusType()
    {
        return VtxDeviceTypes.VTXDEV_SMARTAUDIO;
    }
}

class VtxDeviceStatusTramp extends VtxDeviceStatus {
    constructor(dataView)
    {
        super(dataView);

        dataView.readU8(); // custom device status size

        // Read other Tramp VTX device parameters here
    }

    static get staticDeviceStatusType()
    {
        return VtxDeviceTypes.VTXDEV_TRAMP;
    }
}

class VtxDeviceStatusMsp extends VtxDeviceStatus {
    constructor(dataView)
    {
        super(dataView);

        dataView.readU8(); // custom device status size

        // Read other MSP VTX device parameters here
    }

    static get staticDeviceStatusType()
    {
        return VtxDeviceTypes.VTXDEV_MSP;
    }
}

class VtxDeviceStatusRtc6705 extends VtxDeviceStatus {
    constructor(dataView)
    {
        super(dataView);

        dataView.readU8(); // custom device status size

        // Read other Tramp VTX device parameters here
    }

    static get staticDeviceStatusType()
    {
        return VtxDeviceTypes.VTXDEV_RTC6705;
    }
}

const vtxDeviceStatusFactory = {
    _vtxDeviceStatusClasses: [],

    // call this to register a new vtx type like SmartAudio, Tramp or Rtc6705
    registerVtxDeviceStatusClass: function(vtxDeviceStatusClass)
    {
        this._vtxDeviceStatusClasses.push(vtxDeviceStatusClass);
    },

    createVtxDeviceStatus: function(byteArray)
    {
        const dataView = new DataView(byteArray.buffer);

        const vtxTypeIndex = dataView.readU8();
        const vtxDeviceStatusClass = this._getDeviceStatusClass(vtxTypeIndex);

        return new vtxDeviceStatusClass(dataView);
    },

    _readVtxType: function(dataView)
    {
        return dataView.readU8();
    },

    _getDeviceStatusClass: function(vtxTypeIndex)
    {
        let result = this._vtxDeviceStatusClasses.find(
            (vtxClass) => {
                return vtxClass.staticDeviceStatusType === vtxTypeIndex;
            });

        if (typeof result === 'undefined') {
            result = VtxDeviceStatus;
        }

        return result;
    },
};

vtxDeviceStatusFactory.registerVtxDeviceStatusClass(VtxDeviceStatusSmartAudio);
vtxDeviceStatusFactory.registerVtxDeviceStatusClass(VtxDeviceStatusTramp);
vtxDeviceStatusFactory.registerVtxDeviceStatusClass(VtxDeviceStatusMsp);
vtxDeviceStatusFactory.registerVtxDeviceStatusClass(VtxDeviceStatusRtc6705);

//MSPCodes needs to be re-integrated inside MSP object
const MSPCodes = {
    MSP_API_VERSION:                1,
    MSP_FC_VARIANT:                 2,
    MSP_FC_VERSION:                 3,
    MSP_BOARD_INFO:                 4,
    MSP_BUILD_INFO:                 5,

    MSP_NAME:                       10, // DEPRECATED IN MSP 1.45
    MSP_SET_NAME:                   11, // DEPRECATED IN MSP 1.45

    MSP_BATTERY_CONFIG:             32,
    MSP_SET_BATTERY_CONFIG:         33,
    MSP_MODE_RANGES:                34,
    MSP_SET_MODE_RANGE:             35,
    MSP_FEATURE_CONFIG:             36,
    MSP_SET_FEATURE_CONFIG:         37,
    MSP_BOARD_ALIGNMENT_CONFIG:     38,
    MSP_SET_BOARD_ALIGNMENT_CONFIG: 39,
    MSP_CURRENT_METER_CONFIG:       40,
    MSP_SET_CURRENT_METER_CONFIG:   41,
    MSP_MIXER_CONFIG:               42,
    MSP_SET_MIXER_CONFIG:           43,
    MSP_RX_CONFIG:                  44,
    MSP_SET_RX_CONFIG:              45,
    MSP_LED_COLORS:                 46,
    MSP_SET_LED_COLORS:             47,
    MSP_LED_STRIP_CONFIG:           48,
    MSP_SET_LED_STRIP_CONFIG:       49,
    MSP_RSSI_CONFIG:                50,
    MSP_SET_RSSI_CONFIG:            51,
    MSP_ADJUSTMENT_RANGES:          52,
    MSP_SET_ADJUSTMENT_RANGE:       53,
    MSP_CF_SERIAL_CONFIG:           54,
    MSP_SET_CF_SERIAL_CONFIG:       55,
    MSP_VOLTAGE_METER_CONFIG:       56,
    MSP_SET_VOLTAGE_METER_CONFIG:   57,
    MSP_SONAR:                      58, // notice, in firmware named as MSP_SONAR_ALTITUDE
    MSP_PID_CONTROLLER:             59,
    MSP_SET_PID_CONTROLLER:         60,
    MSP_ARMING_CONFIG:              61,
    MSP_SET_ARMING_CONFIG:          62,
    MSP_RX_MAP:                     64,
    MSP_SET_RX_MAP:                 65,
    MSP_BF_CONFIG:                  66, // DEPRECATED
    MSP_SET_BF_CONFIG:              67, // DEPRECATED
    MSP_SET_REBOOT:                 68,
    MSP_BF_BUILD_INFO:              69, // Not used
    MSP_DATAFLASH_SUMMARY:          70,
    MSP_DATAFLASH_READ:             71,
    MSP_DATAFLASH_ERASE:            72,
    MSP_LOOP_TIME:                  73,
    MSP_SET_LOOP_TIME:              74,
    MSP_FAILSAFE_CONFIG:            75,
    MSP_SET_FAILSAFE_CONFIG:        76,
    MSP_RXFAIL_CONFIG:              77,
    MSP_SET_RXFAIL_CONFIG:          78,
    MSP_SDCARD_SUMMARY:             79,
    MSP_BLACKBOX_CONFIG:            80,
    MSP_SET_BLACKBOX_CONFIG:        81,
    MSP_TRANSPONDER_CONFIG:         82,
    MSP_SET_TRANSPONDER_CONFIG:     83,
    MSP_OSD_CONFIG:                 84,
    MSP_SET_OSD_CONFIG:             85,
    MSP_OSD_CHAR_READ:              86,
    MSP_OSD_CHAR_WRITE:             87,
    MSP_VTX_CONFIG:                 88,
    MSP_SET_VTX_CONFIG:             89,
    MSP_ADVANCED_CONFIG:            90,
    MSP_SET_ADVANCED_CONFIG:        91,
    MSP_FILTER_CONFIG:              92,
    MSP_SET_FILTER_CONFIG:          93,
    MSP_PID_ADVANCED:               94,
    MSP_SET_PID_ADVANCED:           95,
    MSP_SENSOR_CONFIG:              96,
    MSP_SET_SENSOR_CONFIG:          97,
    //MSP_SPECIAL_PARAMETERS:         98, // DEPRECATED
    MSP_ARMING_DISABLE:             99,
    //MSP_SET_SPECIAL_PARAMETERS:     99, // DEPRECATED
    //MSP_IDENT:                      100, // DEPRECTED
    MSP_STATUS:                     101,
    MSP_RAW_IMU:                    102,
    MSP_SERVO:                      103,
    MSP_MOTOR:                      104,
    MSP_RC:                         105,
    MSP_RAW_GPS:                    106,
    MSP_COMP_GPS:                   107,
    MSP_ATTITUDE:                   108,
    MSP_ALTITUDE:                   109,
    MSP_ANALOG:                     110,
    MSP_RC_TUNING:                  111,
    MSP_PID:                        112,
    //MSP_BOX:                        113, // DEPRECATED
    MSP_MISC:                       114, // DEPRECATED
    MSP_BOXNAMES:                   116,
    MSP_PIDNAMES:                   117,
    MSP_WP:                         118, // Not used
    MSP_BOXIDS:                     119,
    MSP_SERVO_CONFIGURATIONS:       120,
    MSP_MOTOR_3D_CONFIG:            124,
    MSP_RC_DEADBAND:                125,
    MSP_SENSOR_ALIGNMENT:           126,
    MSP_LED_STRIP_MODECOLOR:        127,

    MSP_VOLTAGE_METERS:             128,
    MSP_CURRENT_METERS:             129,
    MSP_BATTERY_STATE:              130,
    MSP_MOTOR_CONFIG:               131,
    MSP_GPS_CONFIG:                 132,
    MSP_COMPASS_CONFIG:             133,
    MSP_GPS_RESCUE:                 135,

    MSP_VTXTABLE_BAND:              137,
    MSP_VTXTABLE_POWERLEVEL:        138,

    MSP_MOTOR_TELEMETRY:            139,

    MSP_SIMPLIFIED_TUNING:          140,
    MSP_SET_SIMPLIFIED_TUNING:      141,

    MSP_CALCULATE_SIMPLIFIED_PID:   142,    // calculate slider values in temp profile
    MSP_CALCULATE_SIMPLIFIED_GYRO:  143,
    MSP_CALCULATE_SIMPLIFIED_DTERM: 144,

    MSP_VALIDATE_SIMPLIFIED_TUNING: 145,    // validate slider values in temp profile

    MSP_STATUS_EX:                  150,

    MSP_UID:                        160,
    MSP_GPS_SV_INFO:                164,

    MSP_DISPLAYPORT:                182,

    MSP_COPY_PROFILE:               183,

    MSP_BEEPER_CONFIG:              184,
    MSP_SET_BEEPER_CONFIG:          185,

    MSP_SET_OSD_CANVAS:             188,
    MSP_OSD_CANVAS:                 189,

    MSP_SET_RAW_RC:                 200,
    MSP_SET_RAW_GPS:                201, // Not used
    MSP_SET_PID:                    202,
    //MSP_SET_BOX:                    203, // DEPRECATED
    MSP_SET_RC_TUNING:              204,
    MSP_ACC_CALIBRATION:            205,
    MSP_MAG_CALIBRATION:            206,
    MSP_SET_MISC:                   207, // DEPRECATED
    MSP_RESET_CONF:                 208,
    MSP_SET_WP:                     209, // Not used
    MSP_SELECT_SETTING:             210,
    MSP_SET_HEADING:                211, // Not used
    MSP_SET_SERVO_CONFIGURATION:    212,
    MSP_SET_MOTOR:                  214,
    MSP_SET_MOTOR_3D_CONFIG:        217,
    MSP_SET_RC_DEADBAND:            218,
    MSP_SET_RESET_CURR_PID:         219,
    MSP_SET_SENSOR_ALIGNMENT:       220,
    MSP_SET_LED_STRIP_MODECOLOR:    221,
    MSP_SET_MOTOR_CONFIG:           222,
    MSP_SET_GPS_CONFIG:             223,
    MSP_SET_COMPASS_CONFIG:         224,
    MSP_SET_GPS_RESCUE:             225,

    MSP_SET_VTXTABLE_BAND:          227,
    MSP_SET_VTXTABLE_POWERLEVEL:    228,

    MSP_MULTIPLE_MSP:               230,

    MSP_MODE_RANGES_EXTRA:          238,
    MSP_SET_ACC_TRIM:               239,
    MSP_ACC_TRIM:                   240,
    MSP_SERVO_MIX_RULES:            241,
    MSP_SET_SERVO_MIX_RULE:         242, // Not used
    MSP_SET_4WAY_IF:                245, // Not used
    MSP_SET_RTC:                    246,
    MSP_RTC:                        247, // Not used
    MSP_SET_BOARD_INFO:             248, // Not used
    MSP_SET_SIGNATURE:              249, // Not used

    MSP_EEPROM_WRITE:               250,
    MSP_DEBUGMSG:                   253, // Not used
    MSP_DEBUG:                      254,

    // MSPv2 Common
    MSP2_COMMON_SERIAL_CONFIG:          0x1009,
    MSP2_COMMON_SET_SERIAL_CONFIG:      0x100A,

    // MSPv2 Betaflight specific
    MSP2_BETAFLIGHT_BIND:               0x3000,
    MSP2_MOTOR_OUTPUT_REORDERING:       0x3001,
    MSP2_SET_MOTOR_OUTPUT_REORDERING:   0x3002,
    MSP2_SEND_DSHOT_COMMAND:            0x3003,
    MSP2_GET_VTX_DEVICE_STATUS:         0x3004,
    MSP2_GET_OSD_WARNINGS:              0x3005,
    MSP2_GET_TEXT:                      0x3006,
    MSP2_SET_TEXT:                      0x3007,
    MSP2_GET_LED_STRIP_CONFIG_VALUES:   0x3008,
    MSP2_SET_LED_STRIP_CONFIG_VALUES:   0x3009,
    MSP2_SENSOR_CONFIG_ACTIVE:          0x300A,

    // MSP2_GET_TEXT and MSP2_SET_TEXT variable types
    PILOT_NAME:                     1,
    CRAFT_NAME:                     2,
    PID_PROFILE_NAME:               3,
    RATE_PROFILE_NAME:              4,
    BUILD_KEY:                      5,
};

class EscProtocols
{
    static get PROTOCOL_PWM()          { return "PWM"; }
    static get PROTOCOL_ONESHOT125()   { return "ONESHOT125"; }
    static get PROTOCOL_ONESHOT42()    { return "ONESHOT42"; }
    static get PROTOCOL_MULTISHOT()    { return "MULTISHOT"; }
    static get PROTOCOL_BRUSHED()      { return "BRUSHED"; }
    static get PROTOCOL_DSHOT150()     { return "DSHOT150"; }
    static get PROTOCOL_DSHOT300()     { return "DSHOT300"; }
    static get PROTOCOL_DSHOT600()     { return "DSHOT600"; }
    static get PROTOCOL_DSHOT1200()    { return "DSHOT1200"; }
    static get PROTOCOL_PROSHOT1000()  { return "PROSHOT1000"; }
    static get PROTOCOL_DISABLED()     { return "DISABLED"; }

    static get DSHOT_PROTOCOLS_SET()
    {
        return [
            EscProtocols.PROTOCOL_DSHOT150,
            EscProtocols.PROTOCOL_DSHOT300,
            EscProtocols.PROTOCOL_DSHOT600,
            EscProtocols.PROTOCOL_DSHOT1200,
            EscProtocols.PROTOCOL_PROSHOT1000,
        ];
    }

    static GetProtocolName(apiVersion, protocolIndex)
    {
        const escProtocols = EscProtocols.GetAvailableProtocols(apiVersion);
        return escProtocols[protocolIndex];
    }

    static IsProtocolDshot(apiVersion, protocolIndex)
    {
        const protocolName = EscProtocols.GetProtocolName(apiVersion, protocolIndex);
        return EscProtocols.DSHOT_PROTOCOLS_SET.includes(protocolName);
    }

    static GetAvailableProtocols(apiVersion)
    {
        const escProtocols = [
            EscProtocols.PROTOCOL_PWM,
            EscProtocols.PROTOCOL_ONESHOT125,
            EscProtocols.PROTOCOL_ONESHOT42,
            EscProtocols.PROTOCOL_MULTISHOT,
            EscProtocols.PROTOCOL_BRUSHED,
            EscProtocols.PROTOCOL_DSHOT150,
            EscProtocols.PROTOCOL_DSHOT300,
            EscProtocols.PROTOCOL_DSHOT600,
        ];


        if (semver.lt(apiVersion, API_VERSION_1_42)) {
            escProtocols.push(EscProtocols.PROTOCOL_DSHOT1200);
        }

        escProtocols.push(EscProtocols.PROTOCOL_PROSHOT1000);

        if (semver.gte(apiVersion, API_VERSION_1_43)) {
            escProtocols.push(EscProtocols.PROTOCOL_DISABLED);
        }

        return escProtocols;
    }

    static ReorderPwmProtocols(apiVersion, protocolIndex)
    {
        return protocolIndex;
    }


}

const HUFFMAN_EOF = -1;

function huffmanDecodeBuf(inBuf, inBufCharacterCount, huffmanTree, huffmanLenIndex) {
    let code = 0;
    let codeLen = 0;
    let testBit = 0x80;
    let eof = false;
    const outBuf = [];

    while (!eof && inBuf.byteLength != 0) {
        if (outBuf.length == inBufCharacterCount) {
            // we've exhausted the input stream, discard any odd bits on the end
            break;
        }

        if (inBuf.byteLength == 0) {
            throw new Error('unexpected');
        }

        // get the next bit from the input buffer
        code <<= 1;
        ++codeLen;
        if (inBuf[0] & testBit) {
            code |= 0x01;
        }
        testBit >>= 1;
        if (testBit == 0) {
            testBit = 0x80;
            inBuf = inBuf.subarray(1);
        }

        // check if the code is a leaf node or an interior node
        if (huffmanLenIndex[codeLen] != -1) {
            // look for the code in the tree, only leaf nodes are stored in the tree
            for (let i = huffmanLenIndex[codeLen]; (i < huffmanTree.length) && (huffmanTree[i].codeLen === codeLen); ++i) {
                if (huffmanTree[i].code === code) {
                    // we've found the code, so it is a leaf node
                    const value = huffmanTree[i].value;

                    if (value == HUFFMAN_EOF) {
                        eof = true;
                    } else {
                        // output the value
                        outBuf.push(value);
                    }

                    // reset the code to continue decompressing the input buffer
                    code = 0;
                    codeLen = 0;
                    break;
                }
            }
        }
    }

    return new Uint8Array(outBuf);
}

const defaultHuffmanTree = [
    { value: 0x00, codeLen: 2, code: 0x0003 },  //  11
    { value: 0x01, codeLen: 3, code: 0x0005 },  //  101
    { value: 0x02, codeLen: 4, code: 0x0009 },  //  1001
    { value: 0x03, codeLen: 5, code: 0x0011 },  //  10001
    { value: 0x04, codeLen: 5, code: 0x0010 },  //  10000
    { value: 0x50, codeLen: 5, code: 0x000F },  //  01111
    { value: 0x05, codeLen: 6, code: 0x001D },  //  011101
    { value: 0x06, codeLen: 6, code: 0x001C },  //  011100
    { value: 0x07, codeLen: 6, code: 0x001B },  //  011011
    { value: 0x08, codeLen: 6, code: 0x001A },  //  011010
    { value: 0x10, codeLen: 6, code: 0x0019 },  //  011001
    { value: 0x09, codeLen: 7, code: 0x0031 },  //  0110001
    { value: 0x0A, codeLen: 7, code: 0x0030 },  //  0110000
    { value: 0x0B, codeLen: 7, code: 0x002F },  //  0101111
    { value: 0x0C, codeLen: 7, code: 0x002E },  //  0101110
    { value: 0x0D, codeLen: 7, code: 0x002D },  //  0101101
    { value: 0x0E, codeLen: 7, code: 0x002C },  //  0101100
    { value: 0x0F, codeLen: 7, code: 0x002B },  //  0101011
    { value: 0x11, codeLen: 7, code: 0x002A },  //  0101010
    { value: 0x12, codeLen: 7, code: 0x0029 },  //  0101001
    { value: 0x13, codeLen: 8, code: 0x0051 },  //  01010001
    { value: 0x14, codeLen: 8, code: 0x0050 },  //  01010000
    { value: 0x15, codeLen: 8, code: 0x004F },  //  01001111
    { value: 0x16, codeLen: 8, code: 0x004E },  //  01001110
    { value: 0x17, codeLen: 8, code: 0x004D },  //  01001101
    { value: 0x18, codeLen: 8, code: 0x004C },  //  01001100
    { value: 0x19, codeLen: 8, code: 0x004B },  //  01001011
    { value: 0x1A, codeLen: 8, code: 0x004A },  //  01001010
    { value: 0x1B, codeLen: 8, code: 0x0049 },  //  01001001
    { value: 0x1C, codeLen: 8, code: 0x0048 },  //  01001000
    { value: 0x1D, codeLen: 8, code: 0x0047 },  //  01000111
    { value: 0x1E, codeLen: 8, code: 0x0046 },  //  01000110
    { value: 0x1F, codeLen: 8, code: 0x0045 },  //  01000101
    { value: 0x20, codeLen: 8, code: 0x0044 },  //  01000100
    { value: 0x21, codeLen: 8, code: 0x0043 },  //  01000011
    { value: 0x22, codeLen: 8, code: 0x0042 },  //  01000010
    { value: 0x23, codeLen: 8, code: 0x0041 },  //  01000001
    { value: 0x24, codeLen: 8, code: 0x0040 },  //  01000000
    { value: 0x30, codeLen: 8, code: 0x003F },  //  00111111
    { value: 0x40, codeLen: 8, code: 0x003E },  //  00111110
    { value: 0xF0, codeLen: 8, code: 0x003D },  //  00111101
    { value: 0x25, codeLen: 9, code: 0x0079 },  //  001111001
    { value: 0x26, codeLen: 9, code: 0x0078 },  //  001111000
    { value: 0x27, codeLen: 9, code: 0x0077 },  //  001110111
    { value: 0x28, codeLen: 9, code: 0x0076 },  //  001110110
    { value: 0x29, codeLen: 9, code: 0x0075 },  //  001110101
    { value: 0x2A, codeLen: 9, code: 0x0074 },  //  001110100
    { value: 0x2B, codeLen: 9, code: 0x0073 },  //  001110011
    { value: 0x2C, codeLen: 9, code: 0x0072 },  //  001110010
    { value: 0x2D, codeLen: 9, code: 0x0071 },  //  001110001
    { value: 0x2E, codeLen: 9, code: 0x0070 },  //  001110000
    { value: 0x2F, codeLen: 9, code: 0x006F },  //  001101111
    { value: 0x31, codeLen: 9, code: 0x006E },  //  001101110
    { value: 0x32, codeLen: 9, code: 0x006D },  //  001101101
    { value: 0x33, codeLen: 9, code: 0x006C },  //  001101100
    { value: 0x34, codeLen: 9, code: 0x006B },  //  001101011
    { value: 0x35, codeLen: 9, code: 0x006A },  //  001101010
    { value: 0x36, codeLen: 9, code: 0x0069 },  //  001101001
    { value: 0x37, codeLen: 9, code: 0x0068 },  //  001101000
    { value: 0x38, codeLen: 9, code: 0x0067 },  //  001100111
    { value: 0x39, codeLen: 9, code: 0x0066 },  //  001100110
    { value: 0x3A, codeLen: 9, code: 0x0065 },  //  001100101
    { value: 0x3B, codeLen: 9, code: 0x0064 },  //  001100100
    { value: 0x3C, codeLen: 9, code: 0x0063 },  //  001100011
    { value: 0x3D, codeLen: 9, code: 0x0062 },  //  001100010
    { value: 0x3E, codeLen: 9, code: 0x0061 },  //  001100001
    { value: 0x3F, codeLen: 9, code: 0x0060 },  //  001100000
    { value: 0x41, codeLen: 9, code: 0x005F },  //  001011111
    { value: 0x42, codeLen: 9, code: 0x005E },  //  001011110
    { value: 0x43, codeLen: 9, code: 0x005D },  //  001011101
    { value: 0x44, codeLen: 9, code: 0x005C },  //  001011100
    { value: 0x45, codeLen: 9, code: 0x005B },  //  001011011
    { value: 0x46, codeLen: 9, code: 0x005A },  //  001011010
    { value: 0x47, codeLen: 9, code: 0x0059 },  //  001011001
    { value: 0x48, codeLen: 9, code: 0x0058 },  //  001011000
    { value: 0x49, codeLen: 9, code: 0x0057 },  //  001010111
    { value: 0x4C, codeLen: 9, code: 0x0056 },  //  001010110
    { value: 0x4F, codeLen: 9, code: 0x0055 },  //  001010101
    { value: 0x51, codeLen: 9, code: 0x0054 },  //  001010100
    { value: 0x80, codeLen: 9, code: 0x0053 },  //  001010011
    { value: 0xE0, codeLen: 9, code: 0x0052 },  //  001010010
    { value: 0xF1, codeLen: 9, code: 0x0051 },  //  001010001
    { value: 0xFF, codeLen: 9, code: 0x0050 },  //  001010000
    { value: 0x4A, codeLen: 10, code: 0x009F },  //  0010011111
    { value: 0x4B, codeLen: 10, code: 0x009E },  //  0010011110
    { value: 0x4D, codeLen: 10, code: 0x009D },  //  0010011101
    { value: 0x4E, codeLen: 10, code: 0x009C },  //  0010011100
    { value: 0x52, codeLen: 10, code: 0x009B },  //  0010011011
    { value: 0x53, codeLen: 10, code: 0x009A },  //  0010011010
    { value: 0x54, codeLen: 10, code: 0x0099 },  //  0010011001
    { value: 0x55, codeLen: 10, code: 0x0098 },  //  0010011000
    { value: 0x56, codeLen: 10, code: 0x0097 },  //  0010010111
    { value: 0x57, codeLen: 10, code: 0x0096 },  //  0010010110
    { value: 0x58, codeLen: 10, code: 0x0095 },  //  0010010101
    { value: 0x59, codeLen: 10, code: 0x0094 },  //  0010010100
    { value: 0x5A, codeLen: 10, code: 0x0093 },  //  0010010011
    { value: 0x5B, codeLen: 10, code: 0x0092 },  //  0010010010
    { value: 0x5C, codeLen: 10, code: 0x0091 },  //  0010010001
    { value: 0x5D, codeLen: 10, code: 0x0090 },  //  0010010000
    { value: 0x5E, codeLen: 10, code: 0x008F },  //  0010001111
    { value: 0x5F, codeLen: 10, code: 0x008E },  //  0010001110
    { value: 0x60, codeLen: 10, code: 0x008D },  //  0010001101
    { value: 0x61, codeLen: 10, code: 0x008C },  //  0010001100
    { value: 0x62, codeLen: 10, code: 0x008B },  //  0010001011
    { value: 0x63, codeLen: 10, code: 0x008A },  //  0010001010
    { value: 0x64, codeLen: 10, code: 0x0089 },  //  0010001001
    { value: 0x65, codeLen: 10, code: 0x0088 },  //  0010001000
    { value: 0x66, codeLen: 10, code: 0x0087 },  //  0010000111
    { value: 0x67, codeLen: 10, code: 0x0086 },  //  0010000110
    { value: 0x68, codeLen: 10, code: 0x0085 },  //  0010000101
    { value: 0x69, codeLen: 10, code: 0x0084 },  //  0010000100
    { value: 0x6A, codeLen: 10, code: 0x0083 },  //  0010000011
    { value: 0x6B, codeLen: 10, code: 0x0082 },  //  0010000010
    { value: 0x6C, codeLen: 10, code: 0x0081 },  //  0010000001
    { value: 0x6D, codeLen: 10, code: 0x0080 },  //  0010000000
    { value: 0x6E, codeLen: 10, code: 0x007F },  //  0001111111
    { value: 0x6F, codeLen: 10, code: 0x007E },  //  0001111110
    { value: 0x70, codeLen: 10, code: 0x007D },  //  0001111101
    { value: 0x71, codeLen: 10, code: 0x007C },  //  0001111100
    { value: 0x72, codeLen: 10, code: 0x007B },  //  0001111011
    { value: 0x73, codeLen: 10, code: 0x007A },  //  0001111010
    { value: 0x74, codeLen: 10, code: 0x0079 },  //  0001111001
    { value: 0x75, codeLen: 10, code: 0x0078 },  //  0001111000
    { value: 0x76, codeLen: 10, code: 0x0077 },  //  0001110111
    { value: 0x77, codeLen: 10, code: 0x0076 },  //  0001110110
    { value: 0x78, codeLen: 10, code: 0x0075 },  //  0001110101
    { value: 0x79, codeLen: 10, code: 0x0074 },  //  0001110100
    { value: 0x7A, codeLen: 10, code: 0x0073 },  //  0001110011
    { value: 0x7B, codeLen: 10, code: 0x0072 },  //  0001110010
    { value: 0x7C, codeLen: 10, code: 0x0071 },  //  0001110001
    { value: 0x7D, codeLen: 10, code: 0x0070 },  //  0001110000
    { value: 0x7E, codeLen: 10, code: 0x006F },  //  0001101111
    { value: 0x7F, codeLen: 10, code: 0x006E },  //  0001101110
    { value: 0x81, codeLen: 10, code: 0x006D },  //  0001101101
    { value: 0x82, codeLen: 10, code: 0x006C },  //  0001101100
    { value: 0x83, codeLen: 10, code: 0x006B },  //  0001101011
    { value: 0x84, codeLen: 10, code: 0x006A },  //  0001101010
    { value: 0x85, codeLen: 10, code: 0x0069 },  //  0001101001
    { value: 0x86, codeLen: 10, code: 0x0068 },  //  0001101000
    { value: 0x87, codeLen: 10, code: 0x0067 },  //  0001100111
    { value: 0x88, codeLen: 10, code: 0x0066 },  //  0001100110
    { value: 0x89, codeLen: 10, code: 0x0065 },  //  0001100101
    { value: 0x8A, codeLen: 10, code: 0x0064 },  //  0001100100
    { value: 0x8B, codeLen: 10, code: 0x0063 },  //  0001100011
    { value: 0x8C, codeLen: 10, code: 0x0062 },  //  0001100010
    { value: 0x8D, codeLen: 10, code: 0x0061 },  //  0001100001
    { value: 0x8E, codeLen: 10, code: 0x0060 },  //  0001100000
    { value: 0x8F, codeLen: 10, code: 0x005F },  //  0001011111
    { value: 0x90, codeLen: 10, code: 0x005E },  //  0001011110
    { value: 0x91, codeLen: 10, code: 0x005D },  //  0001011101
    { value: 0x92, codeLen: 10, code: 0x005C },  //  0001011100
    { value: 0x93, codeLen: 10, code: 0x005B },  //  0001011011
    { value: 0x94, codeLen: 10, code: 0x005A },  //  0001011010
    { value: 0x95, codeLen: 10, code: 0x0059 },  //  0001011001
    { value: 0x96, codeLen: 10, code: 0x0058 },  //  0001011000
    { value: 0x97, codeLen: 10, code: 0x0057 },  //  0001010111
    { value: 0x98, codeLen: 10, code: 0x0056 },  //  0001010110
    { value: 0x99, codeLen: 10, code: 0x0055 },  //  0001010101
    { value: 0x9A, codeLen: 10, code: 0x0054 },  //  0001010100
    { value: 0x9B, codeLen: 10, code: 0x0053 },  //  0001010011
    { value: 0x9C, codeLen: 10, code: 0x0052 },  //  0001010010
    { value: 0x9D, codeLen: 10, code: 0x0051 },  //  0001010001
    { value: 0x9E, codeLen: 10, code: 0x0050 },  //  0001010000
    { value: 0x9F, codeLen: 10, code: 0x004F },  //  0001001111
    { value: 0xA0, codeLen: 10, code: 0x004E },  //  0001001110
    { value: 0xA1, codeLen: 10, code: 0x004D },  //  0001001101
    { value: 0xA2, codeLen: 10, code: 0x004C },  //  0001001100
    { value: 0xA3, codeLen: 10, code: 0x004B },  //  0001001011
    { value: 0xA4, codeLen: 10, code: 0x004A },  //  0001001010
    { value: 0xA5, codeLen: 10, code: 0x0049 },  //  0001001001
    { value: 0xA6, codeLen: 10, code: 0x0048 },  //  0001001000
    { value: 0xA7, codeLen: 10, code: 0x0047 },  //  0001000111
    { value: 0xA8, codeLen: 10, code: 0x0046 },  //  0001000110
    { value: 0xA9, codeLen: 10, code: 0x0045 },  //  0001000101
    { value: 0xAA, codeLen: 10, code: 0x0044 },  //  0001000100
    { value: 0xAB, codeLen: 10, code: 0x0043 },  //  0001000011
    { value: 0xAC, codeLen: 10, code: 0x0042 },  //  0001000010
    { value: 0xAD, codeLen: 10, code: 0x0041 },  //  0001000001
    { value: 0xAE, codeLen: 10, code: 0x0040 },  //  0001000000
    { value: 0xAF, codeLen: 10, code: 0x003F },  //  0000111111
    { value: 0xB0, codeLen: 10, code: 0x003E },  //  0000111110
    { value: 0xB1, codeLen: 10, code: 0x003D },  //  0000111101
    { value: 0xB2, codeLen: 10, code: 0x003C },  //  0000111100
    { value: 0xB3, codeLen: 10, code: 0x003B },  //  0000111011
    { value: 0xB4, codeLen: 10, code: 0x003A },  //  0000111010
    { value: 0xB5, codeLen: 10, code: 0x0039 },  //  0000111001
    { value: 0xB6, codeLen: 10, code: 0x0038 },  //  0000111000
    { value: 0xB7, codeLen: 10, code: 0x0037 },  //  0000110111
    { value: 0xB8, codeLen: 10, code: 0x0036 },  //  0000110110
    { value: 0xB9, codeLen: 10, code: 0x0035 },  //  0000110101
    { value: 0xBA, codeLen: 10, code: 0x0034 },  //  0000110100
    { value: 0xBB, codeLen: 10, code: 0x0033 },  //  0000110011
    { value: 0xBC, codeLen: 10, code: 0x0032 },  //  0000110010
    { value: 0xBD, codeLen: 10, code: 0x0031 },  //  0000110001
    { value: 0xBE, codeLen: 10, code: 0x0030 },  //  0000110000
    { value: 0xBF, codeLen: 10, code: 0x002F },  //  0000101111
    { value: 0xC0, codeLen: 10, code: 0x002E },  //  0000101110
    { value: 0xC1, codeLen: 10, code: 0x002D },  //  0000101101
    { value: 0xC2, codeLen: 10, code: 0x002C },  //  0000101100
    { value: 0xC3, codeLen: 10, code: 0x002B },  //  0000101011
    { value: 0xC4, codeLen: 10, code: 0x002A },  //  0000101010
    { value: 0xC5, codeLen: 10, code: 0x0029 },  //  0000101001
    { value: 0xC6, codeLen: 10, code: 0x0028 },  //  0000101000
    { value: 0xC7, codeLen: 10, code: 0x0027 },  //  0000100111
    { value: 0xC8, codeLen: 10, code: 0x0026 },  //  0000100110
    { value: 0xC9, codeLen: 10, code: 0x0025 },  //  0000100101
    { value: 0xCA, codeLen: 10, code: 0x0024 },  //  0000100100
    { value: 0xCB, codeLen: 10, code: 0x0023 },  //  0000100011
    { value: 0xCC, codeLen: 10, code: 0x0022 },  //  0000100010
    { value: 0xCD, codeLen: 10, code: 0x0021 },  //  0000100001
    { value: 0xCE, codeLen: 10, code: 0x0020 },  //  0000100000
    { value: 0xCF, codeLen: 10, code: 0x001F },  //  0000011111
    { value: 0xD0, codeLen: 10, code: 0x001E },  //  0000011110
    { value: 0xD1, codeLen: 10, code: 0x001D },  //  0000011101
    { value: 0xD2, codeLen: 10, code: 0x001C },  //  0000011100
    { value: 0xD3, codeLen: 10, code: 0x001B },  //  0000011011
    { value: 0xD4, codeLen: 10, code: 0x001A },  //  0000011010
    { value: 0xD6, codeLen: 10, code: 0x0019 },  //  0000011001
    { value: 0xD7, codeLen: 10, code: 0x0018 },  //  0000011000
    { value: 0xD8, codeLen: 10, code: 0x0017 },  //  0000010111
    { value: 0xD9, codeLen: 10, code: 0x0016 },  //  0000010110
    { value: 0xDA, codeLen: 10, code: 0x0015 },  //  0000010101
    { value: 0xDB, codeLen: 10, code: 0x0014 },  //  0000010100
    { value: 0xDC, codeLen: 10, code: 0x0013 },  //  0000010011
    { value: 0xDE, codeLen: 10, code: 0x0012 },  //  0000010010
    { value: 0xDF, codeLen: 10, code: 0x0011 },  //  0000010001
    { value: 0xE1, codeLen: 10, code: 0x0010 },  //  0000010000
    { value: 0xE2, codeLen: 10, code: 0x000F },  //  0000001111
    { value: 0xE4, codeLen: 10, code: 0x000E },  //  0000001110
    { value: 0xEF, codeLen: 10, code: 0x000D },  //  0000001101
    { value: 0xD5, codeLen: 11, code: 0x0019 },  //  00000011001
    { value: 0xDD, codeLen: 11, code: 0x0018 },  //  00000011000
    { value: 0xE3, codeLen: 11, code: 0x0017 },  //  00000010111
    { value: 0xE5, codeLen: 11, code: 0x0016 },  //  00000010110
    { value: 0xE6, codeLen: 11, code: 0x0015 },  //  00000010101
    { value: 0xE7, codeLen: 11, code: 0x0014 },  //  00000010100
    { value: 0xE8, codeLen: 11, code: 0x0013 },  //  00000010011
    { value: 0xE9, codeLen: 11, code: 0x0012 },  //  00000010010
    { value: 0xEA, codeLen: 11, code: 0x0011 },  //  00000010001
    { value: 0xEB, codeLen: 11, code: 0x0010 },  //  00000010000
    { value: 0xEC, codeLen: 11, code: 0x000F },  //  00000001111
    { value: 0xED, codeLen: 11, code: 0x000E },  //  00000001110
    { value: 0xEE, codeLen: 11, code: 0x000D },  //  00000001101
    { value: 0xF2, codeLen: 11, code: 0x000C },  //  00000001100
    { value: 0xF3, codeLen: 11, code: 0x000B },  //  00000001011
    { value: 0xF4, codeLen: 11, code: 0x000A },  //  00000001010
    { value: 0xF5, codeLen: 11, code: 0x0009 },  //  00000001001
    { value: 0xF6, codeLen: 11, code: 0x0008 },  //  00000001000
    { value: 0xF7, codeLen: 11, code: 0x0007 },  //  00000000111
    { value: 0xF8, codeLen: 11, code: 0x0006 },  //  00000000110
    { value: 0xFA, codeLen: 11, code: 0x0005 },  //  00000000101
    { value: 0xFB, codeLen: 11, code: 0x0004 },  //  00000000100
    { value: 0xFC, codeLen: 11, code: 0x0003 },  //  00000000011
    { value: 0xFD, codeLen: 11, code: 0x0002 },  //  00000000010
    { value: 0xFE, codeLen: 11, code: 0x0001 },  //  00000000001
    { value: 0xF9, codeLen: 12, code: 0x0001 },  //  000000000001
    { value: HUFFMAN_EOF, codeLen: 12, code: 0x0000 },  //  000000000000
];

const defaultHuffmanLenIndex = function() {
    const result = Array(defaultHuffmanTree.length).fill(-1);

    for (let i = 0; i < defaultHuffmanTree.length; ++i) {
        if (result[defaultHuffmanTree[i].codeLen] === -1) {
            result[defaultHuffmanTree[i].codeLen] = i;
        }
    }

    return result;
}();

function updateTabList(features) {
    const isExpertModeEnabled = $$1('input[name="expertModeCheckbox"]').is(':checked');

    $$1('#tabs ul.mode-connected li.tab_failsafe').toggle(isExpertModeEnabled);
    $$1('#tabs ul.mode-connected li.tab_adjustments').toggle(isExpertModeEnabled);
    $$1('#tabs ul.mode-connected li.tab_sensors').toggle(isExpertModeEnabled);
    $$1('#tabs ul.mode-connected li.tab_logging').toggle(isExpertModeEnabled);

    $$1('#tabs ul.mode-connected li.tab_servos').toggle(features.isEnabled('CHANNEL_FORWARDING') || features.isEnabled('SERVO_TILT'));
    $$1('#tabs ul.mode-connected li.tab_gps').toggle(features.isEnabled('GPS'));
    $$1('#tabs ul.mode-connected li.tab_led_strip').toggle(features.isEnabled('LED_STRIP'));
    $$1('#tabs ul.mode-connected li.tab_transponder').toggle(features.isEnabled('TRANSPONDER'));
    $$1('#tabs ul.mode-connected li.tab_osd').toggle(features.isEnabled('OSD'));
}

function showErrorDialog(message) {
   const dialog = $$1('.dialogError')[0];

    $$1('.dialogError-content').html(message);

    $$1('.dialogError-closebtn').click(function() {
        dialog.close();
    });

    dialog.showModal();
}

/**
 * Gets one or more items from sessionStorage
 * @param {string | string[]} key string or array of strings
 * @returns {object}
 */
function get(key) {
  let result = {};
  if (Array.isArray(key)) {
    key.forEach(function (element) {
      try {
        result = { ...result, ...JSON.parse(sessionStorage.getItem(element)) };
      } catch (e) {
        console.error(e);
      }
    });
  } else {
    const keyValue = sessionStorage.getItem(key);
    if (keyValue) {
      try {
        result = JSON.parse(keyValue);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return result;
}

/**
 * Save dictionary of key/value pairs to sessionStorage
 * @param {object} input object which keys are strings and values are serializable objects
 */
function set(input) {
  Object.keys(input).forEach(function (element) {
    const tmpObj = {};
    tmpObj[element] = input[element];
    try {
      sessionStorage.setItem(element, JSON.stringify(tmpObj));
    } catch (e) {
      console.error(e);
    }
  });
}

class BuildApi {

    constructor () {
        this._url = 'https://build.betaflight.com';
        this._cacheExpirationPeriod = 3600 * 1000;
    }

    load(url, onSuccess, onFailure) {
        const dataTag = `${url}_Data`;
        const cacheLastUpdateTag = `${url}_LastUpdate`;

        const result = get([cacheLastUpdateTag, dataTag]);
        const dataTimestamp = $$1.now();
        const cachedData = result[dataTag];
        const cachedLastUpdate = result[cacheLastUpdateTag];

        const cachedCallback = () => {
            if (cachedData) {
                gui_log(i18n$1.getMessage('buildServerUsingCached', [url]));
            }

            onSuccess(cachedData);
        };

        if (!cachedData || !cachedLastUpdate || dataTimestamp - cachedLastUpdate > this._cacheExpirationPeriod) {
            $$1.get(url, function (info) {
                // cache loaded info
                const object = {};
                object[dataTag] = info;
                object[cacheLastUpdateTag] = $$1.now();
                set(object);
                onSuccess(info);
            }).fail(xhr => {
                gui_log(i18n$1.getMessage('buildServerFailure', [url, `HTTP ${xhr.status}`]));
                if (onFailure !== undefined) {
                    onFailure();
                } else {
                    cachedCallback();
                }
            });
        } else {
            cachedCallback();
        }
    }

    loadTargets(callback) {
        const url = `${this._url}/api/targets`;
        this.load(url, callback);
    }

    loadTargetReleases(target, callback) {
        const url = `${this._url}/api/targets/${target}`;
        this.load(url, callback);
    }

    loadTarget(target, release, onSuccess, onFailure) {
        const url = `${this._url}/api/builds/${release}/${target}`;
        this.load(url, onSuccess, onFailure);
    }

    loadTargetHex(path, onSuccess, onFailure) {
        const url = `${this._url}${path}`;
        $$1.get(url, function (data) {
            gui_log(i18n$1.getMessage('buildServerSuccess', [path]));
            onSuccess(data);
        }).fail(xhr => {
            gui_log(i18n$1.getMessage('buildServerFailure', [path, `HTTP ${xhr.status}`]));
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    getSupportCommands(onSuccess, onFailure) {
        const url = `${this._url}/api/support/commands`;
        $$1.get(url, function (data) {
            onSuccess(data);
        }).fail(xhr => {
            gui_log(i18n$1.getMessage('buildServerFailure', [url, `HTTP ${xhr.status}`]));
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    submitSupportData(data, onSuccess, onFailure) {
        const url = `${this._url}/api/support`;
        $$1.ajax({
            url: url,
            type: "POST",
            data: data,
            contentType: "text/plain",
            dataType: "text",

            success: function(response) {
                onSuccess(response);
            },
        }).fail(xhr => {
            gui_log(i18n$1.getMessage('buildServerFailure', [`HTTP ${xhr.status}`]));
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    requestBuild(request, onSuccess, onFailure) {
        const url = `${this._url}/api/builds`;
        $$1.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(request),
            contentType: "application/json",
            dataType: "json",

            success: function(response) {
                onSuccess(response);
            },
        }).fail(xhr => {
            gui_log(i18n$1.getMessage('buildServerFailure', [url, `HTTP ${xhr.status}`]));
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    requestBuildStatus(key, onSuccess, onFailure) {
        const url = `${this._url}/api/builds/${key}/status`;
        $$1.get(url, function (data) {
            gui_log(i18n$1.getMessage('buildServerSuccess', [url]));
            onSuccess(data);
        }).fail(xhr => {
            gui_log(i18n$1.getMessage('buildServerFailure', [url, `HTTP ${xhr.status}`]));
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    requestBuildOptions(key, onSuccess, onFailure) {
        const url = `${this._url}/api/builds/${key}/json`;
        $$1.get(url, function (data) {
            onSuccess(data);
        }).fail(xhr => {
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    loadOptions(release, onSuccess, onFailure) {
        const url = `${this._url}/api/options/${release}`;
        this.load(url, onSuccess, onFailure);
    }

    loadOptionsByBuildKey(release, key, onSuccess, onFailure) {
        const url = `${this._url}/api/options/${release}/${key}`;
        this.load(url, onSuccess, onFailure);
    }

    loadCommits(release, onSuccess, onFailure) {
        const url = `${this._url}/api/releases/${release}/commits`;
        this.load(url, onSuccess, onFailure);
    }

    loadConfiguratorRelease(type, onSuccess, onFailure) {
        const url = `${this._url}/api/configurator/releases/${type}`;
        this.load(url, onSuccess, onFailure);
    }

    loadSponsorTile(mode, page, onSuccess, onFailure) {
        const url = `${this._url}/api/configurator/sponsors/${mode}/${page}`;
        $$1.get(url, function (data) {
            onSuccess(data);
        }).fail(xhr => {
            if (onFailure !== undefined) {
                onFailure();
            }
        });
    }

    sendAnalytics(type, parcel) {
        const url = `${this._url}/analytics/${type}`;
        $$1.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(parcel),
            contentType: "application/json",
            dataType: "json",
        });
    }
}

let tracking = null;

function createAnalytics(settings) {
    tracking = new Analytics(settings);
}


function setupAnalytics(result) {
    const uid = new ShortUniqueId();

    let userId;
    if (result.userId) {
        userId = result.userId;
    } else {
        userId = uid.randomUUID(13);
        set$1({ 'userId': userId });
    }

    const optOut = !!result.analyticsOptOut;
    const checkForDebugVersions = !!result.checkForConfiguratorUnstableVersions;

    const settings = {
        sessionId: uid.randomUUID(16),
        userId: userId,
        appName:  CONFIGURATOR.productName,
        appVersion: CONFIGURATOR.version,
        gitRevision: CONFIGURATOR.gitRevision,
        os: GUI.operating_system,
        checkForDebugVersions: checkForDebugVersions,
        optOut: optOut,
        buildType: GUI.Mode,
    };

    createAnalytics(settings);
    window.tracking = tracking;

    function logException(exception) {
        tracking.sendException(exception.stack);
    }

    if (typeof process === "object") {
        process.on('uncaughtException', logException);
    }

    tracking.sendEvent(tracking.EVENT_CATEGORIES.APPLICATION, 'AppStart', { sessionControl: 'start' });

    $$1('.connect_b a.connect').removeClass('disabled');
    $$1('.firmware_b a.flash').removeClass('disabled');
}

function checkSetupAnalytics(callback) {
    if (!tracking) {
        const result = get$1(['userId', 'analyticsOptOut', 'checkForConfiguratorUnstableVersions' ]);
        setupAnalytics(result);
    }

    if (callback) {
        callback(tracking);
    }
}

class Analytics {

    constructor (settings) {

        this.setOptOut(settings.optOut);

        this._settings = settings;
        this._api = new BuildApi();

        this.EVENT_CATEGORIES = {
            APPLICATION: 'Application',
            FLIGHT_CONTROLLER: 'FlightController',
            FLASHING: 'Flashing',
        };

        this.sendSettings();
    }

    send(name, properties) {
        if (this._optOut) {
            return;
        }

        this._api.sendAnalytics(name, {
            sessionId: this._settings.sessionId,
            userId: this._settings.userId,
            [name]: properties,
        });
    }

    sendSettings() {
        this.send('settings', this._settings);
    }

    sendEvent(category, action, options) {
        this.send('event', { category: category, action: action, options: options });
    }

    sendChangeEvents(category, changeList) {
        this.sendEvent(category, 'Change', { changes: changeList });
    }

    sendSaveAndChangeEvents(category, changeList, tabName) {
        this.sendEvent(category, 'Save', { tab: tabName, changes: changeList });
    }

    sendAppView(viewName) {
        this.send('view', viewName);
    }

    sendTiming(category, timing, value) {
        this.send('timing', { category: category, timing: timing, value: value });
    }

    sendException(message) {
        this.send('exception', message);
    }

    setOptOut(optOut) {
        this._optOut = !!optOut;
    }
}

const Features = function (config) {
    const self = this;

    const features = [
        {bit: 0, group: 'rxMode', mode: 'select', name: 'RX_PPM'},
        {bit: 2, group: 'other', name: 'INFLIGHT_ACC_CAL'},
        {bit: 3, group: 'rxMode', mode: 'select', name: 'RX_SERIAL'},
        {bit: 4, group: 'escMotorStop', name: 'MOTOR_STOP'},
        {bit: 5, group: 'other', name: 'SERVO_TILT', haveTip: true, dependsOn: 'SERVOS'},
        {bit: 6, group: 'other', name: 'SOFTSERIAL', haveTip: true},
        {bit: 7, group: 'other', name: 'GPS', haveTip: true, dependsOn: 'GPS'},
        {bit: 9, group: 'other', name: 'SONAR', haveTip: true, dependsOn: 'RANGEFINDER'},
        {bit: 10, group: 'telemetry', name: 'TELEMETRY', haveTip: true, dependsOn: 'TELEMETRY'},
        {bit: 12, group: '3D', name: '3D', haveTip: true},
        {bit: 13, group: 'rxMode', mode: 'select', name: 'RX_PARALLEL_PWM'},
        {bit: 14, group: 'rxMode', mode: 'select', name: 'RX_MSP'},
        {bit: 15, group: 'rssi', name: 'RSSI_ADC'},
        {bit: 16, group: 'other', name: 'LED_STRIP', haveTip: true, dependsOn: 'LED_STRIP'},
        {bit: 17, group: 'other', name: 'DISPLAY', haveTip: true, dependsOn: 'DASHBOARD'},
        {bit: 18, group: 'other', name: 'OSD', haveTip: true, dependsOn: 'OSD'},
        {bit: 20, group: 'other', name: 'CHANNEL_FORWARDING', dependsOn: 'SERVOS'},
        {bit: 21, group: 'other', name: 'TRANSPONDER', haveTip: true, dependsOn: 'TRANSPONDER'},
        {bit: 22, group: 'other', name: 'AIRMODE'},
        {bit: 25, group: 'rxMode', mode: 'select', name: 'RX_SPI'},
        {bit: 27, group: 'escSensor', name: 'ESC_SENSOR'},
        {bit: 28, group: 'antiGravity', name: 'ANTI_GRAVITY', haveTip: true, hideName: true},
    ];

    if (semver.lt(config.apiVersion, API_VERSION_1_44)) { // DYNAMIC_FILTER got removed from FEATURES in BF 4.3 / API 1.44
        features.push(
            {bit: 29, group: 'other', name: 'DYNAMIC_FILTER'},
        );
    }

    self._features = features;

    // Filter features based on build options
    if (semver.gte(config.apiVersion, API_VERSION_1_45) && config.buildOptions.length) {
        self._features = [];

        for (const feature of features) {
            if (config.buildOptions.some(opt => opt.includes(feature.dependsOn)) || feature.dependsOn === undefined) {
                self._features.push(feature);
            }
        }
    }

    // Add TELEMETRY feature if any of the following protocols are used: CRSF, GHST, FPORT
    if (semver.gte(config.apiVersion, API_VERSION_1_46)) {
        let enableTelemetry = false;
        if (config.buildOptions.some(opt => opt.includes('CRSF') || opt.includes('GHST') || opt.includes('FPORT'))) {
            enableTelemetry = true;
        }

        if (enableTelemetry) {
            self._features.push({bit: 10, group: 'telemetry', name: 'TELEMETRY', haveTip: true, dependsOn: 'TELEMETRY'});
        }
    }

    self._features.sort((a, b) => a.name.localeCompare(b.name, window.navigator.language, { ignorePunctuation: true }));
    self._featureMask = 0;

    self._analyticsChanges = {};
};

Features.prototype.getMask = function () {
    const self = this;

    tracking.sendChangeEvents(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, self._analyticsChanges);
    self._analyticsChanges = {};

    return self._featureMask;
};

Features.prototype.setMask = function (featureMask) {
    const self = this;

    self._featureMask = featureMask;
};

Features.prototype.isEnabled = function (featureName) {
    const self = this;

    for (const element of self._features) {
        if (element.name === featureName && bit_check(self._featureMask, element.bit)) {
            return true;
        }
    }
    return false;
};

Features.prototype.enable = function (featureName) {
    const self = this;

    for (const element of self._features) {
        if (element.name === featureName) {
            self._featureMask = bit_set(self._featureMask, element.bit);
        }
    }
};

Features.prototype.disable = function (featureName) {
    const self = this;

    for (const element of self._features) {
        if (element.name === featureName) {
            self._featureMask = bit_clear(self._featureMask, element.bit);
        }
    }
};

Features.prototype.generateElements = function (featuresElements) {
    const self = this;

    self._featureChanges = {};

    const listElements = [];

    for (const feature of self._features) {
        let feature_tip_html = '';
        const featureName = feature.name;
        const featureBit = feature.bit;

        if (feature.haveTip) {
            feature_tip_html = `<div class="helpicon cf_tip" i18n_title="feature${featureName}Tip"></div>`;
        }

        const newElements = [];

        if (feature.mode === 'select') {
            if (listElements.length === 0) {
                newElements.push($$1('<option class="feature" value="-1" i18n="featureNone" />'));
            }
            const newElement = $$1(`<option class="feature" id="feature${featureBit}" name="${featureName}" value="${featureBit}" i18n="feature${featureName}" />`);

            newElements.push(newElement);
            listElements.push(newElement);
        } else {
            let newFeatureName = '';
            if (!feature.hideName) {
                newFeatureName = `<td><div>${featureName}</div></td>`;
            }

            let element = `<tr><td><input class="feature toggle" id="feature${featureBit}"`;
            element += `name="${featureName}" title="${featureName}"`;
            element += `type="checkbox"/></td><td><div>${newFeatureName}</div>`;
            element += `<span class="xs" i18n="feature${featureName}"></span></td>`;
            element += `<td><span class="sm-min" i18n="feature${featureName}"></span>`;
            if (feature.haveTip) {
                element += feature_tip_html;
            }
            element += '</td></tr>';

            const newElement = $$1(element);

            const featureElement = newElement.find('input.feature');

            featureElement.prop('checked', bit_check(self._featureMask, featureBit));
            featureElement.data('bit', featureBit);

            newElements.push(newElement);
        }

        featuresElements.each(function () {
            if ($$1(this).hasClass(feature.group)) {
                $$1(this).append(newElements);
            }
        });
    }

    for (const element of listElements) {
        const bit = parseInt(element.attr('value'));
        const state = bit_check(self._featureMask, bit);

        element.prop('selected', state);
    }
};

Features.prototype.findFeatureByBit = function (bit) {
    const self = this;

    for (const feature of self._features) {
        if (feature.bit === bit) {
            return feature;
        }
    }
};

Features.prototype.updateData = function (featureElement) {
    const self = this;

    if (featureElement.attr('type') === 'checkbox') {
        const bit = featureElement.data('bit');
        let featureValue;

        if (featureElement.is(':checked')) {
            self._featureMask = bit_set(self._featureMask, bit);
            featureValue = 'On';
        } else {
            self._featureMask = bit_clear(self._featureMask, bit);
            featureValue = 'Off';
        }
        self._analyticsChanges[`Feature${self.findFeatureByBit(bit).name}`] = featureValue;
    } else if (featureElement.prop('localName') === 'select') {
        const controlElements = featureElement.children();
        const selectedBit = featureElement.val();
        if (selectedBit !== -1) {
            let selectedFeature;
            for (const controlElement of controlElements) {
                const bit = controlElement.value;
                if (selectedBit === bit) {
                    self._featureMask = bit_set(self._featureMask, bit);
                    selectedFeature = self.findFeatureByBit(bit);
                } else {
                    self._featureMask = bit_clear(self._featureMask, bit);
                }
            }
            if (selectedFeature) {
                self._analyticsChanges[`FeatureGroup-${selectedFeature.group}`] = selectedFeature.name;
            }
        }
    }
};

class Beepers {
    constructor(config, supportedConditions) {
        const self = this;

        const beepers = [
            { bit: 0, name: 'GYRO_CALIBRATED', visible: true },
            { bit: 1, name: 'RX_LOST', visible: true },
            { bit: 2, name: 'RX_LOST_LANDING', visible: true },
            { bit: 3, name: 'DISARMING', visible: true },
            { bit: 4, name: 'ARMING', visible: true },
            { bit: 5, name: 'ARMING_GPS_FIX', visible: true },
            { bit: 6, name: 'BAT_CRIT_LOW', visible: true },
            { bit: 7, name: 'BAT_LOW', visible: true },
            { bit: 8, name: 'GPS_STATUS', visible: true },
            { bit: 9, name: 'RX_SET', visible: true },
            { bit: 10, name: 'ACC_CALIBRATION', visible: true },
            { bit: 11, name: 'ACC_CALIBRATION_FAIL', visible: true },
            { bit: 12, name: 'READY_BEEP', visible: true },
            { bit: 13, name: 'MULTI_BEEPS', visible: false },
            { bit: 14, name: 'DISARM_REPEAT', visible: true },
            { bit: 15, name: 'ARMED', visible: true },
            { bit: 16, name: 'SYSTEM_INIT', visible: true },
            { bit: 17, name: 'USB', visible: true },
            { bit: 18, name: 'BLACKBOX_ERASE', visible: true },
            { bit: 19, name: 'CRASH_FLIP', visible: true },
            { bit: 20, name: 'CAM_CONNECTION_OPEN', visible: true },
            { bit: 21, name: 'CAM_CONNECTION_CLOSE', visible: true },
            { bit: 22, name: 'RC_SMOOTHING_INIT_FAIL', visible: true },
        ];

        if (supportedConditions) {
            self._beepers = [];
            beepers.forEach(function (beeper) {
                if (supportedConditions.some(function (supportedCondition) {
                    return supportedCondition === beeper.name;
                })) {
                    self._beepers.push(beeper);
                }
            });
        } else {
            self._beepers = beepers.slice();
        }

        self._beeperDisabledMask = 0;
    }
    getDisabledMask() {
        const self = this;

        return self._beeperDisabledMask;
    }
    setDisabledMask(beeperDisabledMask) {
        const self = this;

        self._beeperDisabledMask = beeperDisabledMask;
    }
    isEnabled(beeperName) {
        const self = this;

        for (let i = 0; i < self._beepers.length; i++) {
            if (self._beepers[i].name === beeperName && bit_check(self._beeperOfMask, self._beepers[i].bit)) {
                return true;
            }
        }
        return false;
    }
    generateElements(template, destination) {
        const self = this;

        for (let i = 0; i < self._beepers.length; i++) {
            if (self._beepers[i].visible) {
                const element = template.clone();
                destination.append(element);

                const inputElement = $$1(element).find('input');
                const labelElement = $$1(element).find('div');
                const spanElement = $$1(element).find('span');

                inputElement.attr('id', `beeper-${i}`);
                inputElement.attr('name', self._beepers[i].name);
                inputElement.attr('title', self._beepers[i].name);
                inputElement.prop('checked', !bit_check(self._beeperDisabledMask, self._beepers[i].bit));
                inputElement.data('bit', self._beepers[i].bit);

                labelElement.text(self._beepers[i].name);

                spanElement.attr('i18n', `beeper${self._beepers[i].name}`);

                element.show();
            }
        }
    }
    updateData(beeperElement) {
        const self = this;

        if (beeperElement.attr('type') === 'checkbox') {
            const bit = beeperElement.data('bit');

            if (beeperElement.is(':checked')) {
                self._beeperDisabledMask = bit_clear(self._beeperDisabledMask, bit);
            } else {
                self._beeperDisabledMask = bit_set(self._beeperDisabledMask, bit);
            }
        }
    }
}

const VirtualFC = {
    // these values are manufactured to unlock all the functionality of the configurator, they dont represent actual hardware
    setVirtualConfig() {
        const virtualFC = FC;

        virtualFC.resetState();
        virtualFC.CONFIG.deviceIdentifier = 0;

        virtualFC.CONFIG.flightControllerVersion = "4.5.0";
        virtualFC.CONFIG.apiVersion = CONFIGURATOR.virtualApiVersion;

        virtualFC.CONFIG.cpuTemp = 48;

        virtualFC.CONFIG.buildInfo = "now";

        virtualFC.CONFIG.craftName = "BetaFlight" ;
        virtualFC.CONFIG.pilotName = "BF pilot" ;

        virtualFC.FEATURE_CONFIG.features = new Features(FC.CONFIG);
        virtualFC.FEATURE_CONFIG.features.setMask(0);
        virtualFC.FEATURE_CONFIG.features.enable('ESC_SENSOR');
        virtualFC.FEATURE_CONFIG.features.enable('GPS');
        virtualFC.FEATURE_CONFIG.features.enable('LED_STRIP');
        virtualFC.FEATURE_CONFIG.features.enable('OSD');
        virtualFC.FEATURE_CONFIG.features.enable('SONAR');
        virtualFC.FEATURE_CONFIG.features.enable('TELEMETRY');
        virtualFC.FEATURE_CONFIG.features.enable('TRANSPONDER');

        virtualFC.BEEPER_CONFIG.beepers = new Beepers(FC.CONFIG);
        virtualFC.BEEPER_CONFIG.dshotBeaconConditions = new Beepers(FC.CONFIG, [ "RX_LOST", "RX_SET" ]);

        virtualFC.MIXER_CONFIG.mixer = 3;

        virtualFC.MOTOR_DATA = Array.from({length: 8});
        virtualFC.MOTOR_3D_CONFIG = {
            deadband3d_low: 1406,
            deadband3d_high: 1514,
            neutral: 1460,
        };
        virtualFC.MOTOR_CONFIG = {
            minthrottle: 1070,
            maxthrottle: 2000,
            mincommand: 1000,
            motor_count: 4,
            motor_poles: 14,
            use_dshot_telemetry: true,
            use_esc_sensor: false,
        };

        virtualFC.SERVO_CONFIG = Array.from({length: 8});

        for (let i = 0; i < virtualFC.SERVO_CONFIG.length; i++) {
            virtualFC.SERVO_CONFIG[i] = {
                middle: 1500,
                min: 1000,
                max: 2000,
                indexOfChannelToForward: 255,
                rate: 100,
                reversedInputSources: 0,
            };
        }

        virtualFC.ADJUSTMENT_RANGES = Array.from({length: 16});

        for (let i = 0; i < virtualFC.ADJUSTMENT_RANGES.length; i++) {
            virtualFC.ADJUSTMENT_RANGES[i] = {
                slotIndex: 0,
                auxChannelIndex: 0,
                range: {
                    start: 900,
                    end: 900,
                },
                adjustmentFunction: 0,
                auxSwitchChannelIndex: 0,
            };
        }

        virtualFC.SERIAL_CONFIG.ports = Array.from({length: 6});

        virtualFC.SERIAL_CONFIG.ports[0] = {
            identifier: 20,
            auxChannelIndex: 0,
            functions: ["MSP"],
            msp_baudrate: 115200,
            gps_baudrate: 57600,
            telemetry_baudrate: "AUTO",
            blackbox_baudrate: 115200,
        };

        for (let i = 1; i < virtualFC.SERIAL_CONFIG.ports.length; i++) {
            virtualFC.SERIAL_CONFIG.ports[i] = {
                identifier: i-1,
                auxChannelIndex: 0,
                functions: [],
                msp_baudrate: 115200,
                gps_baudrate: 57600,
                telemetry_baudrate: "AUTO",
                blackbox_baudrate: 115200,
            };
        }

        virtualFC.LED_STRIP = Array.from({length: 256});

        for (let i = 0; i < virtualFC.LED_STRIP.length; i++) {
            virtualFC.LED_STRIP[i] = {
                x: 0,
                y: 0,
                functions: ["c"],
                color: 0,
                directions: [],
                parameters: 0,
            };
        }

        virtualFC.ANALOG = {
            voltage: 12,
            mAhdrawn: 1200,
            rssi: 100,
            amperage: 3,
        };

        virtualFC.CONFIG.sampleRateHz  = 12000;
        virtualFC.PID_ADVANCED_CONFIG.pid_process_denom = 2;

        virtualFC.BLACKBOX.supported = true;

        virtualFC.BATTERY_CONFIG = {
            vbatmincellvoltage: 3.7,
            vbatmaxcellvoltage: 4.3,
            vbatwarningcellvoltage: 3.8,
            capacity: 5000,
            voltageMeterSource: 2,
            currentMeterSource: 3,
        };

        virtualFC.BATTERY_STATE = {
            cellCount: 4,
            voltage: 16.1,
            mAhDrawn: 3000,
            amperage: 2,
        };

        virtualFC.DATAFLASH = {
            ready: true,
            supported: true,
            sectors: 1024,
            totalSize: 40000,
            usedSize: 10000,
        };

        virtualFC.SDCARD = {
            supported: true,
            state: 1,
            freeSizeKB: 1024,
            totalSizeKB: 2048,
        };

        virtualFC.SENSOR_DATA = { ...FC.SENSOR_DATA };

        virtualFC.RC = {
            channels: Array.from({length: 16}),
            active_channels: 16,
        };
        for (let i = 0; i < virtualFC.RC.channels.length; i++) {
            virtualFC.RC.channels[i] = 1500;
        }

        // from https://betaflight.com/docs/development/Modes or msp/msp_box.c
        virtualFC.AUX_CONFIG = ["ARM","ANGLE","HORIZON","ANTI GRAVITY","MAG","HEADFREE","HEADADJ","CAMSTAB","PASSTHRU","BEEPERON","LEDLOW","CALIB",
        "OSD","TELEMETRY","SERVO1","SERVO2","SERVO3","BLACKBOX","FAILSAFE","AIR MODE","3D","FPV ANGLE MIX","BLACKBOX ERASE","CAMERA CONTROL 1",
        "CAMERA CONTROL 2","CAMERA CONTROL 3","FLIP OVER AFTER CRASH","BOXPREARM","BEEP GPS SATELLITE COUNT","VTX PIT MODE","USER1","USER2",
        "USER3","USER4","PID AUDIO","PARALYZE","GPS RESCUE","ACRO TRAINER","DISABLE VTX CONTROL","LAUNCH CONTROL", "MSP OVERRIDE", "STICK COMMANDS DISABLE",
        "BEEPER MUTE", "READY", "LAP TIMER RESET"];
        FC.AUX_CONFIG_IDS = [0,1,2,4,5,6,7,8,12,13,15,17,19,20,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54];

        for (let i = 0; i < 16; i++) {
            virtualFC.RXFAIL_CONFIG[i] = {
                mode: 1,
                value: 1500,
            };
        }

        // 11 1111 (pass bitchecks)
        virtualFC.CONFIG.activeSensors = 63;

        virtualFC.SENSOR_CONFIG_ACTIVE = {
            gyro_hardware: 2,           // MPU6050
            acc_hardware: 3,            // MPU6050
            baro_hardware: 4,           // BMP280
            mag_hardware: 5,            // QMC5883
            sonar_hardware: 1,          // HCSR04
        };

        virtualFC.SENSOR_DATA.sonars = 231;

        virtualFC.GPS_CONFIG = {
            provider: 1,
            ublox_sbas: 1,
            auto_config: 1,
            auto_baud: 0,
            home_point_once: 1,
            ublox_use_galileo: 1,
        };

        virtualFC.GPS_DATA = sampleGpsData;
    },

    setupVirtualOSD() {
        const virtualOSD = OSD;

        virtualOSD.data.video_system = 1;       // PAL
        virtualOSD.data.unit_mode = 1;          // METRIC

        virtualOSD.virtualMode = {
            itemPositions: Array.from({length: 77}),
            statisticsState: [],
            warningFlags: 0,
            timerData: [],
        };

        virtualOSD.data.state = {
            haveMax7456Configured: true,
            haveOsdFeature: true,
            haveMax7456FontDeviceConfigured: true,
            isMax7456FontDeviceDetected: true,
            haveSomeOsd: true,
        };

        virtualOSD.data.parameters = {
            cameraFrameWidth: 30,
            cameraFrameHeight: 30,
        };

        virtualOSD.data.osd_profiles = {
            number: 3,
            selected: 0,
        };

        virtualOSD.data.alarms = {
            rssi: { display_name: i18n$1.getMessage('osdTimerAlarmOptionRssi'), value: 0 },
            cap: { display_name: i18n$1.getMessage('osdTimerAlarmOptionCapacity'), value: 0 },
            alt: { display_name: i18n$1.getMessage('osdTimerAlarmOptionAltitude'), value: 0 },
            time: { display_name: 'Minutes', value: 0 },
        };
    },
};

const sampleGpsData = {
    "fix": 2,
    "numSat": 10,
    "lat": 474919409,
    "lon": 190539766,
    "alt": 0,
    "speed": 0,
    "ground_course": 1337,
    "positionalDop": 0,
    "distanceToHome": 0,
    "directionToHome": 0,
    "update": 0,
    "chn": [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 6, 6, 6, 6, 6, 6, 6, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
    "svid": [1, 2, 10, 15, 18, 23, 26, 123, 136, 1, 15, 2, 3, 4, 9, 10, 16, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "quality": [3, 95, 95, 95, 95, 95, 95, 23, 23, 1, 31, 20, 31, 23, 20, 17, 31, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "cno": [27, 37, 43, 37, 34, 47, 44, 42, 39, 0, 40, 24, 40, 35, 26, 0, 35, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

/**
 * Takes an ImageData object and returns an MCM symbol as an array of strings.
 *
 * @param {ImageData} data
 */
function imageToCharacter(data) {
    const char = [];
    let line = "";
    for (let i = 0, I = data.length; i < I; i += 4) {
        const rgbPixel = data.slice(i, i + 3),
            colorKey = rgbPixel.join("-");
        line += this.constants.MCM_COLORMAP[colorKey]
            || this.constants.MCM_COLORMAP['default'];
        if (line.length === 8) {
            char.push(line);
            line = "";
        }
    }
    const fieldSize = this.font.constants.SIZES.MAX_NVM_FONT_CHAR_FIELD_SIZE;
    if (char.length < fieldSize) {
        const pad = this.constants.MCM_COLORMAP['default'].repeat(4);
        for (let i = 0, I = fieldSize - char.length; i < I; i++) {
            char.push(pad);
        }
    }
    return char;
}

/**
 * Takes an OSD symbol as an array of strings and replaces the in-memory character at charAddress with it.
 *
 * @param {Array<String>} lines
 * @param {Number} charAddress
 */
function replaceChar(lines, charAddress) {
    const characterBits = [],
        characterBytes = [];
    for (let n = 0, N = lines.length; n < N; n++) {
        const line = lines[n];
        for (let y = 0; y < 8; y = y + 2) {
            characterBits.push(parseInt(line.slice(y, y + 2), 2));
        }
        characterBytes.push(parseInt(line, 2));
    }
    this.font.data.characters[charAddress] = characterBits;
    this.font.data.characters_bytes[charAddress] = characterBytes;
    this.font.data.character_image_urls[charAddress] = null;
    this.font.draw(charAddress);
}

/**
 * Validate image using defined constraints and display results on the UI.
 *
 * @param {HTMLImageElement} img
 */
function validateImage(img) {
    return new Promise((resolveValidateImage, rejectValidateImage) => {
        this.resetImageInfo();
        for (const key in this.constraints) {
            if (!this.constraints.hasOwnProperty(key)) {
                continue;
            }
            const constraint = this.constraints[key],
                satisfied = constraint.test(img);
            if (satisfied) {
                this.showConstraintSatisfied(constraint);
            } else {
                this.showConstraintNotSatisfied(constraint);
                rejectValidateImage("Boot logo image constraint violation");
                return;
            }
        }
        resolveValidateImage();
    });
}

const LogoManager = {
    // dependencies set by init()
    font: null,
    logoStartIndex: null,
    // DOM elements to cache
    elements: {
        preview: "#font-logo-preview",
        uploadHint: "#font-logo-info-upload-hint",
    },
    // predefined values for handling the logo image
    constants: {
        TILES_NUM_HORIZ: 24,
        TILES_NUM_VERT: 4,
        MCM_COLORMAP: {
            // background
            '0-255-0': '01',
            // black
            '0-0-0': '00',
            // white
            '255-255-255': '10',
            // fallback
            'default': '01',
        },
    },
    // config for logo image selection dialog
    acceptFileTypes: [
        { description: 'images', extensions: ['png', 'bmp'] },
    ],
};

/**
 * Initialize Logo Manager UI with dependencies.
 *
 * @param {FONT} font
 * @param {number} logoStartIndex
 */
LogoManager.init = function (font, logoStartIndex) {
    // custom logo image constraints
    this.constraints = {
        // test for image size
        imageSize: {
            el: "#font-logo-info-size",
            // calculate logo image size at runtime as it may change conditionally in the future
            expectedWidth: font.constants.SIZES.CHAR_WIDTH
                * this.constants.TILES_NUM_HORIZ,
            expectedHeight: font.constants.SIZES.CHAR_HEIGHT
                * this.constants.TILES_NUM_VERT,
            /**
             * @param {HTMLImageElement} img
             */
            test: img => {
                const constraint = this.constraints.imageSize;
                if (img.width !== constraint.expectedWidth
                    || img.height !== constraint.expectedHeight) {
                    gui_log(i18n$1.getMessage("osdSetupCustomLogoImageSizeError", {
                        width: img.width,
                        height: img.height,
                    }));
                    return false;
                }
                return true;
            },
        },
        // test for pixel colors
        colorMap: {
            el: "#font-logo-info-colors",
            /**
             * @param {HTMLImageElement} img
             */
            test: img => {
                const canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                for (let y = 0, Y = canvas.height; y < Y; y++) {
                    for (let x = 0, X = canvas.width; x < X; x++) {
                        const rgbPixel = ctx.getImageData(x, y, 1, 1).data.slice(0, 3),
                            colorKey = rgbPixel.join("-");
                        if (!this.constants.MCM_COLORMAP[colorKey]) {
                            gui_log(i18n$1.getMessage("osdSetupCustomLogoColorMapError", {
                                valueR: rgbPixel[0],
                                valueG: rgbPixel[1],
                                valueB: rgbPixel[2],
                                posX: x,
                                posY: y,
                            }));
                            return false;
                        }
                    }
                }
                return true;
            },
        },
    };

    // deps from osd.js
    this.font = font;
    this.logoStartIndex = logoStartIndex;
    // inject logo size variables for dynamic translation strings
    i18n$1.addResources({
        logoWidthPx: `${this.constraints.imageSize.expectedWidth}`, // NOSONAR
        logoHeightPx: `${this.constraints.imageSize.expectedHeight}`, // NOSONAR
    });
    // find/cache DOM elements
    Object.keys(this.elements).forEach(key => {
        this.elements[`$${key}`] = $$1(this.elements[key]);
    });
    Object.keys(this.constraints).forEach(key => {
        this.constraints[key].$el = $$1(this.constraints[key].el);
    });
    // resize logo preview area to match tile size
    this.elements.$preview
        .width(this.constraints.imageSize.expectedWidth)
        .height(this.constraints.imageSize.expectedHeight);
    this.resetImageInfo();
};

LogoManager.resetImageInfo = function () {
    this.hideUploadHint();
    Object.values(this.constraints).forEach(constraint => {
        const $el = constraint.$el;
        $el.toggleClass("invalid", false);
        $el.toggleClass("valid", false);
    });
};

LogoManager.showConstraintNotSatisfied = constraint => {
    constraint.$el.toggleClass("invalid", true);
};

LogoManager.showConstraintSatisfied = constraint => {
    constraint.$el.toggleClass("valid", true);
};

LogoManager.showUploadHint = function () {
    this.elements.$uploadHint.show();
};

LogoManager.hideUploadHint = function () {
    this.elements.$uploadHint.hide();
};

/**
 * Show a file open dialog and resolve to an Image object.
 *
 * @returns {Promise}
 */
LogoManager.openImage = function () {
    return new Promise((resolveOpenImage, rejectOpenImage) => {
        const dialogOptions = {
            type: 'openFile',
            accepts: this.acceptFileTypes,
        };
        chrome.fileSystem.chooseEntry(dialogOptions, fileEntry => {
            if (checkChromeRuntimeError()) {
                return;
            }
            if (!fileEntry) {
                rejectOpenImage(new Error('No image selected'));
                return;
            }
            // load and validate selected image
            const img = new Image();
            fileEntry.file(file => {
                const imageUrl = file.path ? `file://${file.path}` : URL.createObjectURL(file);
                const cleanupImageUrl = () => {
                    if (!file.path) {
                        URL.revokeObjectURL(imageUrl);
                    }
                };

                img.onload = () => {
                    cleanupImageUrl();
                    validateImage.apply(this, [img])
                        .then(() => resolveOpenImage(img))
                        .catch(error => rejectOpenImage(error));
                };
                img.onerror = error => {
                    cleanupImageUrl();
                    rejectOpenImage(error);
                };
                img.src = imageUrl;
            });
        });
    });
};

/**
 * Replaces the logo in the loaded font based on an image.
 *
 * @param {HTMLImageElement} img
 */
LogoManager.replaceLogoInFont = function (img) {
    // loop through an image and replace font symbols
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    let charAddr = this.logoStartIndex;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    for (let y = 0; y < this.constants.TILES_NUM_VERT; y++) {
        for (let x = 0; x < this.constants.TILES_NUM_HORIZ; x++) {
            const imageData = ctx.getImageData(
                x * this.font.constants.SIZES.CHAR_WIDTH,
                y * this.font.constants.SIZES.CHAR_HEIGHT,
                this.font.constants.SIZES.CHAR_WIDTH,
                this.font.constants.SIZES.CHAR_HEIGHT,
            ),
                newChar = imageToCharacter.apply(this, [imageData.data]);
            replaceChar.apply(this, [newChar, charAddr]);
            charAddr++;
        }
    }
};

/**
 * Draw the logo using the loaded font data.
 */
LogoManager.drawPreview = function () {
    const $el = this.elements.$preview.empty();
    for (let i = this.logoStartIndex, I = this.font.constants.MAX_CHAR_COUNT; i < I; i++) {
        const url = this.font.data.character_image_urls[i];
        $el.append(`<img src="${url}" title="0x${i.toString(16)}"></img>`);
    }
};

const FONT = {};
const SYM = {};
const OSD = {};

SYM.loadSymbols = function() {
    SYM.BLANK = 0x20;
    SYM.VOLT = 0x06;
    SYM.RSSI = 0x01;
    SYM.LINK_QUALITY = 0x7B;
    SYM.AH_RIGHT = 0x02;
    SYM.AH_LEFT = 0x03;
    SYM.THR = 0x04;
    SYM.FLY_M = 0x9C;
    SYM.ON_M = 0x9B;
    SYM.AH_CENTER_LINE = 0x72;
    SYM.AH_CENTER = 0x73;
    SYM.AH_CENTER_LINE_RIGHT = 0x74;
    SYM.AH_BAR9_0 = 0x80;
    SYM.AH_DECORATION = 0x13;
    SYM.LOGO = 0xA0;
    SYM.AMP = 0x9A;
    SYM.MAH = 0x07;
    SYM.METRE = 0xC;
    SYM.FEET = 0xF;
    SYM.KPH = 0x9E;
    SYM.MPH = 0x9D;
    SYM.MPS = 0x9F;
    SYM.FTPS = 0x99;
    SYM.SPEED = 0x70;
    SYM.TOTAL_DIST = 0x71;
    SYM.GPS_SAT_L = 0x1E;
    SYM.GPS_SAT_R = 0x1F;
    SYM.GPS_LAT = 0x89;
    SYM.GPS_LON = 0x98;
    SYM.HOMEFLAG = 0x11;
    SYM.PB_START = 0x8A;
    SYM.PB_FULL = 0x8B;
    SYM.PB_EMPTY = 0x8D;
    SYM.PB_END = 0x8E;
    SYM.PB_CLOSE = 0x8F;
    SYM.BATTERY = 0x96;
    SYM.ARROW_NORTH = 0x68;
    SYM.ARROW_SOUTH = 0x60;
    SYM.ARROW_EAST = 0x64;
    SYM.ARROW_SMALL_UP = 0x75;
    SYM.ARROW_SMALL_RIGHT = 0x77;
    SYM.HEADING_LINE = 0x1D;
    SYM.HEADING_DIVIDED_LINE = 0x1C;
    SYM.HEADING_N = 0x18;
    SYM.HEADING_S = 0x19;
    SYM.HEADING_E = 0x1A;
    SYM.HEADING_W = 0x1B;
    SYM.TEMPERATURE = 0x7A;
    SYM.TEMP_F = 0x0D;
    SYM.TEMP_C = 0x0E;
    SYM.STICK_OVERLAY_SPRITE_HIGH = 0x08;
    SYM.STICK_OVERLAY_SPRITE_MID = 0x09;
    SYM.STICK_OVERLAY_SPRITE_LOW = 0x0A;
    SYM.STICK_OVERLAY_CENTER = 0x0B;
    SYM.STICK_OVERLAY_VERTICAL = 0x16;
    SYM.STICK_OVERLAY_HORIZONTAL = 0x17;
    SYM.BBLOG = 0x10;
    SYM.ALTITUDE = 0x7F;
    SYM.PITCH = 0x15;
    SYM.ROLL = 0x14;
    SYM.KM = 0x7d;
    SYM.MILES = 0x7e;

    /* Versions before Betaflight 4.1 use font V1
     * To maintain this list at minimum, we only add here:
     * - Symbols used in this versions
     * - That were moved or didn't exist in the font file
     */
    if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
        SYM.AH_CENTER_LINE = 0x26;
        SYM.AH_CENTER = 0x7E;
        SYM.AH_CENTER_LINE_RIGHT = 0x27;
        SYM.SPEED = null;
        SYM.LINK_QUALITY = null;
    }
};

FONT.initData = function() {
    if (FONT.data) {
        return;
    }
    FONT.data = {
        // default font file name
        loaded_font_file: 'default',
        // array of arry of image bytes ready to upload to fc
        characters_bytes: [],
        // array of array of image bits by character
        characters: [],
        // an array of base64 encoded image strings by character
        character_image_urls: [],
    };
};

FONT.constants = {
    MAX_CHAR_COUNT: 256,
    SIZES: {
        /** NVM ram size for one font char, actual character bytes **/
        MAX_NVM_FONT_CHAR_SIZE: 54,
        /** NVM ram field size for one font char, last 10 bytes dont matter **/
        MAX_NVM_FONT_CHAR_FIELD_SIZE: 64,
        CHAR_HEIGHT: 18,
        CHAR_WIDTH: 12,
    },
    COLORS: {
        // black
        0: 'rgba(0, 0, 0, 1)',
        // also the value 3, could yield transparent according to
        // https://www.sparkfun.com/datasheets/BreakoutBoards/MAX7456.pdf
        1: 'rgba(255, 255, 255, 0)',
        // white
        2: 'rgba(255,255,255, 1)',
    },
};

FONT.pushChar = function(fontCharacterBytes, fontCharacterBits) {
    // Only push full characters onto the stack.
    if (fontCharacterBytes.length !== FONT.constants.SIZES.MAX_NVM_FONT_CHAR_FIELD_SIZE) {
        return;
    }
    FONT.data.characters_bytes.push(fontCharacterBytes.slice(0));
    FONT.data.characters.push(fontCharacterBits.slice(0));
    FONT.draw(FONT.data.characters.length - 1);
};

/**
* Each line is composed of 8 asci 1 or 0, representing 1 bit each for a total of 1 byte per line
*/
FONT.parseMCMFontFile = function(dataFontFile) {
    const data = dataFontFile.trim().split("\n");
    // clear local data
    FONT.data.characters.length = 0;
    FONT.data.characters_bytes.length = 0;
    FONT.data.character_image_urls.length = 0;
    // reset logo image info when font data is changed
    LogoManager.resetImageInfo();
    // make sure the font file is valid
    if (data.shift().trim() !== 'MAX7456') {
        const msg = 'that font file doesnt have the MAX7456 header, giving up';
        console.debug(msg);
        Promise.reject(msg);
    }
    const characterBits = [];
    const characterBytes = [];
    // hexstring is for debugging
    FONT.data.hexstring = [];
    for (let i = 0; i < data.length; i++) {
        const line = data[i];
        // hexstring is for debugging
        FONT.data.hexstring.push(`0x${parseInt(line, 2).toString(16)}`);
        // every 64 bytes (line) is a char, we're counting chars though, which are 2 bits
        if (characterBits.length === FONT.constants.SIZES.MAX_NVM_FONT_CHAR_FIELD_SIZE * (8 / 2)) {
            FONT.pushChar(characterBytes, characterBits);
            characterBits.length = 0;
            characterBytes.length = 0;
        }
        for (let y = 0; y < 8; y = y + 2) {
            const v = parseInt(line.slice(y, y + 2), 2);
            characterBits.push(v);
        }
        characterBytes.push(parseInt(line, 2));
    }
    // push the last char
    FONT.pushChar(characterBytes, characterBits);

    return FONT.data.characters;
};

FONT.openFontFile = function() {
    return new Promise(function(resolve) {
        chrome.fileSystem.chooseEntry({ type: 'openFile', accepts: [{ description: 'MCM files', extensions: ['mcm'] }] }, function(fileEntry) {
            if (checkChromeRuntimeError()) {
                return;
            }

            FONT.data.loaded_font_file = fileEntry.name;
            fileEntry.file(function(file) {
                const reader = new FileReader();
                reader.onloadend = function(e) {
                    if (e.total !== 0 && e.total === e.loaded) {
                        FONT.parseMCMFontFile(e.target.result);
                        resolve();
                    } else {
                        console.error('could not load whole font file');
                    }
                };
                reader.readAsText(file);
            });
        });
    });
};

/**
* returns a canvas image with the character on it
*/
const drawCanvas = function(charAddress) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");

    const pixelSize = 1;
    const width = pixelSize * FONT.constants.SIZES.CHAR_WIDTH;
    const height = pixelSize * FONT.constants.SIZES.CHAR_HEIGHT;

    canvas.width = width;
    canvas.height = height;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!(charAddress in FONT.data.characters)) {
                console.log('charAddress', charAddress, ' is not in ', FONT.data.characters.length);
            }
            const v = FONT.data.characters[charAddress][(y * width) + x];
            ctx.fillStyle = FONT.constants.COLORS[v];
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }
    return canvas;
};

FONT.draw = function(charAddress) {
    let cached = FONT.data.character_image_urls[charAddress];
    if (!cached) {
        cached = FONT.data.character_image_urls[charAddress] = drawCanvas(charAddress).toDataURL('image/png');
    }
    return cached;
};

FONT.msp = {
    encode(charAddress) {
        return [charAddress].concat(FONT.data.characters_bytes[charAddress].slice(0, FONT.constants.SIZES.MAX_NVM_FONT_CHAR_SIZE));
    },
};

FONT.upload = function($progress) {
    return FONT.data.characters
        .reduce(
            (p, x, i) =>
                p.then(() => {
                    $progress.val((i / FONT.data.characters.length) * 100);
                    return MSP$1.promise(
                        MSPCodes.MSP_OSD_CHAR_WRITE,
                        FONT.msp.encode(i),
                    );
                }),
            Promise.resolve(),
        )
        .then(function() {

            console.log(`Uploaded all ${FONT.data.characters.length} characters`);
            gui_log(i18n$1.getMessage('osdSetupUploadingFontEnd', {length: FONT.data.characters.length}));

            OSD.GUI.fontManager.close();

            return MSP$1.promise(MSPCodes.MSP_SET_REBOOT);
        });
};

FONT.preview = function($el) {
    $el.empty();
    for (let i = 0; i < SYM.LOGO; i++) {
        const url = FONT.data.character_image_urls[i];
        $el.append(`<img src="${url}" title="0x${i.toString(16)}"></img>`);
    }
};

FONT.symbol = function(hexVal) {
    return (hexVal === '' || hexVal === null)? '' : String.fromCharCode(hexVal);
};

OSD.getNumberOfProfiles = function() {
    return OSD.data.osd_profiles.number;
};

OSD.getCurrentPreviewProfile = function() {
    const osdprofileElement = $$1('.osdprofile-selector');
    if (osdprofileElement.length > 0) {
        return osdprofileElement.val();
    } else {
        return 0;
    }
};

// parsed fc output and output to fc, used by to OSD.msp.encode
OSD.initData = function() {
    OSD.data = {
        video_system: null,
        unit_mode: null,
        alarms: [],
        statItems: [],
        warnings: [],
        displayItems: [],
        timers: [],
        last_positions: {},
        preview: [],
        tooltips: [],
        osd_profiles: {},
        VIDEO_COLS: {
            PAL: 30,
            NTSC: 30,
            HD: 53,
        },
        VIDEO_ROWS: {
            PAL: 16,
            NTSC: 13,
            HD: 20,
        },
        VIDEO_BUFFER_CHARS: {
            PAL: 480,
            NTSC: 390,
            HD: 1590,
        },
    };
};
OSD.initData();

OSD.getVariantForPreview = function(osdData, elementName) {
    return osdData.displayItems.find(element => element.name === elementName).variant;
};

OSD.generateAltitudePreview = function(osdData) {
    const unit = FONT.symbol(osdData.unit_mode === 0 ? SYM.FEET : SYM.METRE);
    const variantSelected = OSD.getVariantForPreview(osdData, 'ALTITUDE');
    return `${FONT.symbol(SYM.ALTITUDE)}399${variantSelected === 0? '.7' : ''}${unit}`;
};

OSD.generateVTXChannelPreview = function(osdData) {
    const variantSelected = OSD.getVariantForPreview(osdData, 'VTX_CHANNEL');
    let value;
    switch (variantSelected) {
        case 0:
            value = 'R:2:200:P';
            break;

        case 1:
            value = '200';
            break;
    }
    return value;
};

OSD.generateBatteryUsagePreview = function(osdData) {
    const variantSelected = OSD.getVariantForPreview(osdData, 'MAIN_BATT_USAGE');

    let value;
    switch (variantSelected) {
        case 0:
            value = FONT.symbol(SYM.PB_START) + FONT.symbol(SYM.PB_FULL).repeat(9) + FONT.symbol(SYM.PB_END) + FONT.symbol(SYM.PB_EMPTY) + FONT.symbol(SYM.PB_CLOSE);
            break;

        case 1:
            value = FONT.symbol(SYM.PB_START) + FONT.symbol(SYM.PB_FULL).repeat(5) + FONT.symbol(SYM.PB_END) + FONT.symbol(SYM.PB_EMPTY).repeat(5) + FONT.symbol(SYM.PB_CLOSE);
            break;

        case 2:
            value = `${FONT.symbol(SYM.MAH)}67%`;
            break;

        case 3:
            value = `${FONT.symbol(SYM.MAH)}33%`;
            break;

    }
    return value;
};

OSD.generateGpsLatLongPreview = function(osdData, elementName) {

    const variantSelected = OSD.getVariantForPreview(osdData, elementName);

    let value;
    switch (variantSelected) {
        case 0:
            value = elementName === 'GPS_LON' ? `${FONT.symbol(SYM.GPS_LON)}-000.0000000` : `${FONT.symbol(SYM.GPS_LAT)}-00.0000000 `;
            break;

        case 1:
            value = elementName === 'GPS_LON' ? `${FONT.symbol(SYM.GPS_LON)}-000.0000` : `${FONT.symbol(SYM.GPS_LAT)}-00.0000 `;
            break;

        case 2:
            const degreesSymbol = FONT.symbol(SYM.STICK_OVERLAY_SPRITE_HIGH);
            value = elementName === 'GPS_LON' ? `${FONT.symbol(SYM.GPS_LON)}00${degreesSymbol}000'00.0"N` : `${FONT.symbol(SYM.GPS_LAT)}00${degreesSymbol}00'00.0"E `;
            break;

        case 3:
            value = `${FONT.symbol(SYM.GPS_SAT_L)}${FONT.symbol(SYM.GPS_SAT_R)}000000AA+BBB`;
            break;

    }
    return value;
};

OSD.generateTimerPreview = function(osdData, timerIndex) {
    let preview = '';
    switch (osdData.timers[timerIndex].src) {
        case 0:
        case 3:
            preview += FONT.symbol(SYM.ON_M);
            break;
        case 1:
        case 2:
            preview += FONT.symbol(SYM.FLY_M);
            break;
    }
    switch (osdData.timers[timerIndex].precision) {
        case 0:
            preview += '00:00';
            break;
        case 1:
            preview += '00:00.00';
            break;
        case 2:
            preview += '00:00.0';
            break;
    }
    return preview;
};

OSD.generateTemperaturePreview = function(osdData, temperature) {
    let preview = FONT.symbol(SYM.TEMPERATURE);
    switch (osdData.unit_mode) {
        case 0:
            let temperatureConversion = temperature * (9.0 / 5.0);
            temperatureConversion += 32.0;
            preview += Math.floor(temperatureConversion) + FONT.symbol(SYM.TEMP_F);
            break;
        case 1:
        case 2:
            preview += temperature + FONT.symbol(SYM.TEMP_C);
            break;
    }
    return preview;
};

OSD.generateLQPreview = function() {
    const crsfIndex = FC.getSerialRxTypes().findIndex(name => name === 'CRSF');
    const isXF = crsfIndex === FC.RX_CONFIG.serialrx_provider;
    return FONT.symbol(SYM.LINK_QUALITY) + (isXF ? '2:100' : '8');
};

OSD.generateCraftName = function() {
    let preview = 'CRAFT_NAME';

    const craftName = semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)
        ? FC.CONFIG.craftName
        : FC.CONFIG.name;
    if (craftName !== '') {
        preview = craftName.toUpperCase();
    }
    return preview;
};

// for backwards compatibility before API_VERSION_1_45
OSD.generateDisplayName = function() {
  let preview = 'DISPLAY_NAME';
  if (FC.CONFIG.displayName) {
      preview = FC.CONFIG.displayName?.toUpperCase();
  }
  return preview;
};

// added in API_VERSION_1_45
OSD.generatePilotName = function() {
  let preview = 'PILOT_NAME';
  if (FC.CONFIG.pilotName) {
      preview = FC.CONFIG.pilotName?.toUpperCase();
  }
  return preview;
};

OSD.drawStickOverlayPreview = function() {
    function randomInt(count) {
        return Math.floor(Math.random() * Math.floor(count));
    }

    const STICK_OVERLAY_SPRITE = [
        SYM.STICK_OVERLAY_SPRITE_HIGH,
        SYM.STICK_OVERLAY_SPRITE_MID,
        SYM.STICK_OVERLAY_SPRITE_LOW,
    ];

    const OVERLAY_WIDTH = 7;
    const OVERLAY_HEIGHT = 5;

    const stickX = randomInt(OVERLAY_WIDTH);
    const stickY = randomInt(OVERLAY_HEIGHT);
    const stickSymbol = randomInt(3);

    // From 'osdDrawStickOverlayAxis' in 'src/main/io/osd.c'
    const stickOverlay = [];
    for (let x = 0; x < OVERLAY_WIDTH; x++) {
        for (let y = 0; y < OVERLAY_HEIGHT; y++) {

            let symbol = null;

            if (x === stickX && y === stickY) {
                symbol = STICK_OVERLAY_SPRITE[stickSymbol];
            } else if (x === (OVERLAY_WIDTH - 1) / 2 && y === (OVERLAY_HEIGHT - 1) / 2) {
                symbol = SYM.STICK_OVERLAY_CENTER;
            } else if (x === (OVERLAY_WIDTH - 1) / 2) {
                symbol = SYM.STICK_OVERLAY_VERTICAL;
            } else if (y === (OVERLAY_HEIGHT - 1) / 2) {
                symbol = SYM.STICK_OVERLAY_HORIZONTAL;
            }

            if (symbol !== null) {
                const element = {
                    x,
                    y,
                    sym: symbol,
                };
                stickOverlay.push(element);
            }
        }
    }
    return stickOverlay;
};

OSD.drawCameraFramePreview = function() {

    const FRAME_WIDTH = OSD.data.parameters.cameraFrameWidth;
    const FRAME_HEIGHT = OSD.data.parameters.cameraFrameHeight;

    const cameraFrame = [];

    for (let x = 0; x < FRAME_WIDTH; x++) {
        const sym = (x === 0 || x === (FRAME_WIDTH -1)) ? SYM.STICK_OVERLAY_CENTER : SYM.STICK_OVERLAY_HORIZONTAL;
        const frameUp = { x, y : 0, sym };
        const frameDown = { x, y : FRAME_HEIGHT - 1, sym };

        cameraFrame.push(frameUp);
        cameraFrame.push(frameDown);
    }

    for (let y = 1; y < FRAME_HEIGHT - 1; y++) {
        const sym = SYM.STICK_OVERLAY_VERTICAL;
        const frameLeft = { x : 0, y, sym };
        const frameRight = { x : FRAME_WIDTH - 1, y, sym };

        cameraFrame.push(frameLeft);
        cameraFrame.push(frameRight);
    }

    return cameraFrame;
};

OSD.formatPidsPreview = function(axis) {
    const pidDefaults = FC.getPidDefaults();
    const p = pidDefaults[axis * 5].toString().padStart(3);
    const i = pidDefaults[axis * 5 + 1].toString().padStart(3);
    const d = pidDefaults[axis * 5 + 2].toString().padStart(3);
    const f = pidDefaults[axis * 5 + 4].toString().padStart(3);
    if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
        return `${p} ${i} ${d}`;
    } else {
        return `${p} ${i} ${d} ${f}`;
    }
};

OSD.loadDisplayFields = function() {

    let videoType = OSD.constants.VIDEO_TYPES[OSD.data.video_system];

 // All display fields, from every version, do not remove elements, only add!
    OSD.ALL_DISPLAY_FIELDS = {
        MAIN_BATT_VOLTAGE: {
            name: 'MAIN_BATT_VOLTAGE',
            text: 'osdTextElementMainBattVoltage',
            desc: 'osdDescElementMainBattVoltage',
            defaultPosition: -29,
            draw_order: 20,
            positionable: true,
            preview: `${FONT.symbol(SYM.BATTERY)}16.8${FONT.symbol(SYM.VOLT)}`,
        },
        RSSI_VALUE: {
            name: 'RSSI_VALUE',
            text: 'osdTextElementRssiValue',
            desc: 'osdDescElementRssiValue',
            defaultPosition: -59,
            draw_order: 30,
            positionable: true,
            preview: `${FONT.symbol(SYM.RSSI)}99`,
        },
        TIMER: {
            name: 'TIMER',
            text: 'osdTextElementTimer',
            desc: 'osdDescElementTimer',
            defaultPosition: -39,
            positionable: true,
            preview: `${FONT.symbol(SYM.ON_M)} 11:11`,
        },
        THROTTLE_POSITION: {
            name: 'THROTTLE_POSITION',
            text: 'osdTextElementThrottlePosition',
            desc: 'osdDescElementThrottlePosition',
            defaultPosition: -9,
            draw_order: 110,
            positionable: true,
            preview: `${FONT.symbol(SYM.THR)} 69`,
        },
        CPU_LOAD: {
            name: 'CPU_LOAD',
            text: 'osdTextElementCpuLoad',
            desc: 'osdDescElementCpuLoad',
            defaultPosition: 26,
            positionable: true,
            preview: '15',
        },
        VTX_CHANNEL: {
            name: 'VTX_CHANNEL',
            text: 'osdTextElementVtxChannel',
            desc: 'osdDescElementVtxChannel',
            defaultPosition: 1,
            draw_order: 120,
            positionable: true,
            variants: [
                'osdTextElementVTXchannelVariantFull',
                'osdTextElementVTXchannelVariantPower',
            ],
            preview(osdData) {
                return OSD.generateVTXChannelPreview(osdData);
            },
        },
        VOLTAGE_WARNING: {
            name: 'VOLTAGE_WARNING',
            text: 'osdTextElementVoltageWarning',
            desc: 'osdDescElementVoltageWarning',
            defaultPosition: -80,
            positionable: true,
            preview: 'LOW VOLTAGE',
        },
        ARMED: {
            name: 'ARMED',
            text: 'osdTextElementArmed',
            desc: 'osdDescElementArmed',
            defaultPosition: -107,
            positionable: true,
            preview: 'ARMED',
        },
        DISARMED: {
            name: 'DISARMED',
            text: 'osdTextElementDisarmed',
            desc: 'osdDescElementDisarmed',
            defaultPosition: -109,
            draw_order: 280,
            positionable: true,
            preview: 'DISARMED',
        },
        CROSSHAIRS: {
            name: 'CROSSHAIRS',
            text: 'osdTextElementCrosshairs',
            desc: 'osdDescElementCrosshairs',
            defaultPosition() {
                return (OSD.data.VIDEO_COLS[videoType] >> 1) + ((OSD.data.VIDEO_ROWS[videoType] >> 1) - 2) * OSD.data.VIDEO_COLS[videoType] - 2;
            },
            draw_order: 40,
            positionable() {
                return true;
            },
            preview() {
                return FONT.symbol(SYM.AH_CENTER_LINE) + FONT.symbol(SYM.AH_CENTER) + FONT.symbol(SYM.AH_CENTER_LINE_RIGHT);
            },
        },
        ARTIFICIAL_HORIZON: {
            name: 'ARTIFICIAL_HORIZON',
            text: 'osdTextElementArtificialHorizon',
            desc: 'osdDescElementArtificialHorizon',
            defaultPosition() {
                return (OSD.data.VIDEO_COLS[videoType] >> 1) + ((OSD.data.VIDEO_ROWS[videoType] >> 1) - 5) * OSD.data.VIDEO_COLS[videoType] - 1;
            },
            draw_order: 10,
            positionable() {
                return true;
            },
            preview() {
                const artificialHorizon = [];

                for (let j = 1; j < 8; j++) {
                    for (let i = -4; i <= 4; i++) {

                        let element;

                        // Blank char to mark the size of the element
                        if (j !== 4) {
                            element = { x: i, y: j, sym: SYM.BLANK };

                            // Sample of horizon
                        } else {
                            element = { x: i, y: j, sym: SYM.AH_BAR9_0 + 4 };
                        }
                        artificialHorizon.push(element);
                    }
                }
                return artificialHorizon;
            },
        },
        HORIZON_SIDEBARS: {
            name: 'HORIZON_SIDEBARS',
            text: 'osdTextElementHorizonSidebars',
            desc: 'osdDescElementHorizonSidebars',
            defaultPosition() {
                return (OSD.data.VIDEO_COLS[videoType] >> 1) + ((OSD.data.VIDEO_ROWS[videoType] >> 1) - 2) * OSD.data.VIDEO_COLS[videoType] - 1;
            },
            draw_order: 50,
            positionable() {
                return true;
            },
            preview() {

                const horizonSidebar = [];

                const hudwidth = OSD.constants.AHISIDEBARWIDTHPOSITION;
                const hudheight = OSD.constants.AHISIDEBARHEIGHTPOSITION;
                let element;
                for (let i = -hudheight; i <= hudheight; i++) {
                    element = { x: -hudwidth,
                                y: i,
                                sym: SYM.AH_DECORATION,
                              };
                    horizonSidebar.push(element);

                    element = { x: hudwidth, y: i, sym: SYM.AH_DECORATION };
                    horizonSidebar.push(element);
                }

                // AH level indicators
                element = {
                    x: -hudwidth + 1,
                    y: 0,
                    sym: SYM.AH_LEFT,
                };
                horizonSidebar.push(element);

                element = {
                    x: hudwidth - 1,
                    y: 0,
                    sym: SYM.AH_RIGHT,
                };
                horizonSidebar.push(element);

                return horizonSidebar;
            },
        },
        CURRENT_DRAW: {
            name: 'CURRENT_DRAW',
            text: 'osdTextElementCurrentDraw',
            desc: 'osdDescElementCurrentDraw',
            defaultPosition: -23,
            draw_order: 130,
            positionable: true,
            preview() {
                return ` 42.00${FONT.symbol(SYM.AMP)}`;
            },
        },
        MAH_DRAWN: {
            name: 'MAH_DRAWN',
            text: 'osdTextElementMahDrawn',
            desc: 'osdDescElementMahDrawn',
            defaultPosition: -18,
            draw_order: 140,
            positionable: true,
            preview() {
                return ` 690${FONT.symbol(SYM.MAH)}`;
            },
        },
        CRAFT_NAME: {
            name: 'CRAFT_NAME',
            text: 'osdTextElementCraftName',
            desc: 'osdDescElementCraftName',
            defaultPosition: -77,
            draw_order: 150,
            positionable: true,
            preview: OSD.generateCraftName,
        },
        ALTITUDE: {
            name: 'ALTITUDE',
            text: 'osdTextElementAltitude',
            desc: 'osdDescElementAltitude',
            defaultPosition: 62,
            draw_order: 160,
            positionable: true,
            variants: [
                'osdTextElementAltitudeVariant1Decimal',
                'osdTextElementAltitudeVariantNoDecimal',
            ],
            preview(osdData) {
                return OSD.generateAltitudePreview(osdData);
            },
        },
        ONTIME: {
            name: 'ONTIME',
            text: 'osdTextElementOnTime',
            desc: 'osdDescElementOnTime',
            defaultPosition: -1,
            positionable: true,
            preview: `${FONT.symbol(SYM.ON_M)}05:42`,
        },
        FLYTIME: {
            name: 'FLYTIME',
            text: 'osdTextElementFlyTime',
            desc: 'osdDescElementFlyTime',
            defaultPosition: -1,
            positionable: true,
            preview: `${FONT.symbol(SYM.FLY_M)}04:11`,
        },
        FLYMODE: {
            name: 'FLYMODE',
            text: 'osdTextElementFlyMode',
            desc: 'osdDescElementFlyMode',
            defaultPosition: -1,
            draw_order: 90,
            positionable: true,
            preview: 'ANGL',
        },
        GPS_SPEED: {
            name: 'GPS_SPEED',
            text: 'osdTextElementGPSSpeed',
            desc: 'osdDescElementGPSSpeed',
            defaultPosition: -1,
            draw_order: 810,
            positionable: true,
            preview(osdData) {
                const UNIT_METRIC = OSD.constants.UNIT_TYPES.indexOf("METRIC");
                const unit = FONT.symbol(osdData.unit_mode === UNIT_METRIC ? SYM.KPH : SYM.MPH);
                return `${FONT.symbol(SYM.SPEED)}40${unit}`;
            },
        },
        GPS_SATS: {
            name: 'GPS_SATS',
            text: 'osdTextElementGPSSats',
            desc: 'osdDescElementGPSSats',
            defaultPosition: -1,
            draw_order: 800,
            positionable: true,
            preview: `${FONT.symbol(SYM.GPS_SAT_L)}${FONT.symbol(SYM.GPS_SAT_R)}14`,
        },
        GPS_LON: {
            name: 'GPS_LON',
            text: 'osdTextElementGPSLon',
            desc: 'osdDescElementGPSLon',
            defaultPosition: -1,
            draw_order: 830,
            positionable: true,
            variants: [
                'osdTextElementGPSVariant7Decimals',
                'osdTextElementGPSVariant4Decimals',
                'osdTextElementGPSVariantDegMinSec',
                'osdTextElementGPSVariantOpenLocation',
            ],
            preview(osdData) {
                return OSD.generateGpsLatLongPreview(osdData, 'GPS_LON');
            },
        },
        GPS_LAT: {
            name: 'GPS_LAT',
            text: 'osdTextElementGPSLat',
            desc: 'osdDescElementGPSLat',
            defaultPosition: -1,
            draw_order: 820,
            positionable: true,
            variants: [
                'osdTextElementGPSVariant7Decimals',
                'osdTextElementGPSVariant4Decimals',
                'osdTextElementGPSVariantDegMinSec',
                'osdTextElementGPSVariantOpenLocation',
            ],
            preview(osdData) {
                return OSD.generateGpsLatLongPreview(osdData, 'GPS_LAT');
            },
        },
        DEBUG: {
            name: 'DEBUG',
            text: 'osdTextElementDebug',
            desc: 'osdDescElementDebug',
            defaultPosition: -1,
            draw_order: 240,
            positionable: true,
            preview: 'DBG     0     0     0     0',
        },
        PID_ROLL: {
            name: 'PID_ROLL',
            text: 'osdTextElementPIDRoll',
            desc: 'osdDescElementPIDRoll',
            defaultPosition: 0x800 | (10 << 5) | 2, // 0x0800 | (y << 5) | x
            draw_order: 170,
            positionable: true,
            preview: `ROL ${OSD.formatPidsPreview(0)}`,
        },
        PID_PITCH: {
            name: 'PID_PITCH',
            text: 'osdTextElementPIDPitch',
            desc: 'osdDescElementPIDPitch',
            defaultPosition: 0x800 | (11 << 5) | 2, // 0x0800 | (y << 5) | x
            draw_order: 180,
            positionable: true,
            preview: `PIT ${OSD.formatPidsPreview(1)}`,
        },
        PID_YAW: {
            name: 'PID_YAW',
            text: 'osdTextElementPIDYaw',
            desc: 'osdDescElementPIDYaw',
            defaultPosition: 0x800 | (12 << 5) | 2, // 0x0800 | (y << 5) | x
            draw_order: 190,
            positionable: true,
            preview: `YAW ${OSD.formatPidsPreview(2)}`,
        },
        POWER: {
            name: 'POWER',
            text: 'osdTextElementPower',
            desc: 'osdDescElementPower',
            defaultPosition: (15 << 5) | 2,
            draw_order: 200,
            positionable: true,
            preview() {
                return ' 142W';
            },
        },
        PID_RATE_PROFILE: {
            name: 'PID_RATE_PROFILE',
            text: 'osdTextElementPIDRateProfile',
            desc: 'osdDescElementPIDRateProfile',
            defaultPosition: 0x800 | (13 << 5) | 2, // 0x0800 | (y << 5) | x
            draw_order: 210,
            positionable: true,
            preview: '1-2',
        },
        BATTERY_WARNING: {
            name: 'BATTERY_WARNING',
            text: 'osdTextElementBatteryWarning',
            desc: 'osdDescElementBatteryWarning',
            defaultPosition: -1,
            positionable: true,
            preview: 'LOW VOLTAGE',
        },
        AVG_CELL_VOLTAGE: {
            name: 'AVG_CELL_VOLTAGE',
            text: 'osdTextElementAvgCellVoltage',
            desc: 'osdDescElementAvgCellVoltage',
            defaultPosition: 12 << 5,
            draw_order: 230,
            positionable: true,
            preview: `${FONT.symbol(SYM.BATTERY)}3.98${FONT.symbol(SYM.VOLT)}`,
        },
        PITCH_ANGLE: {
            name: 'PITCH_ANGLE',
            text: 'osdTextElementPitchAngle',
            desc: 'osdDescElementPitchAngle',
            defaultPosition: -1,
            draw_order: 250,
            positionable: true,
            preview: `${FONT.symbol(SYM.PITCH)}-00.0`,
        },
        ROLL_ANGLE: {
            name: 'ROLL_ANGLE',
            text: 'osdTextElementRollAngle',
            desc: 'osdDescElementRollAngle',
            defaultPosition: -1,
            draw_order: 260,
            positionable: true,
            preview: `${FONT.symbol(SYM.ROLL)}-00.0`,
        },
        MAIN_BATT_USAGE: {
            name: 'MAIN_BATT_USAGE',
            text: 'osdTextElementMainBattUsage',
            desc: 'osdDescElementMainBattUsage',
            defaultPosition: -17,
            draw_order: 270,
            positionable: true,
            variants: [
                'osdTextElementMainBattUsageVariantGraphrRemain',
                'osdTextElementMainBattUsageVariantGraphUsage',
                'osdTextElementMainBattUsageVariantValueRemain',
                'osdTextElementMainBattUsageVariantValueUsage',
            ],
            preview(osdData) {
                return OSD.generateBatteryUsagePreview(osdData);
            },
        },
        ARMED_TIME: {
            name: 'ARMED_TIME',
            text: 'osdTextElementArmedTime',
            desc: 'osdDescElementArmedTime',
            defaultPosition: -1,
            positionable: true,
            preview: `${FONT.symbol(SYM.FLY_M)}02:07`,
        },
        HOME_DIR: {
            name: 'HOME_DIRECTION',
            text: 'osdTextElementHomeDirection',
            desc: 'osdDescElementHomeDirection',
            defaultPosition: -1,
            draw_order: 850,
            positionable: true,
            preview: FONT.symbol(SYM.ARROW_SOUTH + 2),
        },
        HOME_DIST: {
            name: 'HOME_DISTANCE',
            text: 'osdTextElementHomeDistance',
            desc: 'osdDescElementHomeDistance',
            defaultPosition: -1,
            draw_order: 840,
            positionable: true,
            preview(osdData) {
                const unit = FONT.symbol(osdData.unit_mode === 0 ? SYM.FEET : SYM.METRE);
                return `${FONT.symbol(SYM.HOMEFLAG)}432${unit}`;
            },
        },
        NUMERICAL_HEADING: {
            name: 'NUMERICAL_HEADING',
            text: 'osdTextElementNumericalHeading',
            desc: 'osdDescElementNumericalHeading',
            defaultPosition: -1,
            draw_order: 290,
            positionable: true,
            preview: `${FONT.symbol(SYM.ARROW_EAST)}90`,
        },
        NUMERICAL_VARIO: {
            name: 'NUMERICAL_VARIO',
            text: 'osdTextElementNumericalVario',
            desc: 'osdDescElementNumericalVario',
            defaultPosition: -1,
            draw_order: 300,
            positionable: true,
            preview(osdData) {
                const unit = FONT.symbol(osdData.unit_mode === 0 ? SYM.FTPS : SYM.MPS);
                return `${FONT.symbol(SYM.ARROW_SMALL_UP)}8.7${unit}`;
            },
        },
        COMPASS_BAR: {
            name: 'COMPASS_BAR',
            text: 'osdTextElementCompassBar',
            desc: 'osdDescElementCompassBar',
            defaultPosition: -1,
            draw_order: 310,
            positionable: true,
            preview() {
                return FONT.symbol(SYM.HEADING_W) + FONT.symbol(SYM.HEADING_LINE) + FONT.symbol(SYM.HEADING_DIVIDED_LINE) +
                    FONT.symbol(SYM.HEADING_LINE) + FONT.symbol(SYM.HEADING_N) + FONT.symbol(SYM.HEADING_LINE) +
                    FONT.symbol(SYM.HEADING_DIVIDED_LINE) + FONT.symbol(SYM.HEADING_LINE) + FONT.symbol(SYM.HEADING_E);
            },
        },
        WARNINGS: {
            name: 'WARNINGS',
            text: 'osdTextElementWarnings',
            desc: 'osdDescElementWarnings',
            defaultPosition: -1,
            draw_order: 220,
            positionable: true,
            preview: 'LOW VOLTAGE',
        },
        ESC_TEMPERATURE: {
            name: 'ESC_TEMPERATURE',
            text: 'osdTextElementEscTemperature',
            desc: 'osdDescElementEscTemperature',
            defaultPosition: -1,
            draw_order: 900,
            positionable: true,
            preview(osdData) {
                return `E${OSD.generateTemperaturePreview(osdData, 45)}`;
            },
        },
        ESC_RPM: {
            name: 'ESC_RPM',
            text: 'osdTextElementEscRpm',
            desc: 'osdDescElementEscRpm',
            defaultPosition: -1,
            draw_order: 1000,
            positionable: true,
            preview: [ "22600", "22600", "22600", "22600"],
        },
        REMAINING_TIME_ESTIMATE: {
            name: 'REMAINING_TIME_ESTIMATE',
            text: 'osdTextElementRemaningTimeEstimate',
            desc: 'osdDescElementRemaningTimeEstimate',
            defaultPosition: -1,
            draw_order: 80,
            positionable: true,
            preview: '01:13',
        },
        RTC_DATE_TIME: {
            name: 'RTC_DATE_TIME',
            text: 'osdTextElementRtcDateTime',
            desc: 'osdDescElementRtcDateTime',
            defaultPosition: -1,
            draw_order: 360,
            positionable: true,
            preview: '2017-11-11 16:20:00',
        },
        ADJUSTMENT_RANGE: {
            name: 'ADJUSTMENT_RANGE',
            text: 'osdTextElementAdjustmentRange',
            desc: 'osdDescElementAdjustmentRange',
            defaultPosition: -1,
            draw_order: 370,
            positionable: true,
            preview: 'PITCH/ROLL P: 42',
        },
        TIMER_1: {
            name: 'TIMER_1',
            text: 'osdTextElementTimer1',
            desc: 'osdDescElementTimer1',
            defaultPosition: -1,
            draw_order: 60,
            positionable: true,
            preview(osdData) {
                return OSD.generateTimerPreview(osdData, 0);
            },
        },
        TIMER_2: {
            name: 'TIMER_2',
            text: 'osdTextElementTimer2',
            desc: 'osdDescElementTimer2',
            defaultPosition: -1,
            draw_order: 70,
            positionable: true,
            preview(osdData) {
                return OSD.generateTimerPreview(osdData, 1);
            },
        },
        CORE_TEMPERATURE: {
            name: 'CORE_TEMPERATURE',
            text: 'osdTextElementCoreTemperature',
            desc: 'osdDescElementCoreTemperature',
            defaultPosition: -1,
            draw_order: 380,
            positionable: true,
            preview(osdData) {
                return `C${OSD.generateTemperaturePreview(osdData, 33)}`;
            },
        },
        ANTI_GRAVITY: {
            name: 'ANTI_GRAVITY',
            text: 'osdTextAntiGravity',
            desc: 'osdDescAntiGravity',
            defaultPosition: -1,
            draw_order: 320,
            positionable: true,
            preview: 'AG',
        },
        G_FORCE: {
            name: 'G_FORCE',
            text: 'osdTextGForce',
            desc: 'osdDescGForce',
            defaultPosition: -1,
            draw_order: 15,
            positionable: true,
            preview: '1.0G',
        },
        MOTOR_DIAG: {
            name: 'MOTOR_DIAGNOSTICS',
            text: 'osdTextElementMotorDiag',
            desc: 'osdDescElementMotorDiag',
            defaultPosition: -1,
            draw_order: 335,
            positionable: true,
            preview: FONT.symbol(0x84)
                + FONT.symbol(0x85)
                + FONT.symbol(0x84)
                + FONT.symbol(0x83),
        },
        LOG_STATUS: {
            name: 'LOG_STATUS',
            text: 'osdTextElementLogStatus',
            desc: 'osdDescElementLogStatus',
            defaultPosition: -1,
            draw_order: 330,
            positionable: true,
            preview: `${FONT.symbol(SYM.BBLOG)}16`,
        },
        FLIP_ARROW: {
            name: 'FLIP_ARROW',
            text: 'osdTextElementFlipArrow',
            desc: 'osdDescElementFlipArrow',
            defaultPosition: -1,
            draw_order: 340,
            positionable: true,
            preview: FONT.symbol(SYM.ARROW_EAST),
        },
        LINK_QUALITY: {
            name: 'LINK_QUALITY',
            text: 'osdTextElementLinkQuality',
            desc: 'osdDescElementLinkQuality',
            defaultPosition: -1,
            draw_order: 390,
            positionable: true,
            preview: OSD.generateLQPreview,
        },
        FLIGHT_DIST: {
            name: 'FLIGHT_DISTANCE',
            text: 'osdTextElementFlightDist',
            desc: 'osdDescElementFlightDist',
            defaultPosition: -1,
            draw_order: 860,
            positionable: true,
            preview(osdData) {
                const unit = FONT.symbol(osdData.unit_mode === 0 ? SYM.FEET : SYM.METRE);
                return `${FONT.symbol(SYM.TOTAL_DIST)}653${unit}`;
            },
        },
        STICK_OVERLAY_LEFT: {
            name: 'STICK_OVERLAY_LEFT',
            text: 'osdTextElementStickOverlayLeft',
            desc: 'osdDescElementStickOverlayLeft',
            defaultPosition: -1,
            draw_order: 400,
            positionable: true,
            preview: OSD.drawStickOverlayPreview,
        },
        STICK_OVERLAY_RIGHT: {
            name: 'STICK_OVERLAY_RIGHT',
            text: 'osdTextElementStickOverlayRight',
            desc: 'osdDescElementStickOverlayRight',
            defaultPosition: -1,
            draw_order: 410,
            positionable: true,
            preview: OSD.drawStickOverlayPreview,
        },
        ...(semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_45)
            ? {
                DISPLAY_NAME: {
                   name: 'DISPLAY_NAME',
                   text: 'osdTextElementDisplayName',
                   desc: 'osdDescElementDisplayName',
                   defaultPosition: -77,
                   draw_order: 350,
                   positionable: true,
                   preview(osdData) {
                       return OSD.generateDisplayName(osdData, 1);
                   },
                },
            }
            : {}
        ),
        ...(semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)
            ? {
                PILOT_NAME: {
                    name: 'PILOT_NAME',
                    text: 'osdTextElementPilotName',
                    desc: 'osdDescElementPilotName',
                    defaultPosition: -77,
                    draw_order: 350,
                    positionable: true,
                    preview(osdData) {
                        return OSD.generatePilotName(osdData, 1);
                    },
                },
            }
            : {}
        ),
        ESC_RPM_FREQ: {
            name: 'ESC_RPM_FREQ',
            text: 'osdTextElementEscRpmFreq',
            desc: 'osdDescElementEscRpmFreq',
            defaultPosition: -1,
            draw_order: 1010,
            positionable: true,
            preview: [ "22600", "22600", "22600", "22600"],
        },
        RATE_PROFILE_NAME: {
            name: 'RATE_PROFILE_NAME',
            text: 'osdTextElementRateProfileName',
            desc: 'osdDescElementRateProfileName',
            defaultPosition: -1,
            draw_order: 420,
            positionable: true,
            preview: 'RATE_1',
        },
        PID_PROFILE_NAME: {
            name: 'PID_PROFILE_NAME',
            text: 'osdTextElementPidProfileName',
            desc: 'osdDescElementPidProfileName',
            defaultPosition: -1,
            draw_order: 430,
            positionable: true,
            preview: 'PID_1',
        },
        OSD_PROFILE_NAME: {
            name: 'OSD_PROFILE_NAME',
            text: 'osdTextElementOsdProfileName',
            desc: 'osdDescElementOsdProfileName',
            defaultPosition: -1,
            draw_order: 440,
            positionable: true,
            preview: 'OSD_1',
        },
        RSSI_DBM_VALUE: {
            name: 'RSSI_DBM_VALUE',
            text: 'osdTextElementRssiDbmValue',
            desc: 'osdDescElementRssiDbmValue',
            defaultPosition: -1,
            draw_order: 395,
            positionable: true,
            preview: `${FONT.symbol(SYM.RSSI)}-130`,
        },
        RC_CHANNELS: {
            name: 'OSD_RC_CHANNELS',
            text: 'osdTextElementRcChannels',
            desc: 'osdDescElementRcChannels',
            defaultPosition: -1,
            draw_order: 445,
            positionable: true,
            preview: [ "-1000", "  545", "  689", " 1000"],
        },
        CAMERA_FRAME: {
            name: 'OSD_CAMERA_FRAME',
            text: 'osdTextElementCameraFrame',
            desc: 'osdDescElementCameraFrame',
            defaultPosition: -1,
            draw_order: 450,
            positionable: true,
            preview: OSD.drawCameraFramePreview,
        },
        OSD_EFFICIENCY: {
            name: 'OSD_EFFICIENCY',
            text: 'osdTextElementEfficiency',
            desc: 'osdDescElementEfficiency',
            defaultPosition: -1,
            draw_order: 455,
            positionable: true,
            preview(osdData) {
                const unit = FONT.symbol(osdData.unit_mode === 0 ? SYM.MILES : SYM.KM);
                return `1234${FONT.symbol(SYM.MAH)}/${unit}`;
            },
        },
        TOTAL_FLIGHTS: {
            name: 'OSD_TOTAL_FLIGHTS',
            text: 'osdTextTotalFlights',
            desc: 'osdDescTotalFlights',
            defaultPosition: -1,
            draw_order: 460,
            positionable: true,
            preview: "#9876",
        },
        OSD_UP_DOWN_REFERENCE: {
            name: 'OSD_UP_DOWN_REFERENCE',
            text: 'osdTextElementUpDownReference',
            desc: 'osdDescUpDownReference',
            defaultPosition: 238,
            draw_order: 465,
            positionable: true,
            preview: 'U',
        },
        OSD_TX_UPLINK_POWER: {
            name: 'OSD_TX_UPLINK_POWER',
            text: 'osdTextElementTxUplinkPower',
            desc: 'osdDescTxUplinkPower',
            defaultPosition: -1,
            draw_order: 470,
            positionable: true,
            preview: `${FONT.symbol(SYM.RSSI)}250MW`,
        },
        WH_DRAWN: {
            name: 'WH_DRAWN',
            text: 'osdTextElementWhDrawn',
            desc: 'osdDescElementWhDrawn',
            defaultPosition: -1,
            draw_order: 475,
            positionable: true,
            preview: '1.10 WH',
        },
        AUX_VALUE: {
            name: 'AUX_VALUE',
            text: 'osdTextElementAuxValue',
            desc: 'osdDescElementAuxValue',
            defaultPosition: -1,
            draw_order: 480,
            positionable: true,
            preview: 'AUX',
        },
        READY_MODE: {
            name: 'READY_MODE',
            text: 'osdTextElementReadyMode',
            desc: 'osdDescElementReadyMode',
            defaultPosition: -1,
            draw_order: 485,
            positionable: true,
            preview: 'READY',
        },
        RSNR_VALUE: {
            name: 'RSNR_VALUE',
            text: 'osdTextElementRSNRValue',
            desc: 'osdDescElementRSNRValue',
            defaultPosition: -1,
            draw_order: 490,
            positionable: true,
            preview: `${FONT.symbol(SYM.RSSI)}15`,
        },
        SYS_GOGGLE_VOLTAGE: {
            name: 'SYS_GOGGLE_VOLTAGE',
            text: 'osdTextElementSysGoggleVoltage',
            desc: 'osdDescElementSysGoggleVoltage',
            defaultPosition: -1,
            draw_order: 485,
            positionable: true,
            preview: 'G 16.8V',
        },
        SYS_VTX_VOLTAGE: {
            name: 'SYS_VTX_VOLTAGE',
            text: 'osdTextElementSysVtxVoltage',
            desc: 'osdDescElementSysVtxVoltage',
            defaultPosition: -1,
            draw_order: 490,
            positionable: true,
            preview: 'A 12.6V',
        },
        SYS_BITRATE: {
            name: 'SYS_BITRATE',
            text: 'osdTextElementSysBitrate',
            desc: 'osdDescElementSysBitrate',
            defaultPosition: -1,
            draw_order: 495,
            positionable: true,
            preview: '50MBPS',
        },
        SYS_DELAY: {
            name: 'SYS_DELAY',
            text: 'osdTextElementSysDelay',
            desc: 'osdDescElementSysDelay',
            defaultPosition: -1,
            draw_order: 500,
            positionable: true,
            preview: '24.5MS',
        },
        SYS_DISTANCE: {
            name: 'SYS_DISTANCE',
            text: 'osdTextElementSysDistance',
            desc: 'osdDescElementSysDistance',
            defaultPosition: -1,
            draw_order: 505,
            positionable: true,
            preview: `10${FONT.symbol(SYM.METRE)}`,
        },
        SYS_LQ: {
            name: 'SYS_LQ',
            text: 'osdTextElementSysLQ',
            desc: 'osdDescElementSysLQ',
            defaultPosition: -1,
            draw_order: 510,
            positionable: true,
            preview: `G${FONT.symbol(SYM.LINK_QUALITY)}100`,
        },
        SYS_GOGGLE_DVR: {
            name: 'SYS_GOGGLE_DVR',
            text: 'osdTextElementSysGoggleDVR',
            desc: 'osdDescElementSysGoggleDVR',
            defaultPosition: -1,
            draw_order: 515,
            positionable: true,
            preview: `${FONT.symbol(SYM.ARROW_SMALL_RIGHT)}G DVR 8.4G`,
        },
        SYS_VTX_DVR: {
            name: 'SYS_VTX_DVR',
            text: 'osdTextElementSysVtxDVR',
            desc: 'osdDescElementSysVtxDVR',
            defaultPosition: -1,
            draw_order: 520,
            positionable: true,
            preview: `${FONT.symbol(SYM.ARROW_SMALL_RIGHT)}A DVR 1.6G`,
        },
        SYS_WARNINGS: {
            name: 'SYS_WARNINGS',
            text: 'osdTextElementSysWarnings',
            desc: 'osdDescElementSysWarnings',
            defaultPosition: -1,
            draw_order: 525,
            positionable: true,
            preview: 'VTX WARNINGS',
        },
        SYS_VTX_TEMP: {
            name: 'SYS_VTX_TEMP',
            text: 'osdTextElementSysVtxTemp',
            desc: 'osdDescElementSysVtxTemp',
            defaultPosition: -1,
            draw_order: 530,
            positionable: true,
            preview(osdData) {
                return `V${OSD.generateTemperaturePreview(osdData, 45)}`;
            },
        },
        SYS_FAN_SPEED: {
            name: 'SYS_FAN_SPEED',
            text: 'osdTextElementSysFanSpeed',
            desc: 'osdDescElementSysFanSpeed',
            defaultPosition: -1,
            draw_order: 535,
            positionable: true,
            preview: `F${FONT.symbol(SYM.TEMPERATURE)}5`,
        },
        GPS_LAP_TIME_CURRENT: {
            name: 'GPS_LAP_TIME_CURRENT',
            text: 'osdTextElementLapTimeCurrent',
            desc: 'osdDescElementLapTimeCurrent',
            defaultPosition: -1,
            draw_order: 540,
            positionable: true,
            preview: '1:23.456',
        },
        GPS_LAP_TIME_PREVIOUS: {
            name: 'GPS_LAP_TIME_PREVIOUS',
            text: 'osdTextElementLapTimePrevious',
            desc: 'osdDescElementLapTimePrevious',
            defaultPosition: -1,
            draw_order: 545,
            positionable: true,
            preview: '1:23.456',
        },
        GPS_LAP_TIME_BEST3: {
            name: 'GPS_LAP_TIME_BEST3',
            text: 'osdTextElementLapTimeBest3',
            desc: 'osdDescElementLapTimeBest3',
            defaultPosition: -1,
            draw_order: 550,
            positionable: true,
            preview: '1:23.456',
        },
    };
};

OSD.constants = {
    VISIBLE: 0x0800,
    VARIANTS: 0xC000,
    VIDEO_TYPES: [
        'AUTO',
        'PAL',
        'NTSC',
        'HD',
    ],
    UNIT_TYPES: [
        'IMPERIAL',
        'METRIC',
        'BRITISH',
    ],
    TIMER_PRECISION: [
        'SECOND',
        'HUNDREDTH',
        'TENTH',
    ],
    AHISIDEBARWIDTHPOSITION: 7,
    AHISIDEBARHEIGHTPOSITION: 3,

    UNKNOWN_DISPLAY_FIELD: {
        name: 'UNKNOWN',
        text: 'osdTextElementUnknown',
        desc: 'osdDescElementUnknown',
        defaultPosition: -1,
        positionable: true,
        preview: 'UNKNOWN ',
    },
    ALL_STATISTIC_FIELDS: {
        MAX_SPEED: {
            name: 'MAX_SPEED',
            text: 'osdTextStatMaxSpeed',
            desc: 'osdDescStatMaxSpeed',
        },
        MIN_BATTERY: {
            name: 'MIN_BATTERY',
            text: 'osdTextStatMinBattery',
            desc: 'osdDescStatMinBattery',
        },
        MIN_RSSI: {
            name: 'MIN_RSSI',
            text: 'osdTextStatMinRssi',
            desc: 'osdDescStatMinRssi',
        },
        MAX_CURRENT: {
            name: 'MAX_CURRENT',
            text: 'osdTextStatMaxCurrent',
            desc: 'osdDescStatMaxCurrent',
        },
        USED_MAH: {
            name: 'USED_MAH',
            text: 'osdTextStatUsedMah',
            desc: 'osdDescStatUsedMah',
        },
        USED_WH: {
            name: 'USED_WH',
            text: 'osdTextStatUsedWh',
            desc: 'osdDescStatUsedWh',
        },
        MAX_ALTITUDE: {
            name: 'MAX_ALTITUDE',
            text: 'osdTextStatMaxAltitude',
            desc: 'osdDescStatMaxAltitude',
        },
        BLACKBOX: {
            name: 'BLACKBOX',
            text: 'osdTextStatBlackbox',
            desc: 'osdDescStatBlackbox',
        },
        END_BATTERY: {
            name: 'END_BATTERY',
            text: 'osdTextStatEndBattery',
            desc: 'osdDescStatEndBattery',
        },
        FLYTIME: {
            name: 'FLY_TIME',
            text: 'osdTextStatFlyTime',
            desc: 'osdDescStatFlyTime',
        },
        ARMEDTIME: {
            name: 'ARMED_TIME',
            text: 'osdTextStatArmedTime',
            desc: 'osdDescStatArmedTime',
        },
        MAX_DISTANCE: {
            name: 'MAX_DISTANCE',
            text: 'osdTextStatMaxDistance',
            desc: 'osdDescStatMaxDistance',
        },
        BLACKBOX_LOG_NUMBER: {
            name: 'BLACKBOX_LOG_NUMBER',
            text: 'osdTextStatBlackboxLogNumber',
            desc: 'osdDescStatBlackboxLogNumber',
        },
        TIMER_1: {
            name: 'TIMER_1',
            text: 'osdTextStatTimer1',
            desc: 'osdDescStatTimer1',
        },
        TIMER_2: {
            name: 'TIMER_2',
            text: 'osdTextStatTimer2',
            desc: 'osdDescStatTimer2',
        },
        RTC_DATE_TIME: {
            name: 'RTC_DATE_TIME',
            text: 'osdTextStatRtcDateTime',
            desc: 'osdDescStatRtcDateTime',
        },
        STAT_BATTERY: {
            name: 'BATTERY_VOLTAGE',
            text: 'osdTextStatBattery',
            desc: 'osdDescStatBattery',
        },
        MAX_G_FORCE: {
            name: 'MAX_G_FORCE',
            text: 'osdTextStatGForce',
            desc: 'osdDescStatGForce',
        },
        MAX_ESC_TEMP: {
            name: 'MAX_ESC_TEMP',
            text: 'osdTextStatEscTemperature',
            desc: 'osdDescStatEscTemperature',
        },
        MAX_ESC_RPM: {
            name: 'MAX_ESC_RPM',
            text: 'osdTextStatEscRpm',
            desc: 'osdDescStatEscRpm',
        },
        MIN_LINK_QUALITY: {
            name: 'MIN_LINK_QUALITY',
            text: 'osdTextStatMinLinkQuality',
            desc: 'osdDescStatMinLinkQuality',
        },
        FLIGHT_DISTANCE: {
            name: 'FLIGHT_DISTANCE',
            text: 'osdTextStatFlightDistance',
            desc: 'osdDescStatFlightDistance',
        },
        MAX_FFT: {
            name: 'MAX_FFT',
            text: 'osdTextStatMaxFFT',
            desc: 'osdDescStatMaxFFT',
        },
        STAT_TOTAL_FLIGHTS: {
            name: 'STAT_TOTAL_FLIGHTS',
            text: 'osdTextStatTotalFlights',
            desc: 'osdDescStatTotalFlights',
        },
        STAT_TOTAL_FLIGHT_TIME: {
            name: 'STAT_TOTAL_FLIGHT_TIME',
            text: 'osdTextStatTotalFlightTime',
            desc: 'osdDescStatTotalFlightTime',
        },
        STAT_TOTAL_FLIGHT_DIST: {
            name: 'STAT_TOTAL_FLIGHT_DIST',
            text: 'osdTextStatTotalFlightDistance',
            desc: 'osdDescStatTotalFlightDistance',
        },
        MIN_RSSI_DBM: {
            name: 'MIN_RSSI_DBM',
            text: 'osdTextStatMinRssiDbm',
            desc: 'osdDescStatMinRssiDbm',
        },
        MIN_RSNR: {
            name: 'MIN_RSNR',
            text: 'osdTextStatMinRSNR',
            desc: 'osdDescStatMinRSNR',
        },
        STAT_BEST_3_CONSEC_LAPS : {
            name: 'STAT_BEST_3_CONSEC_LAPS',
            text: 'osdTextStatBest3ConsecLaps',
            desc: 'osdDescStatBest3ConsecLaps',
        },
        STAT_BEST_LAP : {
            name: 'STAT_BEST_LAP',
            text: 'osdTextStatBestLap',
            desc: 'osdDescStatBestLap',
        },
        STAT_FULL_THROTTLE_TIME : {
            name: 'STAT_FULL_THROTTLE_TIME',
            text: 'osdTextStatFullThrottleTime',
            desc: 'osdDescStatFullThrottleTime',
        },
        STAT_FULL_THROTTLE_COUNTER : {
            name: 'STAT_FULL_THROTTLE_COUNTER',
            text: 'osdTextStatFullThrottleCounter',
            desc: 'osdDescStatFullThrottleCounter',
        },
        STAT_AVG_THROTTLE : {
            name: 'STAT_AVG_THROTTLE',
            text: 'osdTextStatAvgThrottle',
            desc: 'osdDescStatAvgThrottle',
        },
    },
    ALL_WARNINGS: {
        ARMING_DISABLED: {
            name: 'ARMING_DISABLED',
            text: 'osdWarningTextArmingDisabled',
            desc: 'osdWarningArmingDisabled',
        },
        BATTERY_NOT_FULL: {
            name: 'BATTERY_NOT_FULL',
            text: 'osdWarningTextBatteryNotFull',
            desc: 'osdWarningBatteryNotFull',
        },
        BATTERY_WARNING: {
            name: 'BATTERY_WARNING',
            text: 'osdWarningTextBatteryWarning',
            desc: 'osdWarningBatteryWarning',
        },
        BATTERY_CRITICAL: {
            name: 'BATTERY_CRITICAL',
            text: 'osdWarningTextBatteryCritical',
            desc: 'osdWarningBatteryCritical',
        },
        VISUAL_BEEPER: {
            name: 'VISUAL_BEEPER',
            text: 'osdWarningTextVisualBeeper',
            desc: 'osdWarningVisualBeeper',
        },
        CRASH_FLIP_MODE: {
            name: 'CRASH_FLIP_MODE',
            text: 'osdWarningTextCrashFlipMode',
            desc: 'osdWarningCrashFlipMode',
        },
        ESC_FAIL: {
            name: 'ESC_FAIL',
            text: 'osdWarningTextEscFail',
            desc: 'osdWarningEscFail',
        },
        CORE_TEMPERATURE: {
            name: 'CORE_TEMPERATURE',
            text: 'osdWarningTextCoreTemperature',
            desc: 'osdWarningCoreTemperature',
        },
        RC_SMOOTHING_FAILURE: {
            name: 'RC_SMOOTHING_FAILURE',
            text: 'osdWarningTextRcSmoothingFailure',
            desc: 'osdWarningRcSmoothingFailure',
        },
        FAILSAFE: {
            name: 'FAILSAFE',
            text: 'osdWarningTextFailsafe',
            desc: 'osdWarningFailsafe',
        },
        LAUNCH_CONTROL: {
            name: 'LAUNCH_CONTROL',
            text: 'osdWarningTextLaunchControl',
            desc: 'osdWarningLaunchControl',
        },
        GPS_RESCUE_UNAVAILABLE: {
            name: 'GPS_RESCUE_UNAVAILABLE',
            text: 'osdWarningTextGpsRescueUnavailable',
            desc: 'osdWarningGpsRescueUnavailable',
        },
        GPS_RESCUE_DISABLED: {
            name: 'GPS_RESCUE_DISABLED',
            text: 'osdWarningTextGpsRescueDisabled',
            desc: 'osdWarningGpsRescueDisabled',
        },
        RSSI: {
            name: 'RSSI',
            text: 'osdWarningTextRSSI',
            desc: 'osdWarningRSSI',
        },
        LINK_QUALITY: {
            name: 'LINK_QUALITY',
            text: 'osdWarningTextLinkQuality',
            desc: 'osdWarningLinkQuality',
        },
        RSSI_DBM: {
            name: 'RSSI_DBM',
            text: 'osdWarningTextRssiDbm',
            desc: 'osdWarningRssiDbm',
        },
        OVER_CAP: {
            name: 'OVER_CAP',
            text: 'osdWarningTextOverCap',
            desc: 'osdWarningOverCap',
        },
        RSNR: {
            name: 'RSNR',
            text: 'osdWarningTextRSNR',
            desc: 'osdWarningRSNR',
        },

    },
    FONT_TYPES: [
        { file: "default", name: "osdSetupFontTypeDefault" },
        { file: "bold", name: "osdSetupFontTypeBold" },
        { file: "large", name: "osdSetupFontTypeLarge" },
        { file: "extra_large", name: "osdSetupFontTypeLargeExtra" },
        { file: "betaflight", name: "osdSetupFontTypeBetaflight" },
        { file: "digital", name: "osdSetupFontTypeDigital" },
        { file: "clarity", name: "osdSetupFontTypeClarity" },
        { file: "vision", name: "osdSetupFontTypeVision" },
        { file: "impact", name: "osdSetupFontTypeImpact" },
        { file: "impact_mini", name: "osdSetupFontTypeImpactMini" },
    ],
};

OSD.searchLimitsElement = function(arrayElements) {
    // Search minimum and maximum
    const limits = {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
    };

    if (arrayElements.length === 0) {
        return limits;
    }

    if (arrayElements[0].constructor === String) {
        limits.maxY = arrayElements.length;
        limits.minY = 0;
        limits.minX = 0;
        arrayElements.forEach(function(valor) {
            limits.maxX = Math.max(valor.length, limits.maxX);
        });
    } else {
        arrayElements.forEach(function(valor) {
            limits.minX = Math.min(valor.x, limits.minX);
            limits.maxX = Math.max(valor.x, limits.maxX);
            limits.minY = Math.min(valor.y, limits.minY);
            limits.maxY = Math.max(valor.y, limits.maxY);
        });
    }

    return limits;
};

// Pick display fields by version, order matters, so these are going in an array... pry could iterate the example map instead
OSD.chooseFields = function() {
    let F = OSD.ALL_DISPLAY_FIELDS;

    OSD.constants.DISPLAY_FIELDS = [
        F.RSSI_VALUE,
        F.MAIN_BATT_VOLTAGE,
        F.CROSSHAIRS,
        F.ARTIFICIAL_HORIZON,
        F.HORIZON_SIDEBARS,
        F.TIMER_1,
        F.TIMER_2,
        F.FLYMODE,
        F.CRAFT_NAME,
        F.THROTTLE_POSITION,
        F.VTX_CHANNEL,
        F.CURRENT_DRAW,
        F.MAH_DRAWN,
        F.GPS_SPEED,
        F.GPS_SATS,
        F.ALTITUDE,
        F.PID_ROLL,
        F.PID_PITCH,
        F.PID_YAW,
        F.POWER,
        F.PID_RATE_PROFILE,
        F.WARNINGS,
        F.AVG_CELL_VOLTAGE,
        F.GPS_LON,
        F.GPS_LAT,
        F.DEBUG,
        F.PITCH_ANGLE,
        F.ROLL_ANGLE,
        F.MAIN_BATT_USAGE,
        F.DISARMED,
        F.HOME_DIR,
        F.HOME_DIST,
        F.NUMERICAL_HEADING,
        F.NUMERICAL_VARIO,
        F.COMPASS_BAR,
        F.ESC_TEMPERATURE,
        F.ESC_RPM,
        F.REMAINING_TIME_ESTIMATE,
        F.RTC_DATE_TIME,
        F.ADJUSTMENT_RANGE,
        F.CORE_TEMPERATURE,
        F.ANTI_GRAVITY,
        F.G_FORCE,
        F.MOTOR_DIAG,
        F.LOG_STATUS,
        F.FLIP_ARROW,
        F.LINK_QUALITY,
        F.FLIGHT_DIST,
        F.STICK_OVERLAY_LEFT,
        F.STICK_OVERLAY_RIGHT,
        // show either DISPLAY_NAME or PILOT_NAME depending on the MSP version
        (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45) ? F.PILOT_NAME : F.DISPLAY_NAME),
        F.ESC_RPM_FREQ,
    ];

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
        OSD.constants.DISPLAY_FIELDS = OSD.constants.DISPLAY_FIELDS.concat([
            F.RATE_PROFILE_NAME,
            F.PID_PROFILE_NAME,
            F.OSD_PROFILE_NAME,
            F.RSSI_DBM_VALUE,
        ]);
    }

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
        OSD.constants.DISPLAY_FIELDS = OSD.constants.DISPLAY_FIELDS.concat([
            F.RC_CHANNELS,
            F.CAMERA_FRAME,
            F.OSD_EFFICIENCY,
        ]);
    }

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
        OSD.constants.DISPLAY_FIELDS = OSD.constants.DISPLAY_FIELDS.concat([
            F.TOTAL_FLIGHTS,
            F.OSD_UP_DOWN_REFERENCE,
            F.OSD_TX_UPLINK_POWER,
        ]);
    }

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
        OSD.constants.DISPLAY_FIELDS = OSD.constants.DISPLAY_FIELDS.concat([
            F.WH_DRAWN,
            F.AUX_VALUE,
            F.READY_MODE,
            F.RSNR_VALUE,
            F.SYS_GOGGLE_VOLTAGE,
            F.SYS_VTX_VOLTAGE,
            F.SYS_BITRATE,
            F.SYS_DELAY,
            F.SYS_DISTANCE,
            F.SYS_LQ,
            F.SYS_GOGGLE_DVR,
            F.SYS_VTX_DVR,
            F.SYS_WARNINGS,
            F.SYS_VTX_TEMP,
            F.SYS_FAN_SPEED,
        ]);
    }

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
        OSD.constants.DISPLAY_FIELDS = OSD.constants.DISPLAY_FIELDS.concat([
            F.GPS_LAP_TIME_CURRENT,
            F.GPS_LAP_TIME_PREVIOUS,
            F.GPS_LAP_TIME_BEST3,
        ]);
    }

    // Choose statistic fields
    // Nothing much to do here, I'm preempting there being new statistics
    F = OSD.constants.ALL_STATISTIC_FIELDS;

    // ** IMPORTANT **
    //
    // Starting with 1.39.0 (Betaflight 3.4) the OSD stats selection options
    // are ordered in the same sequence as displayed on-screen in the OSD.
    // If future versions of the firmware implement changes to the on-screen ordering,
    // that needs to be implemented here as well. Simply appending new stats does not
    // require a completely new section for the version - only reordering.

    // Starting with 1.39.0 OSD stats are reordered to match how they're presented on screen
    OSD.constants.STATISTIC_FIELDS = [
        F.RTC_DATE_TIME,
        F.TIMER_1,
        F.TIMER_2,
        F.MAX_SPEED,
        F.MAX_DISTANCE,
        F.MIN_BATTERY,
        F.END_BATTERY,
        F.STAT_BATTERY,
        F.MIN_RSSI,
        F.MAX_CURRENT,
        F.USED_MAH,
        F.MAX_ALTITUDE,
        F.BLACKBOX,
        F.BLACKBOX_LOG_NUMBER,
        F.MAX_G_FORCE,
        F.MAX_ESC_TEMP,
        F.MAX_ESC_RPM,
        F.MIN_LINK_QUALITY,
        F.FLIGHT_DISTANCE,
        F.MAX_FFT,
    ];

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
        OSD.constants.STATISTIC_FIELDS = OSD.constants.STATISTIC_FIELDS.concat([
            F.STAT_TOTAL_FLIGHTS,
            F.STAT_TOTAL_FLIGHT_TIME,
            F.STAT_TOTAL_FLIGHT_DIST,
            F.MIN_RSSI_DBM,
        ]);
    }

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
        OSD.constants.STATISTIC_FIELDS = OSD.constants.STATISTIC_FIELDS.concat([
            F.USED_WH,
            F.MIN_RSNR,
        ]);
    }

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
        OSD.constants.STATISTIC_FIELDS = OSD.constants.STATISTIC_FIELDS.concat([
            F.STAT_BEST_3_CONSEC_LAPS,
            F.STAT_BEST_LAP,
            F.STAT_FULL_THROTTLE_TIME,
            F.STAT_FULL_THROTTLE_COUNTER,
            F.STAT_AVG_THROTTLE,
        ]);
    }

    // Choose warnings
    // Nothing much to do here, I'm preempting there being new warnings
    F = OSD.constants.ALL_WARNINGS;

    OSD.constants.WARNINGS = [
        F.ARMING_DISABLED,
        F.BATTERY_NOT_FULL,
        F.BATTERY_WARNING,
        F.BATTERY_CRITICAL,
        F.VISUAL_BEEPER,
        F.CRASH_FLIP_MODE,
        F.ESC_FAIL,
        F.CORE_TEMPERATURE,
        F.RC_SMOOTHING_FAILURE,
        F.FAILSAFE,
        F.LAUNCH_CONTROL,
        F.GPS_RESCUE_UNAVAILABLE,
        F.GPS_RESCUE_DISABLED,
    ];

    OSD.constants.TIMER_TYPES = [
        'ON_TIME',
        'TOTAL_ARMED_TIME',
        'LAST_ARMED_TIME',
    ];

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
        OSD.constants.TIMER_TYPES = OSD.constants.TIMER_TYPES.concat([
            'ON_ARM_TIME',
        ]);
        OSD.constants.WARNINGS = OSD.constants.WARNINGS.concat([
            F.RSSI,
            F.LINK_QUALITY,
            F.RSSI_DBM,
        ]);
    }
    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
        OSD.constants.WARNINGS = OSD.constants.WARNINGS.concat([
            F.OVER_CAP,
        ]);
    }
    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
        OSD.constants.WARNINGS = OSD.constants.WARNINGS.concat([
            F.RSNR,
        ]);
    }
};

OSD.updateDisplaySize = function() {
    let videoType = OSD.constants.VIDEO_TYPES[OSD.data.video_system];
    if (videoType === 'AUTO') {
        videoType = 'PAL';
    }

    // compute the size
    OSD.data.displaySize = {
        x: OSD.data.VIDEO_COLS[videoType],
        y: OSD.data.VIDEO_ROWS[videoType],
        total: null,
    };
};

OSD.drawByOrder = function(selectedPosition, field, charCode, x, y) {

    // Check if there is other field at the same position
    if (OSD.data.preview[selectedPosition] !== undefined) {
        const oldField = OSD.data.preview[selectedPosition][0];
        if (oldField != null && oldField.draw_order !== undefined &&
            (field.draw_order === undefined || field.draw_order < oldField.draw_order)) {

            // Not overwrite old field
            return;
        }

        // Default action, overwrite old field
        OSD.data.preview[selectedPosition] = [field, charCode, x, y];
    }
};

OSD.msp = {
    /**
    * Note, unsigned 16 bit int for position ispacked:
    * 0: unused
    * v: visible flag
    * b: blink flag
    * y: y coordinate
    * x: x coordinate
    * p: profile
    * t: variant type
    * ttpp vbyy yyyx xxxx
    */
    helpers: {
        unpack: {
            position(bits, c) {
                const displayItem = {};

                const positionable = typeof (c.positionable) === 'function' ? c.positionable() : c.positionable;
                const defaultPosition = typeof (c.defaultPosition) === 'function' ? c.defaultPosition() : c.defaultPosition;

                displayItem.positionable = positionable;

                OSD.updateDisplaySize();

                // size * y + x
                const xpos = ((bits >> 5) & 0x0020) | (bits & 0x001F);
                const ypos = (bits >> 5) & 0x001F;

                displayItem.position = positionable ? OSD.data.displaySize.x * ypos + xpos : defaultPosition;

                displayItem.isVisible = [];
                for (let osd_profile = 0; osd_profile < OSD.getNumberOfProfiles(); osd_profile++) {
                    displayItem.isVisible[osd_profile] = (bits & (OSD.constants.VISIBLE << osd_profile)) !== 0;
                }

                displayItem.variant = (bits & OSD.constants.VARIANTS) >> 14;

                return displayItem;
            },
            timer(bits) {
                return {
                    src: bits & 0x0F,
                    precision: (bits >> 4) & 0x0F,
                    alarm: (bits >> 8) & 0xFF,
                };
            },
        },
        pack: {
            position(displayItem) {
                const isVisible = displayItem.isVisible;
                const position = displayItem.position;
                const variant = displayItem.variant;

                let packed_visible = 0;
                for (let osd_profile = 0; osd_profile < OSD.getNumberOfProfiles(); osd_profile++) {
                    packed_visible |= isVisible[osd_profile] ? OSD.constants.VISIBLE << osd_profile : 0;
                }
                const variantSelected = (variant << 14);
                const xpos = position % OSD.data.displaySize.x;
                const ypos = (position - xpos) / OSD.data.displaySize.x;

                return packed_visible | variantSelected | ((ypos & 0x001F) << 5) | ((xpos & 0x0020) << 5) | (xpos & 0x001F);
            },
            timer(timer) {
                return (timer.src & 0x0F) | ((timer.precision & 0x0F) << 4) | ((timer.alarm & 0xFF) << 8);
            },
        },
    },
    encodeOther() {
        const result = [-1, OSD.data.video_system];
        if (OSD.data.state.haveOsdFeature) {
            result.push8(OSD.data.unit_mode);
            // watch out, order matters! match the firmware
            result.push8(OSD.data.alarms.rssi.value);
            result.push16(OSD.data.alarms.cap.value);
            result.push16(0); // This value is unused by the firmware with configurable timers
            result.push16(OSD.data.alarms.alt.value);

            let warningFlags = 0;
            for (let i = 0; i < OSD.data.warnings.length; i++) {
                if (OSD.data.warnings[i].enabled) {
                    warningFlags |= (1 << i);
                }
            }

            if (CONFIGURATOR.virtualMode) {
                OSD.virtualMode.warningFlags = warningFlags;
            }

            console.log(warningFlags);
            result.push16(warningFlags);
            result.push32(warningFlags);

            result.push8(OSD.data.osd_profiles.selected + 1);

            result.push8(OSD.data.parameters.overlayRadioMode);

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                result.push8(OSD.data.parameters.cameraFrameWidth);
                result.push8(OSD.data.parameters.cameraFrameHeight);
            }

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                result.push16(OSD.data.alarms.link_quality.value);
            }
        }
        return result;
    },
    encodeLayout(displayItem) {
        if (CONFIGURATOR.virtualMode) {
            OSD.virtualMode.itemPositions[displayItem.index] = this.helpers.pack.position(displayItem);
        }

        const buffer = [];
        buffer.push8(displayItem.index);
        buffer.push16(this.helpers.pack.position(displayItem));
        return buffer;
    },
    encodeStatistics(statItem) {
        if (CONFIGURATOR.virtualMode) {
            OSD.virtualMode.statisticsState[statItem.index] = statItem.enabled;
        }

        const buffer = [];
        buffer.push8(statItem.index);
        buffer.push16(statItem.enabled);
        buffer.push8(0);
        return buffer;
    },
    encodeTimer(timer) {
        if (CONFIGURATOR.virtualMode) {
            OSD.virtualMode.timerData[timer.index] = {};
            OSD.virtualMode.timerData[timer.index].src = timer.src;
            OSD.virtualMode.timerData[timer.index].precision = timer.precision;
            OSD.virtualMode.timerData[timer.index].alarm = timer.alarm;
        }

        const buffer = [-2, timer.index];
        buffer.push16(this.helpers.pack.timer(timer));
        return buffer;
    },
    processOsdElements(data, itemPositions){
        // Now we have the number of profiles, process the OSD elements
        for (const item of itemPositions) {
            const j = data.displayItems.length;
            let c;
            let suffix;
            let ignoreSize = false;
            if (data.displayItems.length < OSD.constants.DISPLAY_FIELDS.length) {
                c = OSD.constants.DISPLAY_FIELDS[j];
            } else {
                c = OSD.constants.UNKNOWN_DISPLAY_FIELD;
                suffix = (1 + data.displayItems.length - OSD.constants.DISPLAY_FIELDS.length).toString();
                ignoreSize = true;
            }
            data.displayItems.push($$1.extend({
                name: c.name,
                text: suffix ? [c.text, suffix] : c.text,
                desc: c.desc,
                index: j,
                draw_order: c.draw_order,
                preview: suffix ? c.preview + suffix : c.preview,
                variants: c.variants,
                ignoreSize,
            }, this.helpers.unpack.position(item, c)));
        }

        // Generate OSD element previews and positionable that are defined by a function
        for (const item of data.displayItems) {
            if (typeof (item.preview) === 'function') {
                item.preview = item.preview(data);
            }
        }
    },
    // Currently only parses MSP_MAX_OSD responses, add a switch on payload.code if more codes are handled
    decode(payload) {
        const view = payload.data;
        const d = OSD.data;

        let displayItemsCountActual = OSD.constants.DISPLAY_FIELDS.length;

        d.flags = view.readU8();

        if (d.flags > 0 && payload.length > 1) {
            d.video_system = view.readU8();
            if (bit_check(d.flags, 0)) {
                d.unit_mode = view.readU8();
                d.alarms = {};
                d.alarms['rssi'] = { display_name: i18n$1.getMessage('osdTimerAlarmOptionRssi'), value: view.readU8() };
                d.alarms['cap'] = { display_name: i18n$1.getMessage('osdTimerAlarmOptionCapacity'), value: view.readU16() };
                // This value was obsoleted by the introduction of configurable timers, and has been reused to encode the number of display elements sent in this command
                view.readU8();
                displayItemsCountActual = view.readU8();

                d.alarms['alt'] = { display_name: i18n$1.getMessage('osdTimerAlarmOptionAltitude'), value: view.readU16() };
            }
        }

        d.state = {};
        d.state.haveSomeOsd = (d.flags !== 0);
        d.state.haveMax7456Configured = bit_check(d.flags, 4);
        d.state.haveFrSkyOSDConfigured = semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43) && bit_check(d.flags, 3);
        d.state.haveMax7456FontDeviceConfigured = d.state.haveMax7456Configured || d.state.haveFrSkyOSDConfigured;
        d.state.isMax7456FontDeviceDetected = bit_check(d.flags, 5) || (d.state.haveMax7456FontDeviceConfigured && semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_43));
        d.state.haveOsdFeature = bit_check(d.flags, 0);
        d.state.isOsdSlave = bit_check(d.flags, 1);
        d.state.isMspDevice = bit_check(d.flags, 6) && semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45);

        d.displayItems = [];
        d.statItems = [];
        d.warnings = [];
        d.timers = [];

        d.parameters = {};
        d.parameters.overlayRadioMode = 0;
        d.parameters.cameraFrameWidth = 24;
        d.parameters.cameraFrameHeight = 11;

        // Read display element positions, the parsing is done later because we need the number of profiles
        const itemsPositionsRead = [];
        while (view.offset < view.byteLength && itemsPositionsRead.length < displayItemsCountActual) {
            const v = view.readU16();
            itemsPositionsRead.push(v);
        }

        // Parse statistics display enable
        const expectedStatsCount = view.readU8();
        if (expectedStatsCount !== OSD.constants.STATISTIC_FIELDS.length) {
            console.error(`Firmware is transmitting a different number of statistics (${expectedStatsCount}) to what the configurator ` +
                `is expecting (${OSD.constants.STATISTIC_FIELDS.length})`);
        }

        for (let i = 0; i < expectedStatsCount; i++) {

            const v = view.readU8();

            // Known statistics field
            if (i < OSD.constants.STATISTIC_FIELDS.length) {

                const c = OSD.constants.STATISTIC_FIELDS[i];
                d.statItems.push({
                    name: c.name,
                    text: c.text,
                    desc: c.desc,
                    index: i,
                    enabled: v === 1,
                });

            // Read all the data for any statistics we don't know about
            } else {
                const statisticNumber = i - OSD.constants.STATISTIC_FIELDS.length + 1;
                d.statItems.push({
                    name: 'UNKNOWN',
                    text: ['osdTextStatUnknown', statisticNumber],
                    desc: 'osdDescStatUnknown',
                    index: i,
                    enabled: v === 1,
                });
            }
        }

        // Parse configurable timers
        let expectedTimersCount = view.readU8();
        while (view.offset < view.byteLength && expectedTimersCount > 0) {
            const v = view.readU16();
            const j = d.timers.length;
            d.timers.push($$1.extend({
                index: j,
            }, this.helpers.unpack.timer(v)));
            expectedTimersCount--;
        }
        // Read all the data for any timers we don't know about
        while (expectedTimersCount > 0) {
            view.readU16();
            expectedTimersCount--;
        }

        // Parse enabled warnings
        view.readU16(); // obsolete
        const warningCount = view.readU8();
        // the flags were replaced with a 32bit version
        const warningFlags = view.readU32();

        for (let i = 0; i < warningCount; i++) {

            const enabled = (warningFlags & (1 << i)) !== 0;

            // Known warning field
            if (i < OSD.constants.WARNINGS.length) {
                d.warnings.push($$1.extend(OSD.constants.WARNINGS[i], { enabled }));

            // Push Unknown Warning field
            } else {
                const  warningNumber = i - OSD.constants.WARNINGS.length + 1;
                d.warnings.push({
                    name: 'UNKNOWN',
                    text: ['osdWarningTextUnknown', warningNumber],
                    desc: 'osdWarningUnknown',
                    enabled,
                });

            }
        }

        // OSD profiles
        d.osd_profiles.number = view.readU8();
        d.osd_profiles.selected = view.readU8() - 1;

        // Overlay radio mode
        d.parameters.overlayRadioMode = view.readU8();

        // Camera frame size
        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
            d.parameters.cameraFrameWidth = view.readU8();
            d.parameters.cameraFrameHeight = view.readU8();
        }

        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
            d.alarms['link_quality'] = { display_name: i18n$1.getMessage('osdTimerAlarmOptionLinkQuality'), value: view.readU16() };
        }

        this.processOsdElements(d, itemsPositionsRead);

        OSD.updateDisplaySize();
    },
    decodeVirtual() {
        const d = OSD.data;

        d.displayItems = [];
        d.statItems = [];
        d.warnings = [];
        d.timers = [];

        // Parse statistics display enable
        const expectedStatsCount = OSD.constants.STATISTIC_FIELDS.length;

        for (let i = 0; i < expectedStatsCount; i++) {
            const v = OSD.virtualMode.statisticsState[i] ? 1 : 0;

            // Known statistics field
            if (i < expectedStatsCount) {
                const c = OSD.constants.STATISTIC_FIELDS[i];
                d.statItems.push({
                    name: c.name,
                    text: c.text,
                    desc: c.desc,
                    index: i,
                    enabled: v === 1,
                });

            // Read all the data for any statistics we don't know about
            } else {
                const statisticNumber = i - expectedStatsCount + 1;
                d.statItems.push({
                    name: 'UNKNOWN',
                    text: ['osdTextStatUnknown', statisticNumber],
                    desc: 'osdDescStatUnknown',
                    index: i,
                    enabled: v === 1,
                });
            }
        }

        // Parse configurable timers
        const expectedTimersCount = 3;
        for (let i = 0; i < expectedTimersCount; i++) {
            d.timers.push($$1.extend({
                index: i,
            }, OSD.virtualMode.timerData[i]));
        }

        // Parse enabled warnings
        const warningCount = OSD.constants.WARNINGS.length;
        const warningFlags = OSD.virtualMode.warningFlags;

        for (let i = 0; i < warningCount; i++) {
            const enabled = (warningFlags & (1 << i)) !== 0;

            // Known warning field
            if (i < warningCount) {
                d.warnings.push($$1.extend(OSD.constants.WARNINGS[i], { enabled }));

            // Push Unknown Warning field
            } else {
                const  warningNumber = i - warningCount + 1;
                d.warnings.push({
                    name: 'UNKNOWN',
                    text: ['osdWarningTextUnknown', warningNumber],
                    desc: 'osdWarningUnknown',
                    enabled,
                });
            }
        }

        this.processOsdElements(OSD.data, OSD.virtualMode.itemPositions);

        OSD.updateDisplaySize();
    },
};

OSD.GUI = {};
OSD.GUI.preview = {
    onMouseEnter() {
        if (!$$1(this).data('field')) {
            return;
        }
        $$1(`#element-fields .field-${$$1(this).data('field').index}`).addClass('mouseover');
    },
    onMouseLeave() {
        if (!$$1(this).data('field')) {
            return;
        }
        $$1(`#element-fields .field-${$$1(this).data('field').index}`).removeClass('mouseover');
    },
    onDragStart(e) {
        const ev = e.originalEvent;
        const displayItem = OSD.data.displayItems[$$1(ev.target).data('field').index];
        let xPos = ev.currentTarget.dataset.x;
        let yPos = ev.currentTarget.dataset.y;
        let offsetX = 6;
        let offsetY = 9;

        if (displayItem.preview.constructor === Array) {
            const arrayElements = displayItem.preview;
            const limits = OSD.searchLimitsElement(arrayElements);
            xPos -= limits.minX;
            yPos -= limits.minY;
            offsetX += (xPos) * 12;
            offsetY += (yPos) * 18;
        }

        ev.dataTransfer.setData("text/plain", $$1(ev.target).data('field').index);
        ev.dataTransfer.setData("x", ev.currentTarget.dataset.x);
        ev.dataTransfer.setData("y", ev.currentTarget.dataset.y);

        if (GUI.operating_system !== "Linux") {
            // latest NW.js (0.6x.x) has introduced an issue with Linux displaying a rectangle while moving an element
            ev.dataTransfer.setDragImage($$1(this).data('field').preview_img, offsetX, offsetY);
        }
    },
    onDragOver(e) {
        const ev = e.originalEvent;
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
        $$1(this).css({
            background: 'rgba(0,0,0,.5)',
        });
    },
    onDragLeave() {
        // brute force un-styling on drag leave
        $$1(this).removeAttr('style');
    },
    onDrop(e) {
        const ev = e.originalEvent;

        const fieldId = parseInt(ev.dataTransfer.getData('text/plain'));
        const displayItem = OSD.data.displayItems[fieldId];
        let position = $$1(this).removeAttr('style').data('position');
        const cursor = position;
        const cursorX = cursor % OSD.data.displaySize.x;

        console.log(`cursorX=${cursorX}`);

        if (displayItem.preview.constructor === Array) {
            console.log(`Initial Drop Position: ${position}`);
            const x = parseInt(ev.dataTransfer.getData('x'));
            const y = parseInt(ev.dataTransfer.getData('y'));
            console.log(`XY Co-ords: ${x}-${y}`);
            position -= x;
            position -= (y * OSD.data.displaySize.x);
            console.log(`Calculated Position: ${position}`);
        }

        if (!displayItem.ignoreSize) {
            if (displayItem.preview.constructor !== Array) {
                // Standard preview, string type
                const overflowsLine = OSD.data.displaySize.x - ((position % OSD.data.displaySize.x) + displayItem.preview.length);
                if (overflowsLine < 0) {
                    position += overflowsLine;
                }
            } else {
                // Advanced preview, array type
                const arrayElements = displayItem.preview;
                const limits = OSD.searchLimitsElement(arrayElements);
                const selectedPositionX = position % OSD.data.displaySize.x;
                let selectedPositionY = Math.trunc(position / OSD.data.displaySize.x);
                if (arrayElements[0].constructor === String) {
                    if (position < 0 ) {
                        return;
                    }
                    if (selectedPositionX > cursorX) { // TRUE -> Detected wrap around
                        position += OSD.data.displaySize.x - selectedPositionX;
                        selectedPositionY++;
                    } else if (selectedPositionX + limits.maxX > OSD.data.displaySize.x) { // TRUE -> right border of the element went beyond left edge of screen.
                        position -= selectedPositionX + limits.maxX - OSD.data.displaySize.x;
                    }
                    if (selectedPositionY < 0 ) {
                        position += Math.abs(selectedPositionY) * OSD.data.displaySize.x;
                    } else if ((selectedPositionY + limits.maxY ) > OSD.data.displaySize.y) {
                        position -= (selectedPositionY + limits.maxY  - OSD.data.displaySize.y) * OSD.data.displaySize.x;
                    }

                } else {
                    if ((limits.minX < 0) && ((selectedPositionX + limits.minX) < 0)) {
                        position += Math.abs(selectedPositionX + limits.minX);
                    } else if ((limits.maxX > 0) && ((selectedPositionX + limits.maxX) >= OSD.data.displaySize.x)) {
                        position -= (selectedPositionX + limits.maxX + 1) - OSD.data.displaySize.x;
                    }
                    if ((limits.minY < 0) && ((selectedPositionY + limits.minY) < 0)) {
                        position += Math.abs(selectedPositionY + limits.minY) * OSD.data.displaySize.x;
                    } else if ((limits.maxY > 0) && ((selectedPositionY + limits.maxY) >= OSD.data.displaySize.y)) {
                        position -= (selectedPositionY + limits.maxY - OSD.data.displaySize.y + 1) * OSD.data.displaySize.x;
                    }
                }
            }
        }

        $$1(`input.${fieldId}.position`).val(position).change();
    },
};

const osd = {
    analyticsChanges: {},
};

osd.initialize = function(callback) {
    if (GUI.active_tab !== 'osd') {
        GUI.active_tab = 'osd';
    }

    if (CONFIGURATOR.virtualMode) {
        VirtualFC.setupVirtualOSD();
    }

    $$1('#content').load("./tabs/osd.html", function() {
        // Prepare symbols depending on the version
        SYM.loadSymbols();
        OSD.loadDisplayFields();

        // Generate font type select element
        const fontPresetsElement = $$1('.fontpresets');
        OSD.constants.FONT_TYPES.forEach(function(e) {
            const option = $$1('<option>', {
                "data-font-file": e.file,
                value: e.file,
                text: i18n$1.getMessage(e.name),
            });
            fontPresetsElement.append($$1(option));
        });

        // Sort the element, if need to group, do it by lexical sort, ie. by naming of (the translated) selection text
        fontPresetsElement.sortSelect(i18n$1.getMessage("osdSetupFontTypeDefault"));

        const fontbuttons = $$1('.fontpresets_wrapper');
        fontbuttons.append($$1('<button>', { class: "load_font_file", i18n: "osdSetupOpenFont" }));

        // must invoke before i18n.localizePage() since it adds translation keys for expected logo size
        LogoManager.init(FONT, SYM.LOGO);

        // translate to user-selected language
        i18n$1.localizePage();

        if ($$1(window).width() < 390) {
            const previewZoom = ($$1(window).width() - 30) / 360;
            $$1('.display-layout .preview').css('zoom', previewZoom);
        }


        // Open modal window
        OSD.GUI.fontManager = new jBox('Modal', {
            width: 750,
            height: 455,
            closeButton: 'title',
            animation: false,
            attach: $$1('#fontmanager'),
            title: 'OSD Font Manager',
            content: $$1('#fontmanagercontent'),
        });

        $$1('.elements-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpElements'));
        $$1('.videomode-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpVideoMode'));
        $$1('.units-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpUnits'));
        $$1('.timers-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpTimers'));
        $$1('.alarms-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpAlarms'));
        $$1('.stats-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpStats'));
        $$1('.warnings-container div.cf_tip').attr('title', i18n$1.getMessage('osdSectionHelpWarnings'));

        function titleizeField(field) {
            let finalFieldName = null;
            if (field.text) {
                if (Array.isArray(field.text) && i18n$1.existsMessage(field.text[0])) {
                    finalFieldName = i18n$1.getMessage(field.text[0], field.text.slice(1));
                } else {
                    finalFieldName = i18n$1.getMessage(field.text);
                }
            }
            return finalFieldName;
        }

        function insertOrdered(fieldList, field) {
            if (field.name === 'UNKNOWN') {
                fieldList.append(field);
            } else {
                let added = false;
                const currentLocale = i18n$1.getCurrentLocale().replace('_', '-');
                fieldList.children().each(function() {
                    if ($$1(this).text().localeCompare(field.text(), currentLocale, { sensitivity: 'base' }) > 0) {
                        $$1(this).before(field);
                        added = true;
                        return false; // This breaks the for each
                    }
                    return true;
                });
                if(!added) {
                    fieldList.append(field);
                }
            }
        }

        // 2 way binding... sorta
        async function updateOsdView() {

            // ask for the OSD canvas data
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                await MSP$1.promise(MSPCodes.MSP_OSD_CANVAS);
            }

            MSP$1.promise(MSPCodes.MSP_OSD_CONFIG)
                .then(info => {

                    OSD.chooseFields();

                    if (CONFIGURATOR.virtualMode) {
                        OSD.msp.decodeVirtual();
                    } else {
                        OSD.msp.decode(info);
                    }

                    if (OSD.data.state.haveMax7456FontDeviceConfigured && !OSD.data.state.isMax7456FontDeviceDetected) {
                        $$1('.noOsdChipDetect').show();
                    }

                    if (OSD.data.state.haveSomeOsd === 0) {
                        $$1('.unsupported').fadeIn();
                        return;
                    }
                    $$1('.supported').fadeIn();

                    // video mode
                    const $videoTypes = $$1('.video-types').empty();
                    for (let i = 0; i < OSD.constants.VIDEO_TYPES.length; i++) {
                        // Disable SD or HD option depending on the build
                        let disabled = false;
                        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45) && FC.CONFIG.buildOptions.length) {
                            if (OSD.constants.VIDEO_TYPES[i] !== 'HD' && !FC.CONFIG.buildOptions.includes('USE_OSD_SD')) {
                                disabled = true;
                            }
                            if (OSD.constants.VIDEO_TYPES[i] === 'HD' && !FC.CONFIG.buildOptions.includes('USE_OSD_HD')) {
                                disabled = true;
                            }
                        }
                        const type = OSD.constants.VIDEO_TYPES[i];
                        let videoFormatOptionText = i18n$1.getMessage(`osdSetupVideoFormatOption${inflection.camelize(type.toLowerCase())}`);
                        videoFormatOptionText = disabled ? `<span style="color:#AFAFAF">${videoFormatOptionText}</span>` : videoFormatOptionText;
                        const $checkbox = $$1('<label/>')
                            .append($$1(`<input name="video_system" ${disabled ? 'disabled' : ''} type="radio"/>${videoFormatOptionText}</label>`)
                            .prop('checked', i === OSD.data.video_system)
                            .data('type', type)
                            .data('type', i),
                        );
                        $videoTypes.append($checkbox);
                    }
                    $videoTypes.find(':radio').click(function() {
                        OSD.data.video_system = $$1(this).data('type');
                        MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeOther())
                            .then(updateOsdView);
                    });

                    // units
                    $$1('.units-container').show();
                    const $unitMode = $$1('.units').empty();
                    for (let i = 0; i < OSD.constants.UNIT_TYPES.length; i++) {
                        const type = OSD.constants.UNIT_TYPES[i];
                        const setupUnitOptionText = i18n$1.getMessage(`osdSetupUnitsOption${inflection.camelize(type.toLowerCase())}`);
                        const $checkbox = $$1('<label/>')
                            .append($$1(`<input name="unit_mode" type="radio"/>${setupUnitOptionText}</label>`)
                            .prop('checked', i === OSD.data.unit_mode)
                            .data('type', type)
                            .data('type', i),
                        );
                        $unitMode.append($checkbox);
                    }
                    $unitMode.find(':radio').click(function() {
                        OSD.data.unit_mode = $$1(this).data('type');
                        MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeOther())
                            .then(updateOsdView);
                    });
                    // alarms
                    $$1('.alarms-container').show();
                    const $alarms = $$1('.alarms').empty();
                    for (const k in OSD.data.alarms) {
                        const alarm = OSD.data.alarms[k];
                        const alarmInput = $$1(`<input name="alarm" type="number" id="${k}"/>${alarm.display_name}</label>`);
                        alarmInput.val(alarm.value);
                        alarmInput.focusout(function() {
                            OSD.data.alarms[$$1(this)[0].id].value = $$1(this)[0].value;
                            MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeOther())
                                .then(updateOsdView);
                        });
                        const $input = $$1('<label/>').append(alarmInput);
                        $alarms.append($input);
                    }

                    // Timers
                    $$1('.timers-container').show();
                    const $timers = $$1('#timer-fields').empty();
                    for (const tim of OSD.data.timers) {
                        const $timerConfig = $$1(`<div class="switchable-field field-${tim.index}"></div>`);
                        const timerTable = $$1('<table />');
                        $timerConfig.append(timerTable);
                        let timerTableRow = $$1('<tr />');
                        timerTable.append(timerTableRow);

                        // Timer number
                        timerTableRow.append(`<td>${tim.index + 1}</td>`);

                        // Source
                        const sourceTimerTableData = $$1('<td class="timer-detail osd_tip"></td>');
                        sourceTimerTableData.attr('title', i18n$1.getMessage('osdTimerSourceTooltip'));
                        sourceTimerTableData.append(`<label for="timerSource_${tim.index}" class="char-label">${i18n$1.getMessage('osdTimerSource')}</label>`);
                        const src = $$1(`<select class="timer-option" id="timerSource_${tim.index}"></select>`);
                        OSD.constants.TIMER_TYPES.forEach(function(e, i) {
                            const timerSourceOptionText = i18n$1.getMessage(`osdTimerSourceOption${inflection.camelize(e.toLowerCase())}`);
                            src.append(`<option value="${i}">${timerSourceOptionText}</option>`);
                        });
                        // Sort the element, if need to group, do it by lexical sort, ie. by naming of (the translated) selection text
                        src.sortSelect();
                        src[0].selectedIndex = tim.src;
                        src.blur(function() {
                            const idx = $$1(this)[0].id.split("_")[1];
                            OSD.data.timers[idx].src = $$1(this)[0].selectedIndex;
                            MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeTimer(OSD.data.timers[idx]))
                                .then(updateOsdView);
                        });
                        sourceTimerTableData.append(src);
                        timerTableRow.append(sourceTimerTableData);

                        // Precision
                        timerTableRow = $$1('<tr />');
                        timerTable.append(timerTableRow);
                        const precisionTimerTableData = $$1('<td class="timer-detail osd_tip"></td>');
                        precisionTimerTableData.attr('title', i18n$1.getMessage('osdTimerPrecisionTooltip'));
                        precisionTimerTableData.append(`<label for="timerPrec_${tim.index}" class="char-label">${i18n$1.getMessage('osdTimerPrecision')}</label>`);
                        const precision = $$1(`<select class="timer-option osd_tip" id="timerPrec_${tim.index}"></select>`);
                        OSD.constants.TIMER_PRECISION.forEach(function(e, i) {
                            const timerPrecisionOptionText = i18n$1.getMessage(`osdTimerPrecisionOption${inflection.camelize(e.toLowerCase())}`);
                            precision.append(`<option value="${i}">${timerPrecisionOptionText}</option>`);
                        });
                        precision[0].selectedIndex = tim.precision;
                        precision.blur(function() {
                            const idx = $$1(this)[0].id.split("_")[1];
                            OSD.data.timers[idx].precision = $$1(this)[0].selectedIndex;
                            MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeTimer(OSD.data.timers[idx]))
                                .then(updateOsdView);
                        });
                        precisionTimerTableData.append(precision);
                        timerTableRow.append('<td></td>');
                        timerTableRow.append(precisionTimerTableData);

                        // Alarm
                        timerTableRow = $$1('<tr />');
                        timerTable.append(timerTableRow);
                        const alarmTimerTableData = $$1('<td class="timer-detail osd_tip"></td>');
                        alarmTimerTableData.attr('title', i18n$1.getMessage('osdTimerAlarmTooltip'));
                        alarmTimerTableData.append(`<label for="timerAlarm_${tim.index}" class="char-label">${i18n$1.getMessage('osdTimerAlarm')}</label>`);
                        const alarm = $$1(`<input class="timer-option osd_tip" name="alarm" type="number" min=0 id="timerAlarm_${tim.index}"/>`);
                        alarm[0].value = tim.alarm;
                        alarm.blur(function() {
                            const idx = $$1(this)[0].id.split("_")[1];
                            OSD.data.timers[idx].alarm = $$1(this)[0].value;
                            MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeTimer(OSD.data.timers[idx]))
                                .then(updateOsdView);
                        });
                        alarmTimerTableData.append(alarm);
                        timerTableRow.append('<td></td>');
                        timerTableRow.append(alarmTimerTableData);

                        $timers.append($timerConfig);

                        // Post flight statistics
                        $$1('.stats-container').show();
                        const $statsFields = $$1('#post-flight-stat-fields').empty();

                        for (const field of OSD.data.statItems) {
                            if (!field.name) {
                                continue;
                            }

                            const $field = $$1(`<div class="switchable-field field-${field.index}"></div>`);
                            let desc = null;
                            if (field.desc && field.desc.length) {
                                desc = i18n$1.getMessage(field.desc);
                            }
                            if (desc && desc.length) {
                                $field[0].classList.add('osd_tip');
                                $field.attr('title', desc);
                            }
                            $field.append(
                                $$1(`<input type="checkbox" name="${field.name}" class="togglesmall"></input>`)
                                    .data('field', field)
                                    .attr('checked', field.enabled)
                                    .change(function() {
                                        const fieldChanged = $$1(this).data('field');

                                        fieldChanged.enabled = !fieldChanged.enabled;

                                        if (self.analyticsChanges[`OSDStatistic${fieldChanged.name}`] === undefined) {
                                            self.analyticsChanges[`OSDStatistic${fieldChanged.name}`] = 0;
                                        }
                                        self.analyticsChanges[`OSDStatistic${fieldChanged.name}`] += fieldChanged.enabled ? 1 : -1;

                                        MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeStatistics(fieldChanged))
                                            .then(updateOsdView);
                                    }),
                            );
                            $field.append(`<label for="${field.name}" class="char-label">${titleizeField(field)}</label>`);

                            // Insert in alphabetical order, with unknown fields at the end
                            $field.name = field.name;
                            insertOrdered($statsFields, $field);
                        }

                        // Warnings
                        $$1('.warnings-container').show();
                        const $warningFields = $$1('#warnings-fields').empty();

                        for (const field of OSD.data.warnings) {
                            if (!field.name) {
                                continue;
                            }

                            const $field = $$1(`<div class="switchable-field field-${field.index}"></div>`);
                            let desc = null;
                            if (field.desc && field.desc.length) {
                                desc = i18n$1.getMessage(field.desc);
                            }
                            if (desc && desc.length) {
                                $field[0].classList.add('osd_tip');
                                $field.attr('title', desc);
                            }
                            $field.append(
                                $$1(`<input type="checkbox" name="${field.name}" class="togglesmall"></input>`)
                                    .data('field', field)
                                    .attr('checked', field.enabled)
                                    .change(function() {
                                        const fieldChanged = $$1(this).data('field');
                                        fieldChanged.enabled = !fieldChanged.enabled;

                                        if (self.analyticsChanges[`OSDWarning${fieldChanged.name}`] === undefined) {
                                            self.analyticsChanges[`OSDWarning${fieldChanged.name}`] = 0;
                                        }
                                        self.analyticsChanges[`OSDWarning${fieldChanged.name}`] += fieldChanged.enabled ? 1 : -1;

                                        MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeOther())
                                            .then(updateOsdView);
                                    }),
                            );

                            const finalFieldName = titleizeField(field);
                            $field.append(`<label for="${field.name}" class="char-label">${finalFieldName}</label>`);

                            // Insert in alphabetical order, with unknown fields at the end
                            $field.name = field.name;
                            insertOrdered($warningFields, $field);

                        }

                    }

                    if (!(OSD.data.state.haveMax7456Configured || OSD.data.state.isMspDevice)) {
                        $$1('.requires-max7456').hide();
                    }

                    if (!OSD.data.state.isMax7456FontDeviceDetected || !OSD.data.state.haveMax7456FontDeviceConfigured) {
                        $$1('.requires-max7456-font-device-detected').addClass('disabled');
                    }

                    if (!OSD.data.state.haveOsdFeature) {
                        $$1('.requires-osd-feature').hide();
                    }

                    const numberOfProfiles = OSD.getNumberOfProfiles();

                    // Header for the switches
                    const headerSwitchesElement = $$1('.elements').find('.osd-profiles-header');
                    if (headerSwitchesElement.children().length === 0) {
                        for (let profileNumber = 0; profileNumber < numberOfProfiles; profileNumber++) {
                            headerSwitchesElement.append(`<span class="profileOsdHeader">${profileNumber + 1}</span>`);
                        }
                    }

                    // Populate the profiles selector preview and current active
                    const osdProfileSelectorElement = $$1('.osdprofile-selector');
                    const osdProfileActiveElement = $$1('.osdprofile-active');
                    if (osdProfileSelectorElement.children().length === 0) {
                        for (let profileNumber = 0; profileNumber < numberOfProfiles; profileNumber++) {
                            const optionText = i18n$1.getMessage('osdSetupPreviewSelectProfileElement', {profileNumber : (profileNumber + 1)});
                            osdProfileSelectorElement.append(new Option(optionText, profileNumber));
                            osdProfileActiveElement.append(new Option(optionText, profileNumber));
                        }
                    }

                    // Select the current OSD profile
                    osdProfileActiveElement.val(OSD.data.osd_profiles.selected);

                    // Populate the fonts selector preview
                    const osdFontSelectorElement = $$1('.osdfont-selector');
                    const osdFontPresetsSelectorElement = $$1('.fontpresets');
                    if (osdFontSelectorElement.children().length === 0) {

                        // Custom font selected by the user
                        const option = $$1('<option>', {
                            text: i18n$1.getMessage("osdSetupFontPresetsSelectorCustomOption"),
                            value: -1,
                            "disabled": "disabled",
                            "style":"display: none;",
                        });
                        osdFontSelectorElement.append($$1(option));

                        // Standard fonts
                        OSD.constants.FONT_TYPES.forEach(function(e) {
                            osdFontSelectorElement.append(new Option(i18n$1.getMessage(e.name), e.file));
                        });

                        // Sort the element, if need to group, do it by lexical sort, ie. by naming of (the translated) selection text
                        osdFontSelectorElement.sortSelect(i18n$1.getMessage("osdSetupFontTypeDefault"));

                        osdFontSelectorElement.change(function() {
                            // Change the font selected in the Font Manager, in this way it is easier to flash if the user likes it
                            osdFontPresetsSelectorElement.val(this.value).change();
                        });
                    }

                    // Select the same element than the Font Manager window
                    osdFontSelectorElement.val(osdFontPresetsSelectorElement.val() != null ? osdFontPresetsSelectorElement.val() : -1);
                    // Hide custom if not used
                    $$1('.osdfont-selector option[value=-1]').toggle(osdFontSelectorElement.val() === -1);

                    // Zoom option for the preview only for mobile devices
                    if (GUI.isCordova()) {
                        $$1('.osd-preview-zoom-group').css({display: 'inherit'});
                        $$1('#osd-preview-zoom-selector').on('change', function() {
                            $$1('.tab-osd .osd-preview').toggleClass('osd-preview-zoom', this.checked);
                        });
                    }

                    // display fields on/off and position
                    const $displayFields = $$1('#element-fields').empty();
                    for (const field of OSD.data.displayItems) {
                        // versioning related, if the field doesn't exist at the current flight controller version, just skip it
                        if (!field.name) {
                            continue;
                        }

                        if (field.isVisible[OSD.getCurrentPreviewProfile()]) ;

                        const $field = $$1(`<div class="switchable-field switchable-field-flex field-${field.index}"></div>`);
                        let desc = null;
                        if (field.desc && field.desc.length) {
                            desc = i18n$1.getMessage(field.desc);
                        }
                        if (desc && desc.length) {
                            $field[0].classList.add('osd_tip');
                            $field.attr('title', desc);
                        }
                        for (let osd_profile = 0; osd_profile < OSD.getNumberOfProfiles(); osd_profile++) {
                            $field.append(
                                    $$1(`<input type="checkbox" name="${field.name}"></input>`)
                                        .data('field', field)
                                        .data('osd_profile', osd_profile)
                                        .attr('checked', field.isVisible[osd_profile])
                                        .change(function() {
                                            const fieldChanged = $$1(this).data('field');
                                            const profile = $$1(this).data('osd_profile');
                                            const $position = $$1(this).parent().find(`.position.${fieldChanged.name}`);
                                            fieldChanged.isVisible[profile] = !fieldChanged.isVisible[profile];

                                            if (self.analyticsChanges[`OSDElement${fieldChanged.name}`] === undefined) {
                                                self.analyticsChanges[`OSDElement${fieldChanged.name}`] = 0;
                                            }
                                            self.analyticsChanges[`OSDElement${fieldChanged.name}`] += fieldChanged.isVisible[profile] ? 1 : -1;

                                            if (fieldChanged.isVisible[OSD.getCurrentPreviewProfile()]) {
                                                $position.show();
                                            } else {
                                                $position.hide();
                                            }
                                            MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeLayout(fieldChanged))
                                                .then(function() {
                                                    updateOsdView();
                                                });
                                        }),
                                );
                        }

                        const finalFieldName = titleizeField(field);
                        const $labelAndVariant = $$1('<div class="switchable-field-description"></div>');
                        $labelAndVariant.append(`<label for="${field.name}" class="char-label">${finalFieldName}</label>`);



                        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44) && field.variants && field.variants.length > 0) {

                            const selectVariant = $$1('<select class="osd-variant" />')
                                .data('field', field)
                                .on("change", function() {
                                    const fieldChanged = $$1(this).data('field');
                                    fieldChanged.variant = parseInt($$1(this).val());
                                    MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeLayout(fieldChanged))
                                        .then(function() {
                                            updateOsdView();
                                        });
                                    });

                            for (const [variantIndex, variantText] of field.variants.entries()) {
                                selectVariant.append($$1('<option/>')
                                             .val(variantIndex)
                                             .html(i18n$1.getMessage(variantText)));
                            }

                            // Sort the element, if need to group, do it by lexical sort, ie. by naming of (the translated) selection text
                            selectVariant.sortSelect();

                            selectVariant.val(field.variant);

                            $labelAndVariant.append(selectVariant);
                        }

                        if (field.positionable && field.isVisible[OSD.getCurrentPreviewProfile()]) {
                            $field.append(
                                $$1(`<input type="number" class="${field.index} position"></input>`)
                                    .data('field', field)
                                    .val(field.position)
                                    .change(debounce(function() {
                                        const fieldChanged = $$1(this).data('field');
                                        const position = parseInt($$1(this).val());
                                        fieldChanged.position = position;
                                        MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeLayout(fieldChanged))
                                            .then(function() {
                                                updateOsdView();
                                            });
                                    }, 250)),
                            );
                        }

                        $field.append($labelAndVariant);
                        // Insert in alphabetical order, with unknown fields at the end
                        $field.name = field.name;
                        insertOrdered($displayFields, $field);
                    }

                    GUI.switchery();
                    // buffer the preview
                    OSD.data.preview = [];
                    OSD.data.displaySize.total = OSD.data.displaySize.x * OSD.data.displaySize.y;
                    for (const field of OSD.data.displayItems) {
                        // reset fields that somehow end up off the screen
                        if (field.position > OSD.data.displaySize.total) {
                            field.position = 0;
                        }
                    }
                    // clear the buffer
                    for (let i = 0; i < OSD.data.displaySize.total; i++) {
                        OSD.data.preview.push([null, ' '.charCodeAt(0), null, null]);
                    }

                    // draw all the displayed items and the drag and drop preview images
                    for (const field of OSD.data.displayItems) {

                        if (!field.preview || !field.isVisible[OSD.getCurrentPreviewProfile()]) {
                            continue;
                        }

                        let selectedPosition = (field.position >= 0) ? field.position : field.position + OSD.data.displaySize.total;

                        // create the preview image
                        field.preview_img = new Image();
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext("2d");

                        // Standard preview, type String
                        if (field.preview.constructor !== Array) {

                            // fill the screen buffer
                            for (let i = 0; i < field.preview.length; i++) {

                                // Add the character to the preview
                                const charCode = field.preview.charCodeAt(i);
                                OSD.drawByOrder(selectedPosition, field, charCode, i, 1);
                                selectedPosition++;

                                // Image used when "dragging" the element
                                if (field.positionable) {
                                    const img = new Image();
                                    img.src = FONT.draw(charCode);
                                    ctx.drawImage(img, i * 12, 0);
                                }
                            }
                        } else {
                            const arrayElements = field.preview;
                            for (let i = 0; i < arrayElements.length; i++) {
                                const element = arrayElements[i];
                                //Add string to the preview.
                                if (element.constructor === String) {
                                    for(let j = 0; j < element.length; j++) {
                                        const charCode = element.charCodeAt(j);
                                        OSD.drawByOrder(selectedPosition, field, charCode, j, i);
                                        selectedPosition++;
                                        // Image used when "dragging" the element
                                        if (field.positionable) {
                                            const img = new Image();
                                            img.src = FONT.draw(charCode);
                                            ctx.drawImage(img, j * 12, i * 18);
                                        }
                                    }
                                    selectedPosition = selectedPosition - element.length + OSD.data.displaySize.x;
                                } else {
                                    const limits = OSD.searchLimitsElement(arrayElements);
                                    let offsetX = 0;
                                    let offsetY = 0;
                                        if (limits.minX < 0) {
                                            offsetX = -limits.minX;
                                        }
                                        if (limits.minY < 0) {
                                            offsetY = -limits.minY;
                                        }
                                        // Add the character to the preview
                                        const charCode = element.sym;
                                        OSD.drawByOrder(selectedPosition + element.x + element.y * OSD.data.displaySize.x, field, charCode, element.x, element.y);
                                        // Image used when "dragging" the element
                                        if (field.positionable) {
                                            const img = new Image();
                                            img.src = FONT.draw(charCode);
                                            ctx.drawImage(img, (element.x + offsetX) * 12, (element.y + offsetY) * 18);
                                        }
                                }
                            }

                        }
                        field.preview_img.src = canvas.toDataURL('image/png');
                        // Required for NW.js - Otherwise the <img /> will
                        //consume drag/drop events.
                        field.preview_img.style.pointerEvents = 'none';
                    }

                    // render
                    const $preview = $$1('.display-layout .preview').empty();
                    let $row = $$1('<div class="row"></div>');
                    for (let i = 0; i < OSD.data.displaySize.total;) {
                        let charCode = OSD.data.preview[i];
                        let field;
                        let x;
                        let y;
                        if (typeof charCode === 'object') {
                            field = OSD.data.preview[i][0];
                            charCode = OSD.data.preview[i][1];
                            x = OSD.data.preview[i][2];
                            y = OSD.data.preview[i][3];
                        }
                        const $img = $$1(`<div class="char" draggable><img src=${FONT.draw(charCode)}></img></div>`)
                            .on('mouseenter', OSD.GUI.preview.onMouseEnter)
                            .on('mouseleave', OSD.GUI.preview.onMouseLeave)
                            .on('dragover', OSD.GUI.preview.onDragOver)
                            .on('dragleave', OSD.GUI.preview.onDragLeave)
                            .on('drop', OSD.GUI.preview.onDrop)
                            .data('field', field)
                            .data('position', i);
                        // Required for NW.js - Otherwise the <img /> will
                        // consume drag/drop events.
                        $img.find('img').css('pointer-events', 'none');
                        $img.attr('data-x', x).attr('data-y', y);
                        if (field && field.positionable) {
                            $img
                                .addClass(`field-${field.index}`)
                                .data('field', field)
                                .prop('draggable', true)
                                .on('dragstart', OSD.GUI.preview.onDragStart);
                        }
                        $row.append($img);
                        i++;
                        if (i % OSD.data.displaySize.x === 0) {
                            $preview.append($row);
                            $row = $$1('<div class="row"></div>');
                        }
                    }

                    // Remove last tooltips
                    for (const tt of OSD.data.tooltips) {
                        tt.destroy();
                    }
                    OSD.data.tooltips = [];

                    // Generate tooltips for OSD elements
                    $$1('.osd_tip').each(function() {
                        const myModal = new jBox('Tooltip', {
                            delayOpen: 100,
                            delayClose: 100,
                            position: {
                                x: 'right',
                                y: 'center',
                            },
                            outside: 'x',
                        });

                        myModal.attach($$1(this));

                        OSD.data.tooltips.push(myModal);
                    });
                });
        }

        $$1('.osdprofile-selector').change(updateOsdView);
        $$1('.osdprofile-active').change(function() {
            OSD.data.osd_profiles.selected = parseInt($$1(this).val());
            MSP$1.promise(MSPCodes.MSP_SET_OSD_CONFIG, OSD.msp.encodeOther())
                .then(function() {
                    updateOsdView();
                });
        });

        $$1('a.save').click(function() {
            MSP$1.promise(MSPCodes.MSP_EEPROM_WRITE);
            gui_log(i18n$1.getMessage('osdSettingsSaved'));
            const oldText = $$1(this).html();
            $$1(this).html(i18n$1.getMessage('osdButtonSaved'));
            setTimeout(() => {
                $$1(this).html(oldText);
            }, 1500);

            Object.keys(self.analyticsChanges).forEach(function(change) {
                const value = self.analyticsChanges[change];
                if (value > 0) {
                    self.analyticsChanges[change] = 'On';
                } else if (value < 0) {
                    self.analyticsChanges[change] = 'Off';
                } else {
                    self.analyticsChanges[change] = undefined;
                }
            });

            tracking.sendSaveAndChangeEvents(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, self.analyticsChanges, 'osd');
            self.analyticsChanges = {};
        });

        // font preview window
        const fontPreviewElement = $$1('.font-preview');

        // init structs once, also clears current font
        FONT.initData();

        fontPresetsElement.change(function() {
            const $font = $$1('.fontpresets option:selected');
            let fontver = 1;
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                fontver = 2;
            }
            $$1('.font-manager-version-info').text(i18n$1.getMessage(`osdDescribeFontVersion${fontver}`));
            $$1.get(`./resources/osd/${fontver}/${$font.data('font-file')}.mcm`, function(data) {
                FONT.parseMCMFontFile(data);
                FONT.preview(fontPreviewElement);
                LogoManager.drawPreview();
                updateOsdView();
                $$1('.fontpresets option[value=-1]').hide();
            });
        });
        // load the first font when we change tabs
        fontPresetsElement.change();


        $$1('button.load_font_file').click(function() {
            FONT.openFontFile().then(function() {
                FONT.preview(fontPreviewElement);
                LogoManager.drawPreview();
                updateOsdView();
                $$1('.font-manager-version-info').text(i18n$1.getMessage('osdDescribeFontVersionCUSTOM'));
                $$1('.fontpresets option[value=-1]').show();
                $$1('.fontpresets').val(-1);
            }).catch(error => console.error(error));
        });

        // font upload
        $$1('a.flash_font').click(function() {
            if (!GUI.connect_lock) { // button disabled while flashing is in progress
                $$1('a.flash_font').addClass('disabled');
                $$1('.progressLabel').text(i18n$1.getMessage('osdSetupUploadingFont'));
                FONT.upload($$1('.progress').val(0)).then(function() {
                    $$1('.progressLabel').text(i18n$1.getMessage('osdSetupUploadingFontEnd', {length: FONT.data.characters.length}));
                });
            }
        });

        // replace logo
        $$1('a.replace_logo').click(() => {
            if (GUI.connect_lock) { // button disabled while flashing is in progress
                return;
            }
            LogoManager.openImage()
                .then(ctx => {
                    LogoManager.replaceLogoInFont(ctx);
                    LogoManager.drawPreview();
                    LogoManager.showUploadHint();
                })
                .catch(error => console.error(error));
        });

        $$1(document).on('click', 'span.progressLabel a.save_font', function() {
            chrome.fileSystem.chooseEntry({ type: 'saveFile', suggestedName: 'baseflight', accepts: [{ description: 'MCM files', extensions: ['mcm'] }] }, function(fileEntry) {
                if (checkChromeRuntimeError()) {
                    return;
                }

                chrome.fileSystem.getDisplayPath(fileEntry, function(path) {
                    console.log(`Saving firmware to: ${path}`);

                    // check if file is writable
                    chrome.fileSystem.isWritableEntry(fileEntry, function(isWritable) {
                        if (isWritable) {
                            // TODO: is this coming from firmware_flasher? seems a bit random
                            // eslint-disable-next-line no-undef
                            const blob = new Blob([intel_hex], { type: 'text/plain' });

                            fileEntry.createWriter(function(writer) {
                                let truncated = false;

                                writer.onerror = function(e) {
                                    console.error(e);
                                };

                                writer.onwriteend = function() {
                                    if (!truncated) {
                                        // onwriteend will be fired again when truncation is finished
                                        truncated = true;
                                        writer.truncate(blob.size);

                                        return;
                                    }
                                };

                                writer.write(blob);
                            }, function(e) {
                                console.error(e);
                            });
                        } else {
                            console.log('You don\'t have write permissions for this file, sorry.');
                            gui_log(i18n$1.getMessage('osdWritePermissions'));
                        }
                    });
                });
            });
        });

        self.analyticsChanges = {};

        MSP$1.promise(MSPCodes.MSP_RX_CONFIG)
            .finally(() => {
                GUI.content_ready(callback);
            });
    });
};

osd.cleanup = function(callback) {
    PortHandler$1.flush_callbacks();

    if (OSD.GUI.fontManager) {
        OSD.GUI.fontManager.destroy();
    }

    // unbind "global" events
    $$1(document).unbind('keypress');
    $$1(document).off('click', 'span.progressLabel a');

    if (callback) {
        callback();
    }
};

TABS.osd = osd;

var osd$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  OSD: OSD,
  osd: osd
});

const UI_PHONES = {
    background: '#background',
    tabContainer: '.tab_container',
    tabContentContainer: '#tab-content-container',
    headerbar: '.headerbar',
    init: function() {
        const self = this;
        $$1('#menu_btn').click(function() {
            self.openSideMenu();
        });
        $$1(this.background).click(function() {
            self.closeSideMenu();
        });
        $$1('#tabs a').click(function() {
            if ($$1('.tab_container').hasClass('reveal')) {
                self.closeSideMenu();
            }
        });
        $$1('#reveal_btn').click(function() {
            self.expandHeader();
        });
        $$1(`${this.background}, ${this.tabContainer}`).swipe( {
            swipeLeft: function() {
                self.closeSideMenu();
            },
        });
        $$1('#side_menu_swipe').swipe( {
            swipeRight: function() {
                self.openSideMenu();
            },
        });
    },
    initToolbar: function() {
        $$1('.toolbar_expand_btn').click(this.expandToolbar);
    },
    openSideMenu: function() {
        $$1(this.background).fadeIn(300);
        $$1(this.tabContainer).addClass('reveal');
    },
    closeSideMenu: function() {
        $$1(this.background).fadeOut(300);
        $$1(this.tabContainer).removeClass('reveal');
    },
    expandHeader: function() {
        const self = this;
        let expand, headerExpanded, reveal;
        if (GUI.connected_to) {
            expand = 'expand2';
            headerExpanded = 'header_expanded2';
            reveal = '.header-wrapper';
        } else {
            expand = 'expand';
            headerExpanded = 'headerExpanded';
            reveal = '#port-picker';
        }
        if ($$1(self.headerbar).hasClass(expand)) {
            $$1(reveal).removeClass('reveal');
            setTimeout(function() {
                $$1(self.tabContentContainer).removeClass(headerExpanded);
                $$1(self.headerbar).removeClass(expand);
            }, 100);
        } else {
            $$1(self.tabContentContainer).addClass(headerExpanded);
            $$1(self.headerbar).addClass(expand);
            setTimeout(function() {
                $$1(reveal).addClass('reveal');
            }, 100);
        }
    },
    expandToolbar: function() {
        const toolbar = $$1('.content_toolbar.xs-compressed');
        if (toolbar.length > 0) {
            if ($$1('.content_toolbar.xs-compressed').hasClass('expanded')) {
                toolbar.removeClass('expanded');
            } else {
                toolbar.addClass('expanded');
            }
        }
    },
    reset: function() {
        $$1(this.tabContentContainer).removeClass('header_expanded2 header_expanded');
        $$1('#port-picker, .header-wrapper').removeClass('reveal');
        $$1(this.headerbar).removeClass('expand2 expand');
    },
};

function have_sensor(sensors_detected, sensor_code) {
    switch(sensor_code) {
        case 'acc':
            return bit_check(sensors_detected, 0);
        case 'baro':
            return bit_check(sensors_detected, 1);
        case 'mag':
            return bit_check(sensors_detected, 2);
        case 'gps':
            return bit_check(sensors_detected, 3);
        case 'sonar':
            return bit_check(sensors_detected, 4);
        case 'gyro':
            return bit_check(sensors_detected, 5);
    }
    return false;
}

function sensor_status(sensors_detected = 0, gps_fix_state = 0) {
    // initialize variable (if it wasn't)
    if (!sensor_status.previous_sensors_detected) {
        sensor_status.previous_sensors_detected = -1; // Otherwise first iteration will not be run if sensors_detected == 0
    }
    if (!sensor_status.previous_gps_fix_state) {
        sensor_status.previous_gps_fix_state = -1;
    }

    // update UI (if necessary)
    if (sensor_status.previous_sensors_detected === sensors_detected && sensor_status.previous_gps_fix_state === gps_fix_state) {
        return;
    }

    // set current value
    sensor_status.previous_sensors_detected = sensors_detected;
    sensor_status.previous_gps_fix_state = gps_fix_state;

    const eSensorStatus = $$1("div#sensor-status");

    if (have_sensor(sensors_detected, "acc")) {
        $$1(".accel", eSensorStatus).addClass("on");
        $$1(".accicon", eSensorStatus).addClass("active");
    } else {
        $$1(".accel", eSensorStatus).removeClass("on");
        $$1(".accicon", eSensorStatus).removeClass("active");
    }

    if (have_sensor(sensors_detected, "gyro")) {
        $$1(".gyro", eSensorStatus).addClass("on");
        $$1(".gyroicon", eSensorStatus).addClass("active");
    } else {
        $$1(".gyro", eSensorStatus).removeClass("on");
        $$1(".gyroicon", eSensorStatus).removeClass("active");
    }

    if (have_sensor(sensors_detected, "baro")) {
        $$1(".baro", eSensorStatus).addClass("on");
        $$1(".baroicon", eSensorStatus).addClass("active");
    } else {
        $$1(".baro", eSensorStatus).removeClass("on");
        $$1(".baroicon", eSensorStatus).removeClass("active");
    }

    if (have_sensor(sensors_detected, "mag")) {
        $$1(".mag", eSensorStatus).addClass("on");
        $$1(".magicon", eSensorStatus).addClass("active");
    } else {
        $$1(".mag", eSensorStatus).removeClass("on");
        $$1(".magicon", eSensorStatus).removeClass("active");
    }

    if (have_sensor(sensors_detected, "gps")) {
        $$1(".gps", eSensorStatus).addClass("on");
        if (gps_fix_state) {
            $$1(".gpsicon", eSensorStatus).removeClass("active");
            $$1(".gpsicon", eSensorStatus).addClass("active_fix");
        } else {
            $$1(".gpsicon", eSensorStatus).removeClass("active_fix");
            $$1(".gpsicon", eSensorStatus).addClass("active");
        }
    } else {
        $$1(".gps", eSensorStatus).removeClass("on");
        $$1(".gpsicon", eSensorStatus).removeClass("active");
        $$1(".gpsicon", eSensorStatus).removeClass("active_fix");
    }

    if (have_sensor(sensors_detected, "sonar")) {
        $$1(".sonar", eSensorStatus).addClass("on");
        $$1(".sonaricon", eSensorStatus).addClass("active");
    } else {
        $$1(".sonar", eSensorStatus).removeClass("on");
        $$1(".sonaricon", eSensorStatus).removeClass("active");
    }
}

const serial = isWeb() ? serialWeb : serial$3;

let mspHelper$1;
let connectionTimestamp;
let liveDataRefreshTimerId = false;

let isConnected = false;

const toggleStatus = function () {
    isConnected = !isConnected;
};

function connectHandler(event) {
    onOpen(event.detail);
    toggleStatus();
}

function disconnectHandler(event) {
    onClosed(event.detail);
}

function initializeSerialBackend() {
    GUI.updateManualPortVisibility = function() {
        const selected_port = $$1('div#port-picker #port option:selected');
        const selectedPortData = selected_port.data() || {};
        if (selectedPortData.isManual) {
            $$1('#port-override-option').show();
        }
        else {
            $$1('#port-override-option').hide();
        }
        if (selectedPortData.isVirtual) {
            $$1('#firmware-virtual-option').show();
        }
        else {
            $$1('#firmware-virtual-option').hide();
        }

        $$1('#auto-connect-and-baud').toggle(!selectedPortData.isDFU);
    };

    GUI.updateManualPortVisibility();

    $$1('#port-override').change(function () {
        set$1({'portOverride': $$1('#port-override').val()});
    });

    const data = get$1('portOverride');
    if (data.portOverride) {
        $$1('#port-override').val(data.portOverride);
    }

    $$1('div#port-picker #port').change(function (target) {
        GUI.updateManualPortVisibility();
    });


    $$1("div.connect_controls a.connect").on('click', function () {

        const selectedPort = $$1('div#port-picker #port option:selected');
        const selectedPortData = selectedPort.data() || {};
        let portName;
        if (selectedPortData.isManual) {
            portName = $$1('#port-override').val();
        } else {
            portName = String($$1('div#port-picker #port').val());
        }

        if (!GUI.connect_lock) {
            // GUI control overrides the user control

            GUI.configuration_loaded = false;

            const selected_baud = parseInt($$1('div#port-picker #baud').val());
            const selectedPort = $$1('div#port-picker #port option:selected');
            const selectedPortData = selectedPort.data() || {};

            if (selectedPortData.isDFU) {
                $$1('select#baud').hide();
            } else if (portName !== '0') {
                if (!isConnected) {
                    console.log(`Connecting to: ${portName}`);
                    GUI.connecting_to = portName;

                    // lock port select & baud while we are connecting / connected
                    $$1('div#port-picker #port, div#port-picker #baud, div#port-picker #delay').prop('disabled', true);
                    $$1('div.connect_controls div.connect_state').text(i18n$1.getMessage('connecting'));

                    const baudRate = parseInt($$1('div#port-picker #baud').val());
                    if (selectedPortData.isVirtual) {
                        CONFIGURATOR.virtualMode = true;
                        CONFIGURATOR.virtualApiVersion = $$1('#firmware-version-dropdown :selected').val();

                        serial.connect('virtual', {}, onOpenVirtual);
                    } else if (isWeb()) {
                        // Explicitly disconnect the event listeners before attaching the new ones.
                        serial.removeEventListener('connect', connectHandler);
                        serial.addEventListener('connect', connectHandler);

                        serial.removeEventListener('disconnect', disconnectHandler);
                        serial.addEventListener('disconnect', disconnectHandler);

                        serial.connect({ baudRate });
                    } else {
                        serial.connect(
                            portName,
                            { bitrate: selected_baud },
                            onOpen,
                        );
                        toggleStatus();
                    }

                } else {
                    if ($$1('div#flashbutton a.flash_state').hasClass('active') && $$1('div#flashbutton a.flash').hasClass('active')) {
                        $$1('div#flashbutton a.flash_state').removeClass('active');
                        $$1('div#flashbutton a.flash').removeClass('active');
                    }
                    GUI.timeout_kill_all();
                    GUI.interval_kill_all();
                    GUI.tab_switch_cleanup(() => GUI.tab_switch_in_progress = false);

                    function onFinishCallback() {
                        finishClose(toggleStatus);
                    }

                    mspHelper$1?.setArmingEnabled(true, false, onFinishCallback);
                }
            }
        }
    });

    $$1('div.open_firmware_flasher a.flash').click(function () {
        if ($$1('div#flashbutton a.flash_state').hasClass('active') && $$1('div#flashbutton a.flash').hasClass('active')) {
            $$1('div#flashbutton a.flash_state').removeClass('active');
            $$1('div#flashbutton a.flash').removeClass('active');
            $$1('#tabs ul.mode-disconnected .tab_landing a').click();
        } else {
            $$1('#tabs ul.mode-disconnected .tab_firmware_flasher a').click();
            $$1('div#flashbutton a.flash_state').addClass('active');
            $$1('div#flashbutton a.flash').addClass('active');
        }
    });

    // auto-connect
    const result = get$1('auto_connect');
    if (result.auto_connect === undefined || result.auto_connect) {
        // default or enabled by user
        GUI.auto_connect = true;

        $$1('input.auto_connect').prop('checked', true);
        $$1('input.auto_connect, span.auto_connect').prop('title', i18n$1.getMessage('autoConnectEnabled'));

        $$1('select#baud').val(115200).prop('disabled', true);
    } else {
        // disabled by user
        GUI.auto_connect = false;

        $$1('input.auto_connect').prop('checked', false);
        $$1('input.auto_connect, span.auto_connect').prop('title', i18n$1.getMessage('autoConnectDisabled'));
    }

    // bind UI hook to auto-connect checkbos
    $$1('input.auto_connect').change(function () {
        GUI.auto_connect = $$1(this).is(':checked');

        // update title/tooltip
        if (GUI.auto_connect) {
            $$1('input.auto_connect, span.auto_connect').prop('title', i18n$1.getMessage('autoConnectEnabled'));

            $$1('select#baud').val(115200).prop('disabled', true);
        } else {
            $$1('input.auto_connect, span.auto_connect').prop('title', i18n$1.getMessage('autoConnectDisabled'));

            if (!GUI.connected_to && !GUI.connecting_to) $$1('select#baud').prop('disabled', false);
        }

        set$1({'auto_connect': GUI.auto_connect});
    });

    PortHandler$1.initialize();
    PortUsage.initialize();
}

function finishClose(finishedCallback) {
    if (GUI.isCordova()) {
        UI_PHONES.reset();
    }

    const wasConnected = CONFIGURATOR.connectionValid;
    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'Disconnected', { time: connectionTimestamp ? Date.now() - connectionTimestamp : undefined});

    if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
        // close reset to custom defaults dialog
        $$1('#dialogResetToCustomDefaults')[0].close();
    }

    serial.disconnect(onClosed);

    MSP$1.disconnect_cleanup();
    PortUsage.reset();
    // To trigger the UI updates by Vue reset the state.
    FC.resetState();

    GUI.connected_to = false;
    GUI.allowedTabs = GUI.defaultAllowedTabsWhenDisconnected.slice();

    // close problems dialog
    $$1('#dialogReportProblems-closebtn').click();

    // unlock port select & baud
    $$1('div#port-picker #port').prop('disabled', false);
    if (!GUI.auto_connect) $$1('div#port-picker #baud').prop('disabled', false);

    // reset connect / disconnect button
    $$1('div.connect_controls a.connect').removeClass('active');
    $$1('div.connect_controls div.connect_state').text(i18n$1.getMessage('connect'));

    // reset active sensor indicators
    sensor_status();

    if (wasConnected) {
        // detach listeners and remove element data
        $$1('#content').empty();
    }

    $$1('#tabs .tab_landing a').click();

    finishedCallback();
}

function setConnectionTimeout() {
    // disconnect after 10 seconds with error if we don't get IDENT data
    GUI.timeout_add('connecting', function () {
        if (!CONFIGURATOR.connectionValid) {
            gui_log(i18n$1.getMessage('noConfigurationReceived'));

            $$1('div.connect_controls a.connect').click(); // disconnect
        }
    }, 10000);
}

function abortConnection() {
    GUI.timeout_remove('connecting'); // kill connecting timer

    GUI.connected_to = false;
    GUI.connecting_to = false;

    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'SerialPortFailed');

    gui_log(i18n$1.getMessage('serialPortOpenFail'));

    $$1('div#connectbutton div.connect_state').text(i18n$1.getMessage('connect'));
    $$1('div#connectbutton a.connect').removeClass('active');

    // unlock port select & baud
    $$1('div#port-picker #port, div#port-picker #baud, div#port-picker #delay').prop('disabled', false);

    // reset data
    isConnected = false;
}

/**
 * purpose of this is to bridge the old and new api
 * when serial events are handled.
 */
function read_serial_adapter(event) {
    const data = event.detail?.buffer ?? event.detail;
    read_serial({ data: data });
}

function onOpen(openInfo) {
    if (openInfo) {
        CONFIGURATOR.virtualMode = false;

        // update connected_to
        GUI.connected_to = GUI.connecting_to;

        // reset connecting_to
        GUI.connecting_to = false;
        gui_log(i18n$1.getMessage('serialPortOpened', serial.connectionType === 'serial' ? [serial.connectionId] : [openInfo.socketId]));

        // save selected port with chrome.storage if the port differs
        let result = get$1('last_used_port');
        if (result.last_used_port) {
            if (result.last_used_port !== GUI.connected_to) {
                // last used port doesn't match the one found in local db, we will store the new one
                set$1({'last_used_port': GUI.connected_to});
            }
        } else {
            // variable isn't stored yet, saving
            set$1({'last_used_port': GUI.connected_to});
        }

        // reset expert mode
        result = get$1('expertMode')?.expertMode ?? false;
        $$1('input[name="expertModeCheckbox"]').prop('checked', result).trigger('change');

        if(isWeb()) {
            serial.removeEventListener('receive', read_serial_adapter);
            serial.addEventListener('receive', read_serial_adapter);
        } else {
            serial.onReceive.addListener(read_serial);
        }
        setConnectionTimeout();
        FC.resetState();
        mspHelper$1 = new MspHelper();
        MSP$1.listen(mspHelper$1.process_data.bind(mspHelper$1));
        MSP$1.timeout = 250;
        console.log(`Requesting configuration data`);

        MSP$1.send_message(MSPCodes.MSP_API_VERSION, false, false, function () {
            gui_log(i18n$1.getMessage('apiVersionReceived', FC.CONFIG.apiVersion));

            if (FC.CONFIG.apiVersion.includes('null')) {
                abortConnection();
                return;
            }

            if (semver.gte(FC.CONFIG.apiVersion, CONFIGURATOR.API_VERSION_ACCEPTED)) {
                MSP$1.send_message(MSPCodes.MSP_FC_VARIANT, false, false, function () {
                    if (FC.CONFIG.flightControllerIdentifier === 'BTFL') {
                        MSP$1.send_message(MSPCodes.MSP_FC_VERSION, false, false, function () {
                            gui_log(i18n$1.getMessage('fcInfoReceived', [FC.CONFIG.flightControllerIdentifier, FC.CONFIG.flightControllerVersion]));

                            MSP$1.send_message(MSPCodes.MSP_BUILD_INFO, false, false, function () {

                                gui_log(i18n$1.getMessage('buildInfoReceived', [FC.CONFIG.buildInfo]));

                                // retrieve build options from the flight controller
                                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                                    FC.processBuildOptions();
                                }

                                MSP$1.send_message(MSPCodes.MSP_BOARD_INFO, false, false, processBoardInfo);
                            });
                        });
                    } else {
                        tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'ConnectionRefusedFirmwareType', { identifier: FC.CONFIG.flightControllerIdentifier });

                        const dialog = $$1('.dialogConnectWarning')[0];

                        $$1('.dialogConnectWarning-content').html(i18n$1.getMessage('firmwareTypeNotSupported'));

                        $$1('.dialogConnectWarning-closebtn').click(function() {
                            dialog.close();
                        });

                        dialog.showModal();

                        connectCli();
                    }
                });
            } else {
                tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'ConnectionRefusedFirmwareVersion', { apiVersion: FC.CONFIG.apiVersion });

                const dialog = $$1('.dialogConnectWarning')[0];

                $$1('.dialogConnectWarning-content').html(i18n$1.getMessage('firmwareVersionNotSupported', [CONFIGURATOR.API_VERSION_ACCEPTED]));

                $$1('.dialogConnectWarning-closebtn').click(function() {
                    dialog.close();
                });

                dialog.showModal();

                connectCli();
            }
        });
    } else {
        abortConnection();
    }
}

function onOpenVirtual() {
    GUI.connected_to = GUI.connecting_to;
    GUI.connecting_to = false;

    CONFIGURATOR.connectionValid = true;
    isConnected = true;

    mspHelper$1 = new MspHelper();

    VirtualFC.setVirtualConfig();

    processBoardInfo();

    update_dataflash_global();
    sensor_status(FC.CONFIG.activeSensors);
    updateTabList(FC.FEATURE_CONFIG.features);
}

function processCustomDefaults() {
    if (bit_check(FC.CONFIG.targetCapabilities, FC.TARGET_CAPABILITIES_FLAGS.SUPPORTS_CUSTOM_DEFAULTS) && bit_check(FC.CONFIG.targetCapabilities, FC.TARGET_CAPABILITIES_FLAGS.HAS_CUSTOM_DEFAULTS) && FC.CONFIG.configurationState === FC.CONFIGURATION_STATES.DEFAULTS_BARE) {
        const dialog = $$1('#dialogResetToCustomDefaults')[0];

        $$1('#dialogResetToCustomDefaults-acceptbtn').click(function() {
            tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'AcceptResetToCustomDefaults');

            const buffer = [];
            buffer.push(mspHelper$1.RESET_TYPES.CUSTOM_DEFAULTS);
            MSP$1.send_message(MSPCodes.MSP_RESET_CONF, buffer, false);

            dialog.close();

            GUI.timeout_add('disconnect', function () {
                $$1('div.connect_controls a.connect').click(); // disconnect
            }, 0);
        });

        $$1('#dialogResetToCustomDefaults-cancelbtn').click(function() {
            tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'CancelResetToCustomDefaults');

            dialog.close();

            setConnectionTimeout();

            checkReportProblems();
        });

        dialog.showModal();

        GUI.timeout_remove('connecting'); // kill connecting timer
    } else {
        checkReportProblems();
    }
}

function processBoardInfo() {

    gui_log(i18n$1.getMessage('boardInfoReceived', [FC.getHardwareName(), FC.CONFIG.boardVersion]));

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
        checkReportProblems();
    } else {
        processCustomDefaults();
    }
    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'Loaded', {
        boardIdentifier: FC.CONFIG.boardIdentifier,
        targetName: FC.CONFIG.targetName,
        boardName: FC.CONFIG.boardName,
        hardware: FC.getHardwareName(),
        manufacturerId: FC.CONFIG.manufacturerId,
        apiVersion: FC.CONFIG.apiVersion,
        flightControllerVersion: FC.CONFIG.flightControllerVersion,
        flightControllerIdentifier: FC.CONFIG.flightControllerIdentifier,
        mcu: FC.getMcuType(),
    });
}

function checkReportProblems() {
    const PROBLEM_ANALYTICS_EVENT = 'ProblemFound';
    const problemItemTemplate = $$1('#dialogReportProblems-listItemTemplate');

    function checkReportProblem(problemName, problems) {
        if (bit_check(FC.CONFIG.configurationProblems, FC.CONFIGURATION_PROBLEM_FLAGS[problemName])) {
            problems.push({name: problemName, description: i18n$1.getMessage(`reportProblemsDialog${problemName}`)});
            return true;
        }

        return false;
    }

    MSP$1.send_message(MSPCodes.MSP_STATUS, false, false, function () {
        let needsProblemReportingDialog = false;
        const problemDialogList = $$1('#dialogReportProblems-list');
        problemDialogList.empty();

        let problems = [];
        let abort = false;

        if (semver.minor(FC.CONFIG.apiVersion) > semver.minor(CONFIGURATOR.API_VERSION_MAX_SUPPORTED)) {
            const problemName = 'API_VERSION_MAX_SUPPORTED';
            problems.push({ name: problemName, description: i18n$1.getMessage(`reportProblemsDialog${problemName}`,
                [CONFIGURATOR.latestVersion, CONFIGURATOR.latestVersionReleaseUrl, CONFIGURATOR.getDisplayVersion(), FC.CONFIG.flightControllerVersion])});
            needsProblemReportingDialog = true;

            abort = true;
            GUI.timeout_remove('connecting'); // kill connecting timer
            $$1('div.connect_controls a.connect').click(); // disconnect
        }

        if (!abort) {
            // only check for problems if we are not already aborting
            needsProblemReportingDialog = checkReportProblem('MOTOR_PROTOCOL_DISABLED', problems) || needsProblemReportingDialog;

            if (have_sensor(FC.CONFIG.activeSensors, 'acc')) {
                needsProblemReportingDialog = checkReportProblem('ACC_NEEDS_CALIBRATION', problems) || needsProblemReportingDialog;
            }
        }

        if (needsProblemReportingDialog) {

            problems.map((problem) => {
                problemItemTemplate.clone().html(problem.description).appendTo(problemDialogList);
            });

            tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, PROBLEM_ANALYTICS_EVENT, { problems: problems.map((problem) => problem.name) });

            const problemDialog = $$1('#dialogReportProblems')[0];
            $$1('#dialogReportProblems-closebtn').click(function() {
                problemDialog.close();
            });

            problemDialog.showModal();
            $$1('#dialogReportProblems').scrollTop(0);
            $$1('#dialogReportProblems-closebtn').focus();
        }

        if (!abort) {
            // if we are not aborting, we can continue
            processUid();
        }
    });
}

async function processBuildOptions() {
    const supported = semver.eq(FC.CONFIG.apiVersion, API_VERSION_1_45);

    // firmware 1_45 or higher is required to support cloud build options
    // firmware 1_46 or higher retrieves build options from the flight controller
    if (supported && FC.CONFIG.buildKey.length === 32 && navigator.onLine) {
        const buildApi = new BuildApi();

        function onLoadCloudBuild(options) {
            FC.CONFIG.buildOptions = options.Request.Options;
            processCraftName();
        }

        buildApi.requestBuildOptions(FC.CONFIG.buildKey, onLoadCloudBuild, processCraftName);
    } else {
        processCraftName();
    }
}

async function processBuildConfiguration() {
    const supported = semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45);

    if (supported) {
        // get build key from firmware
        await MSP$1.promise(MSPCodes.MSP2_GET_TEXT, mspHelper$1.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.BUILD_KEY));
        gui_log(i18n$1.getMessage('buildKey', FC.CONFIG.buildKey));
    }

    processBuildOptions();
}

async function processUid() {
    await MSP$1.promise(MSPCodes.MSP_UID);

    connectionTimestamp = Date.now();

    gui_log(i18n$1.getMessage('uniqueDeviceIdReceived', FC.CONFIG.deviceIdentifier));

    processBuildConfiguration();

    tracking.sendEvent(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, 'Connected', {
        deviceIdentifier: CryptoES.SHA1(FC.CONFIG.deviceIdentifier),
    });
}

async function processCraftName() {
    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
        await MSP$1.promise(MSPCodes.MSP2_GET_TEXT, mspHelper$1.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.CRAFT_NAME));
    } else {
        await MSP$1.promise(MSPCodes.MSP_NAME);
    }

    gui_log(i18n$1.getMessage('craftNameReceived', semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45) ? [FC.CONFIG.craftName] : [FC.CONFIG.name]));

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
        await MSP$1.promise(MSPCodes.MSP2_GET_TEXT, mspHelper$1.crunch(MSPCodes.MSP2_GET_TEXT, MSPCodes.PILOT_NAME));
    }

    FC.CONFIG.armingDisabled = false;
    mspHelper$1.setArmingEnabled(false, false, setRtc);
}

function setRtc() {
    MSP$1.send_message(MSPCodes.MSP_SET_RTC, mspHelper$1.crunch(MSPCodes.MSP_SET_RTC), false, finishOpen);
}

function finishOpen() {
    CONFIGURATOR.connectionValid = true;

    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45) && FC.CONFIG.buildOptions.length) {

        GUI.allowedTabs = Array.from(GUI.defaultAllowedTabs);

        for (const tab of GUI.defaultCloudBuildTabOptions) {
            if (FC.CONFIG.buildOptions.some(opt => opt.toLowerCase().includes(tab))) {
                GUI.allowedTabs.push(tab);
            }
        }

    } else {
        GUI.allowedTabs = Array.from(GUI.defaultAllowedFCTabsWhenConnected);
    }

    if (GUI.isCordova()) {
        UI_PHONES.reset();
    }

    onConnect();

    GUI.selectDefaultTabWhenConnected();
}

function connectCli() {
    CONFIGURATOR.connectionValid = true; // making it possible to open the CLI tab
    GUI.allowedTabs = ['cli'];
    onConnect();
    $$1('#tabs .tab_cli a').click();
}

function onConnect() {
    if ($$1('div#flashbutton a.flash_state').hasClass('active') || $$1('div#flashbutton a.flash').hasClass('active')) {
        $$1('div#flashbutton a.flash_state').removeClass('active');
        $$1('div#flashbutton a.flash').removeClass('active');
    }

    GUI.timeout_remove('connecting'); // kill connecting timer

    $$1('div#connectbutton div.connect_state').text(i18n$1.getMessage('disconnect')).addClass('active');
    $$1('div#connectbutton a.connect').addClass('active');

    $$1('#tabs ul.mode-disconnected').hide();
    $$1('#tabs ul.mode-connected-cli').show();

    // show only appropriate tabs
    $$1('#tabs ul.mode-connected li').hide();
    $$1('#tabs ul.mode-connected li').filter(function (index) {
        const classes = $$1(this).attr("class").split(/\s+/);
        let found = false;

        $$1.each(GUI.allowedTabs, (_index, value) => {
            const tabName = `tab_${value}`;
            if ($$1.inArray(tabName, classes) >= 0) {
                found = true;
            }
        });

        if (FC.CONFIG.boardType == 0) {
            if (classes.indexOf("osd-required") >= 0) {
                found = false;
            }
        }

        return found;
    }).show();

    if (FC.CONFIG.flightControllerVersion !== '') {
        FC.FEATURE_CONFIG.features = new Features(FC.CONFIG);
        FC.BEEPER_CONFIG.beepers = new Beepers(FC.CONFIG);
        FC.BEEPER_CONFIG.dshotBeaconConditions = new Beepers(FC.CONFIG, [ "RX_LOST", "RX_SET" ]);

        $$1('#tabs ul.mode-connected').show();

        MSP$1.send_message(MSPCodes.MSP_FEATURE_CONFIG, false, false);
        MSP$1.send_message(MSPCodes.MSP_BATTERY_CONFIG, false, false);
        MSP$1.send_message(MSPCodes.MSP_DATAFLASH_SUMMARY, false, false);

        if (FC.CONFIG.boardType === 0 || FC.CONFIG.boardType === 2) {
            startLiveDataRefreshTimer();
        }
    }

    const sensorState = $$1('#sensor-status');
    sensorState.show();

    const portPicker = $$1('#portsinput');
    portPicker.hide();

    const dataflash = $$1('#dataflash_wrapper_global');
    dataflash.show();
}

function onClosed(result) {
    if (result) { // All went as expected
        gui_log(i18n$1.getMessage('serialPortClosedOk'));
    } else { // Something went wrong
        gui_log(i18n$1.getMessage('serialPortClosedFail'));
    }

    $$1('#tabs ul.mode-connected').hide();
    $$1('#tabs ul.mode-connected-cli').hide();
    $$1('#tabs ul.mode-disconnected').show();

    const sensorState = $$1('#sensor-status');
    sensorState.hide();

    const portPicker = $$1('#portsinput');
    portPicker.show();

    const dataflash = $$1('#dataflash_wrapper_global');
    dataflash.hide();

    const battery = $$1('#quad-status_wrapper');
    battery.hide();

    clearLiveDataRefreshTimer();

    MSP$1.clearListeners();

    CONFIGURATOR.connectionValid = false;
    CONFIGURATOR.cliValid = false;
    CONFIGURATOR.cliActive = false;
    CONFIGURATOR.cliEngineValid = false;
    CONFIGURATOR.cliEngineActive = false;
}

function read_serial(info) {
    if (CONFIGURATOR.cliActive) {
        MSP$1.clearListeners();
        MSP$1.disconnect_cleanup();
        TABS.cli.read(info);
    } else if (CONFIGURATOR.cliEngineActive) {
        TABS.presets.read(info);
    } else {
        MSP$1.read(info);
    }
}

async function update_live_status() {
    const statuswrapper = $$1('#quad-status_wrapper');

    if (GUI.active_tab !== 'cli' && GUI.active_tab !== 'presets') {
        await MSP$1.promise(MSPCodes.MSP_ANALOG);

        const nbCells = FC.ANALOG.voltage === 0 ? 1 : Math.floor(FC.ANALOG.voltage / FC.BATTERY_CONFIG.vbatmaxcellvoltage) + 1;
        const min = FC.BATTERY_CONFIG.vbatmincellvoltage * nbCells;
        const max = FC.BATTERY_CONFIG.vbatmaxcellvoltage * nbCells;
        const warn = FC.BATTERY_CONFIG.vbatwarningcellvoltage * nbCells;
        const NO_BATTERY_VOLTAGE_MAXIMUM = 1.8; // Maybe is better to add a call to MSP_BATTERY_STATE but is not available for all versions

        if (FC.ANALOG.voltage < min && FC.ANALOG.voltage > NO_BATTERY_VOLTAGE_MAXIMUM) {
            $$1(".battery-status").addClass('state-empty').removeClass('state-ok').removeClass('state-warning');
            $$1(".battery-status").css({ width: "100%" });
        } else {
            $$1(".battery-status").css({ width: `${((FC.ANALOG.voltage - min) / (max - min) * 100)}%` });

            if (FC.ANALOG.voltage < warn) {
                $$1(".battery-status").addClass('state-warning').removeClass('state-empty').removeClass('state-ok');
            } else  {
                $$1(".battery-status").addClass('state-ok').removeClass('state-warning').removeClass('state-empty');
            }
        }

        await MSP$1.promise(MSPCodes.MSP_BOXNAMES);
        await MSP$1.promise(MSPCodes.MSP_STATUS_EX);

        const active = (performance.now() - FC.ANALOG.last_received_timestamp) < 300;
        $$1(".linkicon").toggleClass('active', active);

        for (let i = 0; i < FC.AUX_CONFIG.length; i++) {
            if (FC.AUX_CONFIG[i] === 'ARM') {
                $$1(".armedicon").toggleClass('active', bit_check(FC.CONFIG.mode, i));
            }
            if (FC.AUX_CONFIG[i] === 'FAILSAFE') {
                $$1(".failsafeicon").toggleClass('active', bit_check(FC.CONFIG.mode, i));
            }
        }

        if (have_sensor(FC.CONFIG.activeSensors, 'gps')) {
            await MSP$1.promise(MSPCodes.MSP_RAW_GPS);
        }

        sensor_status(FC.CONFIG.activeSensors, FC.GPS_DATA.fix);

        statuswrapper.show();
    }
}

function clearLiveDataRefreshTimer() {
    if (liveDataRefreshTimerId) {
        clearInterval(liveDataRefreshTimerId);
        liveDataRefreshTimerId = false;
    }
}

function startLiveDataRefreshTimer() {
    // live data refresh
    clearLiveDataRefreshTimer();
    liveDataRefreshTimerId = setInterval(update_live_status, 250);
}

function reinitializeConnection(callback) {

    // Close connection gracefully if it still exists.
    const previousTimeStamp = connectionTimestamp;

    if (serial.connectionId) {
        if (GUI.connected_to || GUI.connecting_to) {
            $$1('a.connect').trigger('click');
        } else {
            serial.disconnect();
        }
    }

    gui_log(i18n$1.getMessage('deviceRebooting'));

    let attempts = 0;
    const reconnect = setInterval(waitforSerial, 100);

    function waitforSerial() {
        if ((connectionTimestamp !== previousTimeStamp && CONFIGURATOR.connectionValid) || GUI.active_tab === 'firmware_flasher') {
            console.log(`Serial connection available after ${attempts / 10} seconds`);
            clearInterval(reconnect);
            gui_log(i18n$1.getMessage('deviceReady'));

            if (typeof callback === 'function') {
                callback();
            }
        } else {
            attempts++;
            if (attempts > 100) {
                clearInterval(reconnect);
                console.log(`failed to get serial connection, gave up after 10 seconds`);
                gui_log(i18n$1.getMessage('serialPortOpenFail'));
            }
        }
    }
}

// Used for LED_STRIP
const ledDirectionLetters    = ['n', 'e', 's', 'w', 'u', 'd'];      // in LSB bit order
const ledBaseFunctionLetters = ['c', 'f', 'a', 'l', 's', 'g', 'r']; // in LSB bit
let ledOverlayLetters        = ['t', 'y', 'o', 'b', 'v', 'i', 'w']; // in LSB bit

function MspHelper() {
    const self = this;

    // 0 based index, must be identical to 'baudRates' in 'src/main/io/serial.c' in betaflight
    self.BAUD_RATES = ['AUTO', '9600', '19200', '38400', '57600', '115200',
    '230400', '250000', '400000', '460800', '500000', '921600', '1000000',
    '1500000', '2000000', '2470000'];
    // needs to be identical to 'serialPortFunction_e' in 'src/main/io/serial.h' in betaflight
    self.SERIAL_PORT_FUNCTIONS = {
    'MSP': 0,
    'GPS': 1,
    'TELEMETRY_FRSKY': 2,
    'TELEMETRY_HOTT': 3,
    'TELEMETRY_MSP': 4,
    'TELEMETRY_LTM': 4, // LTM replaced MSP
    'TELEMETRY_SMARTPORT': 5,
    'RX_SERIAL': 6,
    'BLACKBOX': 7,
    'TELEMETRY_MAVLINK': 9,
    'ESC_SENSOR': 10,
    'TBS_SMARTAUDIO': 11,
    'TELEMETRY_IBUS': 12,
    'IRC_TRAMP': 13,
    'RUNCAM_DEVICE_CONTROL': 14, // support communitate with RunCam Device
    'LIDAR_TF': 15,
    'FRSKY_OSD': 16,
    'VTX_MSP': 17,
    };

    self.REBOOT_TYPES = {
        FIRMWARE: 0,
        BOOTLOADER: 1,
        MSC: 2,
        MSC_UTC: 3,
        BOOTLOADER_FLASH: 4,
    };

    self.RESET_TYPES = {
        BASE_DEFAULTS: 0,
        CUSTOM_DEFAULTS: 1,
    };

    self.SIGNATURE_LENGTH = 32;

    self.mspMultipleCache = [];

    self.setText = function(buffer, type, config, length) {
        // type byte
        buffer.push8(type);

        const size = Math.min(length, config.length);
        // length byte followed by the actual characters
        buffer.push8(size);

        for (let i = 0; i < size; i++) {
            buffer.push8(config.charCodeAt(i));
        }
    };

    self.getText = function(data) {
        // length byte followed by the actual characters
        const size = data.readU8() || 0;
        let str = '';

        for (let i = 0; i < size; i++) {
            str += String.fromCharCode(data.readU8());
        }

        return str;
    };
}

function getMSPCodeName(code) {
    return Object.keys(MSPCodes).find(key => MSPCodes[key] === code);
}

MspHelper.readPidSliderSettings = function(data) {
    FC.TUNING_SLIDERS.slider_pids_mode = data.readU8();
    FC.TUNING_SLIDERS.slider_master_multiplier = data.readU8();
    FC.TUNING_SLIDERS.slider_roll_pitch_ratio = data.readU8();
    FC.TUNING_SLIDERS.slider_i_gain = data.readU8();
    FC.TUNING_SLIDERS.slider_d_gain = data.readU8();
    FC.TUNING_SLIDERS.slider_pi_gain = data.readU8();
    FC.TUNING_SLIDERS.slider_dmax_gain = data.readU8();
    FC.TUNING_SLIDERS.slider_feedforward_gain = data.readU8();
    FC.TUNING_SLIDERS.slider_pitch_pi_gain = data.readU8();
    data.readU32(); // reserved for future use
    data.readU32(); // reserved for future use
};

MspHelper.writePidSliderSettings = function(buffer) {
    buffer
    .push8(FC.TUNING_SLIDERS.slider_pids_mode)
    .push8(FC.TUNING_SLIDERS.slider_master_multiplier)
    .push8(FC.TUNING_SLIDERS.slider_roll_pitch_ratio)
    .push8(FC.TUNING_SLIDERS.slider_i_gain)
    .push8(FC.TUNING_SLIDERS.slider_d_gain)
    .push8(FC.TUNING_SLIDERS.slider_pi_gain)
    .push8(FC.TUNING_SLIDERS.slider_dmax_gain)
    .push8(FC.TUNING_SLIDERS.slider_feedforward_gain)
    .push8(FC.TUNING_SLIDERS.slider_pitch_pi_gain)
    .push32(0)  // reserved for future use
    .push32(0); // reserved for future use
};

MspHelper.readDtermFilterSliderSettings = function(data) {
    FC.TUNING_SLIDERS.slider_dterm_filter = data.readU8();
    FC.TUNING_SLIDERS.slider_dterm_filter_multiplier = data.readU8();
    FC.FILTER_CONFIG.dterm_lowpass_hz = data.readU16();
    FC.FILTER_CONFIG.dterm_lowpass2_hz = data.readU16();
    FC.FILTER_CONFIG.dterm_lowpass_dyn_min_hz = data.readU16();
    FC.FILTER_CONFIG.dterm_lowpass_dyn_max_hz = data.readU16();
    data.readU32(); // reserved for future use
    data.readU32(); // reserved for future use
};

MspHelper.writeDtermFilterSliderSettings = function(buffer) {
    buffer
    .push8(FC.TUNING_SLIDERS.slider_dterm_filter)
    .push8(FC.TUNING_SLIDERS.slider_dterm_filter_multiplier)
    .push16(FC.FILTER_CONFIG.dterm_lowpass_hz)
    .push16(FC.FILTER_CONFIG.dterm_lowpass2_hz)
    .push16(FC.FILTER_CONFIG.dterm_lowpass_dyn_min_hz)
    .push16(FC.FILTER_CONFIG.dterm_lowpass_dyn_max_hz)
    .push32(0)  // reserved for future use
    .push32(0); // reserved for future use
};

MspHelper.readGyroFilterSliderSettings = function(data) {
    FC.TUNING_SLIDERS.slider_gyro_filter = data.readU8();
    FC.TUNING_SLIDERS.slider_gyro_filter_multiplier = data.readU8();
    FC.FILTER_CONFIG.gyro_lowpass_hz = data.readU16();
    FC.FILTER_CONFIG.gyro_lowpass2_hz = data.readU16();
    FC.FILTER_CONFIG.gyro_lowpass_dyn_min_hz = data.readU16();
    FC.FILTER_CONFIG.gyro_lowpass_dyn_max_hz = data.readU16();
    data.readU32(); // reserved for future use
    data.readU32(); // reserved for future use
};

MspHelper.writeGyroFilterSliderSettings = function(buffer) {
    buffer
    .push8(FC.TUNING_SLIDERS.slider_gyro_filter)
    .push8(FC.TUNING_SLIDERS.slider_gyro_filter_multiplier)
    .push16(FC.FILTER_CONFIG.gyro_lowpass_hz)
    .push16(FC.FILTER_CONFIG.gyro_lowpass2_hz)
    .push16(FC.FILTER_CONFIG.gyro_lowpass_dyn_min_hz)
    .push16(FC.FILTER_CONFIG.gyro_lowpass_dyn_max_hz)
    .push32(0)  // reserved for future use
    .push32(0); // reserved for future use
};

MspHelper.prototype.process_data = function(dataHandler) {
    const self = this;
    const data = dataHandler.dataView; // DataView (allowing us to view arrayBuffer as struct/union)
    const code = dataHandler.code;
    const crcError = dataHandler.crcError;
    let buff = [];
    let char = '';
    let flags = 0;

    if (!crcError) {
        if (!dataHandler.unsupported) switch (code) {
            case MSPCodes.MSP_STATUS:
                FC.CONFIG.cycleTime = data.readU16();
                FC.CONFIG.i2cError = data.readU16();
                FC.CONFIG.activeSensors = data.readU16();
                FC.CONFIG.mode = data.readU32();
                FC.CONFIG.profile = data.readU8();

                break;
            case MSPCodes.MSP_STATUS_EX:
                FC.CONFIG.cycleTime = data.readU16();
                FC.CONFIG.i2cError = data.readU16();
                FC.CONFIG.activeSensors = data.readU16();
                FC.CONFIG.mode = data.readU32();
                FC.CONFIG.profile = data.readU8();
                FC.CONFIG.cpuload = data.readU16();
                FC.CONFIG.numProfiles = data.readU8();
                FC.CONFIG.rateProfile = data.readU8();

                // Read flight mode flags
                const byteCount = data.readU8();
                for (let i = 0; i < byteCount; i++) {
                    data.readU8();
                }

                // Read arming disable flags
                FC.CONFIG.armingDisableCount = data.readU8(); // Flag count
                FC.CONFIG.armingDisableFlags = data.readU32();

                // Read config state flags - bits to indicate the state of the configuration, reboot required, etc.
                FC.CONFIG.configStateFlag = data.readU8();

                // Read CPU temp, from API version 1.46
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    FC.CONFIG.cpuTemp = data.readU16();
                }

                break;

            case MSPCodes.MSP_RAW_IMU:
                // 2048 for mpu6050, 1024 for mma (times 4 since we don't scale in the firmware)
                // currently we are unable to differentiate between the sensor types, so we are going with 2048
                FC.SENSOR_DATA.accelerometer[0] = data.read16() / 2048;
                FC.SENSOR_DATA.accelerometer[1] = data.read16() / 2048;
                FC.SENSOR_DATA.accelerometer[2] = data.read16() / 2048;

                // properly scaled
                FC.SENSOR_DATA.gyroscope[0] = data.read16() * (4 / 16.4);
                FC.SENSOR_DATA.gyroscope[1] = data.read16() * (4 / 16.4);
                FC.SENSOR_DATA.gyroscope[2] = data.read16() * (4 / 16.4);

                // no clue about scaling factor
                FC.SENSOR_DATA.magnetometer[0] = data.read16();
                FC.SENSOR_DATA.magnetometer[1] = data.read16();
                FC.SENSOR_DATA.magnetometer[2] = data.read16();
                break;
            case MSPCodes.MSP_SERVO:
                const servoCount = data.byteLength / 2;
                for (let i = 0; i < servoCount; i++) {
                    FC.SERVO_DATA[i] = data.readU16();
                }
                break;
            case MSPCodes.MSP_MOTOR:
                const motorCount = data.byteLength / 2;
                for (let i = 0; i < motorCount; i++) {
                    FC.MOTOR_DATA[i] = data.readU16();
                }
                break;
            case MSPCodes.MSP2_MOTOR_OUTPUT_REORDERING:
                FC.MOTOR_OUTPUT_ORDER = [];
                const arraySize = data.read8();
                for (let i = 0; i < arraySize; i++) {
                    FC.MOTOR_OUTPUT_ORDER[i] = data.readU8();
                }
                break;
            case MSPCodes.MSP2_GET_VTX_DEVICE_STATUS:
                FC.VTX_DEVICE_STATUS = null;
                const dataLength = data.byteLength;
                if (dataLength > 0) {
                    const vtxDeviceStatusData = new Uint8Array(dataLength);
                    for (let i = 0; i < dataLength; i++) {
                        vtxDeviceStatusData[i] = data.readU8();
                    }
                    FC.VTX_DEVICE_STATUS = vtxDeviceStatusFactory.createVtxDeviceStatus(vtxDeviceStatusData);
                }
                break;
            case MSPCodes.MSP_MOTOR_TELEMETRY:
                const telemMotorCount = data.readU8();
                for (let i = 0; i < telemMotorCount; i++) {
                    FC.MOTOR_TELEMETRY_DATA.rpm[i] = data.readU32();   // RPM
                    FC.MOTOR_TELEMETRY_DATA.invalidPercent[i] = data.readU16();   // 10000 = 100.00%
                    FC.MOTOR_TELEMETRY_DATA.temperature[i] = data.readU8();       // degrees celsius
                    FC.MOTOR_TELEMETRY_DATA.voltage[i] = data.readU16();          // 0.01V per unit
                    FC.MOTOR_TELEMETRY_DATA.current[i] = data.readU16();          // 0.01A per unit
                    FC.MOTOR_TELEMETRY_DATA.consumption[i] = data.readU16();      // mAh
                }
                break;
            case MSPCodes.MSP_RC:
                FC.RC.active_channels = data.byteLength / 2;
                for (let i = 0; i < FC.RC.active_channels; i++) {
                    FC.RC.channels[i] = data.readU16();
                }
                break;
            case MSPCodes.MSP_RAW_GPS:
                FC.GPS_DATA.fix = data.readU8();
                FC.GPS_DATA.numSat = data.readU8();
                FC.GPS_DATA.lat = data.read32();
                FC.GPS_DATA.lon = data.read32();
                FC.GPS_DATA.alt = data.readU16();
                FC.GPS_DATA.speed = data.readU16();
                FC.GPS_DATA.ground_course = data.readU16();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    FC.GPS_DATA.positionalDop = data.readU16();
                }
                break;
            case MSPCodes.MSP_COMP_GPS:
                FC.GPS_DATA.distanceToHome = data.readU16();
                FC.GPS_DATA.directionToHome = data.readU16();
                FC.GPS_DATA.update = data.readU8();
                break;
            case MSPCodes.MSP_ATTITUDE:
                FC.SENSOR_DATA.kinematics[0] = data.read16() / 10.0; // x
                FC.SENSOR_DATA.kinematics[1] = data.read16() / 10.0; // y
                FC.SENSOR_DATA.kinematics[2] = data.read16(); // z
                break;
            case MSPCodes.MSP_ALTITUDE:
                FC.SENSOR_DATA.altitude = parseFloat((data.read32() / 100.0).toFixed(2)); // correct scale factor
                break;
            case MSPCodes.MSP_SONAR:
                FC.SENSOR_DATA.sonar = data.read32();
                break;
            case MSPCodes.MSP_ANALOG:
                FC.ANALOG.voltage = data.readU8() / 10.0;
                FC.ANALOG.mAhdrawn = data.readU16();
                FC.ANALOG.rssi = data.readU16(); // 0-1023
                FC.ANALOG.amperage = data.read16() / 100; // A
                FC.ANALOG.voltage = data.readU16() / 100;
                FC.ANALOG.last_received_timestamp = performance.now();
                break;
            case MSPCodes.MSP_VOLTAGE_METERS:
                FC.VOLTAGE_METERS = [];
                const voltageMeterLength = 2;
                for (let i = 0; i < (data.byteLength / voltageMeterLength); i++) {
                    const voltageMeter = {
                        id: data.readU8(),
                        voltage: data.readU8() / 10.0,
                    };

                    FC.VOLTAGE_METERS.push(voltageMeter);
                }
                break;
            case MSPCodes.MSP_CURRENT_METERS:

                FC.CURRENT_METERS = [];
                const currentMeterLength = 5;
                for (let i = 0; i < (data.byteLength / currentMeterLength); i++) {
                    const currentMeter = {
                        id: data.readU8(),
                        mAhDrawn: data.readU16(), // mAh
                        amperage: data.readU16() / 1000, // A
                    };

                    FC.CURRENT_METERS.push(currentMeter);
                }
                break;
            case MSPCodes.MSP_BATTERY_STATE:
                FC.BATTERY_STATE.cellCount = data.readU8();
                FC.BATTERY_STATE.capacity = data.readU16(); // mAh

                FC.BATTERY_STATE.voltage = data.readU8() / 10.0; // V
                FC.BATTERY_STATE.mAhDrawn = data.readU16(); // mAh
                FC.BATTERY_STATE.amperage = data.readU16() / 100; // A
                FC.BATTERY_STATE.batteryState = data.readU8();
                FC.BATTERY_STATE.voltage = data.readU16() / 100;
                break;

            case MSPCodes.MSP_VOLTAGE_METER_CONFIG:
                FC.VOLTAGE_METER_CONFIGS = [];
                const voltageMeterCount = data.readU8();

                for (let i = 0; i < voltageMeterCount; i++) {
                    const subframeLength = data.readU8();
                    if (subframeLength !== 5) {
                        for (let j = 0; j < subframeLength; j++) {
                            data.readU8();
                        }
                    } else {
                        const voltageMeterConfig = {
                            id: data.readU8(),
                            sensorType: data.readU8(),
                            vbatscale: data.readU8(),
                            vbatresdivval: data.readU8(),
                            vbatresdivmultiplier: data.readU8(),
                        };

                        FC.VOLTAGE_METER_CONFIGS.push(voltageMeterConfig);
                    }
                }
                break;
            case MSPCodes.MSP_CURRENT_METER_CONFIG:
                FC.CURRENT_METER_CONFIGS = [];
                const currentMeterCount = data.readU8();
                for (let i = 0; i < currentMeterCount; i++) {
                    const currentMeterConfig = {};
                    const subframeLength = data.readU8();

                    if (subframeLength !== 6) {
                        for (let j = 0; j < subframeLength; j++) {
                            data.readU8();
                        }
                    } else {
                        currentMeterConfig.id = data.readU8();
                        currentMeterConfig.sensorType = data.readU8();
                        currentMeterConfig.scale = data.read16();
                        currentMeterConfig.offset = data.read16();

                        FC.CURRENT_METER_CONFIGS.push(currentMeterConfig);
                    }
                }
                break;

            case MSPCodes.MSP_BATTERY_CONFIG:
                FC.BATTERY_CONFIG.vbatmincellvoltage = data.readU8() / 10; // 10-50
                FC.BATTERY_CONFIG.vbatmaxcellvoltage = data.readU8() / 10; // 10-50
                FC.BATTERY_CONFIG.vbatwarningcellvoltage = data.readU8() / 10; // 10-50
                FC.BATTERY_CONFIG.capacity = data.readU16();
                FC.BATTERY_CONFIG.voltageMeterSource = data.readU8();
                FC.BATTERY_CONFIG.currentMeterSource = data.readU8();
                FC.BATTERY_CONFIG.vbatmincellvoltage = data.readU16() / 100;
                FC.BATTERY_CONFIG.vbatmaxcellvoltage = data.readU16() / 100;
                FC.BATTERY_CONFIG.vbatwarningcellvoltage = data.readU16() / 100;
                break;
            case MSPCodes.MSP_SET_BATTERY_CONFIG:
                console.log('Battery configuration saved');
                break;
            case MSPCodes.MSP_RC_TUNING:
                FC.RC_TUNING.RC_RATE = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.RC_EXPO = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.roll_pitch_rate = 0;
                FC.RC_TUNING.roll_rate = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.pitch_rate = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.yaw_rate = parseFloat((data.readU8() / 100).toFixed(2));
                if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    FC.RC_TUNING.dynamic_THR_PID = parseFloat((data.readU8() / 100).toFixed(2));
                } else {
                    data.readU8();
                }
                FC.RC_TUNING.throttle_MID = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.throttle_EXPO = parseFloat((data.readU8() / 100).toFixed(2));
                if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    FC.RC_TUNING.dynamic_THR_breakpoint = data.readU16();
                } else {
                    data.readU16();
                }
                FC.RC_TUNING.RC_YAW_EXPO = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.rcYawRate = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.rcPitchRate = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.RC_PITCH_EXPO = parseFloat((data.readU8() / 100).toFixed(2));
                FC.RC_TUNING.throttleLimitType = data.readU8();
                FC.RC_TUNING.throttleLimitPercent = data.readU8();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.RC_TUNING.roll_rate_limit = data.readU16();
                    FC.RC_TUNING.pitch_rate_limit = data.readU16();
                    FC.RC_TUNING.yaw_rate_limit = data.readU16();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    FC.RC_TUNING.rates_type = data.readU8();
                }
                break;
            case MSPCodes.MSP_PID:
                // PID data arrived, we need to scale it and save to appropriate bank / array
                for (let i = 0, needle = 0; i < (data.byteLength / 3); i++, needle += 3) {
                    // main for loop selecting the pid section
                    for (let j = 0; j < 3; j++) {
                        FC.PIDS_ACTIVE[i][j] = data.readU8();
                        FC.PIDS[i][j] = FC.PIDS_ACTIVE[i][j];
                    }
                }
                break;

            case MSPCodes.MSP_ARMING_CONFIG:
                FC.ARMING_CONFIG.auto_disarm_delay = data.readU8();
                FC.ARMING_CONFIG.disarm_kill_switch = data.readU8();
                FC.ARMING_CONFIG.small_angle = data.readU8();
                break;
            case MSPCodes.MSP_LOOP_TIME:
                FC.FC_CONFIG.loopTime = data.readU16();
                break;
            case MSPCodes.MSP_MISC: // 22 bytes
                FC.RX_CONFIG.midrc = data.readU16();
                FC.MOTOR_CONFIG.minthrottle = data.readU16(); // 0-2000
                FC.MOTOR_CONFIG.maxthrottle = data.readU16(); // 0-2000
                FC.MOTOR_CONFIG.mincommand = data.readU16(); // 0-2000
                FC.MISC.failsafe_throttle = data.readU16(); // 1000-2000
                FC.GPS_CONFIG.provider = data.readU8();
                FC.MISC.gps_baudrate = data.readU8();
                FC.GPS_CONFIG.ublox_sbas = data.readU8();
                FC.MISC.multiwiicurrentoutput = data.readU8();
                FC.RSSI_CONFIG.channel = data.readU8();
                FC.MISC.placeholder2 = data.readU8();
                data.read16(); // was mag_declination
                FC.MISC.vbatscale = data.readU8(); // was FC.MISC.vbatscale - 10-200
                FC.MISC.vbatmincellvoltage = data.readU8() / 10; // 10-50
                FC.MISC.vbatmaxcellvoltage = data.readU8() / 10; // 10-50
                FC.MISC.vbatwarningcellvoltage = data.readU8() / 10; // 10-50
                break;
            case MSPCodes.MSP_MOTOR_CONFIG:
                FC.MOTOR_CONFIG.minthrottle = data.readU16(); // 0-2000
                FC.MOTOR_CONFIG.maxthrottle = data.readU16(); // 0-2000
                FC.MOTOR_CONFIG.mincommand = data.readU16(); // 0-2000
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.MOTOR_CONFIG.motor_count = data.readU8();
                    FC.MOTOR_CONFIG.motor_poles = data.readU8();
                    FC.MOTOR_CONFIG.use_dshot_telemetry = data.readU8() != 0;
                    FC.MOTOR_CONFIG.use_esc_sensor = data.readU8() != 0;
                }
                break;
            case MSPCodes.MSP_COMPASS_CONFIG:
                FC.COMPASS_CONFIG.mag_declination = data.read16() / 10;
                break;
            case MSPCodes.MSP_GPS_CONFIG:
                FC.GPS_CONFIG.provider = data.readU8();
                FC.GPS_CONFIG.ublox_sbas = data.readU8();
                FC.GPS_CONFIG.auto_config = data.readU8();
                FC.GPS_CONFIG.auto_baud = data.readU8();

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    FC.GPS_CONFIG.home_point_once = data.readU8();
                    FC.GPS_CONFIG.ublox_use_galileo = data.readU8();
                }
                break;
            case MSPCodes.MSP_GPS_RESCUE:
                FC.GPS_RESCUE.angle             = data.readU16();
                FC.GPS_RESCUE.returnAltitudeM   = data.readU16();
                FC.GPS_RESCUE.descentDistanceM  = data.readU16();
                FC.GPS_RESCUE.groundSpeed       = data.readU16();
                FC.GPS_RESCUE.throttleMin       = data.readU16();
                FC.GPS_RESCUE.throttleMax       = data.readU16();
                FC.GPS_RESCUE.throttleHover     = data.readU16();
                FC.GPS_RESCUE.sanityChecks      = data.readU8();
                FC.GPS_RESCUE.minSats           = data.readU8();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    FC.GPS_RESCUE.ascendRate            = data.readU16();
                    FC.GPS_RESCUE.descendRate           = data.readU16();
                    FC.GPS_RESCUE.allowArmingWithoutFix = data.readU8();
                    FC.GPS_RESCUE.altitudeMode          = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    FC.GPS_RESCUE.minStartDistM = data.readU16();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    FC.GPS_RESCUE.initialClimbM = data.readU16();
                }
                break;
            case MSPCodes.MSP_RSSI_CONFIG:
                FC.RSSI_CONFIG.channel = data.readU8();
                break;
            case MSPCodes.MSP_MOTOR_3D_CONFIG:
                FC.MOTOR_3D_CONFIG.deadband3d_low = data.readU16();
                FC.MOTOR_3D_CONFIG.deadband3d_high = data.readU16();
                FC.MOTOR_3D_CONFIG.neutral = data.readU16();
                break;
            case MSPCodes.MSP_BOXNAMES:
                FC.AUX_CONFIG = []; // empty the array as new data is coming in

                buff = [];
                for (let i = 0; i < data.byteLength; i++) {
                    char = data.readU8();
                    if (char == 0x3B) { // ; (delimeter char)
                        FC.AUX_CONFIG.push(String.fromCharCode.apply(null, buff)); // convert bytes into ASCII and save as strings

                        // empty buffer
                        buff = [];
                    } else {
                        buff.push(char);
                    }
                }
                break;
            case MSPCodes.MSP_PIDNAMES:
                FC.PID_NAMES = []; // empty the array as new data is coming in

                buff = [];
                for (let i = 0; i < data.byteLength; i++) {
                    char = data.readU8();
                    if (char == 0x3B) { // ; (delimeter char)
                        FC.PID_NAMES.push(String.fromCharCode.apply(null, buff)); // convert bytes into ASCII and save as strings

                        // empty buffer
                        buff = [];
                    } else {
                        buff.push(char);
                    }
                }
                break;
            case MSPCodes.MSP_BOXIDS:
                FC.AUX_CONFIG_IDS = []; // empty the array as new data is coming in

                for (let i = 0; i < data.byteLength; i++) {
                    FC.AUX_CONFIG_IDS.push(data.readU8());
                }
                break;
            case MSPCodes.MSP_SERVO_MIX_RULES:
                break;

            case MSPCodes.MSP_SERVO_CONFIGURATIONS:
                FC.SERVO_CONFIG = []; // empty the array as new data is coming in
                if (data.byteLength % 12 == 0) {
                    for (let i = 0; i < data.byteLength; i += 12) {
                        const arr = {
                            'min':                      data.readU16(),
                            'max':                      data.readU16(),
                            'middle':                   data.readU16(),
                            'rate':                     data.read8(),
                            'indexOfChannelToForward':  data.readU8(),
                            'reversedInputSources':     data.readU32(),
                        };

                        FC.SERVO_CONFIG.push(arr);
                    }
                }
                break;
            case MSPCodes.MSP_RC_DEADBAND:
                FC.RC_DEADBAND_CONFIG.deadband = data.readU8();
                FC.RC_DEADBAND_CONFIG.yaw_deadband = data.readU8();
                FC.RC_DEADBAND_CONFIG.alt_hold_deadband = data.readU8();

                FC.RC_DEADBAND_CONFIG.deadband3d_throttle = data.readU16();
                break;
            case MSPCodes.MSP_SENSOR_ALIGNMENT:
                FC.SENSOR_ALIGNMENT.align_gyro = data.readU8();
                FC.SENSOR_ALIGNMENT.align_acc = data.readU8();
                FC.SENSOR_ALIGNMENT.align_mag = data.readU8();
                FC.SENSOR_ALIGNMENT.gyro_detection_flags = data.readU8();
                FC.SENSOR_ALIGNMENT.gyro_to_use = data.readU8();
                FC.SENSOR_ALIGNMENT.gyro_1_align = data.readU8();
                FC.SENSOR_ALIGNMENT.gyro_2_align = data.readU8();
                break;
            case MSPCodes.MSP_DISPLAYPORT:
                break;
            case MSPCodes.MSP_SET_RAW_RC:
                break;
            case MSPCodes.MSP_SET_PID:
                console.log('PID settings saved');
                FC.PIDS_ACTIVE = FC.PIDS.map(array => array.slice());
                break;
            case MSPCodes.MSP_SET_RC_TUNING:
                console.log('RC Tuning saved');
                break;
            case MSPCodes.MSP_ACC_CALIBRATION:
                console.log('Accel calibration executed');
                break;
            case MSPCodes.MSP_MAG_CALIBRATION:
                console.log('Mag calibration executed');
                break;
            case MSPCodes.MSP_SET_MOTOR_CONFIG:
                console.log('Motor Configuration saved');
                break;
            case MSPCodes.MSP_SET_GPS_CONFIG:
                console.log('GPS Configuration saved');
                break;
            case MSPCodes.MSP_SET_GPS_RESCUE:
                console.log('GPS Rescue Configuration saved');
                break;
            case MSPCodes.MSP_SET_RSSI_CONFIG:
                console.log('RSSI Configuration saved');
                break;
            case MSPCodes.MSP_SET_FEATURE_CONFIG:
                console.log('Features saved');
                break;
            case MSPCodes.MSP_SET_BEEPER_CONFIG:
                console.log('Beeper Configuration saved');
                break;
            case MSPCodes.MSP_RESET_CONF:
                console.log('Settings Reset');
                break;
            case MSPCodes.MSP_SELECT_SETTING:
                console.log('Profile selected');
                break;
            case MSPCodes.MSP_SET_SERVO_CONFIGURATION:
                console.log('Servo Configuration saved');
                break;
            case MSPCodes.MSP_EEPROM_WRITE:
                console.log('Settings Saved in EEPROM');
                break;
            case MSPCodes.MSP_SET_CURRENT_METER_CONFIG:
                console.log('Amperage Settings saved');
                break;
            case MSPCodes.MSP_SET_VOLTAGE_METER_CONFIG:
                console.log('Voltage config saved');
                break;
            case MSPCodes.MSP_DEBUG:
                for (let i = 0; i < 8; i++) {
                    FC.SENSOR_DATA.debug[i] = data.read16();
                }
                break;
            case MSPCodes.MSP_SET_MOTOR:
                break;
            case MSPCodes.MSP_UID:
                FC.CONFIG.uid[0] = data.readU32();
                FC.CONFIG.uid[1] = data.readU32();
                FC.CONFIG.uid[2] = data.readU32();
                FC.CONFIG.deviceIdentifier = FC.CONFIG.uid[0].toString(16) + FC.CONFIG.uid[1].toString(16) + FC.CONFIG.uid[2].toString(16);
                break;
            case MSPCodes.MSP_ACC_TRIM:
                FC.CONFIG.accelerometerTrims[0] = data.read16(); // pitch
                FC.CONFIG.accelerometerTrims[1] = data.read16(); // roll
                break;
            case MSPCodes.MSP_SET_ACC_TRIM:
                console.log('Accelerometer trimms saved.');
                break;
            case MSPCodes.MSP_GPS_SV_INFO:
                if (data.byteLength > 0) {
                    const numCh = data.readU8();

                    for (let i = 0; i < numCh; i++) {
                        FC.GPS_DATA.chn[i] = data.readU8();
                        FC.GPS_DATA.svid[i] = data.readU8();
                        FC.GPS_DATA.quality[i] = data.readU8();
                        FC.GPS_DATA.cno[i] = data.readU8();
                    }
                }
                break;

            case MSPCodes.MSP_RX_MAP:
                FC.RC_MAP = []; // empty the array as new data is coming in

                for (let i = 0; i < data.byteLength; i++) {
                    FC.RC_MAP.push(data.readU8());
                }
                break;
            case MSPCodes.MSP_SET_RX_MAP:
                console.log('RCMAP saved');
                break;

            case MSPCodes.MSP_MIXER_CONFIG:
                FC.MIXER_CONFIG.mixer = data.readU8();
                FC.MIXER_CONFIG.reverseMotorDir = data.readU8();
                break;

            case MSPCodes.MSP_FEATURE_CONFIG:
                FC.FEATURE_CONFIG.features.setMask(data.readU32());

                updateTabList(FC.FEATURE_CONFIG.features);
                break;

            case MSPCodes.MSP_BEEPER_CONFIG:
                FC.BEEPER_CONFIG.beepers.setDisabledMask(data.readU32());
                FC.BEEPER_CONFIG.dshotBeaconTone = data.readU8();
                FC.BEEPER_CONFIG.dshotBeaconConditions.setDisabledMask(data.readU32());
                break;

            case MSPCodes.MSP_BOARD_ALIGNMENT_CONFIG:
                FC.BOARD_ALIGNMENT_CONFIG.roll = data.read16(); // -180 - 360
                FC.BOARD_ALIGNMENT_CONFIG.pitch = data.read16(); // -180 - 360
                FC.BOARD_ALIGNMENT_CONFIG.yaw = data.read16(); // -180 - 360
                break;

            case MSPCodes.MSP_SET_REBOOT:
                const rebootType = data.read8();
                if ((rebootType === self.REBOOT_TYPES.MSC) || (rebootType === self.REBOOT_TYPES.MSC_UTC)) {
                    if (data.read8() === 0) {
                        console.log('Storage device not ready.');

                        showErrorDialog(i18n$1.getMessage('storageDeviceNotReady'));
                        break;
                    }
                }
                console.log('Reboot request accepted');
                break;

            case MSPCodes.MSP_API_VERSION:
                FC.CONFIG.mspProtocolVersion = data.readU8();
                FC.CONFIG.apiVersion = `${data.readU8()}.${data.readU8()}.0`;
                break;

            case MSPCodes.MSP_FC_VARIANT:
                let fcVariantIdentifier = '';
                for (let i = 0; i < 4; i++) {
                    fcVariantIdentifier += String.fromCharCode(data.readU8());
                }
                FC.CONFIG.flightControllerIdentifier = fcVariantIdentifier;
                break;

            case MSPCodes.MSP_FC_VERSION:
                FC.CONFIG.flightControllerVersion = `${data.readU8()}.${data.readU8()}.${data.readU8()}`;
                break;

            case MSPCodes.MSP_BUILD_INFO: {
                const dateLength = 11;
                buff = [];

                for (let i = 0; i < dateLength; i++) {
                    buff.push(data.readU8());
                }
                buff.push(32); // ascii space

                const timeLength = 8;
                for (let i = 0; i < timeLength; i++) {
                    buff.push(data.readU8());
                }
                FC.CONFIG.buildInfo = String.fromCharCode.apply(null, buff);

                const gitRevisionLength = 7;
                buff = [];
                for (let i = 0; i < gitRevisionLength; i++) {
                    buff.push(data.readU8());
                }

                FC.CONFIG.gitRevision = String.fromCharCode.apply(null, buff);
                console.log("Fw git rev:", FC.CONFIG.gitRevision);

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    let option = data.readU16();
                    while (option) {
                        FC.CONFIG.buildOptions.push(option);
                        option = data.readU16();
                    }
                }

                break;
            }

            case MSPCodes.MSP_BOARD_INFO:
                FC.CONFIG.boardIdentifier = '';

                for (let i = 0; i < 4; i++) {
                    FC.CONFIG.boardIdentifier += String.fromCharCode(data.readU8());
                }

                FC.CONFIG.boardVersion = data.readU16();
                FC.CONFIG.boardType = data.readU8();

                FC.CONFIG.targetCapabilities = data.readU8();
                FC.CONFIG.targetName = this.getText(data);

                FC.CONFIG.boardName = this.getText(data);
                FC.CONFIG.manufacturerId = this.getText(data);
                FC.CONFIG.signature = [];

                for (let i = 0; i < self.SIGNATURE_LENGTH; i++) {
                    FC.CONFIG.signature.push(data.readU8());
                }

                FC.CONFIG.mcuTypeId = data.readU8();

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.CONFIG.configurationState = data.readU8();
                }

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    FC.CONFIG.sampleRateHz = data.readU16();
                    FC.CONFIG.configurationProblems = data.readU32();
                } else {
                    FC.CONFIG.configurationProblems = 0;
                }

                break;

            case MSPCodes.MSP_NAME:
                FC.CONFIG.name = '';
                while ((char = data.readU8()) !== null) {
                    FC.CONFIG.name += String.fromCharCode(char);
                }
                break;

            case MSPCodes.MSP2_GET_TEXT:
                // type byte
                const textType = data.readU8();

                switch(textType) {
                    case MSPCodes.PILOT_NAME:
                        FC.CONFIG.pilotName = self.getText(data);
                        break;
                    case MSPCodes.CRAFT_NAME:
                        FC.CONFIG.craftName = self.getText(data);
                        break;
                    case MSPCodes.PID_PROFILE_NAME:
                        FC.CONFIG.pidProfileNames[FC.CONFIG.profile] = self.getText(data);
                        break;
                    case MSPCodes.RATE_PROFILE_NAME:
                        FC.CONFIG.rateProfileNames[FC.CONFIG.rateProfile] = self.getText(data);
                        break;
                    case MSPCodes.BUILD_KEY:
                        FC.CONFIG.buildKey = self.getText(data);
                        break;
                    default:
                        console.log('Unsupport text type');
                        break;
                }

                break;

            case MSPCodes.MSP2_GET_LED_STRIP_CONFIG_VALUES:
                FC.LED_CONFIG_VALUES.brightness = data.readU8();
                FC.LED_CONFIG_VALUES.rainbow_delta = data.readU16();
                FC.LED_CONFIG_VALUES.rainbow_freq = data.readU16();
                break;

            case MSPCodes.MSP_SET_CHANNEL_FORWARDING:
                console.log('Channel forwarding saved');
                break;

            case MSPCodes.MSP_CF_SERIAL_CONFIG:
                FC.SERIAL_CONFIG.ports = [];
                const bytesPerPort = 1 + 2 + (1 * 4);

                const serialPortCount = data.byteLength / bytesPerPort;
                for (let i = 0; i < serialPortCount; i++) {
                    const serialPort = {
                        identifier: data.readU8(),
                        functions: self.serialPortFunctionMaskToFunctions(data.readU16()),
                        msp_baudrate: self.BAUD_RATES[data.readU8()],
                        gps_baudrate: self.BAUD_RATES[data.readU8()],
                        telemetry_baudrate: self.BAUD_RATES[data.readU8()],
                        blackbox_baudrate: self.BAUD_RATES[data.readU8()],
                    };

                    FC.SERIAL_CONFIG.ports.push(serialPort);
                }
                break;

            case MSPCodes.MSP2_COMMON_SERIAL_CONFIG:
                FC.SERIAL_CONFIG.ports = [];
                const count = data.readU8();
                const portConfigSize = data.remaining() / count;
                for (let ii = 0; ii < count; ii++) {
                    const start = data.remaining();
                    const serialPort = {
                        identifier: data.readU8(),
                        functions: self.serialPortFunctionMaskToFunctions(data.readU32()),
                        msp_baudrate: self.BAUD_RATES[data.readU8()],
                        gps_baudrate: self.BAUD_RATES[data.readU8()],
                        telemetry_baudrate: self.BAUD_RATES[data.readU8()],
                        blackbox_baudrate: self.BAUD_RATES[data.readU8()],
                    };
                    FC.SERIAL_CONFIG.ports.push(serialPort);
                    while(start - data.remaining() < portConfigSize && data.remaining() > 0) {
                        data.readU8();
                    }
                }
                break;

            case MSPCodes.MSP_SET_CF_SERIAL_CONFIG:
                console.log('Serial config saved');
                break;

            case MSPCodes.MSP2_COMMON_SET_SERIAL_CONFIG:
                console.log('Serial config saved (MSPv2)');
                break;

            case MSPCodes.MSP_MODE_RANGES:
                FC.MODE_RANGES = []; // empty the array as new data is coming in

                const modeRangeCount = data.byteLength / 4; // 4 bytes per item.

                for (let i = 0; i < modeRangeCount; i++) {
                    const modeRange = {
                        id: data.readU8(),
                        auxChannelIndex: data.readU8(),
                        range: {
                            start: 900 + (data.readU8() * 25),
                            end: 900 + (data.readU8() * 25),
                        },
                    };
                    FC.MODE_RANGES.push(modeRange);
                }
                break;

            case MSPCodes.MSP_MODE_RANGES_EXTRA:
                FC.MODE_RANGES_EXTRA = []; // empty the array as new data is coming in

                const modeRangeExtraCount = data.readU8();

                for (let i = 0; i < modeRangeExtraCount; i++) {
                    const modeRangeExtra = {
                        id: data.readU8(),
                        modeLogic: data.readU8(),
                        linkedTo: data.readU8(),
                    };
                    FC.MODE_RANGES_EXTRA.push(modeRangeExtra);
                }
                break;

            case MSPCodes.MSP_ADJUSTMENT_RANGES:
                FC.ADJUSTMENT_RANGES = []; // empty the array as new data is coming in

                const adjustmentRangeCount = data.byteLength / 6; // 6 bytes per item.

                for (let i = 0; i < adjustmentRangeCount; i++) {
                    const adjustmentRange = {
                        slotIndex: data.readU8(),
                        auxChannelIndex: data.readU8(),
                        range: {
                            start: 900 + (data.readU8() * 25),
                            end: 900 + (data.readU8() * 25),
                        },
                        adjustmentFunction: data.readU8(),
                        auxSwitchChannelIndex: data.readU8(),
                    };
                    FC.ADJUSTMENT_RANGES.push(adjustmentRange);
                }
                break;

            case MSPCodes.MSP_RX_CONFIG:
                FC.RX_CONFIG.serialrx_provider = data.readU8();
                FC.RX_CONFIG.stick_max = data.readU16();
                FC.RX_CONFIG.stick_center = data.readU16();
                FC.RX_CONFIG.stick_min = data.readU16();
                FC.RX_CONFIG.spektrum_sat_bind = data.readU8();
                FC.RX_CONFIG.rx_min_usec = data.readU16();
                FC.RX_CONFIG.rx_max_usec = data.readU16();
                FC.RX_CONFIG.rcInterpolation = data.readU8();
                FC.RX_CONFIG.rcInterpolationInterval = data.readU8();
                FC.RX_CONFIG.airModeActivateThreshold = data.readU16();
                FC.RX_CONFIG.rxSpiProtocol = data.readU8();
                FC.RX_CONFIG.rxSpiId = data.readU32();
                FC.RX_CONFIG.rxSpiRfChannelCount = data.readU8();
                FC.RX_CONFIG.fpvCamAngleDegrees = data.readU8();
                FC.RX_CONFIG.rcInterpolationChannels = data.readU8();
                FC.RX_CONFIG.rcSmoothingType = data.readU8();
                FC.RX_CONFIG.rcSmoothingSetpointCutoff = data.readU8();
                FC.RX_CONFIG.rcSmoothingFeedforwardCutoff = data.readU8();
                FC.RX_CONFIG.rcSmoothingInputType = data.readU8();
                FC.RX_CONFIG.rcSmoothingDerivativeType = data.readU8();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.RX_CONFIG.usbCdcHidType = data.readU8();
                    FC.RX_CONFIG.rcSmoothingAutoFactor = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    FC.RX_CONFIG.rcSmoothingMode = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    const elrsUidLength = 6;
                    FC.RX_CONFIG.elrsUid = [];
                    for (let i = 0; i < elrsUidLength; i++) {
                        FC.RX_CONFIG.elrsUid.push(data.readU8());
                    }
                }

                break;

            case MSPCodes.MSP_FAILSAFE_CONFIG:
                FC.FAILSAFE_CONFIG.failsafe_delay = data.readU8();
                FC.FAILSAFE_CONFIG.failsafe_off_delay = data.readU8();
                FC.FAILSAFE_CONFIG.failsafe_throttle = data.readU16();
                FC.FAILSAFE_CONFIG.failsafe_switch_mode = data.readU8();
                FC.FAILSAFE_CONFIG.failsafe_throttle_low_delay = data.readU16();
                FC.FAILSAFE_CONFIG.failsafe_procedure = data.readU8();
                break;

            case MSPCodes.MSP_RXFAIL_CONFIG:
                FC.RXFAIL_CONFIG = []; // empty the array as new data is coming in

                const channelCount = data.byteLength / 3;
                for (let i = 0; i < channelCount; i++) {
                    const rxfailChannel = {
                        mode:  data.readU8(),
                        value: data.readU16(),
                    };
                    FC.RXFAIL_CONFIG.push(rxfailChannel);
                }
                break;

            case MSPCodes.MSP_ADVANCED_CONFIG:
                FC.PID_ADVANCED_CONFIG.gyro_sync_denom = data.readU8();
                FC.PID_ADVANCED_CONFIG.pid_process_denom = data.readU8();
                FC.PID_ADVANCED_CONFIG.use_unsyncedPwm = data.readU8();
                FC.PID_ADVANCED_CONFIG.fast_pwm_protocol = EscProtocols.ReorderPwmProtocols(FC.CONFIG.apiVersion, data.readU8());
                FC.PID_ADVANCED_CONFIG.motor_pwm_rate = data.readU16();
                FC.PID_ADVANCED_CONFIG.digitalIdlePercent = data.readU16() / 100;
                data.readU8(); // gyroUse32Khz is not supported
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.PID_ADVANCED_CONFIG.motorPwmInversion = data.readU8();
                    FC.SENSOR_ALIGNMENT.gyro_to_use = data.readU8(); // We don't want to double up on storing this state
                    FC.PID_ADVANCED_CONFIG.gyroHighFsr = data.readU8();
                    FC.PID_ADVANCED_CONFIG.gyroMovementCalibThreshold = data.readU8();
                    FC.PID_ADVANCED_CONFIG.gyroCalibDuration = data.readU16();
                    FC.PID_ADVANCED_CONFIG.gyroOffsetYaw = data.readU16();
                    FC.PID_ADVANCED_CONFIG.gyroCheckOverflow = data.readU8();
                    FC.PID_ADVANCED_CONFIG.debugMode = data.readU8();
                    FC.PID_ADVANCED_CONFIG.debugModeCount = data.readU8();
                }
                break;
            case MSPCodes.MSP_FILTER_CONFIG:
                FC.FILTER_CONFIG.gyro_lowpass_hz = data.readU8();
                FC.FILTER_CONFIG.dterm_lowpass_hz = data.readU16();
                FC.FILTER_CONFIG.yaw_lowpass_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_notch_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_notch_cutoff = data.readU16();
                FC.FILTER_CONFIG.dterm_notch_hz = data.readU16();
                FC.FILTER_CONFIG.dterm_notch_cutoff = data.readU16();
                FC.FILTER_CONFIG.gyro_notch2_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_notch2_cutoff = data.readU16();
                FC.FILTER_CONFIG.dterm_lowpass_type = data.readU8();
                FC.FILTER_CONFIG.gyro_hardware_lpf = data.readU8();
                data.readU8(); // gyro_32khz_hardware_lpf not used
                FC.FILTER_CONFIG.gyro_lowpass_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_lowpass2_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_lowpass_type = data.readU8();
                FC.FILTER_CONFIG.gyro_lowpass2_type = data.readU8();
                FC.FILTER_CONFIG.dterm_lowpass2_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_32khz_hardware_lpf = 0;
                FC.FILTER_CONFIG.dterm_lowpass2_type = data.readU8();
                FC.FILTER_CONFIG.gyro_lowpass_dyn_min_hz = data.readU16();
                FC.FILTER_CONFIG.gyro_lowpass_dyn_max_hz = data.readU16();
                FC.FILTER_CONFIG.dterm_lowpass_dyn_min_hz = data.readU16();
                FC.FILTER_CONFIG.dterm_lowpass_dyn_max_hz = data.readU16();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.FILTER_CONFIG.dyn_notch_range = data.readU8();
                    FC.FILTER_CONFIG.dyn_notch_width_percent = data.readU8();
                    FC.FILTER_CONFIG.dyn_notch_q = data.readU16();
                    FC.FILTER_CONFIG.dyn_notch_min_hz = data.readU16();

                    FC.FILTER_CONFIG.gyro_rpm_notch_harmonics = data.readU8();
                    FC.FILTER_CONFIG.gyro_rpm_notch_min_hz = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    FC.FILTER_CONFIG.dyn_notch_max_hz = data.readU16();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    FC.FILTER_CONFIG.dyn_lpf_curve_expo = data.readU8();
                    FC.FILTER_CONFIG.dyn_notch_count = data.readU8();
                }
                break;
            case MSPCodes.MSP_SET_PID_ADVANCED:
                console.log("Advanced PID settings saved");
                FC.ADVANCED_TUNING_ACTIVE = { ...FC.ADVANCED_TUNING };
                break;
            case MSPCodes.MSP_PID_ADVANCED:
                FC.ADVANCED_TUNING.rollPitchItermIgnoreRate = data.readU16();
                FC.ADVANCED_TUNING.yawItermIgnoreRate = data.readU16();
                FC.ADVANCED_TUNING.yaw_p_limit = data.readU16();
                FC.ADVANCED_TUNING.deltaMethod = data.readU8();
                FC.ADVANCED_TUNING.vbatPidCompensation = data.readU8();
                FC.ADVANCED_TUNING.feedforwardTransition = data.readU8();
                FC.ADVANCED_TUNING.dtermSetpointWeight = data.readU8();
                FC.ADVANCED_TUNING.toleranceBand = data.readU8();
                FC.ADVANCED_TUNING.toleranceBandReduction = data.readU8();
                FC.ADVANCED_TUNING.itermThrottleGain = data.readU8();
                FC.ADVANCED_TUNING.pidMaxVelocity = data.readU16();
                FC.ADVANCED_TUNING.pidMaxVelocityYaw = data.readU16();
                FC.ADVANCED_TUNING.levelAngleLimit = data.readU8();
                FC.ADVANCED_TUNING.levelSensitivity = data.readU8();
                FC.ADVANCED_TUNING.itermThrottleThreshold = data.readU16();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    FC.ADVANCED_TUNING.antiGravityGain = data.readU16();
                } else {
                    FC.ADVANCED_TUNING.itermAcceleratorGain = data.readU16();
                }

                FC.ADVANCED_TUNING.dtermSetpointWeight = data.readU16();
                FC.ADVANCED_TUNING.itermRotation = data.readU8();
                FC.ADVANCED_TUNING.smartFeedforward = data.readU8();
                FC.ADVANCED_TUNING.itermRelax = data.readU8();
                FC.ADVANCED_TUNING.itermRelaxType = data.readU8();
                FC.ADVANCED_TUNING.absoluteControlGain = data.readU8();
                FC.ADVANCED_TUNING.throttleBoost = data.readU8();
                FC.ADVANCED_TUNING.acroTrainerAngleLimit = data.readU8();
                FC.ADVANCED_TUNING.feedforwardRoll  = data.readU16();
                FC.ADVANCED_TUNING.feedforwardPitch = data.readU16();
                FC.ADVANCED_TUNING.feedforwardYaw   = data.readU16();
                FC.ADVANCED_TUNING.antiGravityMode  = data.readU8();

                FC.ADVANCED_TUNING.dMinRoll = data.readU8();
                FC.ADVANCED_TUNING.dMinPitch = data.readU8();
                FC.ADVANCED_TUNING.dMinYaw = data.readU8();
                FC.ADVANCED_TUNING.dMinGain = data.readU8();
                FC.ADVANCED_TUNING.dMinAdvance = data.readU8();
                FC.ADVANCED_TUNING.useIntegratedYaw = data.readU8();
                FC.ADVANCED_TUNING.integratedYawRelax = data.readU8();

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.ADVANCED_TUNING.itermRelaxCutoff = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    FC.ADVANCED_TUNING.motorOutputLimit = data.readU8();
                    FC.ADVANCED_TUNING.autoProfileCellCount = data.read8();
                    FC.ADVANCED_TUNING.idleMinRpm = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    FC.ADVANCED_TUNING.feedforward_averaging = data.readU8();
                    FC.ADVANCED_TUNING.feedforward_smooth_factor = data.readU8();
                    FC.ADVANCED_TUNING.feedforward_boost = data.readU8();
                    FC.ADVANCED_TUNING.feedforward_max_rate_limit = data.readU8();
                    FC.ADVANCED_TUNING.feedforward_jitter_factor = data.readU8();
                    FC.ADVANCED_TUNING.vbat_sag_compensation = data.readU8();
                    FC.ADVANCED_TUNING.thrustLinearization = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    FC.ADVANCED_TUNING.tpaMode = data.readU8();
                    FC.ADVANCED_TUNING.tpaRate = parseFloat((data.readU8() / 100).toFixed(2));
                    FC.ADVANCED_TUNING.tpaBreakpoint = data.readU16();
                }
                FC.ADVANCED_TUNING_ACTIVE = { ...FC.ADVANCED_TUNING };
                break;
            case MSPCodes.MSP_SENSOR_CONFIG:
                FC.SENSOR_CONFIG.acc_hardware = data.readU8();
                FC.SENSOR_CONFIG.baro_hardware = data.readU8();
                FC.SENSOR_CONFIG.mag_hardware = data.readU8();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    FC.SENSOR_CONFIG.sonar_hardware = data.readU8();
                }
                break;
            case MSPCodes.MSP2_SENSOR_CONFIG_ACTIVE:
                FC.SENSOR_CONFIG_ACTIVE.gyro_hardware = data.readU8();
                FC.SENSOR_CONFIG_ACTIVE.acc_hardware = data.readU8();
                FC.SENSOR_CONFIG_ACTIVE.baro_hardware = data.readU8();
                FC.SENSOR_CONFIG_ACTIVE.mag_hardware = data.readU8();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                    FC.SENSOR_CONFIG_ACTIVE.sonar_hardware = data.readU8();
                }
                break;

            case MSPCodes.MSP_LED_STRIP_CONFIG:
                FC.LED_STRIP = [];

                let ledCount = (data.byteLength - 2) / 4;

                // The 32 bit config of each LED contains the following in LSB:
                // +----------------------------------------------------------------------------------------------------------+
                // | Directions - 6 bit | Color ID - 4 bit | Overlays - 10 bit | Function ID - 4 bit  | X - 4 bit | Y - 4 bit |
                // +----------------------------------------------------------------------------------------------------------+
                // According to betaflight/src/main/msp/msp.c
                // API 1.41 - add indicator for advanced profile support and the current profile selection
                // 0 = basic ledstrip available
                // 1 = advanced ledstrip available
                // Following byte is the current LED profile

                //Before API_VERSION_1_46 Parameters were 4 bit and Overlays 6 bit

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {

                    for (let i = 0; i < ledCount; i++) {

                        const mask = data.readU32();

                        const functionId = (mask >> 8) & 0xF;
                        const functions = [];
                        for (let baseFunctionLetterIndex = 0; baseFunctionLetterIndex < ledBaseFunctionLetters.length; baseFunctionLetterIndex++) {
                            if (functionId == baseFunctionLetterIndex) {
                                functions.push(ledBaseFunctionLetters[baseFunctionLetterIndex]);
                                break;
                            }
                        }

                        const overlayMask = (mask >> 12) & 0x3FF;
                        for (let overlayLetterIndex = 0; overlayLetterIndex < ledOverlayLetters.length; overlayLetterIndex++) {
                            if (bit_check(overlayMask, overlayLetterIndex)) {
                                functions.push(ledOverlayLetters[overlayLetterIndex]);
                            }
                        }

                        const directionMask = (mask >> 26) & 0x3F;
                        const directions = [];
                        for (let directionLetterIndex = 0; directionLetterIndex < ledDirectionLetters.length; directionLetterIndex++) {
                            if (bit_check(directionMask, directionLetterIndex)) {
                                directions.push(ledDirectionLetters[directionLetterIndex]);
                            }
                        }
                        const led = {
                            y: (mask) & 0xF,
                            x: (mask >> 4) & 0xF,
                            functions: functions,
                            color: (mask >> 22) & 0xF,
                            directions: directions,
                        };

                        FC.LED_STRIP.push(led);
                    }
                } else {
                    ledOverlayLetters = ledOverlayLetters.filter(x => x !== 'y'); //remove rainbow because it's only supported after API 1.46

                    for (let i = 0; i < ledCount; i++) {

                        const mask = data.readU32();

                        const functionId = (mask >> 8) & 0xF;
                        const functions = [];
                        for (let baseFunctionLetterIndex = 0; baseFunctionLetterIndex < ledBaseFunctionLetters.length; baseFunctionLetterIndex++) {
                            if (functionId == baseFunctionLetterIndex) {
                                functions.push(ledBaseFunctionLetters[baseFunctionLetterIndex]);
                                break;
                            }
                        }

                        const overlayMask = (mask >> 12) & 0x3F;
                        for (let overlayLetterIndex = 0; overlayLetterIndex < ledOverlayLetters.length; overlayLetterIndex++) {
                            if (bit_check(overlayMask, overlayLetterIndex)) {
                                functions.push(ledOverlayLetters[overlayLetterIndex]);
                            }
                        }

                        const directionMask = (mask >> 22) & 0x3F;
                        const directions = [];
                        for (let directionLetterIndex = 0; directionLetterIndex < ledDirectionLetters.length; directionLetterIndex++) {
                            if (bit_check(directionMask, directionLetterIndex)) {
                                directions.push(ledDirectionLetters[directionLetterIndex]);
                            }
                        }
                        const led = {
                            y: (mask) & 0xF,
                            x: (mask >> 4) & 0xF,
                            functions: functions,
                            color: (mask >> 18) & 0xF,
                            directions: directions,
                            parameters: (mask >> 28) & 0xF,
                        };

                        FC.LED_STRIP.push(led);
                    }
                }
                break;
            case MSPCodes.MSP_SET_LED_STRIP_CONFIG:
                console.log('Led strip config saved');
                break;
            case MSPCodes.MSP_LED_COLORS:

                FC.LED_COLORS = [];

                const ledcolorCount = data.byteLength / 4;

                for (let i = 0; i < ledcolorCount; i++) {

                    const color = {
                        h: data.readU16(),
                        s: data.readU8(),
                        v: data.readU8(),
                    };
                    FC.LED_COLORS.push(color);
                }

                break;
            case MSPCodes.MSP_SET_LED_COLORS:
                console.log('Led strip colors saved');
                break;
            case MSPCodes.MSP_LED_STRIP_MODECOLOR:
                FC.LED_MODE_COLORS = [];

                const colorCount = data.byteLength / 3;

                for (let i = 0; i < colorCount; i++) {

                    const modeColor = {
                        mode: data.readU8(),
                        direction: data.readU8(),
                        color: data.readU8(),
                    };
                    FC.LED_MODE_COLORS.push(modeColor);
                }
                break;
            case MSPCodes.MSP_SET_LED_STRIP_MODECOLOR:
                console.log('Led strip mode colors saved');
                break;

            case MSPCodes.MSP_DATAFLASH_SUMMARY:
                if (data.byteLength >= 13) {
                    flags = data.readU8();
                    FC.DATAFLASH.ready = (flags & 1) != 0;
                    FC.DATAFLASH.supported = (flags & 2) != 0;
                    FC.DATAFLASH.sectors = data.readU32();
                    FC.DATAFLASH.totalSize = data.readU32();
                    FC.DATAFLASH.usedSize = data.readU32();
                } else {
                    // Firmware version too old to support MSP_DATAFLASH_SUMMARY
                    FC.DATAFLASH.ready = false;
                    FC.DATAFLASH.supported = false;
                    FC.DATAFLASH.sectors = 0;
                    FC.DATAFLASH.totalSize = 0;
                    FC.DATAFLASH.usedSize = 0;
                }
                update_dataflash_global();
                break;
            case MSPCodes.MSP_DATAFLASH_READ:
                // No-op, let callback handle it
                break;
            case MSPCodes.MSP_DATAFLASH_ERASE:
                console.log("Data flash erase begun...");
                break;
            case MSPCodes.MSP_SDCARD_SUMMARY:
                flags = data.readU8();

                FC.SDCARD.supported = (flags & 0x01) != 0;
                FC.SDCARD.state = data.readU8();
                FC.SDCARD.filesystemLastError = data.readU8();
                FC.SDCARD.freeSizeKB = data.readU32();
                FC.SDCARD.totalSizeKB = data.readU32();
                break;
            case MSPCodes.MSP_BLACKBOX_CONFIG:
                FC.BLACKBOX.supported = (data.readU8() & 1) != 0;
                FC.BLACKBOX.blackboxDevice = data.readU8();
                FC.BLACKBOX.blackboxRateNum = data.readU8();
                FC.BLACKBOX.blackboxRateDenom = data.readU8();
                FC.BLACKBOX.blackboxPDenom = data.readU16();
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    FC.BLACKBOX.blackboxSampleRate = data.readU8();
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    FC.BLACKBOX.blackboxDisabledMask = data.readU32();
                }
                break;
            case MSPCodes.MSP_SET_BLACKBOX_CONFIG:
                console.log("Blackbox config saved");
                break;
            case MSPCodes.MSP_TRANSPONDER_CONFIG:
                let bytesRemaining = data.byteLength;
                const providerCount = data.readU8();
                bytesRemaining--;

                FC.TRANSPONDER.supported = providerCount > 0;
                FC.TRANSPONDER.providers = [];

                for (let i = 0; i < providerCount; i++) {
                    const provider = {
                        id: data.readU8(),
                        dataLength: data.readU8(),
                    };
                    bytesRemaining -= 2;

                    FC.TRANSPONDER.providers.push(provider);
                }
                FC.TRANSPONDER.provider = data.readU8();
                bytesRemaining--;

                FC.TRANSPONDER.data = [];

                for (let i = 0; i < bytesRemaining; i++) {
                    FC.TRANSPONDER.data.push(data.readU8());
                }
                break;

            case MSPCodes.MSP_SET_TRANSPONDER_CONFIG:
                console.log("Transponder config saved");
                break;

            case MSPCodes.MSP_VTX_CONFIG:

                FC.VTX_CONFIG.vtx_type = data.readU8();
                FC.VTX_CONFIG.vtx_band = data.readU8();
                FC.VTX_CONFIG.vtx_channel = data.readU8();
                FC.VTX_CONFIG.vtx_power = data.readU8();
                FC.VTX_CONFIG.vtx_pit_mode = data.readU8() != 0;
                FC.VTX_CONFIG.vtx_frequency = data.readU16();
                FC.VTX_CONFIG.vtx_device_ready = data.readU8() != 0;
                FC.VTX_CONFIG.vtx_low_power_disarm = data.readU8();

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    FC.VTX_CONFIG.vtx_pit_mode_frequency = data.readU16();
                    FC.VTX_CONFIG.vtx_table_available = data.readU8() != 0;
                    FC.VTX_CONFIG.vtx_table_bands = data.readU8();
                    FC.VTX_CONFIG.vtx_table_channels = data.readU8();
                    FC.VTX_CONFIG.vtx_table_powerlevels = data.readU8();
                    FC.VTX_CONFIG.vtx_table_clear = false;
                }
                break;

            case MSPCodes.MSP_SET_VTX_CONFIG:
                console.log("VTX config sent");
                break;

            case MSPCodes.MSP_VTXTABLE_BAND:

                FC.VTXTABLE_BAND.vtxtable_band_number = data.readU8();

                const bandNameLength = data.readU8();
                FC.VTXTABLE_BAND.vtxtable_band_name = '';
                for (let i = 0; i < bandNameLength; i++) {
                    FC.VTXTABLE_BAND.vtxtable_band_name += String.fromCharCode(data.readU8());
                }

                FC.VTXTABLE_BAND.vtxtable_band_letter = String.fromCharCode(data.readU8());
                FC.VTXTABLE_BAND.vtxtable_band_is_factory_band = data.readU8() != 0;

                const bandFrequenciesLength = data.readU8();
                FC.VTXTABLE_BAND.vtxtable_band_frequencies = [];
                for (let i = 0; i < bandFrequenciesLength; i++) {
                    FC.VTXTABLE_BAND.vtxtable_band_frequencies.push(data.readU16());
                }

                break;

            case MSPCodes.MSP_SET_VTXTABLE_BAND:
                console.log("VTX band sent");
                break;

            case MSPCodes.MSP_VTXTABLE_POWERLEVEL:

                FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_number = data.readU8();
                FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_value = data.readU16();

                const powerLabelLength = data.readU8();
                FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_label = '';
                for (let i = 0; i < powerLabelLength; i++) {
                    FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_label += String.fromCharCode(data.readU8());
                }

                break;

            case MSPCodes.MSP_SET_SIMPLIFIED_TUNING:
                console.log('Tuning Sliders sent');
                break;

            case MSPCodes.MSP_SIMPLIFIED_TUNING:
                MspHelper.readPidSliderSettings(data);
                MspHelper.readDtermFilterSliderSettings(data);
                MspHelper.readGyroFilterSliderSettings(data);

                break;
            case MSPCodes.MSP_CALCULATE_SIMPLIFIED_PID:

                if (FC.TUNING_SLIDERS.slider_pids_mode > 0) {
                    FC.PIDS[0][0] = data.readU8();
                    FC.PIDS[0][1] = data.readU8();
                    FC.PIDS[0][2] = data.readU8();
                    FC.ADVANCED_TUNING.dMinRoll = data.readU8();
                    FC.ADVANCED_TUNING.feedforwardRoll = data.readU16();

                    FC.PIDS[1][0] = data.readU8();
                    FC.PIDS[1][1] = data.readU8();
                    FC.PIDS[1][2] = data.readU8();
                    FC.ADVANCED_TUNING.dMinPitch = data.readU8();
                    FC.ADVANCED_TUNING.feedforwardPitch = data.readU16();
                }

                if (FC.TUNING_SLIDERS.slider_pids_mode > 1) {
                    FC.PIDS[2][0] = data.readU8();
                    FC.PIDS[2][1] = data.readU8();
                    FC.PIDS[2][2] = data.readU8();
                    FC.ADVANCED_TUNING.dMinYaw = data.readU8();
                    FC.ADVANCED_TUNING.feedforwardYaw = data.readU16();
                }

                break;
            case MSPCodes.MSP_CALCULATE_SIMPLIFIED_GYRO:
                MspHelper.readGyroFilterSliderSettings(data);

                break;
            case MSPCodes.MSP_CALCULATE_SIMPLIFIED_DTERM:
                MspHelper.readDtermFilterSliderSettings(data);

                break;
            case MSPCodes.MSP_VALIDATE_SIMPLIFIED_TUNING:
                FC.TUNING_SLIDERS.slider_pids_valid = data.readU8();
                FC.TUNING_SLIDERS.slider_gyro_valid = data.readU8();
                FC.TUNING_SLIDERS.slider_dterm_valid = data.readU8();

                break;
            case MSPCodes.MSP_SET_VTXTABLE_POWERLEVEL:
                console.log("VTX powerlevel sent");
                break;
            case MSPCodes.MSP_SET_MODE_RANGE:
                console.log('Mode range saved');
                break;
            case MSPCodes.MSP_SET_ADJUSTMENT_RANGE:
                console.log('Adjustment range saved');
                break;
            case MSPCodes.MSP_SET_BOARD_ALIGNMENT_CONFIG:
                console.log('Board alignment saved');
                break;
            case MSPCodes.MSP_PID_CONTROLLER:
                FC.PID.controller = data.readU8();
                break;
            case MSPCodes.MSP_SET_PID_CONTROLLER:
                console.log('PID controller changed');
                break;
            case MSPCodes.MSP_SET_LOOP_TIME:
                console.log('Looptime saved');
                break;
            case MSPCodes.MSP_SET_ARMING_CONFIG:
                console.log('Arming config saved');
                break;
            case MSPCodes.MSP_SET_RESET_CURR_PID:
                console.log('Current PID profile reset');
                break;
            case MSPCodes.MSP_SET_MOTOR_3D_CONFIG:
                console.log('3D settings saved');
                break;
            case MSPCodes.MSP_SET_MIXER_CONFIG:
                console.log('Mixer config saved');
                break;
            case MSPCodes.MSP_SET_RC_DEADBAND:
                console.log('Rc controls settings saved');
                break;
            case MSPCodes.MSP_SET_SENSOR_ALIGNMENT:
                console.log('Sensor alignment saved');
                break;
            case MSPCodes.MSP_SET_RX_CONFIG:
                console.log('Rx config saved');
                break;
            case MSPCodes.MSP_SET_RXFAIL_CONFIG:
                console.log('Rxfail config saved');
                break;
            case MSPCodes.MSP_SET_FAILSAFE_CONFIG:
                console.log('Failsafe config saved');
                break;
            case MSPCodes.MSP_OSD_CANVAS:
                OSD.data.VIDEO_COLS['HD'] = data.readU8();
                OSD.data.VIDEO_ROWS['HD'] = data.readU8();
                OSD.data.VIDEO_BUFFER_CHARS['HD'] = OSD.data.VIDEO_COLS['HD'] * OSD.data.VIDEO_ROWS['HD'];
                console.log(`Canvas ${OSD.data.VIDEO_COLS['HD']} x ${OSD.data.VIDEO_ROWS['HD']}`);
                break;
            case MSPCodes.MSP_SET_OSD_CANVAS:
                console.log('OSD Canvas config set');
                break;
            case MSPCodes.MSP_OSD_CONFIG:
                break;
            case MSPCodes.MSP_SET_OSD_CONFIG:
                console.log('OSD config set');
                break;
            case MSPCodes.MSP_OSD_CHAR_READ:
                break;
            case MSPCodes.MSP_OSD_CHAR_WRITE:
                console.log('OSD char uploaded');
                break;
            case MSPCodes.MSP_SET_NAME:
                console.log('Name set');
                break;
            case MSPCodes.MSP2_SET_TEXT:
                console.log('Text set');
                break;
            case MSPCodes.MSP2_SET_LED_STRIP_CONFIG_VALUES:
                break;
            case MSPCodes.MSP_SET_FILTER_CONFIG:
                // removed as this fires a lot with firmware sliders console.log('Filter config set');
                break;
            case MSPCodes.MSP_SET_ADVANCED_CONFIG:
                console.log('Advanced config parameters set');
                break;
            case MSPCodes.MSP_SET_SENSOR_CONFIG:
                console.log('Sensor config parameters set');
                break;
            case MSPCodes.MSP_COPY_PROFILE:
                console.log('Copy profile');
                break;
            case MSPCodes.MSP_ARMING_DISABLE:
                console.log('Arming disable');
                break;
            case MSPCodes.MSP_SET_RTC:
                console.log('Real time clock set');
                break;
            case MSPCodes.MSP2_SET_MOTOR_OUTPUT_REORDERING:
                console.log('Motor output reordering set');
                break;
            case MSPCodes.MSP2_SEND_DSHOT_COMMAND:
                console.log('DSHOT command sent');
                break;

            case MSPCodes.MSP_MULTIPLE_MSP:

                let hasReturnedSomeCommand = false; // To avoid infinite loops

                while (data.offset < data.byteLength) {

                    hasReturnedSomeCommand = true;

                    const command = self.mspMultipleCache.shift();
                    const payloadSize = data.readU8();

                    if (payloadSize != 0) {

                        const currentDataHandler = {
                            code         : command,
                            dataView     : new DataView(data.buffer, data.offset, payloadSize),
                            callbacks    : [],
                        };

                        self.process_data(currentDataHandler);

                        data.offset += payloadSize;
                    }
                }

                if (hasReturnedSomeCommand) {
                    // Send again MSP messages missing, the buffer in the FC was too small
                    if (self.mspMultipleCache.length > 0) {

                        const partialBuffer = [];
                        for (const instance of self.mspMultipleCache) {
                            partialBuffer.push8(instance);
                        }

                        MSP$1.send_message(MSPCodes.MSP_MULTIPLE_MSP, partialBuffer, false, dataHandler.callbacks);
                        dataHandler.callbacks = [];
                    }
                } else {
                    console.log("MSP Multiple can't process the command");
                    self.mspMultipleCache = [];
                }

                break;

            default:
                console.log(`Unknown code detected: ${code} (${getMSPCodeName(code)})`);
        } else {
            console.log(`FC reports unsupported message error: ${code} (${getMSPCodeName(code)})`);

            if (code === MSPCodes.MSP_SET_REBOOT) {
                TABS.onboard_logging.mscRebootFailedCallback();
            }
        }

    } else {
        console.warn(`code: ${code} (${getMSPCodeName(code)}) - crc failed`);
    }
    // trigger callbacks, cleanup/remove callback after trigger
    for (let i = dataHandler.callbacks.length - 1; i >= 0; i--) { // iterating in reverse because we use .splice which modifies array length
        if (dataHandler.callbacks[i]?.code === code) {
            // save callback reference
            const callback = dataHandler.callbacks[i].callback;
            const callbackOnError = dataHandler.callbacks[i].callbackOnError;

            // remove timeout
            clearInterval(dataHandler.callbacks[i].timer);

            // remove object from array
            dataHandler.callbacks.splice(i, 1);
            if (!crcError || callbackOnError) {
                // fire callback
                if (callback) callback({'command': code, 'data': data, 'length': data.byteLength, 'crcError': crcError});
            } else {
                console.warn(`code: ${code} - crc failed. No callback`);
            }
        }
    }
};

/**
 * Encode the request body for the MSP request with the given code and return it as an array of bytes.
 * The second (optional) 'modifierCode' argument can be used to extend/specify the behavior of certain MSP codes
 * (e.g. 'MSPCodes.MSP2_GET_TEXT' and 'MSPCodes.MSP2_SET_TEXT')
 */
MspHelper.prototype.crunch = function(code, modifierCode = undefined) {
    const buffer = [];
    const self = this;

    switch (code) {
        case MSPCodes.MSP_SET_FEATURE_CONFIG:
            const featureMask = FC.FEATURE_CONFIG.features.getMask();
            buffer.push32(featureMask);
            break;
        case MSPCodes.MSP_SET_BEEPER_CONFIG:
            const beeperDisabledMask = FC.BEEPER_CONFIG.beepers.getDisabledMask();
            buffer.push32(beeperDisabledMask);
            buffer.push8(FC.BEEPER_CONFIG.dshotBeaconTone);
            buffer.push32(FC.BEEPER_CONFIG.dshotBeaconConditions.getDisabledMask());
            break;
        case MSPCodes.MSP_SET_MIXER_CONFIG:
            buffer.push8(FC.MIXER_CONFIG.mixer);
            buffer.push8(FC.MIXER_CONFIG.reverseMotorDir);
            break;
        case MSPCodes.MSP_SET_BOARD_ALIGNMENT_CONFIG:
            buffer.push16(FC.BOARD_ALIGNMENT_CONFIG.roll)
                .push16(FC.BOARD_ALIGNMENT_CONFIG.pitch)
                .push16(FC.BOARD_ALIGNMENT_CONFIG.yaw);
            break;
        case MSPCodes.MSP_SET_PID_CONTROLLER:
            buffer.push8(FC.PID.controller);
            break;
        case MSPCodes.MSP_SET_PID:
            for (let i = 0; i < FC.PIDS.length; i++) {
                for (let j = 0; j < 3; j++) {
                    buffer.push8(parseInt(FC.PIDS[i][j]));
                }
            }
            break;
        case MSPCodes.MSP_SET_RC_TUNING:
            buffer.push8(Math.round(FC.RC_TUNING.RC_RATE * 100))
                .push8(Math.round(FC.RC_TUNING.RC_EXPO * 100))
                .push8(Math.round(FC.RC_TUNING.roll_rate * 100))
                .push8(Math.round(FC.RC_TUNING.pitch_rate * 100))
                .push8(Math.round(FC.RC_TUNING.yaw_rate * 100));
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                buffer.push8(0);
            } else {
                buffer.push8(Math.round(FC.RC_TUNING.dynamic_THR_PID * 100));
            }
            buffer.push8(Math.round(FC.RC_TUNING.throttle_MID * 100));
            buffer.push8(Math.round(FC.RC_TUNING.throttle_EXPO * 100));
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                buffer.push16(0);
            } else {
                buffer.push16(FC.RC_TUNING.dynamic_THR_breakpoint);
            }
            buffer.push8(Math.round(FC.RC_TUNING.RC_YAW_EXPO * 100));
            buffer.push8(Math.round(FC.RC_TUNING.rcYawRate * 100));
            buffer.push8(Math.round(FC.RC_TUNING.rcPitchRate * 100));
            buffer.push8(Math.round(FC.RC_TUNING.RC_PITCH_EXPO * 100));
            buffer.push8(FC.RC_TUNING.throttleLimitType);
            buffer.push8(FC.RC_TUNING.throttleLimitPercent);
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                buffer.push16(FC.RC_TUNING.roll_rate_limit);
                buffer.push16(FC.RC_TUNING.pitch_rate_limit);
                buffer.push16(FC.RC_TUNING.yaw_rate_limit);
            }
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                buffer.push8(FC.RC_TUNING.rates_type);
            }
            break;
        case MSPCodes.MSP_SET_RX_MAP:
            for (let i = 0; i < FC.RC_MAP.length; i++) {
                buffer.push8(FC.RC_MAP[i]);
            }
            break;
        case MSPCodes.MSP_SET_ACC_TRIM:
            buffer.push16(FC.CONFIG.accelerometerTrims[0])
                .push16(FC.CONFIG.accelerometerTrims[1]);
            break;
        case MSPCodes.MSP_SET_ARMING_CONFIG:
            buffer.push8(FC.ARMING_CONFIG.auto_disarm_delay)
                .push8(FC.ARMING_CONFIG.disarm_kill_switch)
                .push8(FC.ARMING_CONFIG.small_angle);
            break;
        case MSPCodes.MSP_SET_LOOP_TIME:
            buffer.push16(FC.FC_CONFIG.loopTime);
            break;
        case MSPCodes.MSP_SET_MISC:
            buffer.push16(FC.RX_CONFIG.midrc)
                .push16(FC.MOTOR_CONFIG.minthrottle)
                .push16(FC.MOTOR_CONFIG.maxthrottle)
                .push16(FC.MOTOR_CONFIG.mincommand)
                .push16(FC.MISC.failsafe_throttle)
                .push8(FC.GPS_CONFIG.provider)
                .push8(FC.MISC.gps_baudrate)
                .push8(FC.GPS_CONFIG.ublox_sbas)
                .push8(FC.MISC.multiwiicurrentoutput)
                .push8(FC.RSSI_CONFIG.channel)
                .push8(FC.MISC.placeholder2)
                .push16(0) // was mag_declination
                .push8(FC.MISC.vbatscale)
                .push8(Math.round(FC.MISC.vbatmincellvoltage * 10))
                .push8(Math.round(FC.MISC.vbatmaxcellvoltage * 10))
                .push8(Math.round(FC.MISC.vbatwarningcellvoltage * 10));
            break;
        case MSPCodes.MSP_SET_MOTOR_CONFIG:
            buffer.push16(FC.MOTOR_CONFIG.minthrottle)
                .push16(FC.MOTOR_CONFIG.maxthrottle)
                .push16(FC.MOTOR_CONFIG.mincommand);
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                buffer.push8(FC.MOTOR_CONFIG.motor_poles);
                buffer.push8(FC.MOTOR_CONFIG.use_dshot_telemetry ? 1 : 0);
            }
            break;
        case MSPCodes.MSP_SET_GPS_CONFIG:
            buffer.push8(FC.GPS_CONFIG.provider)
                .push8(FC.GPS_CONFIG.ublox_sbas)
                .push8(FC.GPS_CONFIG.auto_config)
                .push8(FC.GPS_CONFIG.auto_baud);

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                buffer.push8(FC.GPS_CONFIG.home_point_once)
                    .push8(FC.GPS_CONFIG.ublox_use_galileo);
            }
            break;
        case MSPCodes.MSP_SET_GPS_RESCUE:
            buffer.push16(FC.GPS_RESCUE.angle)
                  .push16(FC.GPS_RESCUE.returnAltitudeM)
                  .push16(FC.GPS_RESCUE.descentDistanceM)
                  .push16(FC.GPS_RESCUE.groundSpeed)
                  .push16(FC.GPS_RESCUE.throttleMin)
                  .push16(FC.GPS_RESCUE.throttleMax)
                  .push16(FC.GPS_RESCUE.throttleHover)
                  .push8(FC.GPS_RESCUE.sanityChecks)
                  .push8(FC.GPS_RESCUE.minSats);

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                buffer.push16(FC.GPS_RESCUE.ascendRate)
                    .push16(FC.GPS_RESCUE.descendRate)
                    .push8(FC.GPS_RESCUE.allowArmingWithoutFix)
                    .push8(FC.GPS_RESCUE.altitudeMode);
            }
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                buffer.push16(FC.GPS_RESCUE.minStartDistM);
            }
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {
                buffer.push16(FC.GPS_RESCUE.initialClimbM);
            }
            break;
        case MSPCodes.MSP_SET_COMPASS_CONFIG:
            buffer.push16(Math.round(10.0 * parseFloat(FC.COMPASS_CONFIG.mag_declination)));
            break;
        case MSPCodes.MSP_SET_RSSI_CONFIG:
            buffer.push8(FC.RSSI_CONFIG.channel);
            break;
        case MSPCodes.MSP_SET_BATTERY_CONFIG:
            buffer.push8(Math.round(FC.BATTERY_CONFIG.vbatmincellvoltage * 10))
                .push8(Math.round(FC.BATTERY_CONFIG.vbatmaxcellvoltage * 10))
                .push8(Math.round(FC.BATTERY_CONFIG.vbatwarningcellvoltage * 10))
                .push16(FC.BATTERY_CONFIG.capacity)
                .push8(FC.BATTERY_CONFIG.voltageMeterSource)
                .push8(FC.BATTERY_CONFIG.currentMeterSource)
                .push16(Math.round(FC.BATTERY_CONFIG.vbatmincellvoltage * 100))
                .push16(Math.round(FC.BATTERY_CONFIG.vbatmaxcellvoltage * 100))
                .push16(Math.round(FC.BATTERY_CONFIG.vbatwarningcellvoltage * 100));
            break;
        case MSPCodes.MSP_SET_VOLTAGE_METER_CONFIG:
            // not used
           break;
        case MSPCodes.MSP_SET_CURRENT_METER_CONFIG:
            // not used
            break;
        case MSPCodes.MSP_SET_RX_CONFIG:
            buffer.push8(FC.RX_CONFIG.serialrx_provider)
                .push16(FC.RX_CONFIG.stick_max)
                .push16(FC.RX_CONFIG.stick_center)
                .push16(FC.RX_CONFIG.stick_min)
                .push8(FC.RX_CONFIG.spektrum_sat_bind)
                .push16(FC.RX_CONFIG.rx_min_usec)
                .push16(FC.RX_CONFIG.rx_max_usec)
                .push8(FC.RX_CONFIG.rcInterpolation)
                .push8(FC.RX_CONFIG.rcInterpolationInterval)
                .push16(FC.RX_CONFIG.airModeActivateThreshold)
                .push8(FC.RX_CONFIG.rxSpiProtocol)
                .push32(FC.RX_CONFIG.rxSpiId)
                .push8(FC.RX_CONFIG.rxSpiRfChannelCount)
                .push8(FC.RX_CONFIG.fpvCamAngleDegrees)
                .push8(FC.RX_CONFIG.rcInterpolationChannels)
                .push8(FC.RX_CONFIG.rcSmoothingType)
                .push8(FC.RX_CONFIG.rcSmoothingSetpointCutoff)
                .push8(FC.RX_CONFIG.rcSmoothingFeedforwardCutoff)
                .push8(FC.RX_CONFIG.rcSmoothingInputType)
                .push8(FC.RX_CONFIG.rcSmoothingDerivativeType);

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    buffer.push8(FC.RX_CONFIG.usbCdcHidType)
                        .push8(FC.RX_CONFIG.rcSmoothingAutoFactor);
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                        buffer.push8(FC.RX_CONFIG.rcSmoothingMode);
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    FC.RX_CONFIG.elrsUid.forEach(b => buffer.push8(b));
                }

            break;

        case MSPCodes.MSP_SET_FAILSAFE_CONFIG:
            buffer.push8(FC.FAILSAFE_CONFIG.failsafe_delay)
                .push8(FC.FAILSAFE_CONFIG.failsafe_off_delay)
                .push16(FC.FAILSAFE_CONFIG.failsafe_throttle)
                .push8(FC.FAILSAFE_CONFIG.failsafe_switch_mode)
                .push16(FC.FAILSAFE_CONFIG.failsafe_throttle_low_delay)
                .push8(FC.FAILSAFE_CONFIG.failsafe_procedure);
            break;

        case MSPCodes.MSP_SET_TRANSPONDER_CONFIG:
            buffer.push8(FC.TRANSPONDER.provider); //

            for (let i = 0; i < FC.TRANSPONDER.data.length; i++) {
                buffer.push8(FC.TRANSPONDER.data[i]);
            }
            break;

        case MSPCodes.MSP_SET_CHANNEL_FORWARDING:
            for (let i = 0; i < FC.SERVO_CONFIG.length; i++) {
                let out = FC.SERVO_CONFIG[i].indexOfChannelToForward;
                if (out == undefined) {
                    out = 255; // Cleanflight defines "CHANNEL_FORWARDING_DISABLED" as "(uint8_t)0xFF"
                }
                buffer.push8(out);
            }
            break;
        case MSPCodes.MSP_SET_CF_SERIAL_CONFIG:
            for (let i = 0; i < FC.SERIAL_CONFIG.ports.length; i++) {
                const serialPort = FC.SERIAL_CONFIG.ports[i];

                buffer.push8(serialPort.identifier);

                const functionMask = self.serialPortFunctionsToMask(serialPort.functions);
                buffer.push16(functionMask)
                    .push8(self.BAUD_RATES.indexOf(serialPort.msp_baudrate))
                    .push8(self.BAUD_RATES.indexOf(serialPort.gps_baudrate))
                    .push8(self.BAUD_RATES.indexOf(serialPort.telemetry_baudrate))
                    .push8(self.BAUD_RATES.indexOf(serialPort.blackbox_baudrate));
            }
            break;

        case MSPCodes.MSP2_COMMON_SET_SERIAL_CONFIG:
            buffer.push8(FC.SERIAL_CONFIG.ports.length);

            for (let i = 0; i < FC.SERIAL_CONFIG.ports.length; i++) {
                const serialPort = FC.SERIAL_CONFIG.ports[i];

                buffer.push8(serialPort.identifier);

                const functionMask = self.serialPortFunctionsToMask(serialPort.functions);
                buffer.push32(functionMask)
                    .push8(self.BAUD_RATES.indexOf(serialPort.msp_baudrate))
                    .push8(self.BAUD_RATES.indexOf(serialPort.gps_baudrate))
                    .push8(self.BAUD_RATES.indexOf(serialPort.telemetry_baudrate))
                    .push8(self.BAUD_RATES.indexOf(serialPort.blackbox_baudrate));
            }
            break;

        case MSPCodes.MSP_SET_MOTOR_3D_CONFIG:
            buffer.push16(FC.MOTOR_3D_CONFIG.deadband3d_low)
                .push16(FC.MOTOR_3D_CONFIG.deadband3d_high)
                .push16(FC.MOTOR_3D_CONFIG.neutral);
            break;

        case MSPCodes.MSP_SET_RC_DEADBAND:
            buffer.push8(FC.RC_DEADBAND_CONFIG.deadband)
                .push8(FC.RC_DEADBAND_CONFIG.yaw_deadband)
                .push8(FC.RC_DEADBAND_CONFIG.alt_hold_deadband)
                .push16(FC.RC_DEADBAND_CONFIG.deadband3d_throttle);
            break;

        case MSPCodes.MSP_SET_SENSOR_ALIGNMENT:
            buffer.push8(FC.SENSOR_ALIGNMENT.align_gyro)
                .push8(FC.SENSOR_ALIGNMENT.align_acc)
                .push8(FC.SENSOR_ALIGNMENT.align_mag)
                .push8(FC.SENSOR_ALIGNMENT.gyro_to_use)
                .push8(FC.SENSOR_ALIGNMENT.gyro_1_align)
                .push8(FC.SENSOR_ALIGNMENT.gyro_2_align);
            break;
        case MSPCodes.MSP_SET_ADVANCED_CONFIG:
            buffer.push8(FC.PID_ADVANCED_CONFIG.gyro_sync_denom)
                .push8(FC.PID_ADVANCED_CONFIG.pid_process_denom)
                .push8(FC.PID_ADVANCED_CONFIG.use_unsyncedPwm)
                .push8(EscProtocols.ReorderPwmProtocols(FC.CONFIG.apiVersion, FC.PID_ADVANCED_CONFIG.fast_pwm_protocol))
                .push16(FC.PID_ADVANCED_CONFIG.motor_pwm_rate)
                .push16(FC.PID_ADVANCED_CONFIG.digitalIdlePercent * 100)
                .push8(0); // gyroUse32kHz not used
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    buffer.push8(FC.PID_ADVANCED_CONFIG.motorPwmInversion)
                            .push8(FC.SENSOR_ALIGNMENT.gyro_to_use) // We don't want to double up on storing this state
                            .push8(FC.PID_ADVANCED_CONFIG.gyroHighFsr)
                            .push8(FC.PID_ADVANCED_CONFIG.gyroMovementCalibThreshold)
                            .push16(FC.PID_ADVANCED_CONFIG.gyroCalibDuration)
                            .push16(FC.PID_ADVANCED_CONFIG.gyroOffsetYaw)
                            .push8(FC.PID_ADVANCED_CONFIG.gyroCheckOverflow)
                            .push8(FC.PID_ADVANCED_CONFIG.debugMode);
                }
               break;
        case MSPCodes.MSP_SET_FILTER_CONFIG:
            buffer.push8(FC.FILTER_CONFIG.gyro_lowpass_hz)
                .push16(FC.FILTER_CONFIG.dterm_lowpass_hz)
                .push16(FC.FILTER_CONFIG.yaw_lowpass_hz)
                .push16(FC.FILTER_CONFIG.gyro_notch_hz)
                .push16(FC.FILTER_CONFIG.gyro_notch_cutoff)
                .push16(FC.FILTER_CONFIG.dterm_notch_hz)
                .push16(FC.FILTER_CONFIG.dterm_notch_cutoff)
                .push16(FC.FILTER_CONFIG.gyro_notch2_hz)
                .push16(FC.FILTER_CONFIG.gyro_notch2_cutoff)
                .push8(FC.FILTER_CONFIG.dterm_lowpass_type)
                .push8(FC.FILTER_CONFIG.gyro_hardware_lpf)
                .push8(0) // gyro_32khz_hardware_lpf not used
                .push16(FC.FILTER_CONFIG.gyro_lowpass_hz)
                .push16(FC.FILTER_CONFIG.gyro_lowpass2_hz)
                .push8(FC.FILTER_CONFIG.gyro_lowpass_type)
                .push8(FC.FILTER_CONFIG.gyro_lowpass2_type)
                .push16(FC.FILTER_CONFIG.dterm_lowpass2_hz)
                .push8(FC.FILTER_CONFIG.dterm_lowpass2_type)
                .push16(FC.FILTER_CONFIG.gyro_lowpass_dyn_min_hz)
                .push16(FC.FILTER_CONFIG.gyro_lowpass_dyn_max_hz)
                .push16(FC.FILTER_CONFIG.dterm_lowpass_dyn_min_hz)
                .push16(FC.FILTER_CONFIG.dterm_lowpass_dyn_max_hz);
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                buffer.push8(FC.FILTER_CONFIG.dyn_notch_range)
                    .push8(FC.FILTER_CONFIG.dyn_notch_width_percent)
                    .push16(FC.FILTER_CONFIG.dyn_notch_q)
                    .push16(FC.FILTER_CONFIG.dyn_notch_min_hz)
                    .push8(FC.FILTER_CONFIG.gyro_rpm_notch_harmonics)
                    .push8(FC.FILTER_CONFIG.gyro_rpm_notch_min_hz);
            }
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                buffer.push16(FC.FILTER_CONFIG.dyn_notch_max_hz);
            }
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                buffer.push8(FC.FILTER_CONFIG.dyn_lpf_curve_expo)
                    .push8(FC.FILTER_CONFIG.dyn_notch_count);
            }
            break;
        case MSPCodes.MSP_SET_PID_ADVANCED:
            buffer.push16(FC.ADVANCED_TUNING.rollPitchItermIgnoreRate)
                .push16(FC.ADVANCED_TUNING.yawItermIgnoreRate)
                .push16(FC.ADVANCED_TUNING.yaw_p_limit)
                .push8(FC.ADVANCED_TUNING.deltaMethod)
                .push8(FC.ADVANCED_TUNING.vbatPidCompensation)
                .push8(FC.ADVANCED_TUNING.feedforwardTransition)
                .push8(Math.min(FC.ADVANCED_TUNING.dtermSetpointWeight, 254))
                .push8(FC.ADVANCED_TUNING.toleranceBand)
                .push8(FC.ADVANCED_TUNING.toleranceBandReduction)
                .push8(FC.ADVANCED_TUNING.itermThrottleGain)
                .push16(FC.ADVANCED_TUNING.pidMaxVelocity)
                .push16(FC.ADVANCED_TUNING.pidMaxVelocityYaw)
                .push8(FC.ADVANCED_TUNING.levelAngleLimit)
                .push8(FC.ADVANCED_TUNING.levelSensitivity)
                .push16(FC.ADVANCED_TUNING.itermThrottleThreshold);

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                buffer.push16(FC.ADVANCED_TUNING.antiGravityGain);
            } else {
                buffer.push16(FC.ADVANCED_TUNING.itermAcceleratorGain);
            }

            buffer.push16(FC.ADVANCED_TUNING.dtermSetpointWeight)
                .push8(FC.ADVANCED_TUNING.itermRotation)
                .push8(FC.ADVANCED_TUNING.smartFeedforward)
                .push8(FC.ADVANCED_TUNING.itermRelax)
                .push8(FC.ADVANCED_TUNING.itermRelaxType)
                .push8(FC.ADVANCED_TUNING.absoluteControlGain)
                .push8(FC.ADVANCED_TUNING.throttleBoost)
                .push8(FC.ADVANCED_TUNING.acroTrainerAngleLimit)
                .push16(FC.ADVANCED_TUNING.feedforwardRoll)
                .push16(FC.ADVANCED_TUNING.feedforwardPitch)
                .push16(FC.ADVANCED_TUNING.feedforwardYaw)
                .push8(FC.ADVANCED_TUNING.antiGravityMode)
                .push8(FC.ADVANCED_TUNING.dMinRoll)
                .push8(FC.ADVANCED_TUNING.dMinPitch)
                .push8(FC.ADVANCED_TUNING.dMinYaw)
                .push8(FC.ADVANCED_TUNING.dMinGain)
                .push8(FC.ADVANCED_TUNING.dMinAdvance)
                .push8(FC.ADVANCED_TUNING.useIntegratedYaw)
                .push8(FC.ADVANCED_TUNING.integratedYawRelax);

                if(semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                    buffer.push8(FC.ADVANCED_TUNING.itermRelaxCutoff);
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43)) {
                    buffer.push8(FC.ADVANCED_TUNING.motorOutputLimit)
                        .push8(FC.ADVANCED_TUNING.autoProfileCellCount)
                        .push8(FC.ADVANCED_TUNING.idleMinRpm);
                }
                if(semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    buffer.push8(FC.ADVANCED_TUNING.feedforward_averaging)
                        .push8(FC.ADVANCED_TUNING.feedforward_smooth_factor)
                        .push8(FC.ADVANCED_TUNING.feedforward_boost)
                        .push8(FC.ADVANCED_TUNING.feedforward_max_rate_limit)
                        .push8(FC.ADVANCED_TUNING.feedforward_jitter_factor)
                        .push8(FC.ADVANCED_TUNING.vbat_sag_compensation)
                        .push8(FC.ADVANCED_TUNING.thrustLinearization);
                }
                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                    buffer.push8(FC.ADVANCED_TUNING.tpaMode);
                    buffer.push8(Math.round(FC.ADVANCED_TUNING.tpaRate * 100));
                    buffer.push16(FC.ADVANCED_TUNING.tpaBreakpoint);
                }
            break;
        case MSPCodes.MSP_SET_SENSOR_CONFIG:
            buffer.push8(FC.SENSOR_CONFIG.acc_hardware)
                .push8(FC.SENSOR_CONFIG.baro_hardware)
                .push8(FC.SENSOR_CONFIG.mag_hardware);
            break;

        case MSPCodes.MSP_SET_NAME:
            const MSP_BUFFER_SIZE = 64;
            for (let i = 0; i<FC.CONFIG.name.length && i<MSP_BUFFER_SIZE; i++) {
                buffer.push8(FC.CONFIG.name.charCodeAt(i));
            }
            break;

        case MSPCodes.MSP2_GET_TEXT:
            buffer.push8(modifierCode);
            break;

        case MSPCodes.MSP2_SET_TEXT:
            switch (modifierCode) {
                case MSPCodes.PILOT_NAME:
                    self.setText(buffer, modifierCode, FC.CONFIG.pilotName, 16);
                    break;
                case MSPCodes.CRAFT_NAME:
                    self.setText(buffer, modifierCode, FC.CONFIG.craftName, 16);
                    break;
                case MSPCodes.PID_PROFILE_NAME:
                    self.setText(buffer, modifierCode, FC.CONFIG.pidProfileNames[FC.CONFIG.profile], 8);
                    break;
                case MSPCodes.RATE_PROFILE_NAME:
                    self.setText(buffer, modifierCode, FC.CONFIG.rateProfileNames[FC.CONFIG.rateProfile], 8);
                    break;
                default:
                    console.log('Unsupported text type');
                    break;
            }
            break;

        case MSPCodes.MSP2_SET_LED_STRIP_CONFIG_VALUES:
            break;

        case MSPCodes.MSP_SET_BLACKBOX_CONFIG:
            buffer.push8(FC.BLACKBOX.blackboxDevice)
                .push8(FC.BLACKBOX.blackboxRateNum)
                .push8(FC.BLACKBOX.blackboxRateDenom)
                .push16(FC.BLACKBOX.blackboxPDenom);
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                buffer.push8(FC.BLACKBOX.blackboxSampleRate);
            }
            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_45)) {
                buffer.push32(FC.BLACKBOX.blackboxDisabledMask);
            }

            break;

        case MSPCodes.MSP_COPY_PROFILE:
            buffer.push8(FC.COPY_PROFILE.type)
                .push8(FC.COPY_PROFILE.dstProfile)
                .push8(FC.COPY_PROFILE.srcProfile);
            break;
        case MSPCodes.MSP_ARMING_DISABLE:
            let value;
            if (FC.CONFIG.armingDisabled) {
                value = 1;
            } else {
                value = 0;
            }
            buffer.push8(value);

            if (FC.CONFIG.runawayTakeoffPreventionDisabled) {
                value = 1;
            } else {
                value = 0;
            }
            // This will be ignored if `armingDisabled` is true
            buffer.push8(value);

            break;
        case MSPCodes.MSP_SET_RTC:
            const now = new Date();

            const timestamp = now.getTime();
            const secs = timestamp / 1000;
            const millis = timestamp % 1000;
            buffer.push32(secs);
            buffer.push16(millis);
            break;

        case MSPCodes.MSP_SET_VTX_CONFIG:

            buffer.push16(FC.VTX_CONFIG.vtx_frequency)
                .push8(FC.VTX_CONFIG.vtx_power)
                .push8(FC.VTX_CONFIG.vtx_pit_mode ? 1 : 0)
                .push8(FC.VTX_CONFIG.vtx_low_power_disarm);

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                buffer.push16(FC.VTX_CONFIG.vtx_pit_mode_frequency)
                    .push8(FC.VTX_CONFIG.vtx_band)
                    .push8(FC.VTX_CONFIG.vtx_channel)
                    .push16(FC.VTX_CONFIG.vtx_frequency)
                    .push8(FC.VTX_CONFIG.vtx_table_bands)
                    .push8(FC.VTX_CONFIG.vtx_table_channels)
                    .push8(FC.VTX_CONFIG.vtx_table_powerlevels)
                    .push8(FC.VTX_CONFIG.vtx_table_clear ? 1 : 0);
            }

            break;

        case MSPCodes.MSP_SET_VTXTABLE_POWERLEVEL:

            buffer.push8(FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_number)
                  .push16(FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_value);

            buffer.push8(FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_label.length);
            for (let i = 0; i < FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_label.length; i++) {
                buffer.push8(FC.VTXTABLE_POWERLEVEL.vtxtable_powerlevel_label.charCodeAt(i));
            }

            break;

        case MSPCodes.MSP_SET_VTXTABLE_BAND:

            buffer.push8(FC.VTXTABLE_BAND.vtxtable_band_number);

            buffer.push8(FC.VTXTABLE_BAND.vtxtable_band_name.length);
            for (let i = 0; i < FC.VTXTABLE_BAND.vtxtable_band_name.length; i++) {
                buffer.push8(FC.VTXTABLE_BAND.vtxtable_band_name.charCodeAt(i));
            }

            if (FC.VTXTABLE_BAND.vtxtable_band_letter != '') {
                buffer.push8(FC.VTXTABLE_BAND.vtxtable_band_letter.charCodeAt(0));
            } else {
                buffer.push8(' '.charCodeAt(0));
            }
            buffer.push8(FC.VTXTABLE_BAND.vtxtable_band_is_factory_band ? 1 : 0);

            buffer.push8(FC.VTXTABLE_BAND.vtxtable_band_frequencies.length);
            for (let i = 0; i < FC.VTXTABLE_BAND.vtxtable_band_frequencies.length; i++) {
                buffer.push16(FC.VTXTABLE_BAND.vtxtable_band_frequencies[i]);
            }

            break;

        case MSPCodes.MSP_MULTIPLE_MSP:

            while (FC.MULTIPLE_MSP.msp_commands.length > 0) {
                const mspCommand = FC.MULTIPLE_MSP.msp_commands.shift();
                self.mspMultipleCache.push(mspCommand);
                buffer.push8(mspCommand);
            }

            break;

        case MSPCodes.MSP2_SET_MOTOR_OUTPUT_REORDERING:

            buffer.push8(FC.MOTOR_OUTPUT_ORDER.length);
            for (let i = 0; i < FC.MOTOR_OUTPUT_ORDER.length; i++) {
                buffer.push8(FC.MOTOR_OUTPUT_ORDER[i]);
            }

            break;

        case MSPCodes.MSP2_SEND_DSHOT_COMMAND:
            buffer.push8(1);
            break;

        case MSPCodes.MSP_SET_SIMPLIFIED_TUNING:
            MspHelper.writePidSliderSettings(buffer);
            MspHelper.writeDtermFilterSliderSettings(buffer);
            MspHelper.writeGyroFilterSliderSettings(buffer);

            break;
        case MSPCodes.MSP_CALCULATE_SIMPLIFIED_PID:
            MspHelper.writePidSliderSettings(buffer);

            break;

        case MSPCodes.MSP_CALCULATE_SIMPLIFIED_GYRO:
            MspHelper.writeGyroFilterSliderSettings(buffer);

            break;
        case MSPCodes.MSP_CALCULATE_SIMPLIFIED_DTERM:
            MspHelper.writeDtermFilterSliderSettings(buffer);

            break;

        default:
            return buffer;
    }

    return buffer;
};

/**
 * Set raw Rx values over MSP protocol.
 *
 * Channels is an array of 16-bit unsigned integer channel values to be sent. 8 channels is probably the maximum.
 */
MspHelper.prototype.setRawRx = function(channels) {
    const buffer = [];

    for (let i = 0; i < channels.length; i++) {
        buffer.push16(channels[i]);
    }

    MSP$1.send_message(MSPCodes.MSP_SET_RAW_RC, buffer, false);
};

/**
 * Send a request to read a block of data from the dataflash at the given address and pass that address and a dataview
 * of the returned data to the given callback (or null for the data if an error occured).
 */
MspHelper.prototype.dataflashRead = function(address, blockSize, onDataCallback) {
    let outData = [address & 0xFF, (address >> 8) & 0xFF, (address >> 16) & 0xFF, (address >> 24) & 0xFF];

    outData = outData.concat([blockSize & 0xFF, (blockSize >> 8) & 0xFF]);

    // Allow compression
    outData = outData.concat([1]);

    MSP$1.send_message(MSPCodes.MSP_DATAFLASH_READ, outData, false, function(response) {
        if (!response.crcError) {
            const chunkAddress = response.data.readU32();

            const headerSize = 7;
            const dataSize = response.data.readU16();
            const dataCompressionType = response.data.readU8();

            // Verify that the address of the memory returned matches what the caller asked for and there was not a CRC error
            if (chunkAddress == address) {
                /* Strip that address off the front of the reply and deliver it separately so the caller doesn't have to
                 * figure out the reply format:
                 */
                if (dataCompressionType == 0) {
                    onDataCallback(address, new DataView(response.data.buffer, response.data.byteOffset + headerSize, dataSize));
                } else if (dataCompressionType == 1) {
                    // Read compressed char count to avoid decoding stray bit sequences as bytes
                    const compressedCharCount = response.data.readU16();

                    // Compressed format uses 2 additional bytes as a pseudo-header to denote the number of uncompressed bytes
                    const compressedArray = new Uint8Array(response.data.buffer, response.data.byteOffset + headerSize + 2, dataSize - 2);
                    const decompressedArray = huffmanDecodeBuf(compressedArray, compressedCharCount, defaultHuffmanTree, defaultHuffmanLenIndex);

                    onDataCallback(address, new DataView(decompressedArray.buffer), dataSize);
                }
            } else {
                // Report address error
                console.log(`Expected address ${address} but received ${chunkAddress} - retrying`);
                onDataCallback(address, null);  // returning null to the callback forces a retry
            }
        } else {
            // Report crc error
            console.log(`CRC error for address ${address} - retrying`);
            onDataCallback(address, null);  // returning null to the callback forces a retry
        }
    }, true);
};

MspHelper.prototype.sendServoConfigurations = function(onCompleteCallback) {
    let nextFunction = send_next_servo_configuration;

    let servoIndex = 0;

    if (FC.SERVO_CONFIG.length == 0) {
        onCompleteCallback();
    } else {
        nextFunction();
    }


    function send_next_servo_configuration() {

        const buffer = [];

        // send one at a time, with index

        const servoConfiguration = FC.SERVO_CONFIG[servoIndex];

        buffer.push8(servoIndex)
            .push16(servoConfiguration.min)
            .push16(servoConfiguration.max)
            .push16(servoConfiguration.middle)
            .push8(servoConfiguration.rate);

        let out = servoConfiguration.indexOfChannelToForward;
        if (out == undefined) {
            out = 255; // Cleanflight defines "CHANNEL_FORWARDING_DISABLED" as "(uint8_t)0xFF"
        }
        buffer.push8(out)
            .push32(servoConfiguration.reversedInputSources);

        // prepare for next iteration
        servoIndex++;
        if (servoIndex == FC.SERVO_CONFIG.length) {
            nextFunction = onCompleteCallback;
        }

        MSP$1.send_message(MSPCodes.MSP_SET_SERVO_CONFIGURATION, buffer, false, nextFunction);
    }
};

MspHelper.prototype.sendModeRanges = function(onCompleteCallback) {
    let nextFunction = send_next_mode_range;

    let modeRangeIndex = 0;

    if (FC.MODE_RANGES.length == 0) {
        onCompleteCallback();
    } else {
        send_next_mode_range();
    }

    function send_next_mode_range() {

        const modeRange = FC.MODE_RANGES[modeRangeIndex];
        const buffer = [];

        buffer.push8(modeRangeIndex)
            .push8(modeRange.id)
            .push8(modeRange.auxChannelIndex)
            .push8((modeRange.range.start - 900) / 25)
            .push8((modeRange.range.end - 900) / 25);

        const modeRangeExtra = FC.MODE_RANGES_EXTRA[modeRangeIndex];

        buffer.push8(modeRangeExtra.modeLogic)
            .push8(modeRangeExtra.linkedTo);

        // prepare for next iteration
        modeRangeIndex++;
        if (modeRangeIndex == FC.MODE_RANGES.length) {
            nextFunction = onCompleteCallback;
        }
        MSP$1.send_message(MSPCodes.MSP_SET_MODE_RANGE, buffer, false, nextFunction);
    }
};

MspHelper.prototype.sendAdjustmentRanges = function(onCompleteCallback) {
    let nextFunction = send_next_adjustment_range;

    let adjustmentRangeIndex = 0;

    if (FC.ADJUSTMENT_RANGES.length == 0) {
        onCompleteCallback();
    } else {
        send_next_adjustment_range();
    }


    function send_next_adjustment_range() {

        const adjustmentRange = FC.ADJUSTMENT_RANGES[adjustmentRangeIndex];
        const buffer = [];

        buffer.push8(adjustmentRangeIndex)
            .push8(adjustmentRange.slotIndex)
            .push8(adjustmentRange.auxChannelIndex)
            .push8((adjustmentRange.range.start - 900) / 25)
            .push8((adjustmentRange.range.end - 900) / 25)
            .push8(adjustmentRange.adjustmentFunction)
            .push8(adjustmentRange.auxSwitchChannelIndex);

        // prepare for next iteration
        adjustmentRangeIndex++;
        if (adjustmentRangeIndex == FC.ADJUSTMENT_RANGES.length) {
            nextFunction = onCompleteCallback;

        }
        MSP$1.send_message(MSPCodes.MSP_SET_ADJUSTMENT_RANGE, buffer, false, nextFunction);
    }
};

MspHelper.prototype.sendVoltageConfig = function(onCompleteCallback) {

    let nextFunction = send_next_voltage_config;

    let configIndex = 0;

    if (FC.VOLTAGE_METER_CONFIGS.length == 0) {
        onCompleteCallback();
    } else {
        send_next_voltage_config();
    }

    function send_next_voltage_config() {
        const buffer = [];

        buffer.push8(FC.VOLTAGE_METER_CONFIGS[configIndex].id)
            .push8(FC.VOLTAGE_METER_CONFIGS[configIndex].vbatscale)
            .push8(FC.VOLTAGE_METER_CONFIGS[configIndex].vbatresdivval)
            .push8(FC.VOLTAGE_METER_CONFIGS[configIndex].vbatresdivmultiplier);

        // prepare for next iteration
        configIndex++;
        if (configIndex == FC.VOLTAGE_METER_CONFIGS.length) {
            nextFunction = onCompleteCallback;
        }

        MSP$1.send_message(MSPCodes.MSP_SET_VOLTAGE_METER_CONFIG, buffer, false, nextFunction);
    }

};

MspHelper.prototype.sendCurrentConfig = function(onCompleteCallback) {

    let nextFunction = send_next_current_config;

    let configIndex = 0;

    if (FC.CURRENT_METER_CONFIGS.length == 0) {
        onCompleteCallback();
    } else {
        send_next_current_config();
    }

    function send_next_current_config() {
        const buffer = [];

        buffer.push8(FC.CURRENT_METER_CONFIGS[configIndex].id)
            .push16(FC.CURRENT_METER_CONFIGS[configIndex].scale)
            .push16(FC.CURRENT_METER_CONFIGS[configIndex].offset);

        // prepare for next iteration
        configIndex++;
        if (configIndex == FC.CURRENT_METER_CONFIGS.length) {
            nextFunction = onCompleteCallback;
        }

        MSP$1.send_message(MSPCodes.MSP_SET_CURRENT_METER_CONFIG, buffer, false, nextFunction);
    }

};

MspHelper.prototype.sendLedStripConfig = function(onCompleteCallback) {

    let nextFunction = send_next_led_strip_config;

    let ledIndex = 0;

    if (FC.LED_STRIP.length == 0) {
        onCompleteCallback();
    } else {
        send_next_led_strip_config();
    }

    function send_next_led_strip_config() {

        const led = FC.LED_STRIP[ledIndex];
        const buffer = [];

        buffer.push(ledIndex);

        let mask = 0;

        mask |= (led.y << 0);
        mask |= (led.x << 4);

        for (let functionLetterIndex = 0; functionLetterIndex < led.functions.length; functionLetterIndex++) {
            const fnIndex = ledBaseFunctionLetters.indexOf(led.functions[functionLetterIndex]);
            if (fnIndex >= 0) {
                mask |= (fnIndex << 8);
                break;
            }
        }

        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_46)) {

            for (let overlayLetterIndex = 0; overlayLetterIndex < led.functions.length; overlayLetterIndex++) {
                const bitIndex = ledOverlayLetters.indexOf(led.functions[overlayLetterIndex]);
                if (bitIndex >= 0) {
                    mask |= bit_set(mask, bitIndex + 12);
                }
            }

            mask |= (led.color << 22);

            for (let directionLetterIndex = 0; directionLetterIndex < led.directions.length; directionLetterIndex++) {
                const bitIndex = ledDirectionLetters.indexOf(led.directions[directionLetterIndex]);
                if (bitIndex >= 0) {
                    mask |= bit_set(mask, bitIndex + 26);
                }
            }

            buffer.push32(mask);
        } else {
            for (let overlayLetterIndex = 0; overlayLetterIndex < led.functions.length; overlayLetterIndex++) {
                const bitIndex = ledOverlayLetters.indexOf(led.functions[overlayLetterIndex]);
                if (bitIndex >= 0) {
                    mask |= bit_set(mask, bitIndex + 12);
                }
            }

            mask |= (led.color << 18);

            for (let directionLetterIndex = 0; directionLetterIndex < led.directions.length; directionLetterIndex++) {
                const bitIndex = ledDirectionLetters.indexOf(led.directions[directionLetterIndex]);
                if (bitIndex >= 0) {
                    mask |= bit_set(mask, bitIndex + 22);
                }
            }

            mask |= (0 << 28); // parameters

            buffer.push32(mask);
        }

        // prepare for next iteration
        ledIndex++;
        if (ledIndex == FC.LED_STRIP.length) {
            nextFunction = onCompleteCallback;
        }

        MSP$1.send_message(MSPCodes.MSP_SET_LED_STRIP_CONFIG, buffer, false, nextFunction);
    }
};

MspHelper.prototype.sendLedStripColors = function(onCompleteCallback) {
    if (FC.LED_COLORS.length == 0) {
        onCompleteCallback();
    } else {
        const buffer = [];

        for (const color of FC.LED_COLORS) {
            buffer.push16(color.h)
                .push8(color.s)
                .push8(color.v);
        }
        MSP$1.send_message(MSPCodes.MSP_SET_LED_COLORS, buffer, false, onCompleteCallback);
    }
};

MspHelper.prototype.sendLedStripModeColors = function(onCompleteCallback) {

    let nextFunction = send_next_led_strip_mode_color;
    let index = 0;

    if (FC.LED_MODE_COLORS.length == 0) {
        onCompleteCallback();
    } else {
        send_next_led_strip_mode_color();
    }

    function send_next_led_strip_mode_color() {
        const buffer = [];

        const modeColor = FC.LED_MODE_COLORS[index];

        buffer.push8(modeColor.mode)
            .push8(modeColor.direction)
            .push8(modeColor.color);

        // prepare for next iteration
        index++;
        if (index == FC.LED_MODE_COLORS.length) {
            nextFunction = onCompleteCallback;
        }

        MSP$1.send_message(MSPCodes.MSP_SET_LED_STRIP_MODECOLOR, buffer, false, nextFunction);
    }
};

MspHelper.prototype.sendLedStripConfigValues = function(onCompleteCallback) {
    const buffer = [];
    buffer.push8(FC.LED_CONFIG_VALUES.brightness);
    buffer.push16(FC.LED_CONFIG_VALUES.rainbow_delta);
    buffer.push16(FC.LED_CONFIG_VALUES.rainbow_freq);
    MSP$1.send_message(MSPCodes.MSP2_SET_LED_STRIP_CONFIG_VALUES, buffer, false, onCompleteCallback);
};

MspHelper.prototype.serialPortFunctionMaskToFunctions = function(functionMask) {
    const self = this;
    const functions = [];

    const keys = Object.keys(self.SERIAL_PORT_FUNCTIONS);
    for (const key of keys) {
        const bit = self.SERIAL_PORT_FUNCTIONS[key];
        if (bit_check(functionMask, bit)) {
            functions.push(key);
        }
    }
    return functions;
};

MspHelper.prototype.serialPortFunctionsToMask = function(functions) {
    const self = this;
    let mask = 0;

    for (let index = 0; index < functions.length; index++) {
        const key = functions[index];
        const bitIndex = self.SERIAL_PORT_FUNCTIONS[key];
        if (bitIndex >= 0) {
            mask = bit_set(mask, bitIndex);
        }
    }

    return mask;
};

MspHelper.prototype.sendRxFailConfig = function(onCompleteCallback) {
    let nextFunction = send_next_rxfail_config;

    let rxFailIndex = 0;

    if (FC.RXFAIL_CONFIG.length == 0) {
        onCompleteCallback();
    } else {
        send_next_rxfail_config();
    }

    function send_next_rxfail_config() {

        const rxFail = FC.RXFAIL_CONFIG[rxFailIndex];

        const buffer = [];
        buffer.push8(rxFailIndex)
            .push8(rxFail.mode)
            .push16(rxFail.value);


        // prepare for next iteration
        rxFailIndex++;
        if (rxFailIndex == FC.RXFAIL_CONFIG.length) {
            nextFunction = onCompleteCallback;

        }
        MSP$1.send_message(MSPCodes.MSP_SET_RXFAIL_CONFIG, buffer, false, nextFunction);
    }
};

MspHelper.prototype.setArmingEnabled = function(doEnable, disableRunawayTakeoffPrevention, onCompleteCallback) {
    if (FC.CONFIG.armingDisabled === doEnable || FC.CONFIG.runawayTakeoffPreventionDisabled !== disableRunawayTakeoffPrevention) {

        FC.CONFIG.armingDisabled = !doEnable;
        FC.CONFIG.runawayTakeoffPreventionDisabled = disableRunawayTakeoffPrevention;

        MSP$1.send_message(MSPCodes.MSP_ARMING_DISABLE, mspHelper.crunch(MSPCodes.MSP_ARMING_DISABLE), false, function () {
            if (doEnable) {
                gui_log(i18n$1.getMessage('armingEnabled'));
                if (disableRunawayTakeoffPrevention) {
                    gui_log(i18n$1.getMessage('runawayTakeoffPreventionDisabled'));
                } else {
                    gui_log(i18n$1.getMessage('runawayTakeoffPreventionEnabled'));
                }
            } else {
                gui_log(i18n$1.getMessage('armingDisabled'));
            }

            if (onCompleteCallback) {
                onCompleteCallback();
            }
        });
    } else {
        if (onCompleteCallback) {
            onCompleteCallback();
        }
    }
};

MspHelper.prototype.loadSerialConfig = function(callback) {
    const mspCode = semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43) ? MSPCodes.MSP2_COMMON_SERIAL_CONFIG : MSPCodes.MSP_CF_SERIAL_CONFIG;
    MSP$1.send_message(mspCode, false, false, callback);
};

MspHelper.prototype.sendSerialConfig = function(callback) {
    const mspCode = semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_43) ? MSPCodes.MSP2_COMMON_SET_SERIAL_CONFIG : MSPCodes.MSP_SET_CF_SERIAL_CONFIG;
    MSP$1.send_message(mspCode, mspHelper.crunch(mspCode), false, callback);
};

MspHelper.prototype.writeConfiguration = function(reboot, callback) {
    setTimeout(function() {
        MSP$1.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, function() {
            gui_log(i18n$1.getMessage('configurationEepromSaved'));
            console.log('Configuration saved to EEPROM');
            if (reboot) {
                GUI.tab_switch_cleanup(function() {
                    MSP$1.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitializeConnection);
                });
            }
            if (callback) {
                callback();
            }
        });
    }, 100); // 100ms delay before sending MSP_EEPROM_WRITE to ensure that all settings have been received
};

let mspHelper;
// This is temporary, till things are moved
// to modules and every usage of this can create own
// instance or re-use existing where needed.
window.mspHelper = mspHelper = new MspHelper();

/**
 * Encapsulates the AutoComplete logic
 *
 * Uses: https://github.com/yuku/jquery-textcomplete
 * Check out the docs at https://github.com/yuku/jquery-textcomplete/tree/v1/doc
 */
const CliAutoComplete = {
    configEnabled: false,
    builder: { state: 'reset', numFails: 0 },
};

CliAutoComplete.isEnabled = function() {
    return this.isBuilding() || (this.configEnabled && FC.CONFIG.flightControllerIdentifier === "BTFL" && this.builder.state !== 'fail');
};

CliAutoComplete.isBuilding = function() {
    return this.builder.state !== 'reset' && this.builder.state !== 'done' && this.builder.state !== 'fail';
};

CliAutoComplete.isOpen = function() {
    return $$1('.cli-textcomplete-dropdown').is(':visible');
};

/**
 * @param {boolean} force - Forces AutoComplete to be shown even if the matching strategy has less that minChars input
 */
CliAutoComplete.openLater = function(force) {
    const self = this;
    setTimeout(function() {
        self.forceOpen = !!force;
        self.$textarea.textcomplete('trigger');
        self.forceOpen = false;
    }, 0);
};

CliAutoComplete.setEnabled = function(enable) {
    if (this.configEnabled !== enable) {
        this.configEnabled = enable;

        if (CONFIGURATOR.cliActive && CONFIGURATOR.cliValid) {
            // cli is already open
            if (this.isEnabled()) {
                this.builderStart();
            } else if (!this.isEnabled() && !this.isBuilding()) {
                this.cleanup();
            }
        }
    }
};

CliAutoComplete.initialize = function($textarea, sendLine, writeToOutput) {
    tracking.sendEvent(tracking.EVENT_CATEGORIES.APPLICATION, 'CliAutoComplete', { configEnabled: this.configEnabled });

    this.$textarea = $textarea;
    this.forceOpen = false;
    this.sendLine = sendLine;
    this.writeToOutput = writeToOutput;
    this.cleanup();
};

CliAutoComplete.cleanup = function() {
    this.$textarea.textcomplete('destroy');
    this.builder.state = 'reset';
    this.builder.numFails = 0;
};

CliAutoComplete._builderWatchdogTouch = function() {
    const self = this;

    this._builderWatchdogStop();

    GUI.timeout_add('autocomplete_builder_watchdog', function() {
        if (self.builder.numFails) {
            self.builder.numFails++;
            self.builder.state = 'fail';
            self.writeToOutput('Failed!<br># ');
            $$1(self).trigger('build:stop');
        } else {
            // give it one more try
            self.builder.state = 'reset';
            self.builderStart();
        }
    }, 3000);
};

CliAutoComplete._builderWatchdogStop = function() {
    GUI.timeout_remove('autocomplete_builder_watchdog');
};

CliAutoComplete.builderStart = function() {
    if (this.builder.state === 'reset') {
        this.cache = {
            commands: [],
            resources: [],
            resourcesCount: {},
            settings: [],
            settingsAcceptedValues: {},
            feature: [],
            beeper: ['ALL'],
            mixers: [],
        };
        this.builder.commandSequence = ['help', 'dump', 'get', 'mixer list'];
        this.builder.currentSetting = null;
        this.builder.sentinel = `# ${Math.random()}`;
        this.builder.state = 'init';
        this.writeToOutput('<br># Building AutoComplete Cache ... ');
        this.sendLine(this.builder.sentinel);
        $$1(this).trigger('build:start');
    }
};

CliAutoComplete.builderParseLine = function(line) {
    const cache = this.cache;
    const builder = this.builder;

    this._builderWatchdogTouch();

    if (line.indexOf(builder.sentinel) !== -1) {
        // got sentinel
        const command = builder.commandSequence.shift();

        if (command && this.configEnabled) {
            // next state
            builder.state = `parse-${command}`;
            this.sendLine(command);
            this.sendLine(builder.sentinel);
        } else {
            // done
            this._builderWatchdogStop();

            if (!this.configEnabled) {
                // disabled while we were building
                this.writeToOutput('Cancelled!<br># ');
                this.cleanup();
            } else {
                cache.settings.sort();
                cache.commands.sort();
                cache.feature.sort();
                cache.beeper.sort();
                cache.resources = Object.keys(cache.resourcesCount).sort();

                this._initTextcomplete();
                this.writeToOutput('Done!<br># ');
                builder.state = 'done';
            }
            $$1(this).trigger('build:stop');
        }
    } else {
        switch (builder.state) {
            case 'parse-help':
                const matchHelp = line.match(/^(\w+)/);
                if (matchHelp) {
                    cache.commands.push(matchHelp[1]);
                }
                break;

            case 'parse-dump':
                const matchDump = line.match(/^resource\s+(\w+)/i);
                if (matchDump) {
                    const r = matchDump[1].toUpperCase(); // should alread be upper, but to be sure, since we depend on that later
                    cache.resourcesCount[r] = (cache.resourcesCount[r] || 0) + 1;
                } else {
                    const matchFeatBeep = line.match(/^(feature|beeper)\s+-?(\w+)/i);
                    if (matchFeatBeep) {
                        cache[matchFeatBeep[1].toLowerCase()].push(matchFeatBeep[2]);
                    }
                }
                break;

            case 'parse-get':
                const matchGet = line.match(/^(\w+)\s*=/);
                if (matchGet) {
                    // setting name
                    cache.settings.push(matchGet[1]);
                    builder.currentSetting = matchGet[1].toLowerCase();
                } else {
                    const matchGetSettings = line.match(/^(.*): (.*)/);
                    if (matchGetSettings !== null && builder.currentSetting) {
                        if (matchGetSettings[1].match(/values/i)) {
                            // Allowed Values
                            cache.settingsAcceptedValues[builder.currentSetting] = matchGetSettings[2].split(/\s*,\s*/).sort();
                        } else if (matchGetSettings[1].match(/range|length/i)){
                            // "Allowed range" or "Array length", store as string hint
                            cache.settingsAcceptedValues[builder.currentSetting] = matchGetSettings[0];
                        }
                    }
                }
                break;

            case 'parse-mixer list':
                const matchMixer = line.match(/:(.+)/);
                if (matchMixer) {
                    cache.mixers = ['list'].concat(matchMixer[1].trim().split(/\s+/));
                }
                break;
        }
    }
};

/**
 * Initializes textcomplete with all the autocomplete strategies
 */
CliAutoComplete._initTextcomplete = function() {
    let sendOnEnter = false;
    const self = this;
    const $textarea = this.$textarea;
    const cache = self.cache;

    let savedMouseoverItemHandler = null;

    // helper functions
    const highlighter = function(anywhere) {
        return function(value, term) {
            const anywherePrefix = anywhere ? '': '^';
            const termValue = value.replace(new RegExp(`${anywherePrefix}(${term})`, 'gi'), '<b>$1</b>');
            return term ? termValue : value;
        };
    };
    const highlighterAnywhere = highlighter(true);
    const highlighterPrefix = highlighter(false);

    const searcher = function(term, callback, array, minChars, matchPrefix) {
        const res = [];

        if ((minChars !== false && term.length >= minChars) || self.forceOpen || self.isOpen()) {
            term = term.toLowerCase();
            for (let i = 0; i < array.length; i++) {
                const v = array[i].toLowerCase();
                if (matchPrefix && v.startsWith(term) || !matchPrefix && v.indexOf(term) !== -1) {
                    res.push(array[i]);
                }
            }
        }

        callback(res);

        if (self.forceOpen && res.length === 1) {
            // hacky: if we came here because of Tab and there's only one match
            // trigger Tab again, so that textcomplete should immediately select the only result
            // instead of showing the menu
            $textarea.trigger($$1.Event('keydown', {keyCode:9}));
        }
    };

    const contexter = function(text) {
        const val = $textarea.val();
        if (val.length === text.length || val[text.length].match(/\s/)) {
            return true;
        }
        return false; // do not show autocomplete if in the middle of a word
    };

    const basicReplacer = function(value) {
        return `$1${value} `;
    };
    // end helper functions

    // init textcomplete
    $textarea.textcomplete([],
        {
            maxCount: 10000,
            debounce: 0,
            className: 'cli-textcomplete-dropdown',
            placement: 'top',
            onKeydown: function(e) {
                // some strategies may set sendOnEnter only at the replace stage, thus we call with timeout
                // since this handler [onKeydown] is triggered before replace()
                if (e.which === 13) {
                    setTimeout(function() {
                        if (sendOnEnter) {
                            // fake "enter" to run the textarea's handler
                            $textarea.trigger($$1.Event('keypress', {which:13}));
                        }
                    }, 0);
                }
            },
        },
    )
    .on('textComplete:show', function() {
        /**
         * The purpose of this code is to disable initially the `mouseover` menu item handler.
         * Normally, when the menu pops up, if the mouse cursor is in the same area,
         * the `mouseover` event triggers immediately and activates the item under
         * the cursor. This might be undesirable when using the keyboard.
         *
         * Here we save the original `mouseover` handler and remove it on popup show.
         * Then add `mousemove` handler. If the mouse moves we consider that mouse interaction
         * is desired so we reenable the `mouseover` handler
         */

        const textCompleteDropDownElement = $$1('.textcomplete-dropdown');

        if (!savedMouseoverItemHandler) {
            // save the original 'mouseover' handeler
            try {
                savedMouseoverItemHandler = $$1._data(textCompleteDropDownElement[0], 'events').mouseover[0].handler;
            } catch (error) {
                console.log(error);
            }

            if (savedMouseoverItemHandler) {
                textCompleteDropDownElement
                .off('mouseover') // initially disable it
                .off('mousemove') // avoid `mousemove` accumulation if previous show did not trigger `mousemove`
                .on('mousemove', '.textcomplete-item', function(e) {
                        // the mouse has moved so reenable `mouseover`
                    $$1(this).parent()
                    .off('mousemove')
                    .on('mouseover', '.textcomplete-item', savedMouseoverItemHandler);

                    // trigger the mouseover handler to select the item under the cursor
                    savedMouseoverItemHandler(e);
                });
            }
        }
    });

    // textcomplete autocomplete strategies

    // strategy builder helper
    const strategy = function(s) {
        return $$1.extend({
            template: highlighterAnywhere,
            replace: basicReplacer,
            context: contexter,
            index: 2,
        }, s);
    };

    $textarea.textcomplete('register', [
        strategy({ // "command"
            match: /^(\s*)(\w*)$/,
            search: function(term, callback) {
                sendOnEnter = false;
                searcher(term, callback, cache.commands, false, true);
            },
            template: highlighterPrefix,
        }),

        strategy({ // "get"
            match: /^(\s*get\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = true;
                searcher(term, function(arr) {
                    if (term.length > 0 && arr.length > 1) {
                        // prepend the uncompleted term in the popup
                        arr = [term].concat(arr);
                    }
                    callback(arr);
                }, cache.settings, 3);
            },
        }),

        strategy({ // "set"
            match: /^(\s*set\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = false;
                searcher(term, callback, cache.settings, 3);
            },
        }),

        strategy({ // "set ="
            match: /^(\s*set\s+\w*\s*)$/i,
            search:  function(term, callback) {
                sendOnEnter = false;
                searcher('', callback, ['='], false);
            },
            replace: function(value) {
                self.openLater();
                return basicReplacer(value);
            },
        }),

        strategy({ // "set with value"
            match: /^(\s*set\s+(\w+))\s*=\s*(.*)$/i,
            search: function(term, callback, match) {
                const arr = [];
                const settingName = match[2].toLowerCase();
                this.isSettingValueArray = false;
                this.value = match[3];
                sendOnEnter = !!term;

                if (settingName in cache.settingsAcceptedValues) {
                    const val = cache.settingsAcceptedValues[settingName];

                    if (Array.isArray(val)) {
                        // setting uses lookup strings
                        this.isSettingValueArray = true;
                        sendOnEnter = true;
                        searcher(term, callback, val, 0);
                        return;
                    }

                    // the settings uses a numeric value.
                    // Here we use a little trick - we use the autocomplete
                    // list as kind of a tooltip to display the Accepted Range hint
                    arr.push(val);
                }

                callback(arr);
            },
            replace: function (value) {
                if (!this.isSettingValueArray) {
                    // `value` is the tooltip text, so use the saved match
                    value = this.value;
                }

                return `$1 = ${value}`; // cosmetic - make sure we have spaces around the `=`
            },
            index: 3,
            isSettingValueArray: false,
        }),

        strategy({ // "resource"
            match: /^(\s*resource\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = false;
                let arr = cache.resources;
                if (semver.gte(FC.CONFIG.flightControllerVersion, "4.0.0")) {
                    arr = ['show'].concat(arr);
                } else {
                    arr = ['list'].concat(arr);
                }
                searcher(term, callback, arr, 1);
            },
            replace: function(value) {
                if (value in cache.resourcesCount) {
                    self.openLater();
                } else if (value === 'list' || value === 'show') {
                    sendOnEnter = true;
                }
                return basicReplacer(value);
            },
        }),

        strategy({ // "resource index"
            match: /^(\s*resource\s+(\w+)\s+)(\d*)$/i,
            search:  function(term, callback, match) {
                sendOnEnter = false;
                this.savedTerm = term;
                callback([`&lt;1-${cache.resourcesCount[match[2].toUpperCase()]}&gt;`]);
            },
            replace: function() {
                if (this.savedTerm) {
                    self.openLater();
                    return '$1$3 ';
                }
                return undefined;
            },
            context: function(text) {
                const matchResource = text.match(/^\s*resource\s+(\w+)\s/i);
                // use this strategy only for resources with more than one index
                if (matchResource && (cache.resourcesCount[matchResource[1].toUpperCase()] || 0) > 1 ) {
                    return contexter(text);
                }
                return false;
            },
            index: 3,
            savedTerm: null,
        }),

        strategy({ // "resource pin"
            match: /^(\s*resource\s+\w+\s+(\d*\s+)?)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = !!term;
                if (term) {
                    if ('none'.startsWith(term)) {
                        callback(['none']);
                    } else {
                        callback(['&lt;pin&gt;']);
                    }
                } else {
                    callback(['&lt;pin&gt', 'none']);
                }
            },
            template: function(value, term) {
                if (value === 'none') {
                    return highlighterPrefix(value, term);
                }
                return value;
            },
            replace: function(value) {
                if (value === 'none') {
                    sendOnEnter = true;
                    return '$1none ';
                }
                return undefined;
            },
            context: function(text) {
                const m = text.match(/^\s*resource\s+(\w+)\s+(\d+\s)?/i);
                if (m) {
                    // show pin/none for resources having only one index (it's not needed at the commend line)
                    // OR having more than one index and the index is supplied at the command line
                    const count = cache.resourcesCount[m[1].toUpperCase()] || 0;
                    if (count && (m[2] || count === 1)) {
                        return contexter(text);
                    }
                }
                return false;
            },
            index: 3,
        }),

        strategy({ // "feature" and "beeper"
            match: /^(\s*(feature|beeper)\s+(-?))(\w*)$/i,
            search:  function(term, callback, match) {
                sendOnEnter = !!term;
                let arr = cache[match[2].toLowerCase()];
                if (!match[3]) {
                    arr = ['-', 'list'].concat(arr);
                }
                searcher(term, callback, arr, 1);
            },
            replace: function(value) {
                if (value === '-') {
                    self.openLater(true);
                    return '$1-';
                }
                return basicReplacer(value);
            },
            index: 4,
        }),

        strategy({ // "mixer"
            match: /^(\s*mixer\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = true;
                searcher(term, callback, cache.mixers, 1);
            },
        }),
    ]);

    $textarea.textcomplete('register', [
        strategy({ // "resource show all", from BF 4.0.0 onwards
            match: /^(\s*resource\s+show\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = true;
                searcher(term, callback, ['all'], 1, true);
            },
            template: highlighterPrefix,
        }),
    ]);

    // diff command
    const diffArgs1 = ["master", "profile", "rates", "all"];
    const diffArgs2 = [];

    // above 3.4.0
    diffArgs2.push("defaults");
    diffArgs1.push("hardware");
    diffArgs2.push("bare");

    diffArgs1.sort();
    diffArgs2.sort();

    $textarea.textcomplete('register', [
        strategy({ // "diff arg1"
            match: /^(\s*diff\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = true;
                searcher(term, callback, diffArgs1, 1, true);
            },
            template: highlighterPrefix,
        }),

        strategy({ // "diff arg1 arg2"
            match: /^(\s*diff\s+\w+\s+)(\w*)$/i,
            search:  function(term, callback) {
                sendOnEnter = true;
                searcher(term, callback, diffArgs2, 1, true);
            },
            template: highlighterPrefix,
        }),
    ]);
};

window.CliAutoComplete = CliAutoComplete;

const DarkTheme = {
    configSetting: undefined,
    enabled: false,
};

DarkTheme.isDarkThemeEnabled = function (callback) {
    if (this.configSetting === 0) {
        callback(true);
    } else if (this.configSetting === 2) {
        if (GUI.isCordova()) {
            cordova.plugins.ThemeDetection.isDarkModeEnabled(function(success) {
                callback(success.value);
            }, function(error) {
                console.log(`cordova-plugin-theme-detection: ${error}`);
                callback(false);
            });
        } else {
            const isEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            callback(isEnabled);
        }
    } else {
        callback(false);
    }
};

DarkTheme.apply = function() {
    const self = this;
    this.isDarkThemeEnabled(function(isEnabled) {
        if (isEnabled) {
            self.applyDark();
        } else {
            self.applyNormal();
        }

        if (chrome.app.window !== undefined) {
            windowWatcherUtil.passValue(chrome.app.window.get("receiver_msp"), 'darkTheme', isEnabled);
        }
    });
};

DarkTheme.autoSet = function() {
    if (this.configSetting === 2) {
        this.apply();
    }
};

DarkTheme.setConfig = function (result) {
    if (this.configSetting !== result) {
        this.configSetting = result;
        this.apply();
    }
};

DarkTheme.applyDark = function () {
    $$1('body').addClass('dark-theme');
    this.enabled = true;
};

DarkTheme.applyNormal = function () {
    $$1('body').removeClass('dark-theme');
    this.enabled = false;
};

function setDarkTheme(enabled) {
    DarkTheme.setConfig(enabled);

    checkSetupAnalytics(function (analyticsService) {
        analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'DarkTheme', { enabled: enabled });
    });
}

function isExpertModeEnabled() {
    return $$1('input[name="expertModeCheckbox"]').is(':checked');
}

function notifyOutdatedVersion(data) {

    if (data === undefined) {
        console.log('No releaseData');
        return false;
    }

    if (data.isCurrent === false && data.updatedVersion !== undefined) {

        CONFIGURATOR.latestVersion = data.updatedVersion.version;
        CONFIGURATOR.latestVersionReleaseUrl = data.updatedVersion.url;

        const message = i18n$1.getMessage('configuratorUpdateNotice', [CONFIGURATOR.latestVersion, CONFIGURATOR.latestVersionReleaseUrl]);
        gui_log(message);

        const dialog = $$1('.dialogConfiguratorUpdate')[0];

        $$1('.dialogConfiguratorUpdate-content').html(message);

        $$1('.dialogConfiguratorUpdate-closebtn').click(function() {
            dialog.close();
        });

        $$1('.dialogConfiguratorUpdate-websitebtn').click(function() {
            dialog.close();

            window.open(CONFIGURATOR.latestVersionReleaseUrl, '_blank');
        });

        dialog.showModal();
    } else {
        CONFIGURATOR.latestVersion = data.version;
    }
}

function checkForConfiguratorUpdates() {

    const result = get$1('checkForConfiguratorUnstableVersions');
    let type = "Stable";
    if (result.checkForConfiguratorUnstableVersions) {
        type = "Unstable";
    }

    const buildApi = new BuildApi();
    buildApi.loadConfiguratorRelease(type, notifyOutdatedVersion);
}

if (typeof String.prototype.replaceAll === "undefined") {
    String.prototype.replaceAll = function(match, replace) {
        return this.replace(new RegExp(match, 'g'), () => replace);
    };
}

$$1(document).ready(function () {

    useGlobalNodeFunctions();

    if (typeof cordovaApp === 'undefined') {
        appReady();
    }
});

function useGlobalNodeFunctions() {
    // The global functions of Node continue working on background. This is good to continue flashing,
    // for example, when the window is minimized
    if (GUI.isNWJS()) {
        console.log("Replacing timeout/interval functions with Node versions");
        window.setTimeout = global.setTimeout;
        window.clearTimeout = global.clearTimeout;
        window.setInterval = global.setInterval;
        window.clearInterval = global.clearInterval;
    }
}

function readConfiguratorVersionMetadata() {
    if (GUI.isNWJS() || GUI.isCordova()) {
        const manifest = chrome.runtime.getManifest();
        CONFIGURATOR.productName = manifest.productName;
        CONFIGURATOR.version = manifest.version;
        CONFIGURATOR.gitRevision = manifest.gitRevision;
    } else {
        // These are injected by vite. If not checking
        // for undefined occasionally there is a race
        // condition where this fails the nwjs and cordova builds
        CONFIGURATOR.productName = typeof __APP_PRODUCTNAME__ !== 'undefined' ? __APP_PRODUCTNAME__ : 'Betaflight Configurator';
        CONFIGURATOR.version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';
        CONFIGURATOR.gitRevision = typeof __APP_REVISION__ !== 'undefined' ? __APP_REVISION__ : 'unknown';
    }
}

function cleanupLocalStorage() {
    // storage quota is 5MB, we need to clean up some stuff (more info see PR #2937)
    const cleanupLocalStorageList = [
        'cache',
        'firmware',
        'https',
        'selected_board',
        'unifiedConfigLast',
        'unifiedSourceCache',
    ];

    for (const key in localStorage) {
        for (const item of cleanupLocalStorageList) {
            if (key.includes(item)) {
                localStorage.removeItem(key);
            }
        }
    }

    set$1({'erase_chip': true}); // force erase chip on first run
}

function appReady() {
    readConfiguratorVersionMetadata();

    cleanupLocalStorage();

    i18n$1.init(function() {

        // pass the configurator version as a custom header for every AJAX request.
        $$1.ajaxSetup({
            headers: {
                'X-CFG-VER': `${CONFIGURATOR.version}`,
            },
        });

        startProcess();

        checkSetupAnalytics(function (analyticsService) {
            analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'SelectedLanguage', { language: i18n$1.selectedLanguage });
        });

        initializeSerialBackend();
    });
}

function closeSerial() {
    // automatically close the port when application closes
    const connectionId = serial$3.connectionId;

    if (connectionId && CONFIGURATOR.connectionValid && !CONFIGURATOR.virtualMode) {
        // code below is handmade MSP message (without pretty JS wrapper), it behaves exactly like MSP.send_message
        // sending exit command just in case the cli tab was open.
        // reset motors to default (mincommand)

        let bufferOut = new ArrayBuffer(5),
        bufView = new Uint8Array(bufferOut);

        bufView[0] = 0x65; // e
        bufView[1] = 0x78; // x
        bufView[2] = 0x69; // i
        bufView[3] = 0x74; // t
        bufView[4] = 0x0D; // enter

        const sendFn = (serial$3.connectionType === 'serial' ? chrome.serial.send : chrome.sockets.tcp.send);
        sendFn(connectionId, bufferOut, function () {
            console.log('Send exit');
        });

        setTimeout(function() {
            bufferOut = new ArrayBuffer(22);
            bufView = new Uint8Array(bufferOut);
            let checksum = 0;

            bufView[0] = 36; // $
            bufView[1] = 77; // M
            bufView[2] = 60; // <
            bufView[3] = 16; // data length
            bufView[4] = 214; // MSP_SET_MOTOR

            checksum = bufView[3] ^ bufView[4];

            for (let i = 0; i < 16; i += 2) {
                bufView[i + 5] = FC.MOTOR_CONFIG.mincommand & 0x00FF;
                bufView[i + 6] = FC.MOTOR_CONFIG.mincommand >> 8;

                checksum ^= bufView[i + 5];
                checksum ^= bufView[i + 6];
            }

            bufView[5 + 16] = checksum;

            sendFn(connectionId, bufferOut, function () {
                serial$3.disconnect();
            });
        }, 100);
    } else if (connectionId) {
        serial$3.disconnect();
    }
}

function closeHandler() {
    if (!GUI.isCordova()) {
        this.hide();
    }

    tracking.sendEvent(tracking.EVENT_CATEGORIES.APPLICATION, 'AppClose', { sessionControl: 'end' });

    closeSerial();

    if (!GUI.isCordova()) {
        this.close(true);
    }
}

//Process to execute to real start the app
function startProcess() {
    // translate to user-selected language
    i18n$1.localizePage();

    gui_log(i18n$1.getMessage('infoVersionOs', { operatingSystem: GUI.operating_system }));
    gui_log(i18n$1.getMessage('infoVersionConfigurator', { configuratorVersion: CONFIGURATOR.getDisplayVersion() }));

    if (GUI.isNWJS()) {
        const nwWindow = GUI.nwGui.Window.get();
        nwWindow.on('new-win-policy', function(frame, url, policy) {
            // do not open the window
            policy.ignore();
            // and open it in external browser
            GUI.nwGui.Shell.openExternal(url);
        });
        nwWindow.on('close', closeHandler);
        const config = get$1('showDevToolsOnStartup');
        if (CONFIGURATOR.isDevVersion() && !!config.showDevToolsOnStartup) {
            nwWindow.showDevTools();
        }
    } else if (GUI.isCordova()) {
        window.addEventListener('beforeunload', closeHandler);
        document.addEventListener('backbutton', function(e) {
            e.preventDefault();
            navigator.notification.confirm(
                i18n$1.getMessage('cordovaExitAppMessage'),
                function(stat) {
                    if (stat === 1) {
                        navigator.app.exitApp();
                    }
                },
                i18n$1.getMessage('cordovaExitAppTitle'),
                [i18n$1.getMessage('yes'),i18n$1.getMessage('no')],
            );
        });
    }

    $$1('.connect_b a.connect').removeClass('disabled');
    // with Vue reactive system we don't need to call these,
    // our view is reactive to model changes
    // updateTopBarVersion();

    if (!GUI.isOther()) {
        checkForConfiguratorUpdates();
    }

    // log webgl capability
    // it would seem the webgl "enabling" through advanced settings will be ignored in the future
    // and webgl will be supported if gpu supports it by default (canary 40.0.2175.0), keep an eye on this one
    document.createElement('canvas');

    // log library versions in console to make version tracking easier
    console.log(`Libraries: jQuery - ${$$1.fn.jquery}, three.js - ${REVISION}`);

    // Tabs
    $$1("#tabs ul.mode-connected li").click(function() {
        // store the first class of the current tab (omit things like ".active")
        const tabName = $$1(this).attr("class").split(' ')[0];

        const tabNameWithoutPrefix = tabName.substring(4);
        if (tabNameWithoutPrefix !== "cli") {
            // Don't store 'cli' otherwise you can never connect to another tab.
            set$1(
                {lastTab: tabName},
            );
        }
    });

    if (GUI.isCordova()) {
        UI_PHONES.init();
    }

    const ui_tabs = $$1('#tabs > ul');
    $$1('a', ui_tabs).click(function () {
        if ($$1(this).parent().hasClass('active') === false && !GUI.tab_switch_in_progress) { // only initialize when the tab isn't already active
            const self = this;
            const tabClass = $$1(self).parent().prop('class');

            const tabRequiresConnection = $$1(self).parent().hasClass('mode-connected');

            const tab = tabClass.substring(4);
            const tabName = $$1(self).text();

            if (tabRequiresConnection && !CONFIGURATOR.connectionValid) {
                gui_log(i18n$1.getMessage('tabSwitchConnectionRequired'));
                return;
            }

            if (GUI.connect_lock) { // tab switching disabled while operation is in progress
                gui_log(i18n$1.getMessage('tabSwitchWaitForOperation'));
                return;
            }

            if (GUI.allowedTabs.indexOf(tab) < 0 && tab === "firmware_flasher") {
                if (GUI.connected_to || GUI.connecting_to) {
                    $$1('a.connect').click();
                } else {
                    serial$3.disconnect();
                }
                $$1('div.open_firmware_flasher a.flash').click();
            } else if (GUI.allowedTabs.indexOf(tab) < 0) {
                gui_log(i18n$1.getMessage('tabSwitchUpgradeRequired', [tabName]));
                return;
            }

            GUI.tab_switch_in_progress = true;

            GUI.tab_switch_cleanup(function () {
                // disable active firmware flasher if it was active
                if ($$1('div#flashbutton a.flash_state').hasClass('active') && $$1('div#flashbutton a.flash').hasClass('active')) {
                    $$1('div#flashbutton a.flash_state').removeClass('active');
                    $$1('div#flashbutton a.flash').removeClass('active');
                }
                // disable previously active tab highlight
                $$1('li', ui_tabs).removeClass('active');

                // Highlight selected tab
                $$1(self).parent().addClass('active');

                // detach listeners and remove element data
                const content = $$1('#content');
                content.empty();

                // display loading screen
                $$1('#cache .data-loading').clone().appendTo(content);

                function content_ready() {
                    GUI.tab_switch_in_progress = false;
                }

                checkSetupAnalytics(function (analyticsService) {
                    analyticsService.sendAppView(tab);
                });

                switch (tab) {
                    case 'landing':
                        import('../landing.js').then(({ landing }) =>
                            landing.initialize(content_ready),
                        );
                        break;
                    case 'changelog':
                        import('../static_tab.js').then(({ staticTab }) =>
                            staticTab.initialize("changelog", content_ready),
                        );
                        break;
                    case 'privacy_policy':
                        import('../static_tab.js').then(({ staticTab }) =>
                            staticTab.initialize("privacy_policy", content_ready),
                        );
                        break;
                    case 'options':
                        import('../options.js').then(({ options }) =>
                            options.initialize(content_ready),
                        );
                        break;
                    case 'firmware_flasher':
                        import('../firmware_flasher.js').then(({ firmware_flasher }) =>
                            firmware_flasher.initialize(content_ready),
                        );
                        break;
                    case 'help':
                        import('../help.js').then(({ help }) =>
                            help.initialize(content_ready),
                        );
                        break;
                    case 'auxiliary':
                        import('../auxiliary.js').then(({ auxiliary }) =>
                            auxiliary.initialize(content_ready),
                        );
                        break;
                    case 'adjustments':
                        import('../adjustments.js').then(({ adjustments }) =>
                            adjustments.initialize(content_ready),
                        );
                        break;
                    case 'ports':
                        import('../ports.js').then(({ ports }) =>
                            ports.initialize(content_ready),
                        );
                        break;
                    case 'led_strip':
                        import('../led_strip.js').then(({ led_strip }) =>
                            led_strip.initialize(content_ready),
                        );
                        break;
                    case 'failsafe':
                        import('../failsafe.js').then(({ failsafe }) =>
                            failsafe.initialize(content_ready),
                        );
                        break;
                    case 'transponder':
                        import('../transponder.js').then(({ transponder }) =>
                            transponder.initialize(content_ready),
                        );
                        break;
                    case 'osd':
                        Promise.resolve().then(function () { return osd$1; }).then(({ osd }) =>
                            osd.initialize(content_ready),
                        );
                        break;
                    case 'vtx':
                        import('../vtx.js').then(({ vtx }) =>
                            vtx.initialize(content_ready),
                        );
                        break;
                    case 'power':
                        import('../power.js').then(({ power }) =>
                            power.initialize(content_ready),
                        );
                        break;
                    case 'setup':
                        import('../setup.js').then(({ setup }) =>
                            setup.initialize(content_ready),
                        );
                        break;
                    case 'setup_osd':
                        import('../setup_osd.js').then(({ setup_osd }) =>
                            setup_osd.initialize(content_ready),
                        );
                        break;
                    case 'configuration':
                        import('../configuration.js').then(({ configuration }) =>
                            configuration.initialize(content_ready),
                        );
                        break;
                    case 'pid_tuning':
                        import('../pid_tuning.js').then(({ pid_tuning }) =>
                            pid_tuning.initialize(content_ready),
                        );
                        break;
                    case 'receiver':
                        import('../receiver.js').then(({ receiver }) =>
                            receiver.initialize(content_ready),
                        );
                        break;
                    case 'servos':
                        import('../servos.js').then(({ servos }) =>
                            servos.initialize(content_ready),
                        );
                        break;
                    case 'gps':
                        import('../gps.js').then(({ gps }) =>
                            gps.initialize(content_ready),
                        );
                        break;
                    case 'motors':
                        import('../motors.js').then(({ motors }) =>
                            motors.initialize(content_ready),
                        );
                        break;
                    case 'sensors':
                        import('../sensors.js').then(({ sensors }) =>
                            sensors.initialize(content_ready),
                        );
                        break;
                    case 'logging':
                        import('../logging.js').then(({ logging }) =>
                            logging.initialize(content_ready),
                        );
                        break;
                    case 'onboard_logging':
                        import('../onboard_logging.js').then(({ onboard_logging }) =>
                            onboard_logging.initialize(content_ready),
                        );
                        break;
                    case 'cli':
                        import('../cli.js').then(({ cli }) =>
                            cli.initialize(content_ready),
                        );
                        break;
                    case 'presets':
                        import('../presets.js').then(({ presets }) =>
                            presets.initialize(content_ready),
                        );
                        break;

                    default:
                        console.log(`Tab not found: ${tab}`);
                }
            });
        }
    });

    $$1('#tabs ul.mode-disconnected li a:first').click();

    // listen to all input change events and adjust the value within limits if necessary
    $$1("#content").on('focus', 'input[type="number"]', function () {
        const element = $$1(this);
        const val = element.val();

        if (!isNaN(val)) {
            element.data('previousValue', parseFloat(val));
        }
    });

    $$1("#content").on('keydown', 'input[type="number"]', function (e) {
        // whitelist all that we need for numeric control
        const whitelist = [
            96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // numpad and standard number keypad
            109, 189, // minus on numpad and in standard keyboard
            8, 46, 9, // backspace, delete, tab
            190, 110, // decimal point
            37, 38, 39, 40, 13, // arrows and enter
        ];

        if (whitelist.indexOf(e.keyCode) === -1) {
            e.preventDefault();
        }
    });

    $$1("#content").on('change', 'input[type="number"]', function () {
        const element = $$1(this);
        const min = parseFloat(element.prop('min'));
        const max = parseFloat(element.prop('max'));
        const step = parseFloat(element.prop('step'));

        let val = parseFloat(element.val());

        // only adjust minimal end if bound is set
        if (element.prop('min') && val < min) {
            element.val(min);
            val = min;
        }

        // only adjust maximal end if bound is set
        if (element.prop('max') && val > max) {
            element.val(max);
            val = max;
        }

        // if entered value is illegal use previous value instead
        if (isNaN(val)) {
            element.val(element.data('previousValue'));
            val = element.data('previousValue');
        }

        // if step is not set or step is int and value is float use previous value instead
        if ((isNaN(step) || step % 1 === 0) && val % 1 !== 0) {
            element.val(element.data('previousValue'));
            val = element.data('previousValue');
        }

        // if step is set and is float and value is int, convert to float, keep decimal places in float according to step *experimental*
        if (!isNaN(step) && step % 1 !== 0) {
            const decimal_places = String(step).split('.')[1].length;

            if (val % 1 === 0 || String(val).split('.')[1].length !== decimal_places) {
                element.val(val.toFixed(decimal_places));
            }
        }
    });

    $$1("#showlog").on('click', function () {
        let state = $$1(this).data('state');
        if (state) {
            setTimeout(function() {
                const command_log = $$1('div#log');
                command_log.scrollTop($$1('div.wrapper', command_log).height());
            }, 200);
            $$1("#log").removeClass('active');
            $$1("#tab-content-container").removeClass('logopen');
            $$1("#scrollicon").removeClass('active');
            set$1({'logopen': false});

            state = false;
        } else {
            $$1("#log").addClass('active');
            $$1("#tab-content-container").addClass('logopen');
            $$1("#scrollicon").addClass('active');
            set$1({'logopen': true});

            state = true;
        }
        $$1(this).text(state ? i18n$1.getMessage('logActionHide') : i18n$1.getMessage('logActionShow'));
        $$1(this).data('state', state);
    });

    let result = get$1('logopen');
    if (result.logopen) {
        $$1("#showlog").trigger('click');
    }

    result = get$1('expertMode').expertMode ?? false;

    const expertModeCheckbox = $$1('input[name="expertModeCheckbox"]');
    expertModeCheckbox.prop('checked', result).trigger('change');

    expertModeCheckbox.on("change", () => {
        const checked = expertModeCheckbox.is(':checked');

        checkSetupAnalytics(function (analyticsService) {
            analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'ExpertMode', { status: checked ? 'On' : 'Off' });
        });

        if (FC.FEATURE_CONFIG && FC.FEATURE_CONFIG.features !== 0) {
            updateTabList(FC.FEATURE_CONFIG.features);
        }

        if (GUI.active_tab) {
            TABS[GUI.active_tab]?.expertModeChanged?.(checked);
        }

        set$1({'expertMode': checked});
    });

    result = get$1('cliAutoComplete');
    CliAutoComplete.setEnabled(typeof result.cliAutoComplete === "undefined" || result.cliAutoComplete); // On by default

    result = get$1('darkTheme');
    if (result.darkTheme === undefined || typeof result.darkTheme !== "number") {
        // sets dark theme to auto if not manually changed
        setDarkTheme(2);
    } else {
        setDarkTheme(result.darkTheme);
    }

    if (GUI.isCordova()) {
        let darkMode = false;
        const checkDarkMode = function() {
            cordova.plugins.ThemeDetection.isDarkModeEnabled(function(success) {
                if (success.value !== darkMode) {
                    darkMode = success.value;
                    DarkTheme.autoSet();
                }
            });
        };
        setInterval(checkDarkMode, 500);
    } else {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function() {
            DarkTheme.autoSet();
        });
    }
}

window.isExpertModeEnabled = isExpertModeEnabled;
window.appReady = appReady;

export { BuildApi as B, CliAutoComplete as C, DarkTheme as D, EscProtocols as E, Features as F, GUI as G, MspHelper as M, PortHandler$1 as P, TABS as T, UI_PHONES as U, VtxDeviceTypes as V, checkSetupAnalytics as a, serial$1 as b, checkForConfiguratorUpdates as c, MSP$1 as d, MSPCodes as e, PortUsage as f, get as g, set as h, sensor_status as i, update_dataflash_global as j, Beepers as k, reinitializeConnection as l, mspHelper as m, have_sensor as n, isExpertModeEnabled as o, updateTabList as p, showErrorDialog as q, read_serial as r, setDarkTheme as s, tracking as t, usbDevices as u, serial$1 as serialAdapter };
//# sourceMappingURL=main.js.map
