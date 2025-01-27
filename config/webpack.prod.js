const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  output:{
    publicPath: './',
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    // minimizer: [new TerserWebpackPlugin()], 
  },
});
