import require$$0 from 'os';
import require$$1 from 'util';
import require$$2 from 'events';
import require$$0$1 from 'buffer';
import require$$1$1 from 'dgram';
import { t as thunky_1 } from './thunky.js';
import { g as getDefaultExportFromCjs } from './@korzio.js';
import { d as dnsEqual$3 } from './dns-equal.js';
import { a as arrayFlattenExports } from './array-flatten.js';
import { m as multicastDnsServiceTypes } from './multicast-dns-service-types.js';
import { d as dnsTxt$1 } from './dns-txt.js';
import { s as safeBufferExports } from './safe-buffer.js';
import { d as deepEqual_1 } from './deep-equal.js';

var os$1 = require$$0;
var util$1 = require$$1;
var EventEmitter$1 = require$$2.EventEmitter;
var serviceName$1 = multicastDnsServiceTypes;
var txt = dnsTxt$1();

var TLD$1 = '.local';

var service = Service$1;

util$1.inherits(Service$1, EventEmitter$1);

function Service$1 (opts) {
  if (!opts.name) throw new Error('Required name not given')
  if (!opts.type) throw new Error('Required type not given')
  if (!opts.port) throw new Error('Required port not given')

  this.name = opts.name;
  this.protocol = opts.protocol || 'tcp';
  this.type = serviceName$1.stringify(opts.type, this.protocol);
  this.host = opts.host || os$1.hostname();
  this.port = opts.port;
  this.fqdn = this.name + '.' + this.type + TLD$1;
  this.subtypes = opts.subtypes || null;
  this.txt = opts.txt || null;
  this.published = false;

  this._activated = false; // indicates intent - true: starting/started, false: stopping/stopped
}

Service$1.prototype._records = function () {
  var records = [rr_ptr(this), rr_srv(this), rr_txt(this)];

  var self = this;
  var interfaces = os$1.networkInterfaces();
  Object.keys(interfaces).forEach(function (name) {
    interfaces[name].forEach(function (addr) {
      if (addr.internal) return
      if (addr.family === 'IPv4') {
        records.push(rr_a(self, addr.address));
      } else {
        records.push(rr_aaaa(self, addr.address));
      }
    });
  });

  return records
};

function rr_ptr (service) {
  return {
    name: service.type + TLD$1,
    type: 'PTR',
    ttl: 28800,
    data: service.fqdn
  }
}

function rr_srv (service) {
  return {
    name: service.fqdn,
    type: 'SRV',
    ttl: 120,
    data: {
      port: service.port,
      target: service.host
    }
  }
}

function rr_txt (service) {
  return {
    name: service.fqdn,
    type: 'TXT',
    ttl: 4500,
    data: txt.encode(service.txt)
  }
}

function rr_a (service, ip) {
  return {
    name: service.host,
    type: 'A',
    ttl: 120,
    data: ip
  }
}

function rr_aaaa (service, ip) {
  return {
    name: service.host,
    type: 'AAAA',
    ttl: 120,
    data: ip
  }
}

var dnsEqual$2 = dnsEqual$3;
var flatten$1 = arrayFlattenExports;
var Service = service;

var REANNOUNCE_MAX_MS = 60 * 60 * 1000;
var REANNOUNCE_FACTOR = 3;

var registry = Registry$1;

function Registry$1 (server) {
  this._server = server;
  this._services = [];
}

Registry$1.prototype.publish = function (opts) {
  var service = new Service(opts);
  service.start = start.bind(service, this);
  service.stop = stop.bind(service, this);
  service.start({ probe: opts.probe !== false });
  return service
};

Registry$1.prototype.unpublishAll = function (cb) {
  teardown(this._server, this._services, cb);
  this._services = [];
};

Registry$1.prototype.destroy = function () {
  this._services.forEach(function (service) {
    service._destroyed = true;
  });
};

function start (registry, opts) {
  if (this._activated) return
  this._activated = true;

  registry._services.push(this);

  if (opts.probe) {
    var service = this;
    probe(registry._server.mdns, this, function (exists) {
      if (exists) {
        service.stop();
        service.emit('error', new Error('Service name is already in use on the network'));
        return
      }
      announce(registry._server, service);
    });
  } else {
    announce(registry._server, this);
  }
}

function stop (registry, cb) {
  if (!this._activated) return // TODO: What about the callback?

  teardown(registry._server, this, cb);

  var index = registry._services.indexOf(this);
  if (index !== -1) registry._services.splice(index, 1);
}

/**
 * Check if a service name is already in use on the network.
 *
 * Used before announcing the new service.
 *
 * To guard against race conditions where multiple services are started
 * simultaneously on the network, wait a random amount of time (between
 * 0 and 250 ms) before probing.
 *
 * TODO: Add support for Simultaneous Probe Tiebreaking:
 * https://tools.ietf.org/html/rfc6762#section-8.2
 */
function probe (mdns, service, cb) {
  var sent = false;
  var retries = 0;
  var timer;

  mdns.on('response', onresponse);
  setTimeout(send, Math.random() * 250);

  function send () {
    // abort if the service have or is being stopped in the meantime
    if (!service._activated || service._destroyed) return

    mdns.query(service.fqdn, 'ANY', function () {
      // This function will optionally be called with an error object. We'll
      // just silently ignore it and retry as we normally would
      sent = true;
      timer = setTimeout(++retries < 3 ? send : done, 250);
      timer.unref();
    });
  }

  function onresponse (packet) {
    // Apparently conflicting Multicast DNS responses received *before*
    // the first probe packet is sent MUST be silently ignored (see
    // discussion of stale probe packets in RFC 6762 Section 8.2,
    // "Simultaneous Probe Tiebreaking" at
    // https://tools.ietf.org/html/rfc6762#section-8.2
    if (!sent) return

    if (packet.answers.some(matchRR) || packet.additionals.some(matchRR)) done(true);
  }

  function matchRR (rr) {
    return dnsEqual$2(rr.name, service.fqdn)
  }

  function done (exists) {
    mdns.removeListener('response', onresponse);
    clearTimeout(timer);
    cb(!!exists);
  }
}

/**
 * Initial service announcement
 *
 * Used to announce new services when they are first registered.
 *
 * Broadcasts right away, then after 3 seconds, 9 seconds, 27 seconds,
 * and so on, up to a maximum interval of one hour.
 */
function announce (server, service) {
  var delay = 1000;
  var packet = service._records();

  server.register(packet)

  ;(function broadcast () {
    // abort if the service have or is being stopped in the meantime
    if (!service._activated || service._destroyed) return

    server.mdns.respond(packet, function () {
      // This function will optionally be called with an error object. We'll
      // just silently ignore it and retry as we normally would
      if (!service.published) {
        service._activated = true;
        service.published = true;
        service.emit('up');
      }
      delay = delay * REANNOUNCE_FACTOR;
      if (delay < REANNOUNCE_MAX_MS && !service._destroyed) {
        setTimeout(broadcast, delay).unref();
      }
    });
  })();
}

/**
 * Stop the given services
 *
 * Besides removing a service from the mDNS registry, a "goodbye"
 * message is sent for each service to let the network know about the
 * shutdown.
 */
function teardown (server, services, cb) {
  if (!Array.isArray(services)) services = [services];

  services = services.filter(function (service) {
    return service._activated // ignore services not currently starting or started
  });

  var records = flatten$1.depth(services.map(function (service) {
    service._activated = false;
    var records = service._records();
    records.forEach(function (record) {
      record.ttl = 0; // prepare goodbye message
    });
    return records
  }), 1);

  if (records.length === 0) return cb && cb()

  server.unregister(records);

  // send goodbye message
  server.mdns.respond(records, function () {
    services.forEach(function (service) {
      service.published = false;
    });
    if (cb) cb.apply(null, arguments);
  });
}

var dnsPacket = {};

var types = {};

