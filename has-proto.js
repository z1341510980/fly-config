var test = {
	foo: {}
};

var $Object = Object;

var hasProto = function hasProto() {
	return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object);
};

export { hasProto as h };
//# sourceMappingURL=has-proto.js.map
