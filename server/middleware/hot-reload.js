import webpack from 'webpack';
import webpackDev from 'koa-webpack-dev-middleware';
import webpackHot from 'koa-webpack-hot-middleware';
import convert from 'koa-convert';

import devConfig from '../../webpack.config.dev';

const compiler = webpack(devConfig);
const path = require('path');
const ROOT = path.join(process.cwd());
const SHARED = path.join(ROOT, 'shared');
const SERVER = path.join(ROOT, 'server');

const devMiddleware = webpackDev(compiler, {
  noInfo: true,
  publicPath: devConfig.output.publicPath
});

const hotMiddleware = webpackHot(compiler, {
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
});

compiler.plugin('done', () => {
  Object.keys(require.cache)
    .filter(module => module.startsWith(SHARED) || module.startsWith(SERVER))
    .forEach(module => delete require.cache[module])
});

export default convert.compose(devMiddleware, hotMiddleware);