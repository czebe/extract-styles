import {expect} from 'chai';
import {underline, bgBlue, bold, whiteBright} from 'chalk';

import * as Prompts from '../src/lib/prompts';

describe(bgBlue(whiteBright('prompts')), () => {

	let question;

	describe(underline(bold('output')), () => {

		before(() => {
			question = Prompts.output();
		});

		it('should allow valid filename', () => {
			const validInput = question.validate('test/tmp/a.scss');
			expect(validInput).to.be.equal(true);
		});

		it('should reject incorrect filename', () => {
			const inValidInput = question.validate('test/tmp/a.css');
			expect(inValidInput).to.be.equal(Prompts.MESSAGES.incorrectScssPath);
		});

	});

});