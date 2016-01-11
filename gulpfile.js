/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var through = require('through2');
var globby = require('globby');

var sources = ['lib/**/*.js'];
var testSources = ['test/**/*.js'];

gulp.task('lint', function () {
  return gulp.src(sources)
    .pipe(eslint({
      extends: 'eslint:recommended',
      rules: {
        strict: 2
      },
      env: {
    		node: true
    	}
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], function (done) {
  var prependToAll = function(path, globs) {
    var ret = [];
    for (var v of globs) {
      ret.push(path + '/' + v);
    }
    return ret;
  };
  var fs = require('fs');
  var target = 'target';
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }
  var pwd = process.cwd();
  process.chdir(target);
  var testSrc = prependToAll('..', testSources);
  var src = prependToAll('..', sources);
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
    .pipe(gulp.dest('reports'))
    .on('end', function() {
      process.chdir(pwd);
    });
});
gulp.task('watch', function() {
  gulp.watch(sources.concat(testSources), ['test']);
});
gulp.task('build-browser', ['test'], function() {
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
    .pipe(gulp.dest('dist/browser/js/'));

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(['./lib/**/*.js']).then(function(entries) {
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
});
gulp.task('build-minified', ['test'], function() {
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
    .pipe(gulp.dest('dist/browser/js/'));

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(['./lib/**/*.js']).then(function(entries) {
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
});
gulp.task('build', ['build-minified', 'build-browser']);
gulp.task('default', ['lint', 'test', 'build']);
