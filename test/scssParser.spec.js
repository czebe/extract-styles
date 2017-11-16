import {expect} from 'chai';
import {underline, bgBlue, bold, whiteBright} from 'chalk';

import {readFile} from '../src/lib/io';
import {parse, markPattern} from '../src/lib/scssParser';

describe(bgBlue(whiteBright('scssParser')), () => {


	describe(underline(bold('markPattern()')), () => {

		it('should detect correct mark pattern and ignore incorrect ones', () => {
			const pattern = markPattern();

			// Correct marks
			expect(('// @theme').match(pattern)).to.have.lengthOf(2);
			expect(('//@theme').match(pattern)).to.have.lengthOf(2);
			expect(('/* @theme */').match(pattern)).to.have.lengthOf(2);
			expect(('/* \n@theme: Foo theme\n */').match(pattern)).to.have.lengthOf(2);
			expect(('/*@theme*/').match(pattern)).to.have.lengthOf(2);
			expect(('// @theme').match(pattern)).to.have.lengthOf(2);

			// Incorrect marks
			expect(('// theme').match(pattern)).to.be.equal(null);
			expect(('// @ theme').match(pattern)).to.be.equal(null);

			// Extended marks
			expect(('// @theme: foo').match(pattern)[1]).to.have.lengthOf(5);
			expect(('/* @theme: foo */').match(pattern)[1]).to.have.lengthOf(6);
		});

	});

	describe(underline(bold('parse()')), () => {

		let scssA, scssB, scssC, scssD;

		before(async () => {
			scssA =  await readFile('test/fixtures/a.scss');
			scssB =  await readFile('test/fixtures/b.scss');
			scssC =  await readFile('test/fixtures/c.scss');
			scssD =  await readFile('test/fixtures/d.scss');
		});

		it('should return undefined when theme mark is not found', () => {
			expect(parse()).to.be.equal(undefined);
			expect(parse('')).to.be.equal(undefined);
			expect(parse('.class { color: red; // @custom-mark }')).to.be.equal(undefined);
		});

		it('should return parsed SCSS when theme mark is found', () => {
			expect(parse(`
				.class {
					color: red; // @theme
				}
			`)).to.not.be.equal(undefined);

			expect(parse(`
				.class {
					color: red; // @custom-mark
				}
			`, '@custom-mark')).to.not.be.equal(undefined);
		});

		it('should return parsed SCSS for multiline strings', () => {
			expect(parse(scssA)).to.not.be.equal(undefined);
		});

		it('should detect theme mark in simple SCSS', () => {
			const scss = parse(scssA).split('\n');
			expect(scss.length).to.be.equal(3);
			expect(scss[1]).to.include('background-color: white;');
		});

		it('should detect theme mark in nested SCSS', () => {
			const scss = parse(scssB).split('\n');
			expect(scss.length).to.be.equal(18);
			expect(scss[6]).to.include('background-color: green;');
			expect(scss[9]).to.include('background-color: blue;');
			expect(scss[16]).to.include('color: #ffff00;');
		});

		it('should keep @at-rule declarations when marked and remove if not', () => {
			const scss = parse(scssC).split('\n');
			expect(scss.length).to.be.equal(13);
			expect(scss[1]).to.include('@include size(100%);');
			expect(scss[3]).to.include('@for $i from 1 through 3 {');
			expect(scss[9]).to.include('@if 5 < 3 {');
		});

		it('should remove unmarked comments and keep marked ones', () => {
			const scss = parse(scssD).split('\n');
			expect(scss.length).to.be.equal(11);
			expect(scss[0]).to.include('@theme: comment to stay');
			expect(scss[6]).to.include('@theme:');
		});

	});
});
