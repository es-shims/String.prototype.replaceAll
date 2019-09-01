'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimReplaceAll() {
	var polyfill = getPolyfill();
	define(
		String.prototype,
		{ replaceAll: polyfill },
		{ replaceAll: function () { return String.prototype.replaceAll !== polyfill; } }
	);
	return polyfill;
};
