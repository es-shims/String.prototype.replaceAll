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

	t.equal(replaceAll('x', '', '_'), '_x_', 'an empty string to replace, replaces each code unit in a single char string');
	t.equal(replaceAll('xxx', '', '_'), '_x_x_x_', 'an empty string to replace, replaces each code unit in a multi char string');

	t.equal(replaceAll('xxx', /(?:)/g, '_'), '_x_x_x_', 'an empty regex to replace, replaces each code unit');
};
