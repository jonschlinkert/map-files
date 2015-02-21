'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var relative = require('relative');

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
  var files = glob(patterns, options);
  var cwd = options && options.cwd || process.cwd();

  return files.reduce(function (cache, filepath) {
    filepath = relative(path.resolve(cwd, filepath));
    var key = name(filepath, cache, options);
    var str = read(filepath, cache, options);

    cache[key] = str;
    return cache;
  }, {});
};

function glob(patterns, options) {
  if (options && options.glob) {
    return options.glob(patterns, options);
  }
  var globby = require('globby');
  return globby.sync(patterns, options);
}

function name(filepath, cache, options) {
  if (options && options.name) {
    return options.name(filepath, cache, options);
  }
  var ext = path.extname(filepath);
  return path.basename(filepath, ext);
}

function read(filepath, cache, options) {
  if (options && options.read) {
    return options.read(filepath, cache, options);
  }
  var str = fs.readFileSync(filepath, 'utf8');
  return {path: filepath, content: str};
}
