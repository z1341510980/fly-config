var r = /[A-Z]/g;

var dnsEqual = function (a, b) {
  a = a.replace(r, replacer);
  b = b.replace(r, replacer);
  return a === b
};

function replacer (m) {
  return m.toLowerCase()
}

export { dnsEqual as d };
//# sourceMappingURL=dns-equal.js.map
