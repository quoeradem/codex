import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter as Router, matchPath} from 'react-router';

import {createRoutes, routes} from '../shared/routes';
import App from '../shared/components';

const styles = process.env.NODE_ENV === 'production' ? ["app.css"] : [];

const createHTML = (markup, pages) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico">
    <title>Codex</title>
    <script>window.__pages__ = ${pages};</script>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700" rel="stylesheet">
    ${styles.map(style => `<link rel="stylesheet" href=${style} />`)}
  </head>
  <body>
    <div id="react-root">${markup}</div>
    <script src="/app.js"></script>
  </body>
</html>
`;

const getPages = (cache) => {
  let pages = [];
  for (const {title, permalink} of cache.values()) {
    pages.push({title, permalink});
  }
  return pages.map(({title}, index) => ({index, title: title.toLowerCase()}))
    .sort(({title: i}, {title: j}) => +(i > j) || +(i === j) - 1)
    .map(({index}) => pages[index]);
}

export const render = async (ctx, cache) => {
  const context = {};
  const {url} = ctx;
  const pages = getPages(cache);
  
  const match = routes.reduce((matches, route) => matchPath(url, route, { exact: true }) || matches, null);

  const initialComponent = renderToString(
    <Router location={url} context={context}>
      <App pages={pages} children={createRoutes()} />
    </Router>
  );

  const initialState = JSON.stringify(pages)
    .replace(/<\/script/g, '<\\/script')
    .replace(/<!--/g, '<\\!--');

  const status = 200;
  const body = createHTML(initialComponent, initialState);

  return {status, body}
};