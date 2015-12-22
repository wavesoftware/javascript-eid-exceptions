/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var webpack = require('./src/gulp/webpack');
var tests = require('./src/gulp/tests');
var clean = require('./src/gulp/clean');

var lintSrcs = ['./src/gulp/**/*.js'];

gulp.task('delete-target', function (done) {
  clean.run(done);
});

gulp.task('build-process.env.NODE_ENV', function () {
  process.env.NODE_ENV = 'production';
});

gulp.task('build-js', ['delete-dist', 'build-process.env.NODE_ENV'], function(done) {
  webpack.build().then(function() { done(); });
});

gulp.task('build-other', ['delete-dist', 'build-process.env.NODE_ENV'], function() {
  staticFiles.build();
});

gulp.task('build', ['build-js', 'build-other', 'lint'], function () {
  inject.build();
});

gulp.task('lint', function () {
  return gulp.src(lintSrcs)
    .pipe(eslint())
    .pipe(eslint.format());
});
