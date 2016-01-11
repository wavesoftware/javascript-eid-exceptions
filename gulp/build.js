/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var config = require('./config');

var toplevel = 'gulp/build/toplevel.js';

module.exports = {
  browserify: function() {
    // set up the browserify instance on a task basis
    var b = browserify({
      entries: toplevel,
      debug: true
    });

    return b.bundle()
      .pipe(source('eid.js'))
      .pipe(buffer())
          .on('error', gutil.log)
      .pipe(gulp.dest(config.dist + '/browser/toplevel'));
  },
  minified: function() {
    // set up the browserify instance on a task basis
    var b = browserify({
      entries: toplevel,
      debug: true
    });

    return b.bundle()
      .pipe(source('eid.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
          // Add transformation tasks to the pipeline here.
          .pipe(uglify())
          .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.dist + '/browser/toplevel'));
  }
};
