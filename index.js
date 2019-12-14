'use strict';

var callBind = require('es-abstract/helpers/callBind');
var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var boundReplaceAll = callBind(implementation);

define(boundReplaceAll, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundReplaceAll;
