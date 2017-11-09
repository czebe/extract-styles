#!/usr/bin/env node
/* eslint-disable no-console */

import {listFiles, readFile} from './lib/io';
import {parse} from './lib/scssParser';

const processFiles = async () => {
	const themeLines = await listFiles()
		.then((files) => {
			const parsed = files.reduce(async (result, file) => {
				const scss = await readFile(file);
				const parsedScss = parse(scss);
				if (parsedScss) {
					result.push(parsedScss);
				}
				return result;
			}, []);

			return parsed;
		});

	console.log(themeLines);
};


processFiles();