types.toString = function (type) {
  switch (type) {
    case 1: return 'A'
    case 10: return 'NULL'
    case 28: return 'AAAA'
    case 18: return 'AFSDB'
    case 42: return 'APL'
    case 257: return 'CAA'
    case 60: return 'CDNSKEY'
    case 59: return 'CDS'
    case 37: return 'CERT'
    case 5: return 'CNAME'
    case 49: return 'DHCID'
    case 32769: return 'DLV'
    case 39: return 'DNAME'
    case 48: return 'DNSKEY'
    case 43: return 'DS'
    case 55: return 'HIP'
    case 13: return 'HINFO'
    case 45: return 'IPSECKEY'
    case 25: return 'KEY'
    case 36: return 'KX'
    case 29: return 'LOC'
    case 15: return 'MX'
    case 35: return 'NAPTR'
    case 2: return 'NS'
    case 47: return 'NSEC'
    case 50: return 'NSEC3'
    case 51: return 'NSEC3PARAM'
    case 12: return 'PTR'
    case 46: return 'RRSIG'
    case 17: return 'RP'
    case 24: return 'SIG'
    case 6: return 'SOA'
    case 99: return 'SPF'
    case 33: return 'SRV'
    case 44: return 'SSHFP'
    case 32768: return 'TA'
    case 249: return 'TKEY'
    case 52: return 'TLSA'
    case 250: return 'TSIG'
    case 16: return 'TXT'
    case 252: return 'AXFR'
    case 251: return 'IXFR'
    case 41: return 'OPT'
    case 255: return 'ANY'
  }
  return 'UNKNOWN_' + type
};

types.toType = function (name) {
  switch (name.toUpperCase()) {
    case 'A': return 1
    case 'NULL': return 10
    case 'AAAA': return 28
    case 'AFSDB': return 18
    case 'APL': return 42
    case 'CAA': return 257
    case 'CDNSKEY': return 60
    case 'CDS': return 59
    case 'CERT': return 37
    case 'CNAME': return 5
    case 'DHCID': return 49
    case 'DLV': return 32769
    case 'DNAME': return 39
    case 'DNSKEY': return 48
    case 'DS': return 43
    case 'HIP': return 55
    case 'HINFO': return 13
    case 'IPSECKEY': return 45
    case 'KEY': return 25
    case 'KX': return 36
    case 'LOC': return 29
    case 'MX': return 15
    case 'NAPTR': return 35
    case 'NS': return 2
    case 'NSEC': return 47
    case 'NSEC3': return 50
    case 'NSEC3PARAM': return 51
    case 'PTR': return 12
    case 'RRSIG': return 46
    case 'RP': return 17
    case 'SIG': return 24
    case 'SOA': return 6
    case 'SPF': return 99
    case 'SRV': return 33
    case 'SSHFP': return 44
    case 'TA': return 32768
    case 'TKEY': return 249
    case 'TLSA': return 52
    case 'TSIG': return 250
    case 'TXT': return 16
    case 'AXFR': return 252
    case 'IXFR': return 251
    case 'OPT': return 41
    case 'ANY': return 255
    case '*': return 255
  }
  return 0
};

var rcodes = {};

/*
 * Traditional DNS header RCODEs (4-bits) defined by IANA in
 * https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml
 */

rcodes.toString = function (rcode) {
  switch (rcode) {
    case 0: return 'NOERROR'
    case 1: return 'FORMERR'
    case 2: return 'SERVFAIL'
    case 3: return 'NXDOMAIN'
    case 4: return 'NOTIMP'
    case 5: return 'REFUSED'
    case 6: return 'YXDOMAIN'
    case 7: return 'YXRRSET'
    case 8: return 'NXRRSET'
    case 9: return 'NOTAUTH'
    case 10: return 'NOTZONE'
    case 11: return 'RCODE_11'
    case 12: return 'RCODE_12'
    case 13: return 'RCODE_13'
    case 14: return 'RCODE_14'
    case 15: return 'RCODE_15'
  }
  return 'RCODE_' + rcode
};

rcodes.toRcode = function (code) {
  switch (code.toUpperCase()) {
    case 'NOERROR': return 0
    case 'FORMERR': return 1
    case 'SERVFAIL': return 2
    case 'NXDOMAIN': return 3
    case 'NOTIMP': return 4
    case 'REFUSED': return 5
    case 'YXDOMAIN': return 6
    case 'YXRRSET': return 7
    case 'NXRRSET': return 8
    case 'NOTAUTH': return 9
    case 'NOTZONE': return 10
    case 'RCODE_11': return 11
    case 'RCODE_12': return 12
    case 'RCODE_13': return 13
    case 'RCODE_14': return 14
    case 'RCODE_15': return 15
  }
  return 0
};

var opcodes = {};

/*
 * Traditional DNS header OPCODEs (4-bits) defined by IANA in
 * https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-5
 */

opcodes.toString = function (opcode) {
  switch (opcode) {
    case 0: return 'QUERY'
    case 1: return 'IQUERY'
    case 2: return 'STATUS'
    case 3: return 'OPCODE_3'
    case 4: return 'NOTIFY'
    case 5: return 'UPDATE'
    case 6: return 'OPCODE_6'
    case 7: return 'OPCODE_7'
    case 8: return 'OPCODE_8'
    case 9: return 'OPCODE_9'
    case 10: return 'OPCODE_10'
    case 11: return 'OPCODE_11'
    case 12: return 'OPCODE_12'
    case 13: return 'OPCODE_13'
    case 14: return 'OPCODE_14'
    case 15: return 'OPCODE_15'
  }
  return 'OPCODE_' + opcode
};

opcodes.toOpcode = function (code) {
  switch (code.toUpperCase()) {
    case 'QUERY': return 0
    case 'IQUERY': return 1
    case 'STATUS': return 2
    case 'OPCODE_3': return 3
    case 'NOTIFY': return 4
    case 'UPDATE': return 5
    case 'OPCODE_6': return 6
    case 'OPCODE_7': return 7
    case 'OPCODE_8': return 8
    case 'OPCODE_9': return 9
    case 'OPCODE_10': return 10
    case 'OPCODE_11': return 11
    case 'OPCODE_12': return 12
    case 'OPCODE_13': return 13
    case 'OPCODE_14': return 14
    case 'OPCODE_15': return 15
  }
  return 0
};

var ip = {};

