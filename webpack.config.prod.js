const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./webpack.common');

const prodConfig = Object.assign({}, config, {
  entry: {
    app: [
      './assets/styles/main.scss',
      './client'
    ]
  }
})

prodConfig.module.loaders.push({
  test: /\.scss$/,
  include: [/assets/],
  use: ExtractTextPlugin.extract({
    use: ['css-loader', 'sass-loader'],
    fallback: 'style-loader'
  })
});

prodConfig.plugins.push(
  new ExtractTextPlugin('[name].css')
);

module.exports = prodConfig;