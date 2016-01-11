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
    return gulp.src(testSrc, { read: false })
      .pipe(cover.instrument({
        pattern: src,
        debugDirectory: 'debug'
      }))
      .pipe(mocha())
      .pipe(cover.gather())
      .pipe(cover.enforce({
        statements: 98,
        blocks: 98,
        lines: 98,
      }))
      .pipe(cover.format([
        { reporter: 'html', outFile: 'coverage.html' },
        { reporter: 'json', outFile: 'coverage.json' },
        { reporter: 'lcov', outFile: 'coverage.lcov' },
      ]))
      .pipe(coveralls())
      .pipe(gulp.dest('reports'))
      .on('end', function() {
        process.chdir(pwd);
      });
  }
};
