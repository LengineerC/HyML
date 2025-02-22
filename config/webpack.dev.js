const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpack = require('webpack');
const path=require('path');

module.exports = merge(baseConfig, {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  output:{
    publicPath: '/',
  },
  devServer: {
    static: path.resolve(__dirname, '../src/renderer'),
    hot: true,
    port: 3000,
    open: false,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), 
  ],
});