(function (exports) {
	var ip = exports;
	var { Buffer } = require$$0$1;
	var os = require$$0;

	ip.toBuffer = function (ip, buff, offset) {
	  offset = ~~offset;

	  var result;

	  if (this.isV4Format(ip)) {
	    result = buff || new Buffer(offset + 4);
	    ip.split(/\./g).map((byte) => {
	      result[offset++] = parseInt(byte, 10) & 0xff;
	    });
	  } else if (this.isV6Format(ip)) {
	    var sections = ip.split(':', 8);

	    var i;
	    for (i = 0; i < sections.length; i++) {
	      var isv4 = this.isV4Format(sections[i]);
	      var v4Buffer;

	      if (isv4) {
	        v4Buffer = this.toBuffer(sections[i]);
	        sections[i] = v4Buffer.slice(0, 2).toString('hex');
	      }

	      if (v4Buffer && ++i < 8) {
	        sections.splice(i, 0, v4Buffer.slice(2, 4).toString('hex'));
	      }
	    }

	    if (sections[0] === '') {
	      while (sections.length < 8) sections.unshift('0');
	    } else if (sections[sections.length - 1] === '') {
	      while (sections.length < 8) sections.push('0');
	    } else if (sections.length < 8) {
	      for (i = 0; i < sections.length && sections[i] !== ''; i++);
	      var argv = [i, 1];
	      for (i = 9 - sections.length; i > 0; i--) {
	        argv.push('0');
	      }
	      sections.splice.apply(sections, argv);
	    }

	    result = buff || new Buffer(offset + 16);
	    for (i = 0; i < sections.length; i++) {
	      var word = parseInt(sections[i], 16);
	      result[offset++] = (word >> 8) & 0xff;
	      result[offset++] = word & 0xff;
	    }
	  }

	  if (!result) {
	    throw Error(`Invalid ip address: ${ip}`);
	  }

	  return result;
	};

	ip.toString = function (buff, offset, length) {
	  offset = ~~offset;
	  length = length || (buff.length - offset);

	  var result = [];
	  var i;
	  if (length === 4) {
	    // IPv4
	    for (i = 0; i < length; i++) {
	      result.push(buff[offset + i]);
	    }
	    result = result.join('.');
	  } else if (length === 16) {
	    // IPv6
	    for (i = 0; i < length; i += 2) {
	      result.push(buff.readUInt16BE(offset + i).toString(16));
	    }
	    result = result.join(':');
	    result = result.replace(/(^|:)0(:0)*:0(:|$)/, '$1::$3');
	    result = result.replace(/:{3,4}/, '::');
	  }

	  return result;
	};

	var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
	var ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;

	ip.isV4Format = function (ip) {
	  return ipv4Regex.test(ip);
	};

	ip.isV6Format = function (ip) {
	  return ipv6Regex.test(ip);
	};

	function _normalizeFamily(family) {
	  if (family === 4) {
	    return 'ipv4';
	  }
	  if (family === 6) {
	    return 'ipv6';
	  }
	  return family ? family.toLowerCase() : 'ipv4';
	}

	ip.fromPrefixLen = function (prefixlen, family) {
	  if (prefixlen > 32) {
	    family = 'ipv6';
	  } else {
	    family = _normalizeFamily(family);
	  }

	  var len = 4;
	  if (family === 'ipv6') {
	    len = 16;
	  }
	  var buff = new Buffer(len);

	  for (var i = 0, n = buff.length; i < n; ++i) {
	    var bits = 8;
	    if (prefixlen < 8) {
	      bits = prefixlen;
	    }
	    prefixlen -= bits;

	    buff[i] = ~(0xff >> bits) & 0xff;
	  }

	  return ip.toString(buff);
	};

	ip.mask = function (addr, mask) {
	  addr = ip.toBuffer(addr);
	  mask = ip.toBuffer(mask);

	  var result = new Buffer(Math.max(addr.length, mask.length));

	  // Same protocol - do bitwise and
	  var i;
	  if (addr.length === mask.length) {
	    for (i = 0; i < addr.length; i++) {
	      result[i] = addr[i] & mask[i];
	    }
	  } else if (mask.length === 4) {
	    // IPv6 address and IPv4 mask
	    // (Mask low bits)
	    for (i = 0; i < mask.length; i++) {
	      result[i] = addr[addr.length - 4 + i] & mask[i];
	    }
	  } else {
	    // IPv6 mask and IPv4 addr
	    for (i = 0; i < result.length - 6; i++) {
	      result[i] = 0;
	    }

	    // ::ffff:ipv4
	    result[10] = 0xff;
	    result[11] = 0xff;
	    for (i = 0; i < addr.length; i++) {
	      result[i + 12] = addr[i] & mask[i + 12];
	    }
	    i += 12;
	  }
	  for (; i < result.length; i++) {
	    result[i] = 0;
	  }

	  return ip.toString(result);
	};

	ip.cidr = function (cidrString) {
	  var cidrParts = cidrString.split('/');

	  var addr = cidrParts[0];
	  if (cidrParts.length !== 2) {
	    throw new Error(`invalid CIDR subnet: ${addr}`);
	  }

	  var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));

	  return ip.mask(addr, mask);
	};

	ip.subnet = function (addr, mask) {
	  var networkAddress = ip.toLong(ip.mask(addr, mask));

	  // Calculate the mask's length.
	  var maskBuffer = ip.toBuffer(mask);
	  var maskLength = 0;

	  for (var i = 0; i < maskBuffer.length; i++) {
	    if (maskBuffer[i] === 0xff) {
	      maskLength += 8;
	    } else {
	      var octet = maskBuffer[i] & 0xff;
	      while (octet) {
	        octet = (octet << 1) & 0xff;
	        maskLength++;
	      }
	    }
	  }

	  var numberOfAddresses = Math.pow(2, 32 - maskLength);

	  return {
	    networkAddress: ip.fromLong(networkAddress),
	    firstAddress: numberOfAddresses <= 2
	      ? ip.fromLong(networkAddress)
	      : ip.fromLong(networkAddress + 1),
	    lastAddress: numberOfAddresses <= 2
	      ? ip.fromLong(networkAddress + numberOfAddresses - 1)
	      : ip.fromLong(networkAddress + numberOfAddresses - 2),
	    broadcastAddress: ip.fromLong(networkAddress + numberOfAddresses - 1),
	    subnetMask: mask,
	    subnetMaskLength: maskLength,
	    numHosts: numberOfAddresses <= 2
	      ? numberOfAddresses : numberOfAddresses - 2,
	    length: numberOfAddresses,
	    contains(other) {
	      return networkAddress === ip.toLong(ip.mask(other, mask));
	    },
	  };
	};

	ip.cidrSubnet = function (cidrString) {
	  var cidrParts = cidrString.split('/');

	  var addr = cidrParts[0];
	  if (cidrParts.length !== 2) {
	    throw new Error(`invalid CIDR subnet: ${addr}`);
	  }

	  var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));

	  return ip.subnet(addr, mask);
	};

	ip.not = function (addr) {
	  var buff = ip.toBuffer(addr);
	  for (var i = 0; i < buff.length; i++) {
	    buff[i] = 0xff ^ buff[i];
	  }
	  return ip.toString(buff);
	};

	ip.or = function (a, b) {
	  var i;

	  a = ip.toBuffer(a);
	  b = ip.toBuffer(b);

	  // same protocol
	  if (a.length === b.length) {
	    for (i = 0; i < a.length; ++i) {
	      a[i] |= b[i];
	    }
	    return ip.toString(a);

	  // mixed protocols
	  }
	  var buff = a;
	  var other = b;
	  if (b.length > a.length) {
	    buff = b;
	    other = a;
	  }

	  var offset = buff.length - other.length;
	  for (i = offset; i < buff.length; ++i) {
	    buff[i] |= other[i - offset];
	  }

	  return ip.toString(buff);
	};

	ip.isEqual = function (a, b) {
	  var i;

	  a = ip.toBuffer(a);
	  b = ip.toBuffer(b);

	  // Same protocol
	  if (a.length === b.length) {
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }

	  // Swap
	  if (b.length === 4) {
	    var t = b;
	    b = a;
	    a = t;
	  }

	  // a - IPv4, b - IPv6
	  for (i = 0; i < 10; i++) {
	    if (b[i] !== 0) return false;
	  }

	  var word = b.readUInt16BE(10);
	  if (word !== 0 && word !== 0xffff) return false;

	  for (i = 0; i < 4; i++) {
	    if (a[i] !== b[i + 12]) return false;
	  }

	  return true;
	};

	ip.isPrivate = function (addr) {
	  // check loopback addresses first
	  if (ip.isLoopback(addr)) {
	    return true;
	  }

	  // ensure the ipv4 address is valid
	  if (!ip.isV6Format(addr)) {
	    const ipl = ip.normalizeToLong(addr);
	    if (ipl < 0) {
	      throw new Error('invalid ipv4 address');
	    }
	    // normalize the address for the private range checks that follow
	    addr = ip.fromLong(ipl);
	  }

	  // check private ranges
	  return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr)
	    || /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr)
	    || /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i
	      .test(addr)
	    || /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr)
	    || /^f[cd][0-9a-f]{2}:/i.test(addr)
	    || /^fe80:/i.test(addr)
	    || /^::1$/.test(addr)
	    || /^::$/.test(addr);
	};

	ip.isPublic = function (addr) {
	  return !ip.isPrivate(addr);
	};

	ip.isLoopback = function (addr) {
	  // If addr is an IPv4 address in long integer form (no dots and no colons), convert it
	  if (!/\./.test(addr) && !/:/.test(addr)) {
	    addr = ip.fromLong(Number(addr));
	  }

	  return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
	    .test(addr)
	    || /^0177\./.test(addr)
	    || /^0x7f\./i.test(addr)
	    || /^fe80::1$/i.test(addr)
	    || /^::1$/.test(addr)
	    || /^::$/.test(addr);
	};

	ip.loopback = function (family) {
	  //
	  // Default to `ipv4`
	  //
	  family = _normalizeFamily(family);

	  if (family !== 'ipv4' && family !== 'ipv6') {
	    throw new Error('family must be ipv4 or ipv6');
	  }

	  return family === 'ipv4' ? '127.0.0.1' : 'fe80::1';
	};

	//
	// ### function address (name, family)
	// #### @name {string|'public'|'private'} **Optional** Name or security
	//      of the network interface.
	// #### @family {ipv4|ipv6} **Optional** IP family of the address (defaults
	//      to ipv4).
	//
	// Returns the address for the network interface on the current system with
	// the specified `name`:
	//   * String: First `family` address of the interface.
	//             If not found see `undefined`.
	//   * 'public': the first public ip address of family.
	//   * 'private': the first private ip address of family.
	//   * undefined: First address with `ipv4` or loopback address `127.0.0.1`.
	//
	ip.address = function (name, family) {
	  var interfaces = os.networkInterfaces();

	  //
	  // Default to `ipv4`
	  //
	  family = _normalizeFamily(family);

	  //
	  // If a specific network interface has been named,
	  // return the address.
	  //
	  if (name && name !== 'private' && name !== 'public') {
	    var res = interfaces[name].filter((details) => {
	      var itemFamily = _normalizeFamily(details.family);
	      return itemFamily === family;
	    });
	    if (res.length === 0) {
	      return undefined;
	    }
	    return res[0].address;
	  }

	  var all = Object.keys(interfaces).map((nic) => {
	    //
	    // Note: name will only be `public` or `private`
	    // when this is called.
	    //
	    var addresses = interfaces[nic].filter((details) => {
	      details.family = _normalizeFamily(details.family);
	      if (details.family !== family || ip.isLoopback(details.address)) {
	        return false;
	      } if (!name) {
	        return true;
	      }

	      return name === 'public' ? ip.isPrivate(details.address)
	        : ip.isPublic(details.address);
	    });

	    return addresses.length ? addresses[0].address : undefined;
	  }).filter(Boolean);

	  return !all.length ? ip.loopback(family) : all[0];
	};

	ip.toLong = function (ip) {
	  var ipl = 0;
	  ip.split('.').forEach((octet) => {
	    ipl <<= 8;
	    ipl += parseInt(octet);
	  });
	  return (ipl >>> 0);
	};

	ip.fromLong = function (ipl) {
	  return (`${ipl >>> 24}.${
	    ipl >> 16 & 255}.${
	    ipl >> 8 & 255}.${
	    ipl & 255}`);
	};

	ip.normalizeToLong = function (addr) {
	  const parts = addr.split('.').map(part => {
	    // Handle hexadecimal format
	    if (part.startsWith('0x') || part.startsWith('0X')) {
	      return parseInt(part, 16);
	    }
	    // Handle octal format (strictly digits 0-7 after a leading zero)
	    else if (part.startsWith('0') && part !== '0' && /^[0-7]+$/.test(part)) {
	      return parseInt(part, 8);
	    }
	    // Handle decimal format, reject invalid leading zeros
	    else if (/^[1-9]\d*$/.test(part) || part === '0') {
	      return parseInt(part, 10);
	    }
	    // Return NaN for invalid formats to indicate parsing failure
	    else {
	      return NaN;
	    }
	  });

	  if (parts.some(isNaN)) return -1; // Indicate error with -1

	  let val = 0;
	  const n = parts.length;

	  switch (n) {
	  case 1:
	    val = parts[0];
	    break;
	  case 2:
	    if (parts[0] > 0xff || parts[1] > 0xffffff) return -1;
	    val = (parts[0] << 24) | (parts[1] & 0xffffff);
	    break;
	  case 3:
	    if (parts[0] > 0xff || parts[1] > 0xff || parts[2] > 0xffff) return -1;
	    val = (parts[0] << 24) | (parts[1] << 16) | (parts[2] & 0xffff);
	    break;
	  case 4:
	    if (parts.some(part => part > 0xff)) return -1;
	    val = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
	    break;
	  default:
	    return -1; // Error case
	  }

	  return val >>> 0;
	}; 
} (ip));

