/* eslint-disable no-var, strict */
'use strict';

var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  // Documentation: https://karma-runner.github.io/0.13/config/configuration-file.html
  config.set({
    browsers: [ 'PhantomJS' ],

    files: [
      'src/test/ts/import-babel-polyfill.js', // This ensures we have the es6 shims in place from babel
      'src/test/ts/**/*.ts',
      'src/test/ts/**/*.tsx'
    ],

    port: 9876,

    frameworks: [ 'jasmine', 'phantomjs-shim' ],

    logLevel: config.LOG_INFO, //config.LOG_DEBUG

    preprocessors: {
      'src/test/ts/import-babel-polyfill.js': [ 'webpack', 'sourcemap' ],
      'src/main/ts/**/*.{ts,tsx}': [ 'webpack', 'sourcemap' ],
      'src/test/ts/**/*.{ts,tsx}': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha', 'junit', 'coverage' ],

    webpack: {
      devtool: 'eval-source-map', //'inline-source-map',
      debug: true,
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },

    webpackMiddleware: {
      quiet: true,
      stats: {
        colors: true
      }
    },

    // reporter options
    mochaReporter: {
      colors: {
        success: 'bgGreen',
        info: 'cyan',
        warning: 'bgBlue',
        error: 'bgRed'
      }
    },

    // the default configuration
    junitReporter: {
      outputDir: 'test-results', // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: ''
    },

    coverageReporter: {
      reporters:[
        {type: 'html', dir:'target/coverage/'},  // https://github.com/karma-runner/karma-coverage/issues/123
        {type: 'text'},
        {type: 'text-summary'}
      ],
    }
  });
};
