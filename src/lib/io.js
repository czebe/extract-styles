/* eslint-disable no-console */

import fs from 'fs-extra';
import glob from 'glob';
import {dirname} from 'path';
import {green} from 'chalk';

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

/**
 *
 * @param {string} data - The data to be written
 * @param {string} fileName - Desired path with filename and extension
 * @param {string} [message = 'File saved to: '] - The message to be displayed in the console after successful save
 * @returns {Promise}
 */
export const saveFile = (data, fileName, message = 'File saved to: ') => {
	return new Promise((resolve, reject) => {
		fs.ensureDir(dirname(fileName))
			.then(() => {
				fs.writeFile(fileName, data, (err) => {
					if (err) return reject(err);
					console.log(green.bold(message + fileName));
					resolve();
				});
			});
	});
};
