const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './public/index.html',
  filename: './index.html'
});

const babelLoaderRule = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: ['babel-loader']
};
const cssLoaderRule = {
  test: /\.css$/,
  use: [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1,
        localIdentName: '[name]_[local]_[hash:base64]',
        sourceMap: process.env.NODE_ENV === 'development',
        minimize: true
      }
    }
  ]
};
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundled.js'
  },
  module: {
    rules: [babelLoaderRule, cssLoaderRule]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  plugins: [htmlPlugin]
};
