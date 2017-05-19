const webpack = require('webpack');
const config = require('./webpack.common');

const devConfig = Object.assign({}, config, {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      './assets/styles/main.scss',
      './client'
    ]
  },
  devtool: 'inline-source-map',
});

devConfig.module.loaders.push({
  test: /\.scss$/,
  include: [/assets/],
  loaders: ['style-loader', 'css-loader', 'sass-loader']
});

devConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin()
);

module.exports = devConfig;