'use strict';

require('es5-shim');
require('es6-shim');
require('../auto');

var test = require('tape');
var defineProperties = require('define-properties');
var callBind = require('call-bind');

var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();

var runTests = require('./tests');

test('shimmed', function (t) {
	t.equal(String.prototype.replaceAll.length, 2, 'String#replaceAll has a length of 2');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(String.prototype.replaceAll.name, 'replaceAll', 'String#replaceAll has name "replaceAll"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(String.prototype, 'replaceAll'), 'String#replaceAll is not enumerable');
		et.end();
	});

	runTests(
		callBind(String.prototype.replaceAll),
		t
	);

	t.end();
});
