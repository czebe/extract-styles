import suppose from 'suppose';
import {expect} from 'chai';
import {underline, bgBlue, bold, whiteBright} from 'chalk';
import fs, {remove} from 'fs-extra';

import {MESSAGES} from '../src/lib/prompts';
import {readFile} from '../src/lib/io';

const MOVEDOWN = (times = 1) => _.repeat('\x1B\x5B\x42', times); // Up: '\x1B\x5B\x41'
const ENTER = '\x0D';

describe(bgBlue(whiteBright('cli')), () => {

	describe(underline(bold('process SCSS files')), () => {

		beforeEach(async () => {
			await remove('test/tmp');
		});

		afterEach(async () => {
			await remove('test/tmp');
		});

		it('should request root directory if no --root parameter supplied', async () => {
			const output = 'test/tmp/a.scss';

			await new Promise((resolve) => {
				suppose('node', ['dist/cli.js'])
					.when(new RegExp(MESSAGES.root, 'i'), ENTER)
					.when(new RegExp(MESSAGES.output, 'i'), output + ENTER)
					.end(() => {
						const fileCreated = fs.existsSync(output);
						expect(fileCreated).to.equal(true);
						resolve();
					});
			});
		});

		it('should NOT request root directory if --root parameter is supplied', async () => {
			const output = 'test/tmp/a.scss';

			await new Promise((resolve) => {
				suppose('node', ['dist/cli.js', '--root', './'])
					.when(new RegExp(MESSAGES.output, 'i'), output + ENTER)
					.end(() => {
						const fileCreated = fs.existsSync(output);
						expect(fileCreated).to.equal(true);
						resolve();
					});
			});
		});

		it('should NOT request output if --output parameter is supplied', async () => {
			const output = 'test/tmp/a.scss';

			await new Promise((resolve) => {
				suppose('node', ['dist/cli.js', '--output', output])
					.when(new RegExp(MESSAGES.root, 'i'), ENTER)
					.end(() => {
						const fileCreated = fs.existsSync(output);
						expect(fileCreated).to.equal(true);
						resolve();
					});
			});
		});

		it('should NOT request anything if --root and --output parameter are supplied', async () => {
			const output = 'test/tmp/a.scss';

			await new Promise((resolve) => {
				suppose('node', ['dist/cli.js', '--root', './', '--output', output])
					.end(() => {
						const fileCreated = fs.existsSync(output);
						expect(fileCreated).to.equal(true);
						resolve();
					});
			});
		});

		it('should generate the file using the custom template', async () => {
			const template = 'test/fixtures/theme-template.tpl';
			const output = 'test/tmp/a.scss';

			await new Promise((resolve) => {
				suppose('node', ['dist/cli.js', '--root', './', '--output', output, '--template', template])
					.end(async () => {
						const fileCreated = fs.existsSync(output);
						expect(fileCreated).to.equal(true);

						const theme = await readFile(output);
						expect(theme).to.include('@import \'_color-names\';');
						resolve();
					});
			});
		});

		it('should detect custom theme marks only', async () => {
			const output = 'test/tmp/a.scss';
			const mark = '@custom-mark';

			await new Promise((resolve) => {
				suppose('node', ['dist/cli.js', '--root', './', '--output', output, '--mark', mark])
					.end(async () => {
						const fileCreated = fs.existsSync(output);
						expect(fileCreated).to.equal(true);

						const theme = await readFile(output);
						const themeLines = theme.split('\n');
						expect(themeLines.length).to.equal(19);
						expect(theme).to.include('background-color: yellow;');
						expect(theme).to.include('width: 100%;');
						resolve();
					});
			});
		});

		it.only('should exit when no SCSS file is found', async () => {
			const output = 'test/tmp/a.scss';

			await new Promise((resolve) => {
				const proc = suppose('node', ['dist/cli.js'], {debug: true})
					// .when(new RegExp(MESSAGES.root, 'i'), ENTER)
					.end(() => {

						console.log(proc.pid);

						let runs = true;
						try {
							const k = process.kill(proc.pid, 0);
							console.log('KKK', k)
						} catch (e) {
							console.log('ERRR', e);
							runs = false;
						}

						expect(runs).to.be.equal(false);
						resolve();
					});
			});
		});


	});
});
