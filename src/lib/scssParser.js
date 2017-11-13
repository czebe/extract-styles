import postcss from 'postcss';
import postcssScss from 'postcss-scss';

const DEFAULT_MARK = '@theme';

export const markPattern = (mark = DEFAULT_MARK) => new RegExp(`^(\/[\/|\*].*?${mark})([^\*]*)`, 'im');

const isMarked = (node, pattern) => {


	console.log(node.type);

	if (node.type === 'comment') {
		// console.log(node.text.match(markPattern));

		if (pattern.test(node.text)) {
			return true;
		}
	} else {
		const nextNode = node.next();
		console.log('SSSS', nextNode.text.match(pattern));

		if (nextNode && nextNode.type === 'comment') {

			nextNode.remove();
			if (pattern.test(nextNode.text)) return true;
		}
	}

	return false;
};

export const parse = (scss, mark = DEFAULT_MARK) => {
	let parsed;

	if (scss && scss.indexOf(mark) >= 0) {
		const pattern = markPattern(mark);
		const root = postcss().process(scss, {syntax: postcssScss}).root;

		root.walkDecls(node => {
			if (!isMarked(node, pattern)) {
				node.remove();
			}
		});

		// root.walkAtRules(node => {
		// 	if (node.name === 'include' && !isMarked(node, markPattern)) {
		// 		node.remove();
		// 	}
		// });
		//
		// // Remove empty at-rules (@if, @for etc).
		// root.walkAtRules(node => {
		// 	if (node.name !== 'include' && (!node.nodes || !node.nodes.length)) {
		// 		node.remove();
		// 	}
		// });
		//

		// Remove comments
		root.walkComments(node => {
			if (!isMarked(node, pattern)) {
				node.remove();
			}
		});

		parsed = root.toString().trim().replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
	}

	return parsed;
};
