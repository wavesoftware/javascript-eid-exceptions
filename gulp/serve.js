/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var serve = require('gulp-serve');
var config = require('./config');

module.exports = serve([ config.test, config.dist ]);
