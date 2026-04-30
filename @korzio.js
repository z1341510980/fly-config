var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/* eslint no-param-reassign: [2, { "props": false }] */

var djvDraft04_1;
var hasRequiredDjvDraft04;

function requireDjvDraft04 () {
	if (hasRequiredDjvDraft04) return djvDraft04_1;
	hasRequiredDjvDraft04 = 1;
	const djvDraft04 = ({
	  properties,
	  keywords,
	  validators,
	  formats,
	  keys,
	  transformation,
	}) => {
	  Object.assign(properties, {
	    minimum(schema) {
	      return `%s <${schema.exclusiveMinimum ? '=' : ''} ${schema.minimum}`;
	    },
	    maximum(schema) {
	      return `%s >${schema.exclusiveMaximum ? '=' : ''} ${schema.maximum}`;
	    },
	  });

	  delete properties.exclusiveMaximum;
	  delete properties.exclusiveMinimum;

	  ['$id', 'contains', 'const', 'examples'].forEach((key) => {
	    const index = keywords.indexOf(key);
	    if (index === -1) {
	      return;
	    }

	    keywords.splice(index, 1);
	  });

	  if (keywords.indexOf('exclusiveMaximum') === -1) {
	    keywords.push('exclusiveMaximum', 'exclusiveMininum', 'id');
	  }

	  ['contains', 'constant', 'propertyNames'].forEach((key) => {
	    const validator = validators.name[key];
	    delete validators.name[key];

	    const index = validators.list.indexOf(validator);
	    if (index === -1) {
	      return;
	    }

	    validators.list.splice(index, 1);
	  });

	  delete formats['json-pointer'];
	  delete formats['uri-reference'];
	  delete formats['uri-template'];

	  Object.assign(keys, { id: 'id' });
	  Object.assign(transformation, {
	    ANY_SCHEMA: true,
	    NOT_ANY_SCHEMA: false,
	  });
	};

	djvDraft04_1 = djvDraft04;
	return djvDraft04_1;
}

export { commonjsGlobal as c, getDefaultExportFromCjs as g, requireDjvDraft04 as r };
//# sourceMappingURL=@korzio.js.map
