/* eslint-disable no-console */

import fs from 'fs';
import glob from 'glob';

/**
 * List certain file types below the supplied root directory
 *
 * @param {string} [root = process.cwd()] - The parent directory to begin the search
 * @param {string} [extension = 'scss'] - File extension to list
 * @returns {Promise} - Resolves to an array of file paths
 */
export const listFiles = (root = process.cwd(), extension = 'scss') => {
	const pattern = `**/*.${extension}`;
	const ignore = [
		'**/node_modules/**'
	];

	return new Promise((resolve, reject) => {
		glob(pattern, {cwd: root, ignore}, (err, files) => {
		if (err) return reject(err);
			resolve(files);
		});
	});
};

/**
 * Reads the supplied file
 *
 * @param {string} file - The path to the file to be read
 * @returns {Promise} - Resolves to a Buffer with the file's content
 */
export const readFile = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err, data) => {
			if (err) return reject(err);
			resolve(data);
		});
	});
};