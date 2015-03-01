/*!
 * map-files <https://github.com/jonschlinkert/map-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var matter = require('gray-matter');
var extend = require('extend-shallow');
var relative = require('relative');
var glob = require('globby');
var mapFiles = require('..');
require('should');

function files(patterns, opts) {
  var o = {};
  o.name = function (fp) {
    return path.basename(fp, path.extname(fp));
  };
  o.read = function (fp) {
    var res = {};
    res.content = fs.readFileSync(fp, 'utf8');
    res.path = relative(fp);
    return res;
  };
  opts = extend({}, o, opts);
  var res = mapFiles(patterns, opts);
  return res;
};

describe('files', function () {
  it('should cache files when `opts.cache` is true.', function () {
    var res = files('test/fixtures/*.txt', {cache: true});
    mapFiles.should.have.property('cache');
    mapFiles.cache.should.have.property('glob:' + path.resolve('test/fixtures/*.txt'));
    mapFiles.cache.should.have.property('files:' + path.resolve('test/fixtures/*.txt'));
    res.should.have.property('a');
    res.should.have.property('b');
    res.should.have.property('c');
    res.should.eql({
      a: { content: 'AAA', path: 'test/fixtures/a.txt' },
      b: { content: 'BBB', path: 'test/fixtures/b.txt' },
      c: { content: 'CCC', path: 'test/fixtures/c.txt' }
    });
  });

  // it('should load files from a glob pattern.', function () {
  //   var cache = files('test/fixtures/*.txt');

  //   cache.should.have.property('a');
  //   cache.should.have.property('b');
  //   cache.should.have.property('c');
  //   cache.should.eql({
  //     a: { content: 'AAA', path: 'test/fixtures/a.txt' },
  //     b: { content: 'BBB', path: 'test/fixtures/b.txt' },
  //     c: { content: 'CCC', path: 'test/fixtures/c.txt' }
  //   });
  // });

  // it('should use a cwd.', function () {
  //   var cache = files('*.txt', {cwd: 'test/fixtures'});

  //   cache.should.have.property('a');
  //   cache.should.have.property('b');
  //   cache.should.have.property('c');
  //   cache.should.eql({
  //     a: { content: 'AAA', path: 'test/fixtures/a.txt' },
  //     b: { content: 'BBB', path: 'test/fixtures/b.txt' },
  //     c: { content: 'CCC', path: 'test/fixtures/c.txt' }
  //   });
  // });

  // it('should rename the key with a custom function.', function () {
  //   var cache = files('test/fixtures/*.txt', {
  //     name: function(filepath) {
  //       return relative(filepath);
  //     }
  //   })
  //   cache.should.have.property('test/fixtures/a.txt');
  //   cache.should.have.property('test/fixtures/b.txt');
  //   cache.should.have.property('test/fixtures/c.txt');
  // });

  // it('should read files with a custom function.', function () {
  //   var cache = files('test/fixtures/*.txt', {
  //     read: function(filepath) {
  //       var res = matter.read(filepath);
  //       res.path = relative(res.path);
  //       return res;
  //     }
  //   });
  //   cache.should.have.property('a', { data: {}, content: 'AAA', orig: 'AAA', path: 'test/fixtures/a.txt' });
  //   cache.should.have.property('b', { data: {}, content: 'BBB', orig: 'BBB', path: 'test/fixtures/b.txt' });
  //   cache.should.have.property('c', { data: {}, content: 'CCC', orig: 'CCC', path: 'test/fixtures/c.txt' });
  // });

  // it('should require files with a custom function.', function () {
  //   var cache = files('test/fixtures/*.js', {
  //     read: function (filepath) {
  //       return {
  //         path: relative(filepath),
  //         helper: require(path.resolve(filepath))
  //       }
  //     }
  //   });
  //   cache.should.have.property('a');
  //   cache.should.have.property('b');
  //   cache.should.have.property('c');
  //   cache['a'].path.should.equal('test/fixtures/a.js');
  //   cache['a'].helper.should.be.an.object;
  //   cache['a'].helper.should.be.a.function;
  // });

  // it('should use multiple custom functions.', function () {
  //   var cache = files('test/fixtures/*.txt', {
  //     read: function(filepath) {
  //       var res = matter.read(filepath);
  //       res.path = relative(res.path);
  //       return res;
  //     },
  //     name: function(filepath) {
  //       return relative(filepath);
  //     }
  //   });
  //   cache.should.have.property('test/fixtures/a.txt', { data: {}, content: 'AAA', orig: 'AAA', path: 'test/fixtures/a.txt' });
  //   cache.should.have.property('test/fixtures/b.txt', { data: {}, content: 'BBB', orig: 'BBB', path: 'test/fixtures/b.txt' });
  //   cache.should.have.property('test/fixtures/c.txt', { data: {}, content: 'CCC', orig: 'CCC', path: 'test/fixtures/c.txt' });
  // });

  // it('readme example #2.', function () {
  //   var cache = files('test/fixtures/*.js', {
  //     read: function (fp) {
  //       return require(path.resolve(fp));
  //     }
  //   });
  //   // console.log(cache);
  // });
});
