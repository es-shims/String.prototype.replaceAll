'use strict';

var Call = require('es-abstract/2019/Call');
var GetMethod = require('es-abstract/2019/GetMethod');
var GetSubstitution = require('es-abstract/2019/GetSubstitution');
var IsCallable = require('es-abstract/2019/IsCallable');
var IsInteger = require('es-abstract/2019/IsInteger');
var RequireObjectCoercible = require('es-abstract/2019/RequireObjectCoercible');
var ToString = require('es-abstract/2019/ToString');
var Type = require('es-abstract/2019/Type');
var GetIntrinsic = require('es-abstract/GetIntrinsic');
var callBound = require('es-abstract/helpers/callBound');
var hasSymbols = require('has-symbols')();
var isRegex = require('is-regex');

var max = GetIntrinsic('%Math.max%');
var $TypeError = GetIntrinsic('%TypeError%');

var $push = callBound('Array.prototype.push');
var $slice = callBound('String.prototype.slice');
var $indexOf = callBound('String.prototype.indexOf');
var $replace = callBound('String.prototype.replace');

// TODO: replace this with the es-abstract 2020 impl once it's merged and published
// eslint-disable-next-line max-params, func-style
function StringIndexOf(string, searchValue, fromIndex) {
	if (Type(string) !== 'String' || Type(searchValue) !== 'String') {
		throw new $TypeError('Assertion failed: string and searchValue must both be Strings');
	}
	if (!IsInteger(fromIndex) || fromIndex < 0) {
		throw new $TypeError('Assertion failed: fromIndex must be a nonnegative integer');
	}

	var searchLen = searchValue.length;

	for (var i = fromIndex; i < string.length; i += 1) {
		if (searchValue === '' || $slice(string, i, i + searchLen) === searchValue) {
			return i;
		}
	}
	return -1;
}

// eslint-disable-next-line complexity, max-statements, max-lines-per-function
module.exports = function replaceAll(searchValue, replaceValue) {
	var O = RequireObjectCoercible(this);

	var searchValueIsRegex = isRegex(searchValue);
	if (searchValueIsRegex && $indexOf($slice(searchValue, searchValue.source.length + 2), 'g') === -1) {
		throw new TypeError('use .replace for a non-global regex. NOTE: this may be allowed in the future.');

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

	// TODO: this may be a workaround for broken spec text; see https://github.com/tc39/proposal-string-replaceall/issues/32
	if (searchString === '') {
		return $replace(string, /(?:)/g, replaceValue);
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
			if (Type(replaceValue) !== 'String') {
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
