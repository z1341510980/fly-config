/**
 * RGB space.
 *
 * @module  color-space/rgb
 */

var rgb = {
	name: 'rgb',
	min: [0,0,0],
	max: [255,255,255],
	channel: ['red', 'green', 'blue'],
	alias: ['RGB']
};

/**
 * CIE XYZ
 *
 * @module  color-space/xyz
 */

var xyz = {
	name: 'xyz',
	min: [0,0,0],
	channel: ['X','Y','Z'],
	alias: ['XYZ', 'ciexyz', 'cie1931']
};


/**
 * Whitepoint reference values with observer/illuminant
 *
 * http://en.wikipedia.org/wiki/Standard_illuminant
 */
xyz.whitepoint = {
	//1931 2°
	2: {
		//incadescent
		A:[109.85, 100, 35.585],
		// B:[],
		C: [98.074, 100, 118.232],
		D50: [96.422, 100, 82.521],
		D55: [95.682, 100, 92.149],
		//daylight
		D65: [95.045592705167, 100, 108.9057750759878],
		D75: [94.972, 100, 122.638],
		//flourescent
		// F1: [],
		F2: [99.187, 100, 67.395],
		// F3: [],
		// F4: [],
		// F5: [],
		// F6:[],
		F7: [95.044, 100, 108.755],
		// F8: [],
		// F9: [],
		// F10: [],
		F11: [100.966, 100, 64.370],
		// F12: [],
		E: [100,100,100]
	},

	//1964  10°
	10: {
		//incadescent
		A:[111.144, 100, 35.200],
		C: [97.285, 100, 116.145],
		D50: [96.720, 100, 81.427],
		D55: [95.799, 100, 90.926],
		//daylight
		D65: [94.811, 100, 107.304],
		D75: [94.416, 100, 120.641],
		//flourescent
		F2: [103.280, 100, 69.026],
		F7: [95.792, 100, 107.687],
		F11: [103.866, 100, 65.627],
		E: [100,100,100]
	}
};


/**
 * Top values are the whitepoint’s top values, default are D65
 */
xyz.max = xyz.whitepoint[2].D65;


/**
 * Transform xyz to rgb
 *
 * @param {Array} xyz Array of xyz values
 *
 * @return {Array} RGB values
 */
xyz.rgb = function (_xyz, white) {
	//FIXME: make sure we have to divide like this. Probably we have to replace matrix as well then
	white = white || xyz.whitepoint[2].E;

	var x = _xyz[0] / white[0],
		y = _xyz[1] / white[1],
		z = _xyz[2] / white[2],
		r, g, b;

	// assume sRGB
	// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
	r = (x * 3.240969941904521) + (y * -1.537383177570093) + (z * -0.498610760293);
	g = (x * -0.96924363628087) + (y * 1.87596750150772) + (z * 0.041555057407175);
	b = (x * 0.055630079696993) + (y * -0.20397695888897) + (z * 1.056971514242878);

	r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r = (r * 12.92);

	g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g = (g * 12.92);

	b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b = (b * 12.92);

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};



/**
 * RGB to XYZ
 *
 * @param {Array} rgb RGB channels
 *
 * @return {Array} XYZ channels
 */
rgb.xyz = function(rgb, white) {
	var r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.41239079926595) + (g * 0.35758433938387) + (b * 0.18048078840183);
	var y = (r * 0.21263900587151) + (g * 0.71516867876775) + (b * 0.072192315360733);
	var z = (r * 0.019330818715591) + (g * 0.11919477979462) + (b * 0.95053215224966);

	white = white || xyz.whitepoint[2].E;

	return [x * white[0], y * white[1], z * white[2]];
};

/**
 * CIE LUV (C'est la vie)
 *
 * @module color-space/luv
 */

var luv = {
	name: 'luv',
	//NOTE: luv has no rigidly defined limits
	//easyrgb fails to get proper coords
	//boronine states no rigid limits
	//colorMine refers this ones:
	min: [0,-134,-140],
	max: [100,224,122],
	channel: ['lightness', 'u', 'v'],
	alias: ['LUV', 'cieluv', 'cie1976'],

	xyz: function(arg, i, o){
		var _u, _v, l, u, v, x, y, z, xn, yn, zn, un, vn;
		l = arg[0], u = arg[1], v = arg[2];

		if (l === 0) return [0,0,0];

		//get constants
		//var e = 0.008856451679035631; //(6/29)^3
		var k = 0.0011070564598794539; //(3/29)^3

		//get illuminant/observer
		i = i || 'D65';
		o = o || 2;

		xn = xyz.whitepoint[o][i][0];
		yn = xyz.whitepoint[o][i][1];
		zn = xyz.whitepoint[o][i][2];

		un = (4 * xn) / (xn + (15 * yn) + (3 * zn));
		vn = (9 * yn) / (xn + (15 * yn) + (3 * zn));
		// un = 0.19783000664283;
		// vn = 0.46831999493879;


		_u = u / (13 * l) + un || 0;
		_v = v / (13 * l) + vn || 0;

		y = l > 8 ? yn * Math.pow( (l + 16) / 116 , 3) : yn * l * k;

		//wikipedia method
		x = y * 9 * _u / (4 * _v) || 0;
		z = y * (12 - 3 * _u - 20 * _v) / (4 * _v) || 0;

		//boronine method
		//https://github.com/boronine/husl/blob/master/husl.coffee#L201
		// x = 0 - (9 * y * _u) / ((_u - 4) * _v - _u * _v);
		// z = (9 * y - (15 * _v * y) - (_v * x)) / (3 * _v);

		return [x, y, z];
	}
};

