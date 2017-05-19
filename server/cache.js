import fs from 'fs';
import {Map, Record, fromJS, toMap} from 'immutable';
import PageRecord from './models/PageRecord';

const PAGES_DIR = '_pages';

const pathPattern = /[^\w-]/;
const wsPattern = /:\s+/;

export default class Cache {
  constructor() {
    this.cache = Map();
  }

  build(files) {
    if (!files) return;

    const json = files.reduce((acc, cur) => {
      const md = fs.readFileSync(`${PAGES_DIR}/${cur}`, 'utf8');
      const page = parseYAML(md);

      return {...acc, [cur]: page}
    }, {});

    this.cache = fromJS(json, (k,v) => k !== "" ? new PageRecord(v) : v.toMap());
  }

  add(file) {
    const md = fs.readFileSync(`${PAGES_DIR}/${file}`, 'utf8');
    const page = parseYAML(md);

    this.cache = this.cache.set(file, new PageRecord(page));
  }

  remove(file) {
    this.cache = this.cache.delete(file);
  }

  update(file) {
    const md = fs.readFileSync(`${PAGES_DIR}/${file}`, 'utf8');
    const page = parseYAML(md);
    this.cache = this.cache.update(file, record => new PageRecord(page));
  }
}

// convert front matter to JS object
const parseFrontmatter = (yaml) => {
  return yaml.reduce((acc, cur) => {
    const buf = cur.replace(wsPattern, ':');
    const [key,value] = buf.split(/:(.+)/);

    if (!key || !value) return {...acc};
    return {...acc, [key]: value};
  }, {});
}

const createPermalink = (title) => {
  if (!title) return '/';
  const permalink = title.replace(/\s/g, '-').replace(pathPattern, '').toLowerCase();

  return `/${permalink}`;
}

const parseYAML = (md) => {
  let yaml = {};
  const arr = md.split('\n');

  if (arr[0] === '---') {
    const index = arr.indexOf('---', 1);
    const frontmatter = arr.slice(1, index);

    yaml = parseFrontmatter(frontmatter);
  }

  let {title, permalink} = yaml;

  if (!permalink) {
    yaml.permalink = createPermalink(title);
  }

  return {...yaml, content: md}
};