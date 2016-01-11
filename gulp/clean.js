/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var fs = require('fs');
var config = require('./config');

var deleteFolderRecursive = function(path) {
  var files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function() {
  deleteFolderRecursive(config.target);
  deleteFolderRecursive(config.dist);
};
