'use strict';
import visit from 'unist-util-visit';
import Prism from 'prismjs';

export default function attacher() {
  return transformer;
}

const TextElement = (value) => ({
  type: 'text',
  value: value
})

const SpanElement = (type) => ({
  type: 'element',
  tagName: 'span',
  properties: {
    className: ['token', type]
  }
})

const getChildren = (nodes, children = []) => {
  if (nodes.length === 0) return children;

  const [node, ...rest] = nodes;

  // Element is string -- return TextElement
  if (typeof node === 'string') return getChildren(rest, children.concat(TextElement(node)));

  // Element is _.Token object -- return SpanElement
  const parent = SpanElement(node.type);
  parent.children = typeof node.content === 'string' ? [TextElement(node.content)] : getChildren(node.content);

  return getChildren(rest, children.concat(parent));
}

const transformer = ast => visit(ast, 'code', node => {
  const {data, lang, value} = node;

  if (!lang) return;
  if (!data) node.data = {};

  const tokens = Prism.tokenize(value, {...Prism.languages[lang]});
  node.data.hChildren = getChildren(tokens);
})