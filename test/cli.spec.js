import {expect} from 'chai';
import {underline, bgBlue, bold, whiteBright} from 'chalk';

import {parseScss} from '../src/cli';

describe(bgBlue(whiteBright('cli')), () => {

	describe(underline(bold('parseScss')), () => {

		it('should return undefined when theme mark is not found', () => {
			expect(parseScss('')).to.be.equal(undefined);
		});

	});
});
