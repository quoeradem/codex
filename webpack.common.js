const webpack = require('webpack');
const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    modules: ['node_modules', 'client', 'server', 'shared'],
    extensions: ['.js', '.jsx', '.scss', '.json']
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, include: [/client/,/server/,/shared/], use: {loader: 'babel-loader'}},
      {test: /\.woff2$/, loader: 'url-loader?limit=10000&mimetype=font/woff2'},
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ],
  performance: {hints: false}
}