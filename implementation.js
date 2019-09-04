'use strict';

var ES = require('es-abstract/es2019');
var GetIntrinsic = require('es-abstract/GetIntrinsic');
var hasSymbols = require('has-symbols')();
var bind = require('function-bind');
var isRegex = require('is-regex');

var max = GetIntrinsic('%Math%').max;
var $TypeError = GetIntrinsic('%TypeError%');
var $ArrayPrototype = GetIntrinsic('%ArrayPrototype%');
var $StringPrototype = GetIntrinsic('%StringPrototype%');

var $push = bind.call(Function.call, $ArrayPrototype.push);
var $slice = bind.call(Function.call, $StringPrototype.slice);
var $indexOf = bind.call(Function.call, $StringPrototype.indexOf);

// TODO: replace this with the es-abstract impl once it's merged and published
// eslint-disable-next-line max-params, func-style
function StringIndexOf(string, searchValue, fromIndex) {
	if (ES.Type(string) !== 'String' || ES.Type(searchValue) !== 'String') {
		throw new $TypeError('Assertion failed: string and searchValue must both be Strings');
	}
	if (!ES.IsInteger(fromIndex) || fromIndex < 0) {
		throw new $TypeError('Assertion failed: fromIndex must be a nonnegative integer');
	}

	return $indexOf(string, searchValue, fromIndex);
}

// eslint-disable-next-line complexity, max-statements
module.exports = function replaceAll(searchValue, replaceValue) {
	var O = ES.RequireObjectCoercible(this);

	if (isRegex(searchValue) && $indexOf($slice(searchValue, searchValue.source.length + 2), 'g') === -1) {
		throw new TypeError('use .replace for a non-global regex. NOTE: this may be allowed in the future.');

	}
	if (searchValue != null && hasSymbols && Symbol.replace) {
		var replacer = ES.GetMethod(searchValue, Symbol.replace);
		if (typeof replacer !== 'undefined') {
			return ES.Call(replacer, searchValue, [O, replaceValue]);
		}
	}

	var string = ES.ToString(O);
	var searchString = ES.ToString(searchValue);
	var functionalReplace = ES.IsCallable(replaceValue);
	if (!functionalReplace) {
		replaceValue = ES.ToString(replaceValue); // eslint-disable-line no-param-reassign
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
			replacement = ES.ToString(ES.Call(replaceValue, undefined, [searchString, matchPositions[i], string]));
		} else {
			if (ES.Type(replaceValue) !== 'String') {
				throw new $TypeError('Assertion failed: `replaceValue` should be a string at this point');
			}
			var captures = [];
			replacement = ES.GetSubstitution(searchString, string, matchPositions[i], captures, undefined, replaceValue);
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
