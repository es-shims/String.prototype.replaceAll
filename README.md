# string.prototype.replaceall <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

ES Proposal spec-compliant shim for String.prototype.replaceAll. Invoke its "shim" method to shim `String.prototype.replaceAll` if it is unavailable or noncompliant.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment, and complies with the [proposed spec](https://github.com/tc39/proposal-string-replaceall).

Most common usage:
```js
const assert = require('assert');
const replaceAll = require('string.prototype.replaceall');

const str = 'aabc';

// replaceAll and replace are the same, when given a global regex to replace
assert.equal(replaceAll(str, /a/g, 'z'), str.replace(/a/g, 'z'));

// replace, with a string, replaces once
assert.equal(str.replace('a', 'z'), 'zabc');

// replaceAll, with a string, replaces all
assert.equal(replaceAll(str, 'a', 'z'), 'zzbc');

replaceAll.shim(); // will be a no-op if not needed

// replaceAll and replace are the same, when given a global regex to replace
assert.equal(str.replaceAll(/a/g, 'z'), str.replace(/a/g, 'z'));

// replace, with a string, replaces once
assert.equal(str.replace('a', 'z'), 'zabc');

// replaceAll, with a string, replaces all
assert.equal(str.replaceAll('a', 'z'), 'zzbc');
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.com/package/string.prototype.replaceall
[npm-version-svg]: http://versionbadg.es/es-shims/String.prototype.replaceAll.svg
[travis-svg]: https://travis-ci.org/es-shims/String.prototype.replaceAll.svg
[travis-url]: https://travis-ci.org/es-shims/String.prototype.replaceAll
[deps-svg]: https://david-dm.org/es-shims/String.prototype.replaceAll.svg
[deps-url]: https://david-dm.org/es-shims/String.prototype.replaceAll
[dev-deps-svg]: https://david-dm.org/es-shims/String.prototype.replaceAll/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/String.prototype.replaceAll#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/string.prototype.replaceall.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/string.prototype.replaceall.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/string.prototype.replaceall.svg
[downloads-url]: http://npm-stat.com/charts.html?package=string.prototype.replaceall
