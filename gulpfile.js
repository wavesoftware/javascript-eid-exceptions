/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');

var sources = ['./lib/**/*.js'];
var testSources = ['./test/**/*.js'];

gulp.task('lint', function () {
  return gulp.src(sources)
    .pipe(eslint({
      extends: 'eslint:recommended',
      ecmaFeatures: {
        'modules': true
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', [], function (done) {
  return gulp.src(testSources, { read: false })
    .pipe(cover.instrument({
        pattern: sources,
        debugDirectory: 'debug'
    }))
    .pipe(mocha())
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('reports'));
});
gulp.task('watch', function() {
  gulp.watch(sources.concat(testSources), ['test']);
});
gulp.task('default', ['lint', 'test']);
