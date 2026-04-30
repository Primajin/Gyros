import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import xo from 'xo';
import {globalIgnores} from 'eslint/config';

/** @type {import('xo').FlatXoConfig} */
const eslintConfig = [
	globalIgnores([
		'package-lock.json',
	]),
	{
		files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
		plugins: {
			vitest,
		},
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}', '!**/*.{test,spec}.{js,jsx,ts,tsx}'],
		rules: {
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					groups: [
						['builtin', 'external'],
						['parent', 'sibling'],
						'index',
					],
				},
			],
		},
	},
];

// Ensure that the config is compatible with ESLint (this will import the necessary plugins and parsers under the hood)
export default xo.xoToEslintConfig(eslintConfig);
