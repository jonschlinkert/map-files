'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var globby = require('globby');
var mm = require('micromatch');

/**
 * Expose `mapFiles`
 */

module.exports = mapFiles;

/**
 * Return an object for all files matching the given `patterns`
 * and `opts`. By default the full filepath of the file is used
 * as the key, but this can be changed by passing a `name` function
 * on the options.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or the following:
 *     @option {Boolean} [opts] `cache` If true, results will be cached in memory so that subsequent lookups for the same cwd and patterns don't repeatedly hit the file system.
 *     @option {Function} [opts] `glob`: Custom glob function. Default is globby.
 *     @option {Function} [opts] `read`: Custom read function. Default is `fs.readFileSync`
 *     @option {Function} [opts] `name`: Custom name function for renaming object keys. Default is the asename of the file, excluding extension.
 * @return {Object}
 * @api public
 */

function mapFiles(patterns, opts) {
  opts = opts || {};
  opts.cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
  var files = without(glob(patterns, opts), opts.ignored || []);

  if (opts.cache === true) {
    var fn = memo('files', opts.cwd, patterns, reduce);
    return fn(files, opts);
  }
  return reduce(files, opts);
}

/**
 * Expose results cache.
 */

var cache = mapFiles.cache = {};

function reduce(files, opts) {
  return files.reduce(function (acc, fp) {
    fp = path.resolve(opts.cwd, fp);
    var key = name(fp, acc, opts);
    var str = read(fp, acc, opts);
    acc[key] = str;
    return acc;
  }, {});
}

/**
 * Default glob function
 */

function glob(patterns, opts) {
  opts = opts || {};
  if (typeof opts.glob === 'function') {
    return opts.glob(patterns, opts);
  }
  if (opts.cache === true) {
    var fn = memo('glob', opts.cwd, patterns, globby.sync);
    return fn(patterns, opts);
  }
  return globby.sync(patterns, opts);
}

/**
 * Default renaming function
 */

function name(fp, acc, opts) {
  var fn = opts && (opts.name || opts.renameKey);
  if (typeof fn === 'function') {
    return fn(fp, acc, opts);
  }
  var ext = path.extname(fp);
  return path.basename(fp, ext);
}

/**
 * Default read function
 */

function read(fp, acc, opts) {
  fp = path.resolve(fp);
  opts = opts || {};
  if (typeof opts.read === 'function') {
    return opts.read(fp, acc, opts);
  }
  var res = {};
  res.content = fs.readFileSync(fp, 'utf8');
  res.path = fp;
  return res;
}

/**
 * Files cache.
 */

function memo(name, cwd, patterns, fn) {
  var key = name + ':' + cwd + '/' + patterns;
  return function () {
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }
    return (cache[key] = fn.apply(fn, arguments));
  };
}

/**
 * Returns an array of file paths excluding
 * files that match the given glob patterns.
 */

function without(files, patterns) {
  var len = files.length, res = [];
  while (len--) {
    var fp = files[len];
    if (mm.any(fp, patterns)) {
      continue;
    }
    res.push(fp);
  }
  return res;
}
