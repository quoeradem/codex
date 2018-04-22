import fs from 'fs';
import {Map, Record, fromJS, toMap} from 'immutable';
import PageRecord from './models/PageRecord';

import unified from 'unified';
import markdown from 'remark-parse';
import toc from '../shared/utils/mdtoc';
import mdsections from '../shared/utils/mdsections'
import mdpre from '../shared/utils/mdpre'
import mdhighlight from '../shared/utils/mdhighlight'
import admonition from '../shared/utils/admonition';

const PAGES_DIR = '_pages';
const pathPattern = /[^\w-]/;
const wsPattern = /:\s+/;

const processor = unified()
  .use(markdown, {commonmark: true})
  .use(admonition)
  .use(toc, {maxDepth: 2, tight: true, className: "page-toc"})
  .use(mdhighlight)
  .use(mdpre)
  .use(mdsections)

export default class Cache {
  constructor() {
    this.cache = Map();
  }

  build(files) {
    if (!files) return;

    const json = files.reduce((acc, cur) => {
      const page = readFile(cur);

      if (!page) return {...acc};
      return {...acc, [cur]: page};
    }, {});

    this.cache = fromJS(json, (k,v) => k !== "" ? new PageRecord(v) : v.toMap());
  }

  add(file) {
    const page = readFile(file);

    // Update cache iff 'page' is valid
    if (!page) return;
    this.cache = this.cache.set(file, new PageRecord(page));
  }

  remove(file) {
    this.cache = this.cache.delete(file);
  }

  update(file) {
    const page = readFile(file);

    // Update cached page if updated 'page' is valid, otherwise delete from cache.
    this.cache = page ? this.cache.update(file, record => new PageRecord(page)) : this.cache.delete(file);
  }
}

// wrapper that reads file and returns object containing parsed YAML / markdown
const readFile = file => parseYAML(fs.readFileSync(`${PAGES_DIR}/${file}`, 'utf8'))

// convert frontmatter to JS object
const parseFrontmatter = yaml => yaml.reduce((acc, cur) => {
  const [k, v] = cur.replace(wsPattern, ':').split(/:(.+)/);
  return (!k & !v) ? {...acc} : {...acc, [k]: v};
}, {})

const createPermalink = (title) => {
  if (!title) return '/';
  const permalink = title.replace(/\s/g, '-').replace(pathPattern, '').toLowerCase();
  return `/${permalink}`;
}

const parseYAML = (md) => {
  const arr = md.split('\n');
  if (arr[0] !== '---') return;

  // process frontmatter
  const index = arr.indexOf('---', 1);
  const frontmatter = arr.slice(1, index);
  const yaml = parseFrontmatter(frontmatter);

  const {title, permalink, published} = yaml;

  // return if 'published' is falsy
  if (published && published.toLowerCase() === 'false' || published === '0') return;

  if (!title) return;
  if (!permalink) yaml.permalink = createPermalink(title);

  // process markdown -> AST
  const content = arr.slice(index + 1).join("\n");
  const markup = processor.parse(content);
  processor.runSync(markup);
  const ast = JSON.stringify(markup);

  return {...yaml, content: ast}
};