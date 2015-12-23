'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var glob = require('glob');

function injectIndex(options) {
  function run() {
    var target = gulp.src('./src/test/html/index.html');
    var sources = gulp.src([
      './target/webpack/vendor*.js',
      './target/webpack/main*.js'
    ], { read: false });
    var injectOptions = { ignorePath: '/target/', addRootSlash: false };
    return target
      .pipe(inject(sources, injectOptions))
      .pipe(gulp.dest('./target'));
  }

  var jsCssGlob = './target/**/*.{js,css}';

  if (options.shouldWatch) {
    gulp.watch(jsCssGlob, function(evt) {
      if (evt.path && evt.type === 'changed') {
        run(evt.path);
      }
    });
  } else {
    run('initial build');
  }
}

module.exports = {
  build: function() { return injectIndex({ shouldWatch: false }); },
  watch: function() { return injectIndex({ shouldWatch: true  }); }
};
