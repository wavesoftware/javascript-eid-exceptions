/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');

var tests = require('./gulp/tests');
var build = require('./gulp/build');
var clean = require('./gulp/clean');

gulp.task('clean', clean);
gulp.task('lint', tests.lint);
gulp.task('specs', ['lint'], tests.specs);
gulp.task('test', ['lint', 'specs']);
gulp.task('watch', function() {
  gulp.watch(sources.concat(testSources), ['test']);
});
gulp.task('build-browser', ['test'], build.browserify);
gulp.task('build-minified', ['test'], build.minified);
gulp.task('build', ['build-browser', 'build-minified']);
gulp.task('default', ['test', 'build']);
