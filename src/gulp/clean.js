'use strict';

var del = require('del');
var gutil = require('gulp-util');
var fs = require('fs');

function run(directory, done) {
  fs.stat(directory, function(err){
    if (err) {
      // Never existed
      done();
    }
    else {
      del([directory], { force: true })
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
  run: function(done) { return run('./target', done); },
  runOnWebPack: function(done) { return run('./target/webpack', done); }
};
