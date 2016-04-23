'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

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
 * @param  {String} `patterns` Glob patterns to pass to [matched][]
 * @param  {Object} `opts` Options for [matched][], or the following:
 *     @option {Boolean} [opts] `cache` If true, results will be cached in memory so that subsequent lookups for the same cwd and patterns don't repeatedly hit the file system.
 *     @option {Function} [opts] `glob`: Custom glob function. Default is [matched][].
 *     @option {Function} [opts] `read`: Custom read function. Default is `fs.readFileSync`
 *     @option {Function} [opts] `name`: Custom name function for renaming object keys. Default is the asename of the file, excluding extension.
 * @return {Object}
 * @api public
 */

function mapFiles(patterns, options) {
  var opts = utils.extend({cwd: process.cwd()}, options);
  var files = utils.glob.sync(patterns, opts);

  return files.reduce(function(acc, filepath) {
    var file = createFile(filepath, opts);
    file.key = renameKey(file, opts);
    acc[file.key] = file;
    return acc;
  }, {});
}

function define(file, key, fn) {
  var cached;
  Object.defineProperty(file, key, {
    configurable: true,
    enumerable: true,
    set: function(val) {
      cached = val;
    },
    get: function() {
      return cached || (cached = fn.call(file, file));
    }
  });
}

function createFile(filepath, options) {
  filepath = path.resolve(options.cwd, filepath);
  var file = new utils.Vinyl({path: filepath, cwd: options.cwd});

  define(file, 'contents', function() {
    return new Buffer(fs.readFileSync(this.path, 'utf8'));
  });

  define(file, 'content', function() {
    return this.contents.toString();
  });

  define(file, 'json', function() {
    return parseJson(this, options);
  });

  define(file, 'fn', function() {
    return requireFile(this, options);
  });

  if (utils.isObject(options.decorate)) {
    for (var key in options.decorate) {
      define(file, key, function() {
        return options.decorate[key](this, options);
      });
    }
  }
  return file;
}

/**
 * Default renaming function
 */

function renameKey(file, options) {
  if (typeof options.renameKey === 'string') {
    return file[options.renameKey];
  }

  return typeof options.renameKey === 'function'
    ? options.renameKey(file, options)
    : file.relative;
}

/**
 * Require a javascript file
 */

function requireFile(file) {
  return file.extname === '.js'
    ? require(file.path)
    : null;
}

/**
 * Parse a JSON file
 */

function parseJson(file) {
  return file.extname === '.json'
    ? JSON.parse(file.contents.toString())
    : {};
}
