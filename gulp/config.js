/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var directory = {
  lib: 'lib',
  test: 'test',
  target: 'target',
  dist: 'dist'
};

module.exports = {
  sources: [ directory.lib + '/**/*.js' ],
  testSources: [ directory.test + '/**/*.js' ],
  lib: directory.lib,
  test: directory.test,
  target: directory.target,
  dist: directory.dist,
  ceverageMin: 98
};
