var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task('default', function() {
  // place code for your default task here
  return gulp.src("src/main/js/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat("eid.js"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("target"));
});
