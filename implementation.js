'use strict';

var Call = require('es-abstract/2024/Call');
var GetMethod = require('es-abstract/2024/GetMethod');
var GetSubstitution = require('es-abstract/2024/GetSubstitution');
var IsCallable = require('es-abstract/2024/IsCallable');
var RequireObjectCoercible = require('es-object-atoms/RequireObjectCoercible');
var ToString = require('es-abstract/2024/ToString');
var StringIndexOf = require('es-abstract/2024/StringIndexOf');

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');
var hasSymbols = require('has-symbols')();
var isRegex = require('is-regex');

var max = GetIntrinsic('%Math.max%');
var $TypeError = require('es-errors/type');

var $push = callBound('Array.prototype.push');
var $slice = callBound('String.prototype.slice');
var $indexOf = callBound('String.prototype.indexOf');
var $replace = callBound('String.prototype.replace');

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function replaceAll(searchValue, replaceValue) {
	var O = RequireObjectCoercible(this);

	var searchValueIsRegex = isRegex(searchValue);
	if (searchValueIsRegex && $indexOf($slice(searchValue, searchValue.source.length + 2), 'g') === -1) {
		throw new $TypeError('use .replace for a non-global regex. NOTE: this may be allowed in the future.');

	}
	if (hasSymbols && Symbol.replace) {
		if (searchValue != null) {
			var replacer = GetMethod(searchValue, Symbol.replace);
			if (typeof replacer !== 'undefined') {
				return Call(replacer, searchValue, [O, replaceValue]);
			}
		}
	} else if (searchValueIsRegex) {
		return $replace(O, searchValue, replaceValue);
	}

	var string = ToString(O);
	var searchString = ToString(searchValue);
	var functionalReplace = IsCallable(replaceValue);
	if (!functionalReplace) {
		replaceValue = ToString(replaceValue); // eslint-disable-line no-param-reassign
	}

	var searchLength = searchString.length;
	var advanceBy = max(1, searchLength);
	var matchPositions = [];

	var position = StringIndexOf(string, searchString, 0);
	while (position !== -1) {
		$push(matchPositions, position);
		position = StringIndexOf(string, searchString, position + advanceBy);
	}

	var endOfLastMatch = 0;
	var result = '';
	for (var i = 0; i < matchPositions.length; i += 1) {
		var replacement;
		if (functionalReplace) {
			replacement = ToString(Call(replaceValue, undefined, [searchString, matchPositions[i], string]));
		} else {
			if (typeof replaceValue !== 'string') {
				throw new $TypeError('Assertion failed: `replaceValue` should be a string at this point');
			}
			var captures = [];
			replacement = GetSubstitution(searchString, string, matchPositions[i], captures, undefined, replaceValue);
		}
		var stringSlice = $slice(string, endOfLastMatch, matchPositions[i]);
		result += stringSlice + replacement;
		endOfLastMatch = matchPositions[i] + searchLength;
	}

	if (endOfLastMatch < string.length) {
		result += $slice(string, endOfLastMatch);
	}

	return result;
};
