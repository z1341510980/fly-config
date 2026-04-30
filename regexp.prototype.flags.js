import { d as defineProperties_1 } from './define-properties.js';
import { a as callBindExports } from './call-bind.js';
import { f as functionsHaveNames_1 } from './functions-have-names.js';

var implementation$2 = {exports: {}};

(function (module) {

	var functionsHaveConfigurableNames = functionsHaveNames_1.functionsHaveConfigurableNames();

	var $Object = Object;
	var $TypeError = TypeError;

	module.exports = function flags() {
		if (this != null && this !== $Object(this)) {
			throw new $TypeError('RegExp.prototype.flags getter called on non-object');
		}
		var result = '';
		if (this.hasIndices) {
			result += 'd';
		}
		if (this.global) {
			result += 'g';
		}
		if (this.ignoreCase) {
			result += 'i';
		}
		if (this.multiline) {
			result += 'm';
		}
		if (this.dotAll) {
			result += 's';
		}
		if (this.unicode) {
			result += 'u';
		}
		if (this.unicodeSets) {
			result += 'v';
		}
		if (this.sticky) {
			result += 'y';
		}
		return result;
	};

	if (functionsHaveConfigurableNames && Object.defineProperty) {
		Object.defineProperty(module.exports, 'name', { value: 'get flags' });
	} 
} (implementation$2));

var implementationExports = implementation$2.exports;

var implementation$1 = implementationExports;

var supportsDescriptors$1 = defineProperties_1.supportsDescriptors;
var $gOPD = Object.getOwnPropertyDescriptor;

var polyfill = function getPolyfill() {
	if (supportsDescriptors$1 && (/a/mig).flags === 'gim') {
		var descriptor = $gOPD(RegExp.prototype, 'flags');
		if (
			descriptor
			&& typeof descriptor.get === 'function'
			&& typeof RegExp.prototype.dotAll === 'boolean'
			&& typeof RegExp.prototype.hasIndices === 'boolean'
		) {
			/* eslint getter-return: 0 */
			var calls = '';
			var o = {};
			Object.defineProperty(o, 'hasIndices', {
				get: function () {
					calls += 'd';
				}
			});
			Object.defineProperty(o, 'sticky', {
				get: function () {
					calls += 'y';
				}
			});
			if (calls === 'dy') {
				return descriptor.get;
			}
		}
	}
	return implementation$1;
};

var supportsDescriptors = defineProperties_1.supportsDescriptors;
var getPolyfill$1 = polyfill;
var gOPD = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var TypeErr = TypeError;
var getProto = Object.getPrototypeOf;
var regex = /a/;

var shim$1 = function shimFlags() {
	if (!supportsDescriptors || !getProto) {
		throw new TypeErr('RegExp.prototype.flags requires a true ES5 environment that supports property descriptors');
	}
	var polyfill = getPolyfill$1();
	var proto = getProto(regex);
	var descriptor = gOPD(proto, 'flags');
	if (!descriptor || descriptor.get !== polyfill) {
		defineProperty(proto, 'flags', {
			configurable: true,
			enumerable: false,
			get: polyfill
		});
	}
	return polyfill;
};

var define = defineProperties_1;
var callBind = callBindExports;

var implementation = implementationExports;
var getPolyfill = polyfill;
var shim = shim$1;

var flagsBound = callBind(getPolyfill());

define(flagsBound, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

var regexp_prototype_flags = flagsBound;

export { regexp_prototype_flags as r };
//# sourceMappingURL=regexp.prototype.flags.js.map
