import { f as functionBind } from './function-bind.js';

var bind = functionBind;

var src = bind.call(Function.call, Object.prototype.hasOwnProperty);

export { src as s };
//# sourceMappingURL=has.js.map
