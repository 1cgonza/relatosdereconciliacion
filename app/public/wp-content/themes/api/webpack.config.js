const webpack = require('webpack');
const Uglify = webpack.optimize.UglifyJsPlugin;
const info   = require('./package.json');

module.exports = {
  context: __dirname + '/dev/js',
  devtool: 'source-map',
  entry: {
    'scripts.min': './index.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ],
  },
  plugins: [
    new Uglify({
      compress: {warnings: false}
    }),
    new webpack.BannerPlugin(
      info.name + ' - v' + info.version + '\n' +
      new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) + '\n' +
      info.description + '\n' +
      info.homepage + '\n' +
      info.author
    )
  ]
};
