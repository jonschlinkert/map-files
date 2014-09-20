'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var glob = require('globby');


/**
 * Default renaming function, returns the
 * basename of the file.
 *
 * ```js
 * renameFn('foo/bar/baz.txt')
 * //=> 'baz'
 * ```
 *
 * @param  {String} `filepath`
 * @param  {Object} `opts`
 * @return {String}
 * @api private
 */

function renameFn(filepath, opts) {
  if (opts.renameFn) {
    return opts.renameFn(filepath, opts);
  }
  return path.basename(filepath, path.extname(filepath));
}


/**
 * Default parsing function, returns an object
 * with the following properties:
 *
 *   - `path` {String}: the absolute file path
 *   - `contents` {String}: the file's contents
 *
 * ```js
 * parseFn('foo/bar/baz.txt')
 * //=> {path: "foo/bar/baz.txt", contents: "This is the file's contents!"}
 * ```
 *
 * @param  {String} `filepath`
 * @param  {Object} `opts`
 * @return {String}
 * @api private
 */

function parseFn(filepath, opts) {
  if (opts.parseFn) {
    return opts.parseFn(filepath, opts);
  }
  var str = fs.readFileSync(filepath, 'utf8');
  return {path: filepath, contents: str};
}


/**
 * Return an object for all files matching the
 * given `patterns` and `options`. The basename
 * of the file is used as the key.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parseFn` or `renameFn`.
 * @return {Object}
 * @api public
 */

function mapFiles(patterns, opts) {
  var files = glob.sync(patterns, opts);
  opts = opts || {};

  return files.reduce(function (acc, filepath) {
    var name = renameFn(filepath, opts);
    var file = parseFn(filepath, opts);
    acc[name] = file;
    return acc;
  }, {});
}


/**
 * Expose `mapFiles`
 */

module.exports = mapFiles;