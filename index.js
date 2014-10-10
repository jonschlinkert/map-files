'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var glob = require('globby');

/**
 * Return an object for all files matching the given `patterns`
 * and `options`. The full filepath of the file is used as the key.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parse` or `name`.
 * @return {Object}
 * @api public
 */

module.exports = function mapFiles(patterns, options) {
  var files = glob.sync(patterns, options);

  return files.reduce(function (cache, filepath) {
    var key = name(filepath, options);
    var str = read(filepath, options);

    cache[key] = str;
    return cache;
  }, {});
};

function name(filepath, options) {
  if (options && options.name) {
    return options.name(filepath, options);
  }
  var ext = path.extname(filepath);
  return path.basename(filepath, ext);
}

function read(filepath, options) {
  if (options && options.read) {
    return options.read(filepath, options);
  }
  var str = fs.readFileSync(filepath, 'utf8');
  return {path: filepath, content: str};
}
