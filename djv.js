import { g as getDefaultExportFromCjs, r as requireDjvDraft04 } from './@korzio.js';

/**
 * @module template
 * @description
 * Defines a small templater functionality for creating functions body.
 */

function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }

  const sanitzedStr = String.prototype.replace.call(str, /[^a-z0-9áéíóúñü .,_-]/gim, '');
  return String.prototype.trim.call(sanitzedStr);
}

/**
 * @name template
 * @type function
 * @description
 * Provides a templater function, which adds a line of code into generated function body.
 *
 * @param {object} state - used in visit and reference method to iterate and find schemas.
 * @param {DjvConfig} options
 * @return {function} tpl
 */
function template$1(state, options) {
  function tpl(expression, ...args) {
    let last;

    tpl.lines.push(
      expression
        .replace(/%i/g, () => 'i')
        .replace(/\$(\d)/g, (match, index) => `${sanitizeString(args[index - 1])}`)
        .replace(/(%[sd])/g, () => {
          if (args.length) {
            last = args.shift();
          }

          return `${last}`;
        })
    );

    return tpl;
  }

  function clearDecode(tplString) {
    return tplString
      .replace('[', '')
      .replace(']', '')
      .replace('(', '')
      .replace(')', '')
      .replace('decodeURIComponent', '');
  }

  const error = typeof options.errorHandler === 'function' ?
    options.errorHandler :
    function defaultErrorHandler(errorType) {
      const path = this.data.toString()
        .replace(/^data/, '');
      const dataPath = path
        .replace(/\['([^']+)'\]/ig, '.$1')
        .replace(/\[(i[0-9]*)\]/ig, '[\'+$1+\']');
      const schemaPath = `#${
        path
          .replace(/\[i([0-9]*)\]/ig, '/items')
          .replace(/\['([^']+)'\]/ig, '/properties/$1')
      }/${errorType}`;

      return `return {
        keyword: '${errorType}',
        dataPath: decodeURIComponent("${clearDecode(dataPath)}"),
        schemaPath: decodeURIComponent("${clearDecode(schemaPath)}")
      };`;
    };

  Object.assign(tpl, {
    cachedIndex: 0,
    cached: [],
    cache(expression) {
      const layer = tpl.cached[tpl.cached.length - 1];
      if (layer[expression]) {
        return `i${layer[expression]}`;
      }

      tpl.cachedIndex += 1;
      layer[expression] = tpl.cachedIndex;
      return `(i${layer[expression]} = ${expression})`;
    },
    data: ['data'],
    error,
    lines: [],
    schema: ['schema'],
    push: tpl,
    /**
     * @name link
     * @description
     * Get schema validator by url
     * Call state link to generate or get cached function
     * @type {function}
     * @param {string} url
     * @return {string} functionName
     */
    link(url) {
      return `f${state.link(url)}`;
    },
    /**
     * @name visit
     * @description
     * Create new cache scope and visit given schema
     * @type {function}
     * @param {object} schema
     * @return {void}
     */
    visit(schema) {
      tpl.cached.push({});
      state.visit(schema, tpl);
      tpl.cached.pop();
    },
  });

  function dataToString() {
    return this.join('.').replace(/\.\[/g, '[');
  }
  tpl.data.toString = dataToString;
  tpl.schema.toString = dataToString;

  return tpl;
}

/**
 * @name restore
 * @type function
 * @description
 * Generate a function by given body with a schema in a closure
 *
 * @param {string} source - function inner & outer body
 * @param {object} schema - passed as argument to meta function
 * @param {DjvConfig} config
 * @return {function} tpl
 */
function restore$2(source, schema, { inner } = {}) {
  /* eslint-disable no-new-func */
  const tpl = new Function('schema', source)(schema);
  /* eslint-enable no-new-func */

  if (!inner) {
    tpl.toString = function toString() {
      return source;
    };
  }

  return tpl;
}

/**
 * Configuration for template functions
 * @typedef {object} TemplateOptions
 * @property {string[]} context
 * @property {string[]} index
 * @property {boolean?} inner - a generating object should be considered as inner
 * @property {boolean?} defineErrors - if erros should be defined
 * @property {string[]} lines - content templates
 */

/**
 * @private
 * @name makeVariables
 * @type function
 * @description
 * Generate internal variables
 *
 * @param {TemplateOptions} options
 * @return {string} variables
 */
function makeVariables({ defineErrors, index }) {
  /**
   * @var {array} errors - empty array for pushing errors ability
   * @see errorHandler
   */
  const errors = defineErrors ? 'const errors = [];' : '';
  const variables = index ?
    `let i${Array(...Array(index))
      .map((value, i) => i + 1)
      .join(',i')};` :
    '';

  // @see map array with holes trick
  // http://2ality.com/2013/11/initializing-arrays.html
  // TODO change var to const
  return `
    ${errors}
    ${variables}
  `;
}

/**
 * @private
 * @name makeHelpers
 * @type function
 * @description
 * Generate internal helpers executed in outer function
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeHelpers({ context, inner }) {
  if (inner || !context.length) {
    return '';
  }

  const functions = [];
  const references = [];

  context
    .forEach((value, i) => {
      if (typeof value === 'number') {
        references.push(`${i + 1} = f${value + 1}`);
        return;
      }
      functions.push(`${i + 1} = ${value}`);
    });

  return `const f${functions.concat(references).join(', f')};`;
}

/**
 * @private
 * @name makeContent
 * @type function
 * @description
 * Generate internal function body content, including variables
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeContent(options) {
  const { defineErrors, lines } = options;

  const variables = makeVariables(options);
  const errors = defineErrors ? 'if(errors.length) return errors;' : '';
  const content = lines.join('\n');

  return `
    "use strict";
    ${variables}
    ${content}
    ${errors}
  `;
}

/**
 * @name body
 * @type function
 * @description
 * Generate a function body, containing internal variables and helpers
 *
 * @param {object} tpl - template instance, containing all analyzed schema related data
 * @param {object} state - state of schema generation
 * @param {DjvConfig} config
 * @return {string} body
 */
function body$1({ cachedIndex, lines }, { context }, { inner, errorHandler } = {}) {
  const options = {
    context,
    inner,
    defineErrors: errorHandler,
    index: cachedIndex,
    lines,
  };

  const helpers = makeHelpers(options);
  const content = makeContent(options);

  return `
    ${helpers}
    function f0(data) {
      ${content}
    }
    return f0;
  `;
}

/**
 * @name templateExpression
 * @type function
 * @description
 * Es6 template helper function
 * Transforms a validator utilities into generated functions body
 * @return {function} template
 */
function templateExpression(strings, ...keys) {
  return (...values) => {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach((key, i) => {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

var template_1 = {
  body: body$1,
  restore: restore$2,
  template: template$1,
  expression: templateExpression,
};

/**
 * @module formats
 * @description
 * Validators as string for format keyword rules.
 * A validator is a string, which when executed returns `false` if test is failed, `true` otherwise.
 */

const { expression: expression$1 } = template_1;

var formats$3 = {
  alpha: expression$1`!/^[a-zA-Z]+$/.test(${'data'})`,
  alphanumeric: expression$1`!/^[a-zA-Z0-9]+$/.test(${'data'})`,
  identifier: expression$1`!/^[-_a-zA-Z0-9]+$/.test(${'data'})`,
  hexadecimal: expression$1`!/^[a-fA-F0-9]+$/.test(${'data'})`,
  numeric: expression$1`!/^[0-9]+$/.test(${'data'})`,
  'date-time': expression$1`isNaN(Date.parse(${'data'})) || ~${'data'}.indexOf(\'/\')`,
  uppercase: expression$1`${'data'} !== ${'data'}.toUpperCase()`,
  lowercase: expression$1`${'data'} !== ${'data'}.toLowerCase()`,
  hostname: expression$1`${'data'}.length >= 256 || !/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])(\\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]))*$/.test(${'data'})`,
  uri: expression$1`!/^[A-Za-z][A-Za-z0-9+\\-.]*:(?:\\/\\/(?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&\'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\\/(?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\\?(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@\\/?]|%[0-9A-Fa-f]{2})*)?(?:\\#(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@\\/?]|%[0-9A-Fa-f]{2})*)?$/.test(${'data'})`,
  email: expression$1`!/^[^@]+@[^@]+\\.[^@]+$/.test(${'data'})`,
  ipv4: expression$1`!/^(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}$/.test(${'data'}) || ${'data'}.split(".")[3] > 255`,
  ipv6: expression$1`!/^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$/.test(${'data'})`,
  regex: expression$1`/[^\\\\]\\\\[^.*+?^\${}()|[\\]\\\\bBcdDfnrsStvwWxu0-9]/i.test(${'data'})`,
  // TODO optimize uri-reference regex... too long
  'json-pointer': expression$1`!/^$|^\\/(?:~(?=[01])|[^~])*$/i.test(${'data'})`,
  'uri-reference': expression$1`!/^(?:[A-Za-z][A-Za-z0-9+\\-.]*:(?:\\/\\/(?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&\'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\\/(?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\\?(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@\\/?]|%[0-9A-Fa-f]{2})*)?(?:\\#(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@\\/?]|%[0-9A-Fa-f]{2})*)?|(?:\\/\\/(?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&\'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\\/(?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\\/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\\?(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@\\/?]|%[0-9A-Fa-f]{2})*)?(?:\\#(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@\\/?]|%[0-9A-Fa-f]{2})*)?)$/i.test(${'data'})`,
  'uri-template': expression$1`!/^(?:(?:[^\\x00-\\x20"\'<>%\\\\^\`{|}]|%[0-9a-f]{2})|\\{[+#.\\/;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?:\\:[1-9][0-9]{0,3}|\\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?:\\:[1-9][0-9]{0,3}|\\*)?)*\\})*$/i.test(${'data'})`,
};

var required$1 = function required(schema, tpl) {
  if (!Array.isArray(schema.required)) {
    return;
  }

  tpl(`if (${tpl.data} !== null && typeof ${tpl.data} === 'object' && !Array.isArray(${tpl.data})) {
    ${schema.required.map((name) => {
    const condition = `!${tpl.data}.hasOwnProperty(decodeURIComponent("${escape(name)}"))`;
    const error = tpl.error('required', name);
    return `if (${condition}) ${error}`;
  }).join('')}
  }`);
};

const formats$2 = formats$3;

var format$1 = function format(schema, tpl) {
  if (typeof schema.format === 'undefined') {
    return;
  }

  const formatter = formats$2[schema.format];
  if (typeof formatter !== 'function') {
    return;
  }

  const { data } = tpl;
  const condition = formatter({ data, schema });
  const error = tpl.error('format');

  tpl(`if (${condition}) ${error}`);
};

/**
 * @module properties
 * @description
 * Validators as string for properties keyword rules.
 * A validator is a function, which when executed returns
 * - `false` if test is failed,
 * - `true` otherwise.
 */

var properties$4 = {
  readOnly: 'false',
  exclusiveMinimum(schema) {
    return `%s <= ${schema.exclusiveMinimum}`;
  },
  minimum(schema) {
    return `%s < ${schema.minimum}`;
  },
  exclusiveMaximum(schema) {
    return `%s >= ${schema.exclusiveMaximum}`;
  },
  maximum(schema) {
    return `%s > ${schema.maximum}`;
  },
  multipleOf: '($1/$2) % 1 !== 0 && typeof $1 === "number"',
  // When the instance value is a string
  // this provides a regular expression that a string instance MUST match in order to be valid.
  pattern(schema) {
    let pattern;
    let modifiers;

    if (typeof schema.pattern === 'string') { pattern = schema.pattern; } else {
      pattern = schema.pattern[0];
      modifiers = schema.pattern[1];
    }

    const regex = new RegExp(pattern, modifiers);
    return `typeof ($1) === "string" && !${regex}.test($1)`;
  },
  /**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
  minLength: 'typeof $1 === "string" && function dltml(b,c){for(var a=0,d=b.length;a<d&&c;){var e=b.charCodeAt(a++);55296<=e&&56319>=e&&a<d&&56320!==(b.charCodeAt(a++)&64512)&&a--;c--}return!!c}($1, $2)',
  maxLength: 'typeof $1 === "string" && function dmtml(b,c){for(var a=0,d=b.length;a<d&&0<=c;){var e=b.charCodeAt(a++);55296<=e&&56319>=e&&a<d&&56320!==(b.charCodeAt(a++)&64512)&&a--;c--}return 0>c}($1, $2)',
  // This attribute defines the minimum number of values
  // in an array when the array is the instance value.
  minItems: '$1.length < $2 && Array.isArray($1)',
  // This attribute defines the maximum number of values
  // in an array when the array is the instance value.
  maxItems: '$1.length > $2 && Array.isArray($1)',
  // TODO without some
  uniqueItems(schema, fn) {
    if (!schema.uniqueItems) {
      return 'true';
    }

    fn(fn.cache('{}'));
    return `Array.isArray($1) && $1.some(function(item, key) {
      if(item !== null && typeof item === "object") key = JSON.stringify(item);
      else key = item;
      if(${fn.cache('{}')}.hasOwnProperty(key)) return true;
      ${fn.cache('{}')}[key] = true;
    })`;
  },
  // ***** object validation ****
  minProperties: '!Array.isArray($1) && typeof $1 === "object" && Object.keys($1).length < $2',
  // An object instance is valid against "maxProperties"
  // if its number of properties is less than, or equal to, the value of this keyword.
  maxProperties: '!Array.isArray($1) && typeof $1 === "object" && Object.keys($1).length > $2',
  // ****** all *****
  enum(schema, fn) {
    return schema.enum.map((value) => {
      let $1 = '$1';
      let comparedValue = value;

      if (typeof value === 'object') {
        comparedValue = `'${JSON.stringify(value)}'`;
        $1 = fn.cache('JSON.stringify($1)');
      } else if (typeof value === 'string') {
        comparedValue = `'${escape(value)}'`;
      }

      return `${$1} != decodeURIComponent(${comparedValue})`;
    }).join(' && ');
  }
};

/**
 * @module keywords
 * @description
 * A list of keywords used in specification.
 */

var keywords$2 = [
  '$ref',
  '$schema',
  'type',
  'not',
  'anyOf',
  'allOf',
  'oneOf',
  'properties',
  'patternProperties',
  'additionalProperties',
  'items',
  'additionalItems',
  'required',
  'default',
  'title',
  'description',
  'definitions',
  'dependencies',
  '$id',
  'contains',
  'const',
  'examples'
];

/**
 * @module utils
 * @description
 * Basic utilities for djv project
 */

/**
 * @name asExpression
 * @type {function}
 * @description
 * Transform function or string to expression
 * @see validators
 * @param {function|string} fn
 * @param {object} schema
 * @param {object} tpl templater instance
 * @returns {string} expression
 */
function asExpression$1(fn, schema, tpl) {
  if (typeof fn !== 'function') {
    return fn;
  }

  return fn(schema, tpl);
}

/**
 * @name hasProperty
 * @type {function}
 * @description
 * Check if the property exists in a given object
 * @param {object} object
 * @param {string} property
 * @returns {boolean} exists
 */
function hasProperty$e(object, property) {
  return (
    typeof object === 'object' &&
    Object.prototype.hasOwnProperty.call(object, property)
  );
}

var utils = {
  asExpression: asExpression$1,
  hasProperty: hasProperty$e,
};

const properties$3 = properties$4;
const keywords$1 = keywords$2;
const { asExpression } = utils;

var property$1 = function property(schema, tpl) {
  Object.keys(schema)
    .forEach((key) => {
      if (keywords$1.indexOf(key) !== -1 || key === 'format') {
        return;
      }

      const condition = asExpression(properties$3[key], schema, tpl);
      if (!condition) {
        return;
      }
      const error = tpl.error(key);

      tpl(`if (${condition}) ${error}`, tpl.data, schema[key]);
    });
};

var types$1 = {
  null: '%s !== null',
  string: 'typeof %s !== "string"',
  boolean: 'typeof %s !== "boolean"',
  number: 'typeof %s !== "number" || %s !== %s',
  integer: 'typeof %s !== "number" || %s % 1 !== 0',
  object: '!%s || typeof %s !== "object" || Array.isArray(%s)',
  array: '!Array.isArray(%s)',
  date: '!(%s instanceof Date)'
};

const types = types$1;
const { hasProperty: hasProperty$d } = utils;

var type$1 = function type(schema, tpl) {
  if (!hasProperty$d(schema, 'type')) {
    return;
  }

  const error = tpl.error('type', schema.type);
  const condition = `(${[].concat(schema.type).map(key => types[key]).join(') && (')})`;

  tpl(`if (${condition}) ${error}`, tpl.data);
};

const { hasProperty: hasProperty$c } = utils;

var $ref$1 = function $ref(schema, tpl) {
  if (!hasProperty$c(schema, '$ref')) {
    return false;
  }

  const condition = `${tpl.link(schema.$ref)}(${tpl.data})`;
  const error = tpl.error('$ref');

  tpl(`if (${condition}) ${error}`);

  // All other properties in a "$ref" object MUST be ignored.
  // @see https://tools.ietf.org/html/draft-wright-json-schema-01#section-8
  return true;
};

const { hasProperty: hasProperty$b } = utils;

var not$1 = function not(schema, tpl) {
  if (!hasProperty$b(schema, 'not')) {
    return;
  }

  const condition = `${tpl.link(schema.not)}(${tpl.data})`;
  const error = tpl.error('not');

  tpl(`if (!${condition}) ${error}`);
};

const { hasProperty: hasProperty$a } = utils;

var anyOf$1 = function anyOf(schema, tpl) {
  if (!hasProperty$a(schema, 'anyOf')) {
    return;
  }

  const error = tpl.error('anyOf');
  const condition = schema.anyOf
    .map(reference => `${tpl.link(reference)}(${tpl.data})`)
    .join(' && ');

  tpl(`if (${condition}) ${error}`);
};

const { hasProperty: hasProperty$9 } = utils;

var oneOf$1 = function oneOf(schema, tpl) {
  if (!hasProperty$9(schema, 'oneOf')) {
    return;
  }

  const fns = schema.oneOf.map(reference => tpl.link(reference));
  const arr = tpl.cache(`[${fns}]`);
  const cachedArr = tpl.cache(`[${fns}]`);
  const index = tpl.cache(`${cachedArr}.length - 1`);
  const cachedIndex = tpl.cache(`${cachedArr}.length - 1`);
  const count = tpl.cache('0');
  const cachedCount = tpl.cache('0');
  const error = tpl.error('oneOf');

  tpl(`for (
    ${arr}, ${index}, ${count};
    ${cachedIndex} >= 0 && ${cachedIndex} < ${cachedArr}.length;
    ${cachedIndex}--) {
      if(!${cachedArr}[${cachedIndex}](${tpl.data})) ${cachedCount}++;
    }
    if (${cachedCount} !== 1) ${error}
  `);
};

const { hasProperty: hasProperty$8 } = utils;

var allOf$1 = function allOf(schema, tpl) {
  if (!hasProperty$8(schema, 'allOf')) {
    return;
  }

  const error = tpl.error('allOf');
  const condition = schema.allOf
    .map(reference => `${tpl.link(reference)}(${tpl.data})`)
    .join(' || ');

  tpl(`if (${condition}) ${error}`);
};

/**
 * @module schema
 * @description
 * Low-level utilities to check, create and transform schemas
 */

/**
 * @name transformation
 * @type {object}
 * @description
 * Schema values transformation
 */
const transformation$1 = {
  ANY_SCHEMA: {},
  NOT_ANY_SCHEMA: { not: {} },
};

/**
 * @name is
 * @type {function}
 * @description
 * Verify the object could be a schema
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 * @returns {boolean} isSchema
 */
function is(schema) {
  return (
    typeof schema === 'object' ||
    typeof schema === 'boolean'
  );
}

/**
 * @name transform
 * @type {function}
 * @description
 * Transform a schema pseudo presentation
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 * @returns {object} schema
 */
function transform(schema) {
  if (schema === true) {
    return transformation$1.ANY_SCHEMA;
  } else if (schema === false) {
    return transformation$1.NOT_ANY_SCHEMA;
  }
  return schema;
}

/**
 * @name make
 * @type {function}
 * @description
 * Generate a simple schema by a given object
 * @param {any} instance
 * @returns {object} schema
 */
function make(instance) {
  if (typeof instance !== 'object' || instance === null) {
    return { enum: [instance] };
  }

  if (Array.isArray(instance)) {
    return {
      items: instance.map(make),
      // other items should be valid by `false` schema, aka not exist at all
      additionalItems: false
    };
  }

  const required = Object.keys(instance);
  return {
    properties: required.reduce((memo, key) => (
      Object.assign({}, memo, {
        [key]: make(instance[key])
      })
    ), {}),
    required,
    // other properties should be valid by `false` schema, aka not exist at all
    // additionalProperties: false,
  };
}

var schema = {
  is,
  make,
  transform,
  transformation: transformation$1,
};

const { hasProperty: hasProperty$7 } = utils;
const { is: isSchema$1 } = schema;

// @see http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.7
var dependencies$1 = function dependencies(schema, tpl) {
  if (!hasProperty$7(schema, 'dependencies')) {
    return;
  }

  Object.keys(schema.dependencies)
    .forEach((dependency) => {
      const value = schema.dependencies[dependency];
      const error = tpl.error('dependencies');

      tpl(`if (${tpl.data}.hasOwnProperty(decodeURIComponent("${escape(dependency)}"))) {`);
      if (Array.isArray(value) || typeof value === 'string') {
        [...value]
          .map(property => `if (!${tpl.data}.hasOwnProperty(decodeURIComponent("${escape(property)}"))) ${error}`)
          .map(tpl);
      } else if (isSchema$1(value)) {
        tpl.visit(value);
      }
      tpl('}');
    });
};

const { hasProperty: hasProperty$6 } = utils;

var properties$2 = function properties(schema, tpl) {
  if (!hasProperty$6(schema, 'properties') || typeof schema.properties !== 'object') {
    return;
  }

  Object.keys(schema.properties)
    .forEach((propertyKey) => {
      const propertySchema = schema.properties[propertyKey];
      if (typeof propertySchema === 'object' && !Object.keys(propertySchema).length) {
        return;
      }

      const isNotRequired = !schema.required || schema.required.indexOf(propertyKey) === -1;
      if (isNotRequired) {
        tpl(`if (${tpl.data}.hasOwnProperty(decodeURIComponent("${escape(propertyKey)}"))) {`);
      }

      tpl.data.push(`[decodeURIComponent('${escape(propertyKey)}')]`);
      tpl.visit(propertySchema);
      tpl.data.pop();

      if (isNotRequired) {
        tpl('}');
      }
    });
};

const { hasProperty: hasProperty$5 } = utils;

var patternProperties$1 = function patternProperties(schema, tpl) {
  const hasAdditionalProperties = hasProperty$5(schema, 'additionalProperties') && schema.additionalProperties !== true;
  const hasPatternProperties = hasProperty$5(schema, 'patternProperties');

  if (!hasAdditionalProperties && !hasPatternProperties) {
    return;
  }

  // When the instance value is an object,
  // the property values of the instance object
  // MUST conform to the property definitions in this object.
  tpl(`if(typeof ${tpl.data} === 'object' && !Array.isArray(${tpl.data})) {`);

  tpl(tpl.cache('null'));
  const property = tpl.cache('null');
  const visitAdditionalProperties = () => {
    if (schema.additionalProperties === false) {
      tpl(tpl.error('additionalProperties'));
    } else if (schema.additionalProperties) {
      tpl.data.push(`[${property}]`);
      tpl.visit(schema.additionalProperties);
      tpl.data.pop();
    }
  };

  tpl(`for (${property} in ${tpl.data}) {`);
  if (hasAdditionalProperties && hasPatternProperties) {
    tpl(tpl.cache('false'));
  }

  if (hasPatternProperties) {
    Object.keys(schema.patternProperties)
      .forEach((propertyKey) => {
        tpl(`if (${new RegExp(propertyKey)}.test(${property})) {`);
        if (hasAdditionalProperties) {
          tpl(`${tpl.cache('false')} = true;`);
        }

        const propertySchema = schema.patternProperties[propertyKey];
        tpl.data.push(`[${property}]`);
        tpl.visit(propertySchema);
        tpl.data.pop();
        tpl('}');

        if (schema.properties) {
          tpl(`if (${hasAdditionalProperties ? `${tpl.cache('false')} || ` : ''} ${tpl.schema}.properties.hasOwnProperty(${property})) continue;`);
        } else if (hasAdditionalProperties) {
          tpl(`if (${tpl.cache('false')}) continue;`);
        }

        visitAdditionalProperties();
      });
  } else {
    if (schema.properties) {
      tpl(`if(${tpl.schema}.properties.hasOwnProperty(${property})) continue;`);
    }
    visitAdditionalProperties();
  }

  tpl('}}');
};

const { hasProperty: hasProperty$4 } = utils;

var items$1 = function items(schema, tpl) {
  if (!hasProperty$4(schema, 'items')) {
    return;
  }

  const itemsLength = schema.items.length;
  const error = tpl.error('additionalItems');
  const { data } = tpl;

  tpl(`if(Array.isArray(${data})) {`);
  if (Array.isArray(schema.items)) {
    if (schema.additionalItems === false) {
      tpl(`if (${data}.length > ${itemsLength}) ${error}`);
    }

    schema.items.forEach((subSchema, index) => {
      tpl(`if(${data}.length > ${index}) {`);
      data.push(`[${index}]`);
      tpl.visit(subSchema);
      data.pop();
      tpl('}');
    });

    if (typeof schema.additionalItems === 'object') {
      const zeroIndex = tpl.cache(itemsLength);
      const index = tpl.cache(itemsLength);

      tpl(`for (${zeroIndex}; ${index} < ${data}.length; ${index}++) {`);
      data.push(`[${tpl.cache(itemsLength)}]`);
      tpl.visit(schema.additionalItems);
      data.pop();
      tpl('}');
    }
  } else {
    const zeroIndex = tpl.cache('0');
    const index = tpl.cache('0');

    tpl(`for (${zeroIndex}; ${index} < ${data}.length; ${index}++) {`);
    data.push(`[${index}]`);
    tpl.visit(schema.items);
    data.pop();
    tpl('}');
  }
  tpl('}');
};

const { hasProperty: hasProperty$3 } = utils;

var contains$1 = function contains(schema, tpl) {
  if (!hasProperty$3(schema, 'contains')) {
    return;
  }

  const error = tpl.error('contains');
  const fn = `${tpl.link(schema.contains)}`;

  const { data } = tpl;
  const zeroIndex = tpl.cache('0');
  const index = tpl.cache('0');
  const dataAtIndex = data.toString.apply(data.concat(`[${index}]`));

  tpl(`if (Array.isArray(${data})) {
    if (${data}.length === 0) ${error}
      for (${zeroIndex}; ${index} < ${data}.length; ${index}++) {
        if (!${fn}(${dataAtIndex})) break;
        if (${index} === ${data}.length - 1) ${error}
      }
  }`);
};

const { hasProperty: hasProperty$2 } = utils;
const { make: makeSchema } = schema;

var _const = function constant(schema, tpl) {
  if (!hasProperty$2(schema, 'const')) {
    return;
  }

  const constantInstanceSchema = makeSchema(schema.const);
  tpl.visit(constantInstanceSchema);
};

const { hasProperty: hasProperty$1 } = utils;

var propertyNames$1 = function propertyNames(schema, tpl) {
  if (!hasProperty$1(schema, 'propertyNames')) {
    return;
  }

  const fn = tpl.link(schema.propertyNames);
  const error = tpl.error('propertyNames');

  tpl(`if (Object.keys(${tpl.data}).some(${fn})) ${error}`);
};

/**
 * @module validators
 * @description
 * Contains validators functions links
 * Provides an information about the order in which validators should be applied
 * Each validator may return true, which means, others will be ignored
 * @see $ref
 */

const required = required$1;
const format = format$1;
const property = property$1;
const type = type$1;
const $ref = $ref$1;
const not = not$1;
const anyOf = anyOf$1;
const oneOf = oneOf$1;
const allOf = allOf$1;
const dependencies = dependencies$1;
const properties$1 = properties$2;
const patternProperties = patternProperties$1;
const items = items$1;
const contains = contains$1;
const constant = _const;
const propertyNames = propertyNames$1;

var validators$2 = {
  name: {
    $ref,
    required,
    format,
    property,
    type,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties: properties$1,
    patternProperties,
    items,
    contains,
    constant,
    propertyNames,
  },
  list: [
    $ref,
    required,
    format,
    property,
    type,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties$1,
    patternProperties,
    items,
    contains,
    constant,
    propertyNames
  ]
};

/**
 * @module utils
 * @description
 * Utilities to check and normalize uri
 */

const REGEXP_URI = /:\/\//;
const REGEXP_URI_FRAGMENT = /#\/?/;
const REGEXP_URI_PATH = /(^[^:]+:\/\/[^?#]*\/).*/;

/**
 * @name keys
 * @type {object}
 * @description
 * Keys to apply schema attributes & values
 */
const keys$2 = {
  id: '$id',
};

/**
 * @name head
 * @type {function}
 * @description
 * Clean an id from its fragment
 * @example
 * head('http://domain.domain:2020/test/a#test')
 * // returns 'http://domain.domain:2020/test/a'
 * @param {string} id
 * @returns {string} cleaned
 */
function head$1(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }

  const parts = uri.split(REGEXP_URI_FRAGMENT);
  return parts[0];
}

function isFullUri$1(uri) {
  return REGEXP_URI.test(uri);
}

/**
 * @name path
 * @type {function}
 * @description
 * Gets a scheme, domain and a path part from the uri
 * @example
 * path('http://domain.domain:2020/test/a?test')
 * // returns 'http://domain.domain:2020/test/'
 * @param {string} uri
 * @returns {string} path
 */
function path(uri) {
  return uri.replace(REGEXP_URI_PATH, '$1');
}

/**
 * @description
 * Get the fragment (#...) part of the uri
 * @see https://tools.ietf.org/html/rfc3986#section-3
 * @param {string} uri
 * @returns {string} fragment
 */
function fragment$1(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }

  const parts = uri.split(REGEXP_URI_FRAGMENT);
  return parts[1];
}

/**
 * @name makePath
 * @type function
 * @description
 * Concat parts into single uri
 * @see https://tools.ietf.org/html/rfc3986#section-3
 * @param {array<string>} parts
 * @returns {string} uri
 */
function makePath$1(parts) {
  return parts
    .filter(part => typeof part === 'string')
    .reduce((uri, id) => {
      // if id is full replace uri
      if (!uri.length || isFullUri$1(id)) {
        return id;
      }
      if (!id) {
        return uri;
      }

      // if fragment found
      if (id.indexOf('#') === 0) {
        // should replace uri's sharp with id
        const sharpUriIndex = uri.indexOf('#');
        if (sharpUriIndex === -1) {
          return uri + id;
        }

        return uri.slice(0, sharpUriIndex) + id;
      }

      // get path part of uri
      // and replace the rest with id
      const partialUri = path(uri) + id;
      return partialUri + (partialUri.indexOf('#') === -1 ? '#' : '');
    }, '');
}

/**
 * @name normalize
 * @type {function}
 * @description
 * Replace json-pointer special symbols in a given uri.
 * @param {string} uri
 * @returns {string} normalizedUri
 */
function normalize$1(uri) {
  return decodeURIComponent(uri.replace(/~1/g, '/').replace(/~0/g, '~'));
}

var uri = {
  makePath: makePath$1,
  isFullUri: isFullUri$1,
  head: head$1,
  fragment: fragment$1,
  normalize: normalize$1,
  keys: keys$2,
};

/**
 * @module state
 * @description
 * State module is responsible for scope schemas resolution.
 * It also exports a main `generate` function.
 */

const { list: validators$1 } = validators$2;
const { body, restore: restore$1, template } = template_1;
const { hasProperty } = utils;
const {
  normalize,
  makePath,
  head,
  isFullUri,
  fragment,
  keys: keys$1,
} = uri;
const {
  is: isSchema,
  transform: transformSchema,
} = schema;

/* eslint-disable no-unused-vars */
function State$1(schema = {}, env) {
/* eslint-enable no-unused-vars */
  Object.assign(this, {
    context: [],
    entries: new Map(),
    env,
  });
}

/**
 * @name generate
 * @type {function}
 * @description
 * The main schema process function.
 * Available and used both in external and internal generation.
 * Saves the state for internal recursive calls.
 * @param {object} env - djv environment
 * @param {object} schema - to process
 * @param {State} state - saved state
 * @param {Environment} options
 * @returns {function} restoredFunction
 */
function generate$1(env, schema, state = new State$1(schema, env), options) {
  const tpl = template(state, options);
  tpl.visit(schema);

  const source = body(tpl, state, options);
  return restore$1(source, schema, options);
}

State$1.prototype = Object.assign(Object.create(Array.prototype), {
  /**
   * @name addEntry
   * @type {function}
   * @description
   * Generates an internal function.
   * Usually necessary for `allOf` types of validators.
   * Caches generated functions by schema object key.
   * Checks for an existing schema in a context stack to avoid double parsing and generation.
   * @param {string} url
   * @param {object} schema
   * @returns {number/boolean} index
   */
  addEntry(url, schema) {
    let entry = this.entries.get(schema);
    if (entry === false) {
      // has already been added to process queue
      // will be revealed as an entry
      return this.context.push(schema);
    }

    if (typeof entry === 'undefined') {
      // start to process schema
      this.entries.set(schema, false);
      entry = generate$1(this.env, schema, this, { inner: true });
      this.entries.set(schema, entry);
      this.revealReference(schema);
    }

    return this.context.push(entry);
  },
  /**
   * @name revealReference
   * @type {function}
   * @description
   * If a schema was added during the add entry phase
   * Then it should be revealed in this step
   * @param {object} schema
   * @returns {void}
   */
  revealReference(schema) {
    for (
      let doubled = this.context.indexOf(schema);
      doubled !== -1;
      doubled = this.context.indexOf(schema)
    ) {
      this.context[doubled] = this.context.length;
    }
  },
  /**
   * @name link
   * @type {function}
   * @description
   * Returns an entry's index in a context stack.
   * @param {string} url
   * @returns {string} entry
   */
  link(url) {
    const schema = this.resolve(url);
    const entry = this.addEntry(url, schema);
    return entry;
  },
  /**
   * @name resolveReference
   * @type {function}
   * @description
   * Resolve reference against the stack.
   * @param {string} reference
   * @returns {string} resolvedReference
   */
  resolveReference(reference) {
    if (isFullUri(reference)) {
      return reference;
    }

    // find last full URI schema
    let lastFullURIReference;
    let lastFullURISchemaIndex;

    for (let i = this.length - 1; i >= 0; i -= 1, lastFullURIReference = false) {
      const { [keys$1.id]: id, $ref } = this[i];
      lastFullURIReference = id || $ref;
      if (isFullUri(lastFullURIReference)) {
        lastFullURISchemaIndex = i;
        break;
      }
    }

    // collect all partial routes for it
    const partialReferences = [];
    for (let i = this.length - 1; i > lastFullURISchemaIndex; i -= 1) {
      const { [keys$1.id]: id, $ref } = this[i];
      const partialReference = id || $ref;
      if (head(partialReference)) {
        partialReferences.push(partialReference);
      }
    }

    // attach reference and make path
    const path = makePath([lastFullURIReference, ...partialReferences, reference]);
    return path;
  },
  /**
   * @name ascend
   * @private
   * @type {function}
   * @description
   * Search for a parent schema by reference.
   * Iterates over the chain of schemas.
   * @param {string} reference
   * @returns {object} parentSchema
   */
  ascend(reference) {
    const path = head(reference);
    let { schema: parentSchema = this[0] } = this.env.resolved[path] || {};

    // Search while it is a full schema, not a ref
    while (
      parentSchema.$ref &&
      // avoid infinite loop
      head(parentSchema.$ref) !== head(reference) &&
      // > All other properties in a "$ref" object MUST be ignored.
      // @see https://tools.ietf.org/html/draft-wright-json-schema-01#section-8
      Object.keys(parentSchema).length === 1
    ) {
      parentSchema = this.ascend(parentSchema.$ref);
    }

    return parentSchema;
  },
  /**
   * @name descend
   * @private
   * @type {function}
   * @description
   * Search for a child schema by reference.
   * Iterates over the chain of schemas.
   * @param {string} reference
   * @returns {object} currentSchema
   */
  descend(reference, parentSchema) {
    let uriFragment = fragment(reference);
    if (!uriFragment && isFullUri(reference)) {
      return parentSchema;
    }

    if (!uriFragment) {
      uriFragment = reference;
    }

    const parts = uriFragment.split('/');
    const currentSchema = parts
      .map(normalize)
      .reduce((schema, part, index) => {
        let subSchema = schema[part];
        if (!isSchema(subSchema)) {
          subSchema = schema.definitions && schema.definitions[part];
        }

        if (
          // last will be pushed on visit
          // @see /draft4/refRemote.json:http://localhost:1234/scope_change_defs2.json
          index !== parts.length - 1 &&
          hasProperty(subSchema, keys$1.id)
        ) {
          this.push(subSchema);
        }

        return subSchema;
      }, parentSchema);

    return isSchema(currentSchema) ? currentSchema : parentSchema;
  },
  /**
   * @name resolve
   * @type {function}
   * @description
   * Resolves schema by given reference and current registered context stack.
   * @param {string} url
   * @returns {object} schema
   */
  resolve(reference) {
    if (typeof reference !== 'string') {
      return reference;
    }

    const fullReference = this.resolveReference(reference);
    const parentSchema = this.ascend(fullReference);
    const subSchema = this.descend(reference, parentSchema);

    return subSchema;
  },
  /**
   * @name visit
   * @type {function}
   * @description
   * Calls each registered validator with given schema and template instance.
   * Validator may or may not add code to generated validator function.
   * @param {object} pseudoSchema
   * @param {object} tpl
   * @returns {void}
   */
  visit(pseudoSchema, tpl) {
    const schema = transformSchema(pseudoSchema);
    const initialLength = this.length;
    this.push(schema);

    validators$1.some(validator => (
      validator(schema, tpl)
    ));

    this.length = initialLength;
  },
});

var state = {
  State: State$1,
  generate: generate$1,
};

/**
 * @module environment
 * @description
 * Update the given environment
 */

const properties = properties$4;
const keywords = keywords$2;
const validators = validators$2;
const formats$1 = formats$3;
const { keys } = uri;
const { transformation } = schema;

const environmentConfig = {};

function add$1(version, config) {
  environmentConfig[version] = config;
}

function use$1(version) {
  if (!version || !environmentConfig[version]) {
    return;
  }

  const patchEnvironment = environmentConfig[version];
  patchEnvironment({
    properties,
    keywords,
    validators,
    formats: formats$1,
    keys,
    transformation,
  });
}

var environment = {
  add: add$1,
  use: use$1,
};

const { restore, expression } = template_1;
const formats = formats$3;
const { generate, State } = state;
const { add, use } = environment;

/**
 * Configuration for template
 * @typedef {object} DjvConfig
 * @property {string?} version - defines which version of json-schema draft to use,
 * draft-04 by default
 * @property {function?} versionConfigure - handler to apply for environment version
 * @property {boolean?} inner - a generating object should be considered as inner
 * Default value is false/undefined.
 * If true, then it avoid creating variables in a generated function body,
 * however without proper wrapper function approach will not work.
 * @see template/body, template/body
 * @property {object?} formats - an object containing list of formatters to add for environment
 * @property {function?} errorHandler - a handler to use for generating custom error messages
 */

/**
 * @name Environment
 * @description
 * Key constructor used for creating enivornment instance
 * @type {function} constructor
 * @param {DjvConfig} options passed to templater and utilities
 *
 * Usage
 *
 * ```javascript
 * const env = djv();
 * const env = new djv();
 * const env = new djv({ errorHandler: () => ';' });
 * ```
 */
function Environment(options = {}) {
  if (!(this instanceof Environment)) { return new Environment(options); }

  this.options = options;
  this.resolved = {};
  this.state = new State(null, this);

  this.useVersion(options.version, options.versionConfigure);
  this.addFormat(options.formats);
}

Object.assign(Environment, {
  expression,
});

Object.assign(Environment.prototype, {
  /**
   * check if object correspond to schema
   *
   * Usage
   *
   * ```javascript
   * env.validate('test#/common', { type: 'common' });
   * // => undefined
   *
   * env.validate('test#/common', { type: 'custom' });
   * // => 'required: data'
   *
   * @param {string} name
   * @param {object} object
   * @returns {string} error - undefined if it is valid
   */
  validate(name, object) {
    const foundSchema = this.resolve(name);
    return foundSchema.fn(object);
  },

  /**
   * add schema to djv environment
   *
   * Usage
   *
   * ```javascript
   * env.addSchema('test', jsonSchema);
   * ```
   *
   * @param {string?} name
   * @param {object} schema
   * @param {object} schema
   * @returns {resolved}
   */
  addSchema(name, schema) {
    const realSchema = typeof name === 'object' ? name : schema;
    const resolved = {
      schema: realSchema,
      fn: generate(this, realSchema, undefined, this.options),
    };

    [name, schema.id]
      .filter(id => typeof id === 'string')
      .forEach((id) => {
        this.resolved[id] = Object.assign({ name: id }, resolved);
      });

    return resolved;
  },

  /**
   * removes a schema or the whole structure from djv environment
   *
   * Usage
   *
   * ```javascript
   * env.removeSchema('test');
   * ```
   *
   * @param {string} name
   */
  removeSchema(name) {
    if (name) {
      delete this.resolved[name];
    } else {
      this.resolved = {};
    }
  },

  /**
   * resolves name by existing environment
   *
   * Usage
   *
   * ```javascript
   * env.resolve('test');
   * // => { name: 'test', schema: {} }, fn: ... }
   * ```
   *
   * @param {string} name
   * @returns {resolved}
   */
  resolve(name) {
    if (typeof name === 'object' || !this.resolved[name]) {
      return this.addSchema(
        name,
        this.state.resolve(name)
      );
    }

    return this.resolved[name];
  },

  /**
   * exports the whole structure object from environment or by resolved name
   *
   * Usage
   *
   * ```javascript
   * env.export();
   * // => { test: { name: 'test', schema: {}, ... } }
   * ```
   *
   * @param {string} name
   * @returns {serializedInternalState}
   */
  export(name) {
    let resolved;
    if (name) {
      resolved = this.resolve(name);
      resolved = {
        name,
        schema: resolved.schema,
        fn: resolved.fn.toString()
      };
    } else {
      resolved = {};
      Object.keys(this.resolved).forEach((key) => {
        resolved[key] = {
          name: key,
          schema: this.resolved[key].schema,
          fn: this.resolved[key].fn.toString()
        };
      });
    }

    return JSON.stringify(resolved);
  },

  /**
   * imports all found structure objects to internal environment structure
   * Usage
   *
   * ```javascript
   * env.import(config);
   * ```
   *
   * @param {object} config - internal structure or only resolved schema object
   */
  import(config) {
    const item = JSON.parse(config);
    let restoreData = item;
    if (item.name && item.fn && item.schema) {
      restoreData = { [item.name]: item };
    }

    Object.keys(restoreData).forEach((key) => {
      const { name, schema, fn: source } = restoreData[key];
      const fn = restore(source, schema, this.options);
      this.resolved[name] = { name, schema, fn };
    });
  },

  /**
   * @name addFormat
   * @type function
   * @description
   * Add formatter to djv environment.
   * When a string is passed it is interpreted as an expression which
   * when returns `true` goes with an error, when returns `false` then a property is valid.
   * When a function is passed it will be executed during schema compilation
   * with a current schema and template helper arguments.
   * @see utils/formats
   *
   * Usage
   *
   * ```javascript
   * env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
   * // or
   * env.addFormat('isOk', function(schema, tpl){
   *   return `!${schema.isOk} || %s !== %s.toUpperCase()`;
   * });
   * ```
   *
   * @param {string/object?} name
   * @param {string/function} formatter
   */
  addFormat(name, formatter) {
    if (typeof name === 'string') {
      formats[name] = formatter;
      return;
    }

    if (typeof name === 'object') {
      Object.assign(formats, name);
    }
  },

  /**
   * @name setErrorHandler
   * @type function
   * @description
   * Specify custom error handler which will be used in generated functions when problem found.
   * The function should return a string expression, which will be executed when generated
   * validator function is executed. The simpliest use case is the default one
   * @see template/defaultErrorHandler
   * ```javascript
   *  function defaultErrorHandler(errorType) {
   *    return `return "${errorType}: ${tpl.data}";`;
   *  }
   * ```
   * It returns an expression 'return ...', so the output is an error string.
   * Usage
   * ```javascript
   * djv({ errorHandler: () => 'return { error: true };' }) // => returns an object
   * djv({
   *  errorHandler: function customErrorHandler(errorType, property) {
   *    return `errors.push({
   *      type: "${errorType}",
   *      schema: "${this.schema[this.schema.length - 1]}",
   *      data: "${this.data[this.data.length - 1]}"
   *    });`;
   *  }
   * });
   * ```
   * When a custom error handler is used, the template body function adds a `error` variable inside
   * a generated validator, which can be used to put error information. `errorType` is always
   * passed to error handler function. Some validate utilities put extra argument, like f.e.
   * currently processed property value. Inside the handler context is a templater instance,
   * which contains `this.schema`, `this.data` paths arrays to identify validator position.
   * @see test/index/setErrorHandler for more examples
   * @param {function} errorHandler - a function called each time compiler creates an error branch
   * @returns void
   */
  setErrorHandler(errorHandler) {
    Object.assign(this.options, { errorHandler });
  },
  /**
  * @name useVersion
  * @type {function}
  * @description
  * Add a specification version for environment
  * A configure function is called with exposed environments, like keys, formats, etc.
  * Updates internals utilities and configurations to fix versions implementation conflicts
  * @param {string} version of json-schema specification to use
  * @param {function} configure
  * @returns void
  */
  useVersion(version, configure) {
    if (typeof configure !== 'function' && version === 'draft-04') {
      /* eslint-disable no-param-reassign, global-require, import/no-extraneous-dependencies */
      configure = requireDjvDraft04();
      /* eslint-enable no-param-reassign, global-require, import/no-extraneous-dependencies */
    }
    if (typeof configure === 'function') {
      add(version, configure);
    }
    use(version);
  },
});

var djv = Environment;

var djv$1 = /*@__PURE__*/getDefaultExportFromCjs(djv);

export { djv$1 as d };
//# sourceMappingURL=djv.js.map
