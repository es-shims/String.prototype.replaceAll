'use strict';

var test = require('tape');
var callBind = require('call-bind');
var functionsHaveNames = require('functions-have-names')();

var implementation = require('../implementation');
var runTests = require('./tests');

test('implementation', function (t) {
	t.equal(implementation.length, 2, 'implementation has a length of 2');

	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(implementation.name, 'replaceAll', 'implementation has name "replaceAll"');
		st.end();
	});

	runTests(callBind(implementation), t);

	t.end();
});
