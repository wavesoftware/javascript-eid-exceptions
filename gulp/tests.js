/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');
var coveralls = require('gulp-coveralls');
var config = require('./config');

module.exports = {
  lint: function () {
    return gulp.src(config.sources)
      .pipe(eslint({
        extends: 'eslint:recommended',
        rules: {
          strict: 2
        },
        env: {
      		node: true,
          browser: true
      	}
      }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },
  specs: function (done) {
    var prependToAll = function(path, globs) {
      var ret = [];
      for (var i = 0; i < globs.length; i++) {
        var value = globs[i];
        ret.push(path + '/' + value);
      }
      return ret;
    };
    var fs = require('fs');
    var target = config.target;
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }
    var pwd = process.cwd();
    process.chdir(target);
    var testSrc = prependToAll('..', config.testSources);
    var src = prependToAll('..', config.sources);
    var stream = gulp.src(testSrc, { read: false })
      .pipe(cover.instrument({
        pattern: src
      }))
      .pipe(mocha())
      .pipe(cover.gather());

    if (process.env.TRAVIS == 'true') {
      stream = stream.pipe(cover.format([
          { reporter: 'lcov' }
        ]))
        .pipe(coveralls());
    } else {
      stream = stream.pipe(cover.format([
          { reporter: 'html' },
          { reporter: 'json' },
          { reporter: 'lcov' }
        ]))
        .pipe(gulp.dest('reports'));
    }
    return stream.pipe(cover.enforce({
        statements: config.ceverageMin,
        blocks: config.ceverageMin,
        lines: config.ceverageMin,
      }))
      .on('end', function() {
        process.chdir(pwd);
      });
  }
};