(function (exports) {
	var types$1 = types;
	var rcodes$1 = rcodes;
	var opcodes$1 = opcodes;
	var ip$1 = ip;
	var Buffer = safeBufferExports.Buffer;

	var QUERY_FLAG = 0;
	var RESPONSE_FLAG = 1 << 15;
	var FLUSH_MASK = 1 << 15;
	var NOT_FLUSH_MASK = ~FLUSH_MASK;
	var QU_MASK = 1 << 15;
	var NOT_QU_MASK = ~QU_MASK;

	var name = exports.txt = exports.name = {};

	name.encode = function (str, buf, offset) {
	  if (!buf) buf = Buffer.alloc(name.encodingLength(str));
	  if (!offset) offset = 0;
	  var oldOffset = offset;

	  // strip leading and trailing .
	  var n = str.replace(/^\.|\.$/gm, '');
	  if (n.length) {
	    var list = n.split('.');

	    for (var i = 0; i < list.length; i++) {
	      var len = buf.write(list[i], offset + 1);
	      buf[offset] = len;
	      offset += len + 1;
	    }
	  }

	  buf[offset++] = 0;

	  name.encode.bytes = offset - oldOffset;
	  return buf
	};

	name.encode.bytes = 0;

	name.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var list = [];
	  var oldOffset = offset;
	  var len = buf[offset++];

	  if (len === 0) {
	    name.decode.bytes = 1;
	    return '.'
	  }
	  if (len >= 0xc0) {
	    var res = name.decode(buf, buf.readUInt16BE(offset - 1) - 0xc000);
	    name.decode.bytes = 2;
	    return res
	  }

	  while (len) {
	    if (len >= 0xc0) {
	      list.push(name.decode(buf, buf.readUInt16BE(offset - 1) - 0xc000));
	      offset++;
	      break
	    }

	    list.push(buf.toString('utf-8', offset, offset + len));
	    offset += len;
	    len = buf[offset++];
	  }

	  name.decode.bytes = offset - oldOffset;
	  return list.join('.')
	};

	name.decode.bytes = 0;

	name.encodingLength = function (n) {
	  if (n === '.' || n === '..') return 1
	  return Buffer.byteLength(n.replace(/^\.|\.$/gm, '')) + 2
	};

	var string = {};

	string.encode = function (s, buf, offset) {
	  if (!buf) buf = Buffer.alloc(string.encodingLength(s));
	  if (!offset) offset = 0;

	  var len = buf.write(s, offset + 1);
	  buf[offset] = len;
	  string.encode.bytes = len + 1;
	  return buf
	};

	string.encode.bytes = 0;

	string.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var len = buf[offset];
	  var s = buf.toString('utf-8', offset + 1, offset + 1 + len);
	  string.decode.bytes = len + 1;
	  return s
	};

	string.decode.bytes = 0;

	string.encodingLength = function (s) {
	  return Buffer.byteLength(s) + 1
	};

	var header = {};

	header.encode = function (h, buf, offset) {
	  if (!buf) buf = header.encodingLength(h);
	  if (!offset) offset = 0;

	  var flags = (h.flags || 0) & 32767;
	  var type = h.type === 'response' ? RESPONSE_FLAG : QUERY_FLAG;

	  buf.writeUInt16BE(h.id || 0, offset);
	  buf.writeUInt16BE(flags | type, offset + 2);
	  buf.writeUInt16BE(h.questions.length, offset + 4);
	  buf.writeUInt16BE(h.answers.length, offset + 6);
	  buf.writeUInt16BE(h.authorities.length, offset + 8);
	  buf.writeUInt16BE(h.additionals.length, offset + 10);

	  return buf
	};

	header.encode.bytes = 12;

	header.decode = function (buf, offset) {
	  if (!offset) offset = 0;
	  if (buf.length < 12) throw new Error('Header must be 12 bytes')
	  var flags = buf.readUInt16BE(offset + 2);

	  return {
	    id: buf.readUInt16BE(offset),
	    type: flags & RESPONSE_FLAG ? 'response' : 'query',
	    flags: flags & 32767,
	    flag_qr: ((flags >> 15) & 0x1) === 1,
	    opcode: opcodes$1.toString((flags >> 11) & 0xf),
	    flag_auth: ((flags >> 10) & 0x1) === 1,
	    flag_trunc: ((flags >> 9) & 0x1) === 1,
	    flag_rd: ((flags >> 8) & 0x1) === 1,
	    flag_ra: ((flags >> 7) & 0x1) === 1,
	    flag_z: ((flags >> 6) & 0x1) === 1,
	    flag_ad: ((flags >> 5) & 0x1) === 1,
	    flag_cd: ((flags >> 4) & 0x1) === 1,
	    rcode: rcodes$1.toString(flags & 0xf),
	    questions: new Array(buf.readUInt16BE(offset + 4)),
	    answers: new Array(buf.readUInt16BE(offset + 6)),
	    authorities: new Array(buf.readUInt16BE(offset + 8)),
	    additionals: new Array(buf.readUInt16BE(offset + 10))
	  }
	};

	header.decode.bytes = 12;

	header.encodingLength = function () {
	  return 12
	};

	var runknown = exports.unknown = {};

	runknown.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(runknown.encodingLength(data));
	  if (!offset) offset = 0;

	  buf.writeUInt16BE(data.length, offset);
	  data.copy(buf, offset + 2);

	  runknown.encode.bytes = data.length + 2;
	  return buf
	};

	runknown.encode.bytes = 0;

	runknown.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var len = buf.readUInt16BE(offset);
	  var data = buf.slice(offset + 2, offset + 2 + len);
	  runknown.decode.bytes = len + 2;
	  return data
	};

	runknown.decode.bytes = 0;

	runknown.encodingLength = function (data) {
	  return data.length + 2
	};

	var rns = exports.ns = {};

	rns.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(rns.encodingLength(data));
	  if (!offset) offset = 0;

	  name.encode(data, buf, offset + 2);
	  buf.writeUInt16BE(name.encode.bytes, offset);
	  rns.encode.bytes = name.encode.bytes + 2;
	  return buf
	};

	rns.encode.bytes = 0;

	rns.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var len = buf.readUInt16BE(offset);
	  var dd = name.decode(buf, offset + 2);

	  rns.decode.bytes = len + 2;
	  return dd
	};

	rns.decode.bytes = 0;

	rns.encodingLength = function (data) {
	  return name.encodingLength(data) + 2
	};

	var rsoa = exports.soa = {};

	rsoa.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(rsoa.encodingLength(data));
	  if (!offset) offset = 0;

	  var oldOffset = offset;
	  offset += 2;
	  name.encode(data.mname, buf, offset);
	  offset += name.encode.bytes;
	  name.encode(data.rname, buf, offset);
	  offset += name.encode.bytes;
	  buf.writeUInt32BE(data.serial || 0, offset);
	  offset += 4;
	  buf.writeUInt32BE(data.refresh || 0, offset);
	  offset += 4;
	  buf.writeUInt32BE(data.retry || 0, offset);
	  offset += 4;
	  buf.writeUInt32BE(data.expire || 0, offset);
	  offset += 4;
	  buf.writeUInt32BE(data.minimum || 0, offset);
	  offset += 4;

	  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
	  rsoa.encode.bytes = offset - oldOffset;
	  return buf
	};

	rsoa.encode.bytes = 0;

	rsoa.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var oldOffset = offset;

	  var data = {};
	  offset += 2;
	  data.mname = name.decode(buf, offset);
	  offset += name.decode.bytes;
	  data.rname = name.decode(buf, offset);
	  offset += name.decode.bytes;
	  data.serial = buf.readUInt32BE(offset);
	  offset += 4;
	  data.refresh = buf.readUInt32BE(offset);
	  offset += 4;
	  data.retry = buf.readUInt32BE(offset);
	  offset += 4;
	  data.expire = buf.readUInt32BE(offset);
	  offset += 4;
	  data.minimum = buf.readUInt32BE(offset);
	  offset += 4;

	  rsoa.decode.bytes = offset - oldOffset;
	  return data
	};

	rsoa.decode.bytes = 0;

	rsoa.encodingLength = function (data) {
	  return 22 + name.encodingLength(data.mname) + name.encodingLength(data.rname)
	};

	var rtxt = exports.txt = exports.null = {};
	var rnull = rtxt;

	rtxt.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(rtxt.encodingLength(data));
	  if (!offset) offset = 0;

	  if (typeof data === 'string') data = Buffer.from(data);
	  if (!data) data = Buffer.alloc(0);

	  var oldOffset = offset;
	  offset += 2;

	  var len = data.length;
	  data.copy(buf, offset, 0, len);
	  offset += len;

	  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
	  rtxt.encode.bytes = offset - oldOffset;
	  return buf
	};

	rtxt.encode.bytes = 0;

	rtxt.decode = function (buf, offset) {
	  if (!offset) offset = 0;
	  var oldOffset = offset;
	  var len = buf.readUInt16BE(offset);

	  offset += 2;

	  var data = buf.slice(offset, offset + len);
	  offset += len;

	  rtxt.decode.bytes = offset - oldOffset;
	  return data
	};

	rtxt.decode.bytes = 0;

	rtxt.encodingLength = function (data) {
	  if (!data) return 2
	  return (Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data)) + 2
	};

	var rhinfo = exports.hinfo = {};

	rhinfo.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(rhinfo.encodingLength(data));
	  if (!offset) offset = 0;

	  var oldOffset = offset;
	  offset += 2;
	  string.encode(data.cpu, buf, offset);
	  offset += string.encode.bytes;
	  string.encode(data.os, buf, offset);
	  offset += string.encode.bytes;
	  buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
	  rhinfo.encode.bytes = offset - oldOffset;
	  return buf
	};

	rhinfo.encode.bytes = 0;

	rhinfo.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var oldOffset = offset;

	  var data = {};
	  offset += 2;
	  data.cpu = string.decode(buf, offset);
	  offset += string.decode.bytes;
	  data.os = string.decode(buf, offset);
	  offset += string.decode.bytes;
	  rhinfo.decode.bytes = offset - oldOffset;
	  return data
	};

	rhinfo.decode.bytes = 0;

	rhinfo.encodingLength = function (data) {
	  return string.encodingLength(data.cpu) + string.encodingLength(data.os) + 2
	};

	var rptr = exports.ptr = {};
	var rcname = exports.cname = rptr;
	var rdname = exports.dname = rptr;

	rptr.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(rptr.encodingLength(data));
	  if (!offset) offset = 0;

	  name.encode(data, buf, offset + 2);
	  buf.writeUInt16BE(name.encode.bytes, offset);
	  rptr.encode.bytes = name.encode.bytes + 2;
	  return buf
	};

	rptr.encode.bytes = 0;

	rptr.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var data = name.decode(buf, offset + 2);
	  rptr.decode.bytes = name.decode.bytes + 2;
	  return data
	};

	rptr.decode.bytes = 0;

	rptr.encodingLength = function (data) {
	  return name.encodingLength(data) + 2
	};

	var rsrv = exports.srv = {};

	rsrv.encode = function (data, buf, offset) {
	  if (!buf) buf = Buffer.alloc(rsrv.encodingLength(data));
	  if (!offset) offset = 0;

	  buf.writeUInt16BE(data.priority || 0, offset + 2);
	  buf.writeUInt16BE(data.weight || 0, offset + 4);
	  buf.writeUInt16BE(data.port || 0, offset + 6);
	  name.encode(data.target, buf, offset + 8);

	  var len = name.encode.bytes + 6;
	  buf.writeUInt16BE(len, offset);

	  rsrv.encode.bytes = len + 2;
	  return buf
	};

	rsrv.encode.bytes = 0;

	rsrv.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var len = buf.readUInt16BE(offset);

	  var data = {};
	  data.priority = buf.readUInt16BE(offset + 2);
	  data.weight = buf.readUInt16BE(offset + 4);
	  data.port = buf.readUInt16BE(offset + 6);
	  data.target = name.decode(buf, offset + 8);

	  rsrv.decode.bytes = len + 2;
	  return data
	};

	rsrv.decode.bytes = 0;

	rsrv.encodingLength = function (data) {
	  return 8 + name.encodingLength(data.target)
	};

	var rcaa = exports.caa = {};

	rcaa.ISSUER_CRITICAL = 1 << 7;

	rcaa.encode = function (data, buf, offset) {
	  var len = rcaa.encodingLength(data);

	  if (!buf) buf = Buffer.alloc(rcaa.encodingLength(data));
	  if (!offset) offset = 0;

	  if (data.issuerCritical) {
	    data.flags = rcaa.ISSUER_CRITICAL;
	  }

	  buf.writeUInt16BE(len - 2, offset);
	  offset += 2;
	  buf.writeUInt8(data.flags || 0, offset);
	  offset += 1;
	  string.encode(data.tag, buf, offset);
	  offset += string.encode.bytes;
	  buf.write(data.value, offset);
	  offset += Buffer.byteLength(data.value);

	  rcaa.encode.bytes = len;
	  return buf
	};

	rcaa.encode.bytes = 0;

	rcaa.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var len = buf.readUInt16BE(offset);
	  offset += 2;

	  var oldOffset = offset;
	  var data = {};
	  data.flags = buf.readUInt8(offset);
	  offset += 1;
	  data.tag = string.decode(buf, offset);
	  offset += string.decode.bytes;
	  data.value = buf.toString('utf-8', offset, oldOffset + len);

	  data.issuerCritical = !!(data.flags & rcaa.ISSUER_CRITICAL);

	  rcaa.decode.bytes = len + 2;

	  return data
	};

	rcaa.decode.bytes = 0;

	rcaa.encodingLength = function (data) {
	  return string.encodingLength(data.tag) + string.encodingLength(data.value) + 2
	};

	var ra = exports.a = {};

	ra.encode = function (host, buf, offset) {
	  if (!buf) buf = Buffer.alloc(ra.encodingLength(host));
	  if (!offset) offset = 0;

	  buf.writeUInt16BE(4, offset);
	  offset += 2;
	  ip$1.toBuffer(host, buf, offset);
	  ra.encode.bytes = 6;
	  return buf
	};

	ra.encode.bytes = 0;

	ra.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  offset += 2;
	  var host = ip$1.toString(buf, offset, 4);
	  ra.decode.bytes = 6;
	  return host
	};

	ra.decode.bytes = 0;

	ra.encodingLength = function () {
	  return 6
	};

	var raaaa = exports.aaaa = {};

	raaaa.encode = function (host, buf, offset) {
	  if (!buf) buf = Buffer.alloc(raaaa.encodingLength(host));
	  if (!offset) offset = 0;

	  buf.writeUInt16BE(16, offset);
	  offset += 2;
	  ip$1.toBuffer(host, buf, offset);
	  raaaa.encode.bytes = 18;
	  return buf
	};

	raaaa.encode.bytes = 0;

	raaaa.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  offset += 2;
	  var host = ip$1.toString(buf, offset, 16);
	  raaaa.decode.bytes = 18;
	  return host
	};

	raaaa.decode.bytes = 0;

	raaaa.encodingLength = function () {
	  return 18
	};

	var renc = exports.record = function (type) {
	  switch (type.toUpperCase()) {
	    case 'A': return ra
	    case 'PTR': return rptr
	    case 'CNAME': return rcname
	    case 'DNAME': return rdname
	    case 'TXT': return rtxt
	    case 'NULL': return rnull
	    case 'AAAA': return raaaa
	    case 'SRV': return rsrv
	    case 'HINFO': return rhinfo
	    case 'CAA': return rcaa
	    case 'NS': return rns
	    case 'SOA': return rsoa
	  }
	  return runknown
	};

	var answer = exports.answer = {};

	answer.encode = function (a, buf, offset) {
	  if (!buf) buf = Buffer.alloc(answer.encodingLength(a));
	  if (!offset) offset = 0;

	  var oldOffset = offset;

	  name.encode(a.name, buf, offset);
	  offset += name.encode.bytes;

	  buf.writeUInt16BE(types$1.toType(a.type), offset);

	  var klass = a.class === undefined ? 1 : a.class;
	  if (a.flush) klass |= FLUSH_MASK; // the 1st bit of the class is the flush bit
	  buf.writeUInt16BE(klass, offset + 2);

	  buf.writeUInt32BE(a.ttl || 0, offset + 4);

	  var enc = renc(a.type);
	  enc.encode(a.data, buf, offset + 8);
	  offset += 8 + enc.encode.bytes;

	  answer.encode.bytes = offset - oldOffset;
	  return buf
	};

	answer.encode.bytes = 0;

	answer.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var a = {};
	  var oldOffset = offset;

	  a.name = name.decode(buf, offset);
	  offset += name.decode.bytes;
	  a.type = types$1.toString(buf.readUInt16BE(offset));
	  a.class = buf.readUInt16BE(offset + 2);
	  a.ttl = buf.readUInt32BE(offset + 4);

	  a.flush = !!(a.class & FLUSH_MASK);
	  if (a.flush) a.class &= NOT_FLUSH_MASK;

	  var enc = renc(a.type);
	  a.data = enc.decode(buf, offset + 8);
	  offset += 8 + enc.decode.bytes;

	  answer.decode.bytes = offset - oldOffset;
	  return a
	};

	answer.decode.bytes = 0;

	answer.encodingLength = function (a) {
	  return name.encodingLength(a.name) + 8 + renc(a.type).encodingLength(a.data)
	};

	var question = exports.question = {};

	question.encode = function (q, buf, offset) {
	  if (!buf) buf = Buffer.alloc(question.encodingLength(q));
	  if (!offset) offset = 0;

	  var oldOffset = offset;

	  name.encode(q.name, buf, offset);
	  offset += name.encode.bytes;

	  buf.writeUInt16BE(types$1.toType(q.type), offset);
	  offset += 2;

	  buf.writeUInt16BE(q.class === undefined ? 1 : q.class, offset);
	  offset += 2;

	  question.encode.bytes = offset - oldOffset;
	  return q
	};

	question.encode.bytes = 0;

	question.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var oldOffset = offset;
	  var q = {};

	  q.name = name.decode(buf, offset);
	  offset += name.decode.bytes;

	  q.type = types$1.toString(buf.readUInt16BE(offset));
	  offset += 2;

	  q.class = buf.readUInt16BE(offset);
	  offset += 2;

	  var qu = !!(q.class & QU_MASK);
	  if (qu) q.class &= NOT_QU_MASK;

	  question.decode.bytes = offset - oldOffset;
	  return q
	};

	question.decode.bytes = 0;

	question.encodingLength = function (q) {
	  return name.encodingLength(q.name) + 4
	};

	exports.AUTHORITATIVE_ANSWER = 1 << 10;
	exports.TRUNCATED_RESPONSE = 1 << 9;
	exports.RECURSION_DESIRED = 1 << 8;
	exports.RECURSION_AVAILABLE = 1 << 7;
	exports.AUTHENTIC_DATA = 1 << 5;
	exports.CHECKING_DISABLED = 1 << 4;

	exports.encode = function (result, buf, offset) {
	  var allocing = !buf;
	  if (allocing) buf = Buffer.alloc(exports.encodingLength(result));
	  if (!offset) offset = 0;

	  var oldOffset = offset;

	  if (!result.questions) result.questions = [];
	  if (!result.answers) result.answers = [];
	  if (!result.authorities) result.authorities = [];
	  if (!result.additionals) result.additionals = [];

	  header.encode(result, buf, offset);
	  offset += header.encode.bytes;

	  offset = encodeList(result.questions, question, buf, offset);
	  offset = encodeList(result.answers, answer, buf, offset);
	  offset = encodeList(result.authorities, answer, buf, offset);
	  offset = encodeList(result.additionals, answer, buf, offset);

	  exports.encode.bytes = offset - oldOffset;

	  // just a quick sanity check
	  if (allocing && exports.encode.bytes !== buf.length) {
	    return buf.slice(0, exports.encode.bytes)
	  }

	  return buf
	};

	exports.encode.bytes = 0;

	exports.decode = function (buf, offset) {
	  if (!offset) offset = 0;

	  var oldOffset = offset;
	  var result = header.decode(buf, offset);
	  offset += header.decode.bytes;

	  offset = decodeList(result.questions, question, buf, offset);
	  offset = decodeList(result.answers, answer, buf, offset);
	  offset = decodeList(result.authorities, answer, buf, offset);
	  offset = decodeList(result.additionals, answer, buf, offset);

	  exports.decode.bytes = offset - oldOffset;

	  return result
	};

	exports.decode.bytes = 0;

	exports.encodingLength = function (result) {
	  return header.encodingLength(result) +
	    encodingLengthList(result.questions || [], question) +
	    encodingLengthList(result.answers || [], answer) +
	    encodingLengthList(result.authorities || [], answer) +
	    encodingLengthList(result.additionals || [], answer)
	};

	function encodingLengthList (list, enc) {
	  var len = 0;
	  for (var i = 0; i < list.length; i++) len += enc.encodingLength(list[i]);
	  return len
	}

	function encodeList (list, enc, buf, offset) {
	  for (var i = 0; i < list.length; i++) {
	    enc.encode(list[i], buf, offset);
	    offset += enc.encode.bytes;
	  }
	  return offset
	}

	function decodeList (list, enc, buf, offset) {
	  for (var i = 0; i < list.length; i++) {
	    list[i] = enc.decode(buf, offset);
	    offset += enc.decode.bytes;
	  }
	  return offset
	} 
} (dnsPacket));

