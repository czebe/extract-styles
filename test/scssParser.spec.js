import {expect} from 'chai';
import {underline, bgBlue, bold, whiteBright} from 'chalk';

import {readFile} from '../src/lib/io';
import {parse} from '../src/lib/scssParser';

describe(bgBlue(whiteBright('scssParser')), () => {

	describe(underline(bold('parse()')), () => {

		let scssA, scssB;

		before(async () => {
			scssA =  await readFile('test/fixtures/a.scss');
			scssB =  await readFile('test/fixtures/b.scss');
		});

		it('should return undefined when theme mark is not found', () => {
			expect(parse()).to.be.equal(undefined);
			expect(parse('')).to.be.equal(undefined);
			expect(parse('.class { color: red; } // @custom-mark')).to.be.equal(undefined);
		});

		it('should return parsed SCSS when theme mark is found', () => {
			expect(parse('.class { color: red; } // @theme')).to.not.be.equal(undefined);
			expect(parse('.class { color: red; } // @custom-mark', '@custom-mark')).to.not.be.equal(undefined);
		});

		it('should return parsed SCSS for multiline strings', () => {
			expect(parse(scssA)).to.not.be.equal(undefined);
		});

		it('should detect theme mark in simple SCSS', () => {
			const scss = parse(scssA).split('\n');
			expect(scss.length).to.be.equal(3);
			expect(scss[1]).to.include('background-color: white;');
		});

		it.only('should detect theme mark in nested SCSS', () => {
			// const scss = parse(scssB).split('\n');
			const scss = parse(scssB);
			console.log(scss);
			// expect(scss.length).to.be.equal(3);
			// expect(scss[1]).to.include('background-color: white;');
		});

	});
});
