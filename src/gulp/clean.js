'use strict';

var del = require('del');
var gutil = require('gulp-util');
var fs = require('fs');

function run(done) {
  fs.stat('./target', function(err){
    if (err) {
      // Never existed
      done();
    }
    else {
      del(['./target'], { force: true })
        .then(function(paths) {
          gutil.log('Deleted files/folders:\n', paths.join('\n'));
          done();
        })
        .catch(function(error) {
          gutil.log('Problem deleting:\n', error);
          done();
        });
    }
  });
}

module.exports = {
  run: function(done) { return run(done); }
};