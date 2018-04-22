module.exports = admonition;

const C_NEWLINE = '\n';
const C_SPACE = ' ';

const delim = /^!{3} (note|tip|warning)(?=\n)/;
const indented = /^(?: {4}|\t)/;

function admonition() {
  const Parser = this.Parser;
  let tokenizers = Parser.prototype.blockTokenizers;
  let methods = Parser.prototype.blockMethods;
  const interruptParagraph = Parser.prototype.interruptParagraph;
  const interruptList = Parser.prototype.interruptList;
  const interruptBlockquote = Parser.prototype.interruptBlockquote;

  tokenizers.admonition = tokenizeAdmonition;
  methods.splice(methods.indexOf('fencedCode'), 0, 'admonition');

  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode'), 0, ['admonition']);
  interruptList.splice(interruptList.indexOf('fencedCode'), 0, ['admonition']);
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode'), 0, ['admonition']);
}

function tokenizeAdmonition(eat, value, silent) {
  const now = eat.now();
  let values = [];
  let contents = [];
  let indents = [];
  let index;
  let startIndex;
  let nextIndex;
  const length = value.length;

  const match = delim.exec(value);
  if (!match) return;
  if (silent) return true;

  values.push(match[0])
  index = match[0].length + 1

  while (index < length) {
    startIndex = index;
    nextIndex = value.indexOf(C_NEWLINE, index);
    if (nextIndex === -1) nextIndex = length;

    const line = value.slice(startIndex, nextIndex);
    if (!indented.test(line)) break;
    values.push(line);

    // Remove 1 level of indentation
    const content = line.slice(/^ {4}/.test(line) ? 4 : 1);
    if (indented.test(content)) {
      indents.push(contents.length)
    }

    contents.push(content);
    index = nextIndex + 1;
  }

  let start, end;
  for (let i = 0; i < indents.length; i++) {
    let cur = indents[i];
    let next = indents[i+1];

    if (!start) start = cur;
    if (next - cur === 1) continue;

    end = cur;
    contents[end] = contents[end] + C_NEWLINE;
    contents[start] = C_NEWLINE + contents[start];
    start = ''
  }

  const add = eat(values.join(C_NEWLINE));
  const exit = this.enterBlock();
  contents = this.tokenizeBlock(contents.join(C_NEWLINE), now);
  exit();

  const type = match[1];
  const title = `${type[0].toUpperCase()}${type.slice(1).toLowerCase()}:${C_SPACE}`;
  const titleElem = {type: 'strong', children: [{type: 'text', value: title}]};

  if (contents[0].type === 'list') {
    contents = [titleElem, ...contents];
  } else {
    const children = contents[0].children;
    contents[0].children = [].concat(titleElem, children);
  }

  return add({
    type: `${type}Block`,
    children: contents,
    data: { hName: 'div', hProperties: { className: `admonition-${type}` } }
  });
}