#!/usr/bin/env node
/* eslint-disable no-console */

import {listFiles, readFile} from './lib/io';

let themeMark = '@theme';

export const processFiles = async () => {
	const themeLines = await listFiles()
		.then((files) => {
			const parsed = files.reduce(async (result, file) => {
				const scss = await readFile(file);
				const parsedScss = parseScss(scss);
				if (parsedScss) {
					result.push(parsedScss);
				}
				return result;
			}, []);

			return parsed;
		});

	console.log(themeLines);
};

export const parseScss = (scss) => {
	let parsed;
	const markPattern = new RegExp(`\/\/\.*?${themeMark}`, 'igm');
	console.log(scss, markPattern, markPattern.test(scss));
	if (markPattern.test(scss)) {
		parsed = scss;
	}

	return parsed;
};

processFiles();