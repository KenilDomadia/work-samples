const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const dotENVPlugin = new Dotenv({
  systemvars: true
});

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true
  },
  plugins: [dotENVPlugin]
});
