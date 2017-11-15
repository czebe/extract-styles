import _ from 'lodash';
import {red, bold} from 'chalk';

export const MESSAGES = {
	root: 'Search for SCSS files in:',
	output: 'Save the generated theme file as:',
	incorrectScssPath: red(bold('Invalid .scss file path. Enter a valid file path relative to project root.'))
};

export const root = (root = process.cwd()) => ({
	type: 'path',
	name: 'root',
	cwd: root,
	directoryOnly: true,
	message: MESSAGES.root,
	default: root
});

export const output = (root = process.cwd()) => ({
	type: 'path',
	name: 'output',
	message: MESSAGES.output,
	cwd: root,
	validate: answer => _.endsWith(answer.toLowerCase(), '.scss') ? true : MESSAGES.incorrectScssPath
});