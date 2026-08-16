import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import {globalIgnores} from 'eslint/config';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
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

export default xoConfig;
