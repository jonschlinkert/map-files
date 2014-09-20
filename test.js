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
var mapFiles = require('./');

describe('mapFiles', function () {
  it('should map files', function () {
    var actual = mapFiles('fixtures/**/*.txt');

    actual.should.eql({
      'fixtures/a.txt': { name: 'a', contents: 'This is file a.txt.' },
      'fixtures/b.txt': { name: 'b', contents: 'This is file b.txt.' },
      'fixtures/c.txt': { name: 'c', contents: 'This is file c.txt.' }
    });
  });

  it('should use a custom parse function.', function () {
    var actual = mapFiles('fixtures/**/*.js', {
      parse: function (filepath) {
        return {
          path: filepath,
          fn: require(path.resolve(filepath))
        }
      }
    });

    actual.should.have.property('fixtures/a.js');
    actual.should.have.property('fixtures/b.js');
    actual.should.have.property('fixtures/c.js');
    actual['fixtures/a.js'].path.should.equal('fixtures/a.js');
    actual['fixtures/a.js'].fn.should.be.an.object;
    actual['fixtures/a.js'].fn.foo.should.be.a.function;
  });

  it('should use a custom rename function.', function () {
    var actual = mapFiles('fixtures/**/*.txt', {
      rename: function (filepath) {
        return path.basename(filepath);
      }
    });

    actual.should.eql({
      'a.txt': { name: 'a', contents: 'This is file a.txt.' },
      'b.txt': { name: 'b', contents: 'This is file b.txt.' },
      'c.txt': { name: 'c', contents: 'This is file c.txt.' }
    });
  });
});