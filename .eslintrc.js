module.exports = {
	parser: '@babel/eslint-parser',
	env: {
		es6: true,
		browser: true
	},
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			experimentalDecorators: true,
		},
		allowImportExportEverywhere: true
	},
	rules: {
		'no-template-curly-in-string': 2,
		'array-callback-return': 2,
		'curly': [ 1, 'all' ],
		'dot-location': [ 1, 'property' ],
		'eqeqeq': 1,
		'no-else-return': [
			1, {
				'allowElseIf': true
			}
		],
		'no-eval': 2,
		'no-extra-bind': 1,
		'no-implicit-coercion': 1,
		'yoda': 1,
		'array-bracket-newline': [
			1, {
				'multiline': true
			}
		],
		'semi': [ 1, 'always' ],
		'no-multi-spaces': 1,
		'no-multi-str': 1,
		'no-useless-return': 1,
		'prefer-promise-reject-errors': [
			1, {
				'allowEmptyReject': true
			}
		],
		'wrap-iife': 1,
		'no-delete-var': 1,
		'no-undef-init': 1,
		'no-use-before-define': 2,
		'array-bracket-spacing': [
			1, 'always', {
				'singleValue': false
			}
		],
		'brace-style': [ 1, '1tbs' ],
		'camelcase': 2,
		'comma-spacing': [
			1, {
				'before': false,
				'after': true
			}
		],
		'comma-style': [ 1, 'last' ],
		'computed-property-spacing': [ 1, 'never' ],
		'eol-last': [ 1, 'always' ],
		'func-call-spacing': [ 1, 'never' ],
		'indent': [
			2, 'space', {
				'SwitchCase': 1,
				'ignoredNodes': ['TemplateLiteral']
			}
		],
		'quotes': [ 1, 'single' ],
		'key-spacing': [
			1, {
				'mode': 'strict'
			}
		],
		'keyword-spacing': 1,
		'lines-between-class-members': [ 1, 'always' ],
		'newline-per-chained-call': [
			1, {
				'ignoreChainWithDepth': 2
			}
		],
		'no-nested-ternary': 2,
		'no-trailing-spaces': 1,
		'semi-spacing': [
			1, {
				'before': false,
				'after': true
			}
		],
		'space-before-function-paren': [ 1, 'never' ],
		'space-in-parens': [ 1, 'never' ],
		'spaced-comment': [ 1, 'always' ],
		'no-var': 1,
		'prefer-rest-params': 2,
		'prefer-arrow-callback': 1,
		'prefer-const': 1,
		'space-infix-ops': 1,
		'no-mixed-spaces-and-tabs': 1,
		'no-loop-func': 0,
		'object-curly-spacing': [ 1, 'always' ],
		'template-curly-spacing': 'off',
	}
};
