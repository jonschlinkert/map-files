/*!
 * map-files <https://github.com/jonschlinkert/map-files>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var mapFiles = require('..');

describe('mapFiles', function () {
  it('should map files', function () {
    var actual = mapFiles('test/fixtures/**/*.txt');
    actual.should.be.an.object;
    actual.should.have.property('a');
    actual.should.have.property('b');
    actual.should.have.property('c');
    actual.a.path.should.equal('test/fixtures/a.txt');
    actual.a.contents.should.be.a.string;
  });

  it('should use a custom parse function.', function () {
    var actual = mapFiles('test/fixtures/**/*.js', {
      parseFn: function (filepath) {
        return {
          path: filepath,
          fn: require(path.resolve(filepath))
        }
      }
    });

    actual.should.be.an.object;
    actual.should.have.property('a');
    actual.should.have.property('b');
    actual.should.have.property('c');
    actual.a.path.should.equal('test/fixtures/a.js');
    actual.a.fn.should.be.an.object;
    actual.a.fn.foo.should.be.a.function;
  });

  it('should use a custom rename function.', function () {
    var actual = mapFiles('test/fixtures/**/*.txt', {
      renameFn: function (filepath) {
        return path.basename(filepath);
      }
    });

    actual.should.be.an.object;
    actual.should.have.property('a.txt');
    actual.should.have.property('b.txt');
    actual.should.have.property('c.txt');
    actual['a.txt'].path.should.equal('test/fixtures/a.txt');
  });
});