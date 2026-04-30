import { d as defineProperties_1 } from './define-properties.js';
import { a as callBindExports } from './call-bind.js';

var numberIsNaN = function (value) {
	return value !== value;
};

var implementation$2 = function is(a, b) {
	if (a === 0 && b === 0) {
		return 1 / a === 1 / b;
	}
	if (a === b) {
		return true;
	}
	if (numberIsNaN(a) && numberIsNaN(b)) {
		return true;
	}
	return false;
};

var implementation$1 = implementation$2;

var polyfill$1 = function getPolyfill() {
	return typeof Object.is === 'function' ? Object.is : implementation$1;
};

var getPolyfill$1 = polyfill$1;
var define$1 = defineProperties_1;

var shim$1 = function shimObjectIs() {
	var polyfill = getPolyfill$1();
	define$1(Object, { is: polyfill }, {
		is: function testObjectIs() {
			return Object.is !== polyfill;
		}
	});
	return polyfill;
};

var define = defineProperties_1;
var callBind = callBindExports;

var implementation = implementation$2;
var getPolyfill = polyfill$1;
var shim = shim$1;

var polyfill = callBind(getPolyfill(), Object);

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

var objectIs = polyfill;

export { objectIs as o };
//# sourceMappingURL=object-is.js.map