var packet = dnsPacket;
var dgram = require$$1$1;
var thunky = thunky_1;
var events = require$$2;
var os = require$$0;

var noop = function () {};

var multicastDns = function (opts) {
  if (!opts) opts = {};

  var that = new events.EventEmitter();
  var port = typeof opts.port === 'number' ? opts.port : 5353;
  var type = opts.type || 'udp4';
  var ip = opts.ip || opts.host || (type === 'udp4' ? '224.0.0.251' : null);
  var me = {address: ip, port: port};
  var memberships = {};
  var destroyed = false;
  var interval = null;

  if (type === 'udp6' && (!ip || !opts.interface)) {
    throw new Error('For IPv6 multicast you must specify `ip` and `interface`')
  }

  var socket = opts.socket || dgram.createSocket({
    type: type,
    reuseAddr: opts.reuseAddr !== false,
    toString: function () {
      return type
    }
  });

  socket.on('error', function (err) {
    if (err.code === 'EACCES' || err.code === 'EADDRINUSE') that.emit('error', err);
    else that.emit('warning', err);
  });

  socket.on('message', function (message, rinfo) {
    try {
      message = packet.decode(message);
    } catch (err) {
      that.emit('warning', err);
      return
    }

    that.emit('packet', message, rinfo);

    if (message.type === 'query') that.emit('query', message, rinfo);
    if (message.type === 'response') that.emit('response', message, rinfo);
  });

  socket.on('listening', function () {
    if (!port) port = me.port = socket.address().port;
    if (opts.multicast !== false) {
      that.update();
      interval = setInterval(that.update, 5000);
      socket.setMulticastTTL(opts.ttl || 255);
      socket.setMulticastLoopback(opts.loopback !== false);
    }
  });

  var bind = thunky(function (cb) {
    if (!port) return cb(null)
    socket.once('error', cb);
    socket.bind(port, opts.interface, function () {
      socket.removeListener('error', cb);
      cb(null);
    });
  });

  bind(function (err) {
    if (err) return that.emit('error', err)
    that.emit('ready');
  });

  that.send = function (value, rinfo, cb) {
    if (typeof rinfo === 'function') return that.send(value, null, rinfo)
    if (!cb) cb = noop;
    if (!rinfo) rinfo = me;

    bind(onbind);

    function onbind (err) {
      if (destroyed) return cb()
      if (err) return cb(err)
      var message = packet.encode(value);
      socket.send(message, 0, message.length, rinfo.port, rinfo.address || rinfo.host, cb);
    }
  };

  that.response =
  that.respond = function (res, rinfo, cb) {
    if (Array.isArray(res)) res = {answers: res};

    res.type = 'response';
    res.flags = (res.flags || 0) | packet.AUTHORITATIVE_ANSWER;
    that.send(res, rinfo, cb);
  };

  that.query = function (q, type, rinfo, cb) {
    if (typeof type === 'function') return that.query(q, null, null, type)
    if (typeof type === 'object' && type && type.port) return that.query(q, null, type, rinfo)
    if (typeof rinfo === 'function') return that.query(q, type, null, rinfo)
    if (!cb) cb = noop;

    if (typeof q === 'string') q = [{name: q, type: type || 'ANY'}];
    if (Array.isArray(q)) q = {type: 'query', questions: q};

    q.type = 'query';
    that.send(q, rinfo, cb);
  };

  that.destroy = function (cb) {
    if (!cb) cb = noop;
    if (destroyed) return process.nextTick(cb)
    destroyed = true;
    clearInterval(interval);
    socket.once('close', cb);
    socket.close();
  };

  that.update = function () {
    var ifaces = opts.interface ? [].concat(opts.interface) : allInterfaces();
    var updated = false;

    for (var i = 0; i < ifaces.length; i++) {
      var addr = ifaces[i];

      if (memberships[addr]) continue
      memberships[addr] = true;
      updated = true;

      try {
        socket.addMembership(ip, addr);
      } catch (err) {
        that.emit('warning', err);
      }
    }

    if (!updated || !socket.setMulticastInterface) return
    socket.setMulticastInterface(opts.interface || defaultInterface());
  };

  return that
};

