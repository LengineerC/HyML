const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

const RENDERER_ENTRY=path.resolve(__dirname,"../src/renderer/index.js");
// const MAIN_PATH=path.resolve(__dirname,"../src/main/main.js");

module.exports = {
  entry: {
    renderer: RENDERER_ENTRY,
    // main: MAIN_PATH,
  },
  output: {
    path: path.resolve(__dirname, '../dist/renderer'),
    filename: '[name].bundle.js',

  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|webp|jpg|jpeg)$/,
        type: 'asset/resource'
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,"../src/renderer/index.html"),
      filename: 'index.html',
      inject: 'body', 
    }),
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      TextEncoder: ['text-encoding', 'TextEncoder'],
      TextDecoder: ['text-encoding', 'TextDecoder'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      "util": require.resolve("util/"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "global": require.resolve("global/"),
      // "text-encoding": require.resolve("text-encoding/"),
    },
  },

};
