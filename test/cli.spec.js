import {expect} from 'chai';
import {underline, bgBlue, bold, whiteBright} from 'chalk';

import {processFiles} from '../src/cli';

describe(bgBlue(whiteBright('cli')), () => {

	describe(underline(bold('processFiles()')), () => {

		it.only('should ', () => {
			processFiles();
		});


	});
});