// http://www.brucelindbloom.com/index.html?Equations.html
// https://github.com/boronine/husl/blob/master/husl.coffee
//i - illuminant
//o - observer
xyz.luv = function(arg, i, o) {
	var _u, _v, l, u, v, x, y, z, xn, yn, zn, un, vn;

	//get constants
	var e = 0.008856451679035631; //(6/29)^3
	var k = 903.2962962962961; //(29/3)^3

	//get illuminant/observer coords
	i = i || 'D65';
	o = o || 2;

	xn = xyz.whitepoint[o][i][0];
	yn = xyz.whitepoint[o][i][1];
	zn = xyz.whitepoint[o][i][2];

	un = (4 * xn) / (xn + (15 * yn) + (3 * zn));
	vn = (9 * yn) / (xn + (15 * yn) + (3 * zn));


	x = arg[0], y = arg[1], z = arg[2];


	_u = (4 * x) / (x + (15 * y) + (3 * z)) || 0;
	_v = (9 * y) / (x + (15 * y) + (3 * z)) || 0;

	var yr = y/yn;

	l = yr <= e ? k * yr : 116 * Math.pow(yr, 1/3) - 16;

	u = 13 * l * (_u - un);
	v = 13 * l * (_v - vn);

	return [l, u, v];
};

/**
 * Cylindrical CIE LUV
 *
 * @module color-space/lchuv
 */

//cylindrical luv
var lchuv = {
	name: 'lchuv',
	channel: ['lightness', 'chroma', 'hue'],
	alias: ['LCHuv', 'cielchuv'],
	min: [0,0,0],
	max: [100,100,360],

	luv: function(luv){
		var l = luv[0],
		c = luv[1],
		h = luv[2],
		u, v, hr;

		hr = h / 360 * 2 * Math.PI;
		u = c * Math.cos(hr);
		v = c * Math.sin(hr);
		return [l, u, v];
	},

	xyz: function(arg) {
		return luv.xyz(lchuv.luv(arg));
	}
};

luv.lchuv = function(luv){
	var l = luv[0], u = luv[1], v = luv[2];

	var c = Math.sqrt(u*u + v*v);
	var hr = Math.atan2(v,u);
	var h = hr * 360 / 2 / Math.PI;
	if (h < 0) {
		h += 360;
	}

	return [l,c,h]
};

xyz.lchuv = function(arg){
  return luv.lchuv(xyz.luv(arg));
};

/**
 * @module color-space/hsl
 */

var hsl = {
	name: 'hsl',
	min: [0,0,0],
	max: [360,100,100],
	channel: ['hue', 'saturation', 'lightness'],
	alias: ['HSL'],

	rgb: function(hsl) {
		var h = hsl[0]/360, s = hsl[1]/100, l = hsl[2]/100, t1, t2, t3, rgb, val, i=0;

		if (s === 0) return val = l * 255, [val, val, val];

		t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (;i<3;) {
			t3 = h + 1 / 3 * - (i - 1);
			t3 < 0 ? t3++ : t3 > 1 && t3--;
			val = 6 * t3 < 1 ? t1 + (t2 - t1) * 6 * t3 :
			2 * t3 < 1 ? t2 :
			3 * t3 < 2 ?  t1 + (t2 - t1) * (2 / 3 - t3) * 6 :
			t1;
			rgb[i++] = val * 255;
		}

		return rgb;
	}
};


//extend rgb
rgb.hsl = function(rgb) {
	var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, l;

	if (max === min) {
		h = 0;
	}
	else if (r === max) {
		h = (g - b) / delta;
	}
	else if (g === max) {
		h = 2 + (b - r) / delta;
	}
	else if (b === max) {
		h = 4 + (r - g)/ delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	}
	else if (l <= 0.5) {
		s = delta / (max + min);
	}
	else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

export { hsl as h, lchuv as l, rgb as r, xyz as x };
//# sourceMappingURL=color-space.js.map
