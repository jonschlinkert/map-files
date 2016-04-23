# map-files [![NPM version](https://img.shields.io/npm/v/map-files.svg?style=flat)](https://www.npmjs.com/package/map-files) [![Build Status](https://img.shields.io/travis/jonschlinkert/map-files.svg?style=flat)](https://travis-ci.org/jonschlinkert/map-files)

> Return an object for a glob of files. Pass a `rename` function for the keys, or a `parse` function for the content, allowing it to be used for readable or require-able files.

As of v0.5.0, map-files returns absolute file paths by default. You can achieve the same results by using a custom `name` function as in the [examples](#options-name).

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install map-files --save
```

## Usage

```js
var files = require('map-files');
console.log(files('templates/*.txt'));
```
Returns an object that looks something like:

```js
{ a: { content: 'AAA', path: 'templates/a.txt' },
  b: { content: 'BBB', path: 'templates/b.txt' },
  c: { content: 'CCC', path: 'templates/c.txt' }}
```

### options.cache

Type: `Boolean`

Default: `false`

If `true`, results will be cached in memory so that subsequent lookups for the same cwd and patterns don't repeatedly hit the file system.

### options.cwd

Type: `String`

Default: `process.cwd()`

Specify the current working directory

```js
files('*.txt', {cwd: 'templates'});
```

### options.name

Type: `Function`

Default: `path.basename(fp, path.extname(fp))`

Rename the key of each file object:

```js
var templates = files('templates/*.txt', {
  name: function (filepath) {
    return path.basename(filepath);
  }
});
```
Returns something like:

```js
{ 'a.txt': { content: 'AAA', path: 'templates/a.txt' },
  'b.txt': { content: 'BBB', path: 'templates/b.txt' },
  'c.txt': { content: 'CCC', path: 'templates/c.txt' }}
```

### options.read

> Pass a custom `read` function to change the object returned for each file.

Type: `Function`

Default: `fs.readFileSync()`

The default function reads files and returns a string, but you can do anything
you want with the function, like `require` files:

```js
var helpers = files('helpers/*.js', {
  read: function (fp) {
    return require(path.resolve(fp));
  }
});
//=> { a: [Function: foo], b: [Function: bar], c: [Function: baz] }
```

## Other files libs
* [export-files](https://www.npmjs.com/package/export-files): node.js utility for exporting a directory of files as modules. | [homepage](https://github.com/jonschlinkert/export-files)
* [file-reader](https://www.npmjs.com/package/file-reader): Read a glob of files, dynamically choosing the reader or requiring the files based on… [more](https://www.npmjs.com/package/file-reader) | [homepage](https://github.com/jonschlinkert/file-reader)
* [filter-files](https://www.npmjs.com/package/filter-files): Recursively read directories and return a list of files, filtered to have only the files… [more](https://www.npmjs.com/package/filter-files) | [homepage](https://github.com/jonschlinkert/filter-files)
* [micromatch](https://www.npmjs.com/package/micromatch): Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch. | [homepage](https://github.com/jonschlinkert/micromatch)

## Running tests
Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/map-files/issues/new).

## Author
**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/map-files/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on April 23, 2016._

[globby]: https://github.com/sindresorhus/globby
