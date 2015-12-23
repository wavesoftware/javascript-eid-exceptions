/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var webpack = require('./src/gulp/webpack');
var tests = require('./src/gulp/tests');
var staticFiles = require('./src/gulp/staticFiles');
var inject = require('./src/gulp/inject');
var clean = require('./src/gulp/clean');
var karma = require('karma');

var lintSrcs = ['./src/gulp/**/*.js'];

gulp.task('clean', function (done) {
  clean.run(done);
});

gulp.task('build-process.env.NODE_ENV', function () {
  process.env.NODE_ENV = 'production';
});

gulp.task('build-js', ['build-process.env.NODE_ENV'], function(done) {
  webpack.build().then(function() { done(); });
});

gulp.task('build-other', ['build-process.env.NODE_ENV'], function() {
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

gulp.task('test', [], function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', ['build'], function() {});

gulp.task('serve', ['watch'], function() {
  connect.server({
    root: './target',
    port: 8080
  });
});
