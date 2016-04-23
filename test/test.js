/*!
 * map-files <https://github.com/jonschlinkert/map-files>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var extend = require('extend-shallow');
var relative = require('relative');
var glob = require('matched');
var yaml = require('js-yaml');
var mapFiles = require('..');

describe('files', function() {
  it('should load files from a glob pattern.', function() {
    var actual = mapFiles('test/fixtures/*.txt');
    assert(actual.hasOwnProperty('test/fixtures/a.txt'));
    assert(actual.hasOwnProperty('test/fixtures/b.txt'));
    assert(actual.hasOwnProperty('test/fixtures/c.txt'));

    assert.equal(actual['test/fixtures/a.txt'].contents.toString(), 'AAA');
    assert.equal(actual['test/fixtures/a.txt'].content, 'AAA');
    assert.equal(actual['test/fixtures/b.txt'].contents.toString(), 'BBB');
    assert.equal(actual['test/fixtures/b.txt'].content, 'BBB');
    assert.equal(actual['test/fixtures/c.txt'].contents.toString(), 'CCC');
    assert.equal(actual['test/fixtures/c.txt'].content, 'CCC');
  });

  it('should ignore files passed on the `ignore` option:', function() {
    var actual = mapFiles('test/fixtures/*.txt', {
      ignore: ['**/a.txt'],
      renameKey: function(file) {
        return file.stem;
      }
    });

    // not
    assert(!actual.hasOwnProperty('a'));
    // should
    assert(actual.hasOwnProperty('b'));
    assert(actual.hasOwnProperty('c'));
    assert.equal(actual.b.contents.toString(), 'BBB');
    assert.equal(actual.b.content, 'BBB');
    assert.equal(actual.c.contents.toString(), 'CCC');
    assert.equal(actual.c.content, 'CCC');
  });

  it('should use a cwd.', function() {
    var actual = mapFiles('*.txt', {
      cwd: 'test/fixtures',
      renameKey: function(file) {
        return file.stem;
      }
    });

    assert(actual.hasOwnProperty('a'));
    assert(actual.hasOwnProperty('b'));
    assert(actual.hasOwnProperty('c'));
    assert.equal(actual.a.contents.toString(), 'AAA');
    assert.equal(actual.a.content, 'AAA');
    assert.equal(actual.b.contents.toString(), 'BBB');
    assert.equal(actual.b.content, 'BBB');
    assert.equal(actual.c.contents.toString(), 'CCC');
    assert.equal(actual.c.content, 'CCC');
  });

  it('should rename the key with a custom function.', function() {
    var actual = mapFiles('test/fixtures/*.txt', {
      renameKey: function(file) {
        return file.basename;
      }
    })
    assert(actual.hasOwnProperty('a.txt'));
    assert(actual.hasOwnProperty('b.txt'));
    assert(actual.hasOwnProperty('c.txt'));
  });

  it('should parse file.contents with a custom function.', function() {
    var actual = mapFiles('test/fixtures/*.txt', {
      decorate: {
        yaml: function(file, options) {
          return yaml.load(file.path);
        }
      }
    });

    assert(actual.hasOwnProperty('test/fixtures/a.txt'));
    assert(actual.hasOwnProperty('test/fixtures/b.txt'));
    assert(actual.hasOwnProperty('test/fixtures/c.txt'));
    assert.equal(actual['test/fixtures/a.txt'].contents.toString(), 'AAA');
  });

  it('should require files with a custom function.', function() {
    var actual = mapFiles('test/fixtures/*.js', {
      renameKey: function(file) {
        return file.stem;
      },
      decorate: {
        helper: function(file) {
          return require(file.path);
        }
      }
    });

    assert(actual.hasOwnProperty('a'));
    assert(actual.hasOwnProperty('b'));
    assert(actual.hasOwnProperty('c'));
    assert.equal(actual['a'].path, path.resolve('test/fixtures/a.js'));
    assert.equal(typeof actual['a'].helper, 'function');
  });

  it('should use multiple custom functions.', function() {
    var actual = mapFiles('test/fixtures/*.yml', {
      rename: function(file) {
        return file.relative;
      },
      decorate: {
        yaml: function(file, options) {
          return yaml.load(file.content);
        },
        foo: function(file, options) {
          return yaml.load(file.content);
        }
      }
    });

    assert(actual.hasOwnProperty('test/fixtures/a.yml'));
    assert(actual.hasOwnProperty('test/fixtures/b.yml'));
    assert(actual.hasOwnProperty('test/fixtures/c.yml'));

    assert.equal(actual['test/fixtures/a.yml'].content, 'title: AAA\n');
    assert.equal(actual['test/fixtures/b.yml'].content, 'title: BBB\n');
    assert.equal(actual['test/fixtures/c.yml'].content, 'title: CCC\n');

    assert.deepEqual(actual['test/fixtures/a.yml'].yaml, {title: 'AAA'});
    assert.deepEqual(actual['test/fixtures/b.yml'].yaml, {title: 'BBB'});
    assert.deepEqual(actual['test/fixtures/c.yml'].yaml, {title: 'CCC'});

    assert.deepEqual(actual['test/fixtures/a.yml'].foo, {title: 'AAA'});
    assert.deepEqual(actual['test/fixtures/b.yml'].foo, {title: 'BBB'});
    assert.deepEqual(actual['test/fixtures/c.yml'].foo, {title: 'CCC'});
  });

  it('readme example #2.', function() {
    var actual = mapFiles('test/fixtures/*.js', {
      renameKey: function(file) {
        return file.stem;
      }
    });

    //=> { a: [Function: foo], b: [Function: bar], c: [Function: baz] }
    assert.equal(typeof actual.a.fn, 'function');
    assert.equal(typeof actual.b.fn, 'function');
    assert.equal(typeof actual.c.fn, 'function');
  });
});
