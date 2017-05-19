'use strict';

import Slugger from 'github-slugger';
import toString from 'mdast-util-to-string';
import visit from 'unist-util-visit';

const slugger = new Slugger();

export default function attacher() {
  return transformer;
}

// Wrap children in section and adds slug
const createDiv = children => {

  return {
    type: 'section',
    data: {
      hName: "section",
      hProperties: {className: 'module'}
    },
    children
  };
}

// 'article-content' container
const createContent = children => {
  // makes 1st child an h2 -- 2nd child rest of children
  return {
    type: 'div',
    data: {
      hProperties: {className: 'article-content'}
    },
    children: [...children.slice(0, 1), ...children.slice(1)]
  };
}

// Top-level container
const createSection = children => {
  const id = slugger.slug(toString(children[0]));
  return {
    type: 'section',
    data: {
      hName: "section",
      hProperties: {
        className: 'article',
        id
      },
      hAttributes: {id},
    },
    children
  };
}

const transformer = ast => {
  let indexes = [];
  slugger.reset();

  // Find all top-level (H2) headings (titles)
  visit(ast, 'heading', (node, index) => {
    if (node.depth === 2) indexes.push(index);
  });

  // iterate top level headings -- wrap in parent container (section)
  const nodeChildren = indexes.map((index, i) => {
    let childIndexes = [0];
    const nextIndex = indexes[i + 1];
    const children = ast.children.slice(index, (nextIndex ? nextIndex : ast.children.length));

    // remove title (1st child) :: makes node a 'root' node so visit works
    let rootChildren = { type: "root", children: [...children.slice(1)] };
    // find headings of each child
    visit(rootChildren, 'heading', (node, index) => {
      if (index !== 0) childIndexes.push(index);
    });

    let newChildren = [];

    childIndexes.map((index, i) => {
      const nextIndex = childIndexes[i + 1];
      const {depth} = rootChildren.children[index];
      const children = rootChildren.children.slice(index, (nextIndex ? nextIndex : rootChildren.children.length));

      newChildren = newChildren.concat(createDiv(children));
    });

    const article = createContent(newChildren);
    const title = children[0];
    const containerChildren = [].concat(title, article);

    return createSection(containerChildren);
  });

  ast.children = [...ast.children.slice(0, indexes[0]), ...nodeChildren];
}