import {expect} from 'chai';
import fs, {remove} from 'fs-extra';
import {underline, bgBlue, bold, whiteBright} from 'chalk';

import {saveFile, readFile, listFiles} from '../src/lib/io';

describe(bgBlue(whiteBright('io')), () => {

	describe(underline(bold('listFiles()')), () => {

		it('should list .scss files below supplied root', async () => {
			const files = await listFiles('test');
			expect(files.length).to.be.greaterThan(0);
		});

		it('should default to current directory when no root is specified', async () => {
			const files = await listFiles();
			expect(files.length).to.be.greaterThan(0);
		});

	});

	describe(underline(bold('readFile()')), () => {

		it('should read the required binary file', async () => {
			const data = await readFile('test/fixtures/a.scss');
			expect(data).to.include('background-color');
		});

		it('should reject when file doesn\'t exist', async () => {
			await readFile('test/fixtures/a_foo.scss')
				.then(() => {
					throw new Error('read was not supposed to succeed');
				})
				.catch((err) => {
					expect(err).to.be.an('error');
				});
		});

	});

	describe(underline(bold('saveFile()')), () => {

		beforeEach(async () => {
			await remove('test/tmp');
		});

		after(async () => {
			await remove('test/tmp');
		});

		it('should save file with correct extension', async () => {
			const fileName = 'test/tmp/a.scss';
			await saveFile('', fileName);
			const fileExists = fs.existsSync(fileName);
			expect(fileExists).to.equal(true);
		});

	});

});