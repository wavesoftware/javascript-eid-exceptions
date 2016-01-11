/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var through = require('through2');
var globby = require('globby');
var config = require('./config');

module.exports = {
  browserify: function() {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
      // turns the output bundle stream into a stream containing
      // the normal attributes gulp plugins expect.
      .pipe(source('eid.js'))
      // the rest of the gulp task, as you would normally write it.
      // here we're copying from the Browserify + Uglify2 recipe.
      .pipe(buffer())
        .on('error', gutil.log)
      .pipe(gulp.dest(config.dist + '/browser/js'));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(config.sources).then(function(entries) {
      // create the Browserify instance.
      var b = browserify({
        entries: entries,
        debug: true
      });

      // pipe the Browserify stream into the stream we created earlier
      // this starts our gulp pipeline.
      b.bundle().pipe(bundledStream);
    }).catch(function(err) {
      // ensure any errors from globby are handled
      bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
  },
  minified: function() {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
      // turns the output bundle stream into a stream containing
      // the normal attributes gulp plugins expect.
      .pipe(source('eid.min.js'))
      // the rest of the gulp task, as you would normally write it.
      // here we're copying from the Browserify + Uglify2 recipe.
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        // Add gulp plugins to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.dist + '/browser/js'));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(config.sources).then(function(entries) {
      // create the Browserify instance.
      var b = browserify({
        entries: entries,
        debug: true
      });

      // pipe the Browserify stream into the stream we created earlier
      // this starts our gulp pipeline.
      b.bundle().pipe(bundledStream);
    }).catch(function(err) {
      // ensure any errors from globby are handled
      bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
  }
};
