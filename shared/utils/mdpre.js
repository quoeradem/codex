'use strict';

import visit from 'unist-util-visit';

// base unist object models
const elementPre = (props, hProps) => ({
  type: 'inlineCode',
  data: {
    hName: 'pre',
    hProperties: {...hProps}
  },
  ...props
})

const elementCode = (value, lang) => ({
  type: 'element',
  tagName: 'code',
  properties: {
    className: `language-${lang}`
  },
  children: [{
    type: 'text',
    value
  }]
})

const createChildren = (node) => {
  const {lang, value} = node;

  const test = /\n---\n/.exec(value);
  if (!test) return [node];

  const hStr = node.value.slice(0, test.index);
  const bStr = node.value.slice(test.index + 5); // index + match length

  const nodeHeader = elementPre({value: hStr}, {className: 'code-header'});
  const nodeParent = elementPre(null, {className: 'code-body'});
  const nodeChild = elementCode(bStr, lang);
  nodeParent.data.hChildren = [nodeChild];

  return [nodeHeader, nodeParent]
}

export default function attacher() {
  return transformer;
}

const transformer = ast => {
  const children = ast.children;
  let indexes = [];
  let newChildren = [];

  // Find indexes of all 'code' type children
  visit(ast, 'code', (node, index) => indexes.push(index));

  if (indexes.length === 0) return;

  indexes.map((index, i) => {
    const node = ast.children[index];
    const nextIndex = indexes[i + 1] || indexes[i];

    const childNodes = createChildren(node);
    newChildren = [...newChildren, ...childNodes, ...children.slice(index + 1, nextIndex)]
  })

  const firstIndex = indexes[0];
  const lastIndex = indexes[indexes.length - 1];

  // AST children until 1st significant index, processed nodes, AST children after last significant index
  ast.children = [...children.slice(0, firstIndex), ...newChildren, ...children.slice(lastIndex + 1)];
}