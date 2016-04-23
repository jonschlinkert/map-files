'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('matched', 'glob');
require('vinyl', 'Vinyl');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
