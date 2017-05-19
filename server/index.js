import Koa from 'koa';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import Router from 'koa-router';
import serve from 'koa-static';
import chokidar from 'chokidar';

import Cache from './cache';
import headers from './middleware/headers';

const server = new Koa();
const apiRouter = new Router();
const pageCache = new Cache();

const watcher = chokidar.watch('*.{md, MD}', {
  cwd: '_pages',
  followSymlinks: false,
  ignoreInitial: true
});

watcher.on('ready', () => {
  const pages = watcher.getWatched()['.'];
  pageCache.build(pages);
});
watcher.on('add', path => pageCache.add(path));
watcher.on('unlink', path => pageCache.remove(path));
watcher.on('change', path => pageCache.update(path));

// API function/route
const getPage = async (ctx, next) => {
  const query = ctx.query.id;
  const page = pageCache.cache.filter((v, k) => v.permalink === query).toList().first();
  const json = JSON.stringify(page);

  ctx.status = 200;
  ctx.body = JSON.stringify(page);
}
apiRouter.get('/page', getPage);
server.use(apiRouter.routes());

// Serve static assets
server.use(serve('assets'))

// Hot reloading
if (process.env.NODE_ENV === 'development') {
  const middleware = require('./middleware/hot-reload');
  server.use(middleware);
} else {
  server.use(serve('build'));
}

// Middleware
server.use(headers);
server.use(compress({threshold: 2048}));
server.use(bodyParser());

server.use(async ctx => {
  global.navigator = {userAgent: ctx.get('user-agent')};
  const {render} = require('./server');
  const {status, redirect, body} = await render(ctx, pageCache.cache);

  ctx.status = status;
  redirect ? ctx.redirect(redirect) : ctx.body = body;
});

export default server;