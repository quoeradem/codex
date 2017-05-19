const fs = require('fs');
const config = require('./webpack.common');

const node_modules = {};

fs.readdirSync('node_modules')
  .filter((module) => ['.bin'].indexOf(module) === -1)
  .forEach((module) => {node_modules[module] = `commonjs ${module}`});

const serverConfig = Object.assign({}, config, {
  target: 'node',
  externals: node_modules,
  entry: {
    server: ['./index.js']
  }
});

module.exports = serverConfig;