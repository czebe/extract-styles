import postcss from 'postcss';
import postcssScss from 'postcss-scss';

const isMarked = (node, mark) => {
	const nextNode = node.next();
	const markPattern = new RegExp(mark, 'i');
	if (nextNode && nextNode.type === 'comment') {
		nextNode.remove();
		if (markPattern.test(nextNode.text)) return true;
	} else if (node.type === 'comment') {
		node.remove();
		if (markPattern.test(node.text)) return true;
	}

	return false;
};

export const parse = (scss, mark = '@theme') => {
	let parsed;
	const markPattern = new RegExp(`\/\/\.*?${mark}`, 'igm');
	if (scss && markPattern.test(scss)) {

		const root = postcss().process(scss, {syntax: postcssScss}).root;

		root.walkDecls(node => {
			if (!isMarked(node, mark)) {
				node.remove();
			}
		});

		root.walkAtRules(node => {
			if (node.name === 'include' && !isMarked(node, mark)) {
				node.remove();
			}
		});

		root.walkAtRules(node => {
			if ((node.name !== 'include') && (!node.nodes || !node.nodes.length)) {
				node.remove();
			} else {
				node.remove();
			}
		});

		root.walkRules(node => {
			if (!node.nodes || !node.nodes.length) {
				node.remove();
			}
		});

		parsed = root.toString().trim();
	}

	return parsed;
};
