import { s as shams$1 } from './has-symbols.js';

var hasSymbols = shams$1;

var shams = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

export { shams as s };
//# sourceMappingURL=has-tostringtag.js.map
