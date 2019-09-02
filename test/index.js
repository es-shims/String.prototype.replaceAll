'use strict';

var replaceAllShim = require('../');
var test = require('tape');

var runTests = require('./tests');

test('as a function', function (t) {
	runTests(replaceAllShim, t);

	t.end();
});
