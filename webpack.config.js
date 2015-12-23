/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');

module.exports = {
  cache: true,
  entry: {
    main: './src/main/ts/eid.ts',
    vendor: [ 'babel-polyfill' ]
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './target/webpack'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      { test: /\.ts(x?)$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015!ts-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015'] } }
    ]
  },
  plugins: [],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
};
