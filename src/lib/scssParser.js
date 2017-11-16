import postcss from 'postcss';
import postcssScss from 'postcss-scss';

const DEFAULT_MARK = '@theme';

export const markPattern = (mark = DEFAULT_MARK) => new RegExp(`${mark}([^*]*)`, 'im');

const isMarked = (node, pattern) => {

	if (node.type === 'comment') {
		const match = node.text.match(pattern);

		if (match && match[1] && match[1].trim().length) {
			return true;
		}
	} else {
		const nextNode = node.next();

		if (nextNode && nextNode.type === 'comment') {
			const match = nextNode.text.match(pattern);

			nextNode.remove();

			if (match) {
				return true;
			}
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

		root.walkAtRules(node => {
			if (node.name === 'include' && !isMarked(node, pattern)) {
				node.remove();
			}
		});

		// Remove empty at-rules (@if, @for etc).
		root.walkAtRules(node => {
			if (node.name !== 'include' && (!node.nodes || !node.nodes.length)) {
				node.remove();
			}
		});


		// Remove comments
		root.walkComments(node => {
			if (!isMarked(node, pattern)) {
				node.remove();
			}
		});

		parsed = root.toString().trim();
	}

	return parsed;
};
