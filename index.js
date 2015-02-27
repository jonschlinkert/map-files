'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var globby = require('globby');

/**
 * Return an object for all files matching the given `patterns`
 * and `opts`. The full filepath of the file is used as the key.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parse` or `name`.
 * @return {Object}
 * @api public
 */

module.exports = function mapFiles(patterns, opts) {
  var files = glob(patterns, opts);
  var cwd = opts && opts.cwd || process.cwd();

  return files.reduce(function (acc, fp) {
    fp = path.resolve(cwd, fp);
    var key = name(fp, acc, opts);
    var str = read(fp, acc, opts);

    acc[key] = str;
    return acc;
  }, {});
};

function glob(patterns, opts) {
  if (opts && opts.glob) {
    return opts.glob(patterns, opts);
  }
  return globby.sync(patterns, opts);
}

function name(fp, acc, opts) {
  if (opts && opts.name) {
    return opts.name(fp, acc, opts);
  }
  var ext = path.extname(fp);
  return path.basename(fp, ext);
}

function read(fp, acc, opts) {
  fp = path.resolve(fp);

  if (opts && opts.read) {
    return opts.read(fp, acc, opts);
  }

  var res = {};
  res.content = fs.readFileSync(fp, 'utf8');
  res.path = fp;
  return res;
}
