const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, options) => {
  return {
    devtool: options.mode === 'development' ? 'eval-source-map' : false,
    devServer: {
      // This will make the server understand "/some-link" routs instead of "/#/some-link"
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'public')
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'js/bundle.js'
    },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                autoprefixer: {
                  browsers: ['last 2 versions']
                },
                plugins: () => [autoprefixer]
              }
            },
            {
              loader: 'sass-loader',
              options: {}
            }
          ]
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/ start[id].css'
      })
      //new BundleAnalyzerPlugin()
    ],
    watchOptions: {
      ignored: ['/node_modules/']
    }
  };
};
