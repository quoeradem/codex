/*
 * Local fork of 'remark-toc' (https://github.com/wooorm/remark-toc)
 * Hardcoded 'heading' / wrap toc in a div / remove slugs
 */
'use strict';

var util = require('mdast-util-toc');

module.exports = toc;

function toc(options) {
  var settings = options || {};
  var heading = 'contents';
  var depth = settings.maxDepth || 6;
  var tight = settings.tight;
  var className = settings.className;

  return transformer;

  function transformer(node) {
    var result = util(node, {
      heading: heading,
      maxDepth: depth,
      tight: tight
    });

    var tocdiv = {
      type: "div",
      data: {
        hName: "div",
        hProperties: {className}
      },
      children: [].concat(node.children.slice(result.index - 1, result.index), result.map)
    }

    if (result.index === null || result.index === -1 || !result.map) {
      return;
    }

    node.children = [].concat(
      node.children.slice(0, result.index - 1),
      tocdiv,
      node.children.slice(result.endIndex)
    );
  }
}