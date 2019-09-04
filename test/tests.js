'use strict';

module.exports = function (replaceAll, t) {
	// t.equal(replaceAll('abcabc', /a/, 'z'), 'abcabc'.replace(/a/, 'z'), 'replaceAll with a non-global regex matches replace with the same args');
	t['throws'](
		function () { replaceAll('abcabc', /a/, 'z'); },
		TypeError,
		'replaceAll with a non-global regex throws'
	);

	t.equal(replaceAll('abcabc', /a/g, 'z'), 'abcabc'.replace(/a/g, 'z'), 'replaceAll with a global regex matches replace with the same args');

	t.equal(replaceAll('abcabc', 'a', 'z'), 'zbczbc', 'replaceAll with a string replaces all');
};
