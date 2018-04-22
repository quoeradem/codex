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

const elementCode = (children, props) => ({
  type: 'element',
  tagName: 'code',
  properties: {...props},
  children: children
})

/* Workaround for mdhighlight
 * Since the mdhighlight plugin is processed
 * before this plugin, children are parsed for
 * the '---↵' delimiter so that the title/delimiter
 * elements can be skipped.
 *
 * Currently, PrismJS tokenize() processes the
 * delimiter as two separate tokens.
 */
const getContentOffset = children => {
  let _children = [];

  // extract 'value' props from children
  for (const child of children) {
    _children.push(child.children ? child.children[0].value : '');
  }

  // iterate children until delimiter elements are found
  for (let i = 0; i < _children.length;) {
    const cur = _children[i++], next = _children[i];
    if (cur === '--' && next === '-\n') return ++i;
  }
}

const createChildren = (node) => {
  const {data = {hChildren: {}}, lang, value} = node;

  const test = /\n---\n/.exec(value);
  if (!test) return [node];

  const hStr = node.value.slice(0, test.index);
  const bStr = node.value.slice(test.index + 5); // index + match length

  const nodeHeader = elementPre({value: hStr}, {className: 'code-header'});
  const nodeParent = elementPre(null, {className: 'code-body'});

  // Syntax highlighting compat -- use node's current hChildren (skipping title/delimiter elements)
  // Normally hChildren should be empty.
  const offset = Array.isArray(data.hChildren) && getContentOffset(data.hChildren);
  const nodeChildren = offset ? data.hChildren.slice(offset) : [{type: 'text', value: bStr}];
  const {hProperties = lang ? {className: `language-${lang}`} : {}} = data;

  nodeParent.data.hChildren = [elementCode(nodeChildren, hProperties)];

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
    if (!node) return;
    const nextIndex = indexes[i + 1] || indexes[i];

    const childNodes = createChildren(node);
    newChildren = [...newChildren, ...childNodes, ...children.slice(index + 1, nextIndex)]
  })

  const firstIndex = indexes[0];
  const lastIndex = indexes[indexes.length - 1];

  // AST children until 1st significant index, processed nodes, AST children after last significant index
  ast.children = [...children.slice(0, firstIndex), ...newChildren, ...children.slice(lastIndex + 1)];
}