function defaultInterface () {
  var networks = os.networkInterfaces();
  var names = Object.keys(networks);

  for (var i = 0; i < names.length; i++) {
    var net = networks[names[i]];
    for (var j = 0; j < net.length; j++) {
      var iface = net[j];
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }

  return '127.0.0.1'
}

function allInterfaces () {
  var networks = os.networkInterfaces();
  var names = Object.keys(networks);
  var res = [];

  for (var i = 0; i < names.length; i++) {
    var net = networks[names[i]];
    for (var j = 0; j < net.length; j++) {
      var iface = net[j];
      if (iface.family === 'IPv4') {
        res.push(iface.address);
        // could only addMembership once per interface (https://nodejs.org/api/dgram.html#dgram_socket_addmembership_multicastaddress_multicastinterface)
        break
      }
    }
  }

  return res
}

var multicastdns = multicastDns;
var dnsEqual$1 = dnsEqual$3;
var flatten = arrayFlattenExports;
var deepEqual = deepEqual_1;

var mdnsServer = Server$1;

function Server$1 (opts) {
  this.mdns = multicastdns(opts);
  this.mdns.setMaxListeners(0);
  this.registry = {};
  this.mdns.on('query', this._respondToQuery.bind(this));
}

Server$1.prototype.register = function (records) {
  var self = this;

  if (Array.isArray(records)) records.forEach(register);
  else register(records);

  function register (record) {
    var subRegistry = self.registry[record.type];
    if (!subRegistry) subRegistry = self.registry[record.type] = [];
    else if (subRegistry.some(isDuplicateRecord(record))) return
    subRegistry.push(record);
  }
};

Server$1.prototype.unregister = function (records) {
  var self = this;

  if (Array.isArray(records)) records.forEach(unregister);
  else unregister(records);

  function unregister (record) {
    var type = record.type;
    if (!(type in self.registry)) return
    self.registry[type] = self.registry[type].filter(function (r) {
      return r.name !== record.name
    });
  }
};

Server$1.prototype._respondToQuery = function (query) {
  var self = this;
  query.questions.forEach(function (question) {
    var type = question.type;
    var name = question.name;

    // generate the answers section
    var answers = type === 'ANY'
      ? flatten.depth(Object.keys(self.registry).map(self._recordsFor.bind(self, name)), 1)
      : self._recordsFor(name, type);

    if (answers.length === 0) return

    // generate the additionals section
    var additionals = [];
    if (type !== 'ANY') {
      answers.forEach(function (answer) {
        if (answer.type !== 'PTR') return
        additionals = additionals
          .concat(self._recordsFor(answer.data, 'SRV'))
          .concat(self._recordsFor(answer.data, 'TXT'));
      });

      // to populate the A and AAAA records, we need to get a set of unique
      // targets from the SRV record
      additionals
        .filter(function (record) {
          return record.type === 'SRV'
        })
        .map(function (record) {
          return record.data.target
        })
        .filter(unique())
        .forEach(function (target) {
          additionals = additionals
            .concat(self._recordsFor(target, 'A'))
            .concat(self._recordsFor(target, 'AAAA'));
        });
    }

    self.mdns.respond({ answers: answers, additionals: additionals }, function (err) {
      if (err) throw err // TODO: Handle this (if no callback is given, the error will be ignored)
    });
  });
};

Server$1.prototype._recordsFor = function (name, type) {
  if (!(type in this.registry)) return []

  return this.registry[type].filter(function (record) {
    var _name = ~name.indexOf('.') ? record.name : record.name.split('.')[0];
    return dnsEqual$1(_name, name)
  })
};

function isDuplicateRecord (a) {
  return function (b) {
    return a.type === b.type &&
      a.name === b.name &&
      deepEqual(a.data, b.data)
  }
}

function unique () {
  var set = [];
  return function (obj) {
    if (~set.indexOf(obj)) return false
    set.push(obj);
    return true
  }
}

var util = require$$1;
var EventEmitter = require$$2.EventEmitter;
var serviceName = multicastDnsServiceTypes;
var dnsEqual = dnsEqual$3;
var dnsTxt = dnsTxt$1;

var TLD = '.local';
var WILDCARD = '_services._dns-sd._udp' + TLD;

var browser = Browser$1;

util.inherits(Browser$1, EventEmitter);

/**
 * Start a browser
 *
 * The browser listens for services by querying for PTR records of a given
 * type, protocol and domain, e.g. _http._tcp.local.
 *
 * If no type is given, a wild card search is performed.
 *
 * An internal list of online services is kept which starts out empty. When
 * ever a new service is discovered, it's added to the list and an "up" event
 * is emitted with that service. When it's discovered that the service is no
 * longer available, it is removed from the list and a "down" event is emitted
 * with that service.
 */
function Browser$1 (mdns, opts, onup) {
  if (typeof opts === 'function') return new Browser$1(mdns, null, opts)

  EventEmitter.call(this);

  this._mdns = mdns;
  this._onresponse = null;
  this._serviceMap = {};
  this._txt = dnsTxt(opts.txt);

  if (!opts || !opts.type) {
    this._name = WILDCARD;
    this._wildcard = true;
  } else {
    this._name = serviceName.stringify(opts.type, opts.protocol || 'tcp') + TLD;
    if (opts.name) this._name = opts.name + '.' + this._name;
    this._wildcard = false;
  }

  this.services = [];

  if (onup) this.on('up', onup);

  this.start();
}

Browser$1.prototype.start = function () {
  if (this._onresponse) return

  var self = this;

  // List of names for the browser to listen for. In a normal search this will
  // be the primary name stored on the browser. In case of a wildcard search
  // the names will be determined at runtime as responses come in.
  var nameMap = {};
  if (!this._wildcard) nameMap[this._name] = true;

  this._onresponse = function (packet, rinfo) {
    if (self._wildcard) {
      packet.answers.forEach(function (answer) {
        if (answer.type !== 'PTR' || answer.name !== self._name || answer.name in nameMap) return
        nameMap[answer.data] = true;
        self._mdns.query(answer.data, 'PTR');
      });
    }

    Object.keys(nameMap).forEach(function (name) {
      // unregister all services shutting down
      goodbyes(name, packet).forEach(self._removeService.bind(self));

      // register all new services
      var matches = buildServicesFor(name, packet, self._txt, rinfo);
      if (matches.length === 0) return

      matches.forEach(function (service) {
        if (self._serviceMap[service.fqdn]) return // ignore already registered services
        self._addService(service);
      });
    });
  };

  this._mdns.on('response', this._onresponse);
  this.update();
};

Browser$1.prototype.stop = function () {
  if (!this._onresponse) return

  this._mdns.removeListener('response', this._onresponse);
  this._onresponse = null;
};

Browser$1.prototype.update = function () {
  this._mdns.query(this._name, 'PTR');
};

Browser$1.prototype._addService = function (service) {
  this.services.push(service);
  this._serviceMap[service.fqdn] = true;
  this.emit('up', service);
};

Browser$1.prototype._removeService = function (fqdn) {
  var service, index;
  this.services.some(function (s, i) {
    if (dnsEqual(s.fqdn, fqdn)) {
      service = s;
      index = i;
      return true
    }
  });
  if (!service) return
  this.services.splice(index, 1);
  delete this._serviceMap[fqdn];
  this.emit('down', service);
};

// PTR records with a TTL of 0 is considered a "goodbye" announcement. I.e. a
// DNS response broadcasted when a service shuts down in order to let the
// network know that the service is no longer going to be available.
//
// For more info see:
// https://tools.ietf.org/html/rfc6762#section-8.4
//
// This function returns an array of all resource records considered a goodbye
// record
function goodbyes (name, packet) {
  return packet.answers.concat(packet.additionals)
    .filter(function (rr) {
      return rr.type === 'PTR' && rr.ttl === 0 && dnsEqual(rr.name, name)
    })
    .map(function (rr) {
      return rr.data
    })
}

function buildServicesFor (name, packet, txt, referer) {
  var records = packet.answers.concat(packet.additionals).filter(function (rr) {
    return rr.ttl > 0 // ignore goodbye messages
  });

  return records
    .filter(function (rr) {
      return rr.type === 'PTR' && dnsEqual(rr.name, name)
    })
    .map(function (ptr) {
      var service = {
        addresses: []
      };

      records
        .filter(function (rr) {
          return (rr.type === 'SRV' || rr.type === 'TXT') && dnsEqual(rr.name, ptr.data)
        })
        .forEach(function (rr) {
          if (rr.type === 'SRV') {
            var parts = rr.name.split('.');
            var name = parts[0];
            var types = serviceName.parse(parts.slice(1, -1).join('.'));
            service.name = name;
            service.fqdn = rr.name;
            service.host = rr.data.target;
            service.referer = referer;
            service.port = rr.data.port;
            service.type = types.name;
            service.protocol = types.protocol;
            service.subtypes = types.subtypes;
          } else if (rr.type === 'TXT') {
            service.rawTxt = rr.data;
            service.txt = txt.decode(rr.data);
          }
        });

      if (!service.name) return

      records
        .filter(function (rr) {
          return (rr.type === 'A' || rr.type === 'AAAA') && dnsEqual(rr.name, service.host)
        })
        .forEach(function (rr) {
          service.addresses.push(rr.data);
        });

      return service
    })
    .filter(function (rr) {
      return !!rr
    })
}

var Registry = registry;
var Server = mdnsServer;
var Browser = browser;

var bonjour = Bonjour;

function Bonjour (opts) {
  if (!(this instanceof Bonjour)) return new Bonjour(opts)
  this._server = new Server(opts);
  this._registry = new Registry(this._server);
}

Bonjour.prototype.publish = function (opts) {
  return this._registry.publish(opts)
};

Bonjour.prototype.unpublishAll = function (cb) {
  this._registry.unpublishAll(cb);
};

Bonjour.prototype.find = function (opts, onup) {
  return new Browser(this._server.mdns, opts, onup)
};

Bonjour.prototype.findOne = function (opts, cb) {
  var browser = new Browser(this._server.mdns, opts);
  browser.once('up', function (service) {
    browser.stop();
    if (cb) cb(service);
  });
  return browser
};

Bonjour.prototype.destroy = function () {
  this._registry.destroy();
  this._server.mdns.destroy();
};

var index = /*@__PURE__*/getDefaultExportFromCjs(bonjour);

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index
});

export { index$1 as i };
//# sourceMappingURL=bonjour.js.map
