/*
 * Copyright 2016 Wave Software
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var EidPreconditions = require('../../lib/eid/preconditions');
var EidNullPointerException = require('../../lib/eid/exceptions').EidNullPointerException;
var EidIllegalArgumentException = require('../../lib/eid/exceptions').EidIllegalArgumentException;
var EidIllegalStateException = require('../../lib/eid/exceptions').EidIllegalStateException;
var EidIndexOutOfBoundsException = require('../../lib/eid/exceptions').EidIndexOutOfBoundsException;
var EidRuntimeException = require('../../lib/eid/exceptions').EidRuntimeException;
var Eid = require('../../lib/eid');
var expect = require('expect.js');

describe('EidPreconditions', function() {
  var eid = '20160111:004403';
  var eidRegex = /20160111:004403/;

  describe('.checkNotNullable()', function() {
    describe('giving a null value', function() {
      it('should throw EidNullPointerException', function() {
        var fn = function() {
          EidPreconditions.checkNotNullable(null, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e.message).to.match(eidRegex);
          expect(e).to.be.a(EidNullPointerException);
          expect(e).not.to.be.a(TypeError);
        });
      });
    });
    describe('giving a undefined value', function() {
      it('should throw EidNullPointerException', function() {
        var fn = function() {
          EidPreconditions.checkNotNullable(undefined, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e.message).to.match(eidRegex);
          expect(e).to.be.a(EidNullPointerException);
          expect(e).not.to.be.a(TypeError);
        });
      });
    });
    describe('giving a string value', function() {
      it('should return original value', function() {
        var given = 'YjdlYjExZGQ0MzY3YjIxO';
        var result = EidPreconditions.checkNotNullable(given, eid);
        expect(result).to.be(given);
      });
    });
  });


  describe('.checkNotNull()', function() {
    describe('giving a null value', function() {
      it('should throw EidNullPointerException', function() {
        var fn = function() {
          EidPreconditions.checkNotNull(null, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e.message).to.match(eidRegex);
          expect(e).to.be.a(EidNullPointerException);
          expect(e).not.to.be.a(TypeError);
        });
      });
    });
    describe('giving a string value', function() {
      it('should return original value', function() {
        var given = 'YjdlYjExZGQ0MzY3YjIxO';
        var result = EidPreconditions.checkNotNull(given, eid);
        expect(result).to.be(given);
      });
    });
  });


  describe('.checkNotUndefined()', function() {
    describe('giving a undefined value', function() {
      it('should throw EidNullPointerException', function() {
        var fn = function() {
          EidPreconditions.checkNotUndefined(undefined, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e.message).to.match(eidRegex);
          expect(e).to.be.a(EidNullPointerException);
          expect(e).not.to.be.a(TypeError);
        });
      });
    });
    describe('giving a string value', function() {
      it('should return original value', function() {
        var given = 'YjdlYjExZGQ0MzY3YjIxO';
        var result = EidPreconditions.checkNotUndefined(given, eid);
        expect(result).to.be(given);
      });
    });
  });


  describe('.checkArgument()', function() {
    describe('giving an Eid object', function() {
      var eidObject = new Eid(eid);
      it('should run without errors', function() {
        var fn = function() {
          EidPreconditions.checkArgument(true, eidObject);
        };
        expect(fn).not.to.throwException();
      });
    });
    describe('giving a nullable value', function() {
      it('should throw TypeError', function() {
        var fn = function() {
          EidPreconditions.checkArgument(true, undefined);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(/Pass not-null Eid to EidPreconditions first!/);
          expect(e).to.be.a(TypeError);
        });
      });
    });
    describe('giving a falsy value', function() {
      it('should throw EidIllegalArgumentException', function() {
        var fn = function() {
          EidPreconditions.checkArgument(false, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e).to.be.a(EidIllegalArgumentException);
        });
      });
    });
  });


  describe('.checkState()', function() {
    describe('giving a falsy value', function() {
      it('should throw EidIllegalStateException', function() {
        var fn = function() {
          EidPreconditions.checkState(false, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e).to.be.a(EidIllegalStateException);
        });
      });
    });
  });


  describe('.checkElementIndex()', function() {
    describe('giving a invalid size of -6', function() {
      it('should throw EidIllegalArgumentException', function() {
        var fn = function() {
          EidPreconditions.checkElementIndex(0, -6, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e).to.be.a(EidIllegalArgumentException);
        });
      });
    });
    describe('giving a invalid index value of 6, and size of 2', function() {
      it('should throw EidIndexOutOfBoundsException', function() {
        var fn = function() {
          EidPreconditions.checkElementIndex(6, 2, eid);
        };
        expect(fn).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e).to.be.a(EidIndexOutOfBoundsException);
        });
      });
    });
    describe('giving a valid index of 2 and size of 5', function() {
      it('should return index of 2', function() {
        var result = EidPreconditions.checkElementIndex(2, 5, eid);
        expect(result).to.be(2);
      });
    });
  });


  describe('.tryToExecute()', function() {
    describe('giving a valid supplier function', function() {
      it('should return supplier value', function() {
        var fn = function() {
          return 6;
        };
        var result = EidPreconditions.tryToExecute(fn, eid);
        expect(result).to.be(6);
      });
    });
    describe('giving a supplier that throws TypeError function', function() {
      it('should throw EidRuntimeException', function() {
        var fn = function() {
          throw new TypeError('invalid type!');
        };
        var testClousure = function() {
          EidPreconditions.tryToExecute(fn, eid);
        };
        expect(testClousure).to.throwException(function(e) {
          expect(e.toString()).to.match(eidRegex);
          expect(e.toString()).to.match(/invalid type!/);
          expect(e).to.be.a(EidRuntimeException);
        });
      });
    });
  });
});
