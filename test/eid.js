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

var Eid = require('../lib/eid');
var expect = require('expect.js');

describe('Eid', function() {
  describe('.setFormat()', function () {
    afterEach(function() {
      Eid.setFormat(Eid.DEFAULT_FORMAT);
    });
    it('should set a valid new format and return last', function() {
      var fmt = "{%s-%s}";
      var prev = Eid.setFormat(fmt);
      expect(prev).to.eql(Eid.DEFAULT_FORMAT);

      prev = Eid.setFormat(fmt);
      expect(prev).to.eql(fmt);
    });
    it('should throw error on null', function() {
      var fn = function() {
        Eid.setFormat(null);
      };
      expect(fn).to.throwError(TypeError, 'Format can\'t be null, but just received one');
    });
    it('should throw error on invalid format', function() {
      var fn = function() {
        Eid.setFormat("%s -->");
      };
      expect(fn).to.throwError(TypeError);
      expect(fn).to.throwError(/Given format contains to little format specifiers, expected 2 but given "\%s \-\-\>"/);
    });
  });

  describe('.setRefFormat()', function() {
    afterEach(function() {
      Eid.setRefFormat(Eid.DEFAULT_REF_FORMAT);
    });
    it('should set a valid new ref format and return last', function() {
      var fmt = "%s:%s --> %s";
      var prev = Eid.setRefFormat(fmt);
      expect(prev).to.eql(Eid.DEFAULT_REF_FORMAT);
    });
  });

  describe('.setMessageFormat()', function() {
    afterEach(function() {
      Eid.setMessageFormat(Eid.DEFAULT_MESSAGE_FORMAT);
    });
    it('should set a valid new message format and return last', function() {
      var fmt = "%s --> %s";
      var prev = Eid.setMessageFormat(fmt);
      expect(prev).to.eql(Eid.DEFAULT_MESSAGE_FORMAT);
    });
  });

  describe('.getMessageFormat()', function() {
    it('should return original actually set message format', function() {
      var fmt = Eid.getMessageFormat();
      expect(fmt).to.eql(Eid.DEFAULT_MESSAGE_FORMAT);
    })
  });

  describe('.setUniqIdGenerator()', function() {
    afterEach(function() {
      Eid.setUniqIdGenerator(Eid.DEFAULT_UNIQ_ID_GENERATOR);
    });
    it('should throw error if given null', function() {
      var fn = function() {
        Eid.setUniqIdGenerator(null);
      }
      expect(fn).to.throwException(TypeError);
      expect(fn).to.throwException(/^Unique ID generator can't be null, but given one$/);
    });
    it('should set properlly if given correct implementation', function() {
      var gen = {
        generateUniqId: function() {
          return 5; // just like SONY here :-)
        }
      };
      var prev = Eid.setUniqIdGenerator(gen);
      expect(prev).to.be(Eid.DEFAULT_UNIQ_ID_GENERATOR);
      var eid = new Eid('20160110:221413');
      expect(eid.toString()).to.eql('[20160110:221413]<5>');
    });
  });

  describe('.DEFAULT_MESSAGE_FORMAT', function() {
    it('should be equal "%s => %s"', function() {
      expect(Eid.DEFAULT_MESSAGE_FORMAT).to.eql("%s => %s");
    });
  });

  describe('.DEFAULT_FORMAT', function() {
    it('should be equal "[%s]<%s>"', function() {
      expect(Eid.DEFAULT_FORMAT).to.eql("[%s]<%s>");
    });
  });

  describe('.DEFAULT_REF_FORMAT', function() {
    it('should be equal "[%s|%s]<%s>"', function() {
      expect(Eid.DEFAULT_REF_FORMAT).to.eql("[%s|%s]<%s>");
    });
  });

  describe('.DEFAULT_UNIQ_ID_GENERATOR', function() {
    it('should be instance of UniqIdGenerator', function() {
      expect(Eid.DEFAULT_UNIQ_ID_GENERATOR.generateUniqId()).to.match(/^[a-z0-9]{5,6}$/);
    });
  });

  describe('#toString()', function() {
    describe('without ref number', function() {
      var subject = new Eid('20160110:214452');
      it('should print object with eid and uniq id', function() {
        expect(subject.toString()).to.match(/^\[20160110:214452]\<[a-z0-9]{5,6}\>$/);
      });
    });
    describe('with ref number', function() {
      var subject = new Eid('20160110:214944', 'ORA-1029');
      it('should print object with eid, ref and uniq id', function() {
        expect(subject.toString()).to.match(/^\[20160110:214944\|ORA-1029\]\<[a-z0-9]{5,6}\>$/);
      });
    });
  });

  describe('#makeLogMessage()', function() {
    var eid = new Eid('20160110:215138');
    var messageFormat = "My test object is: %s";
    var testObject = { 'a': 67 };
    testObject.toString = function() {
      return JSON.stringify(this);
    };
    it('should print log message as: [20160110:215138]<xxxxx> => My test object is: {"a":67}', function() {
      expect(eid.makeLogMessage(messageFormat, testObject)).to.match(/^\[20160110:215138\]\<[a-z0-9]{5,6}\> => My test object is: {"a":67}$/);
    });
  });

  describe('given a eid == new Eid("20160110:220223", "EX-556")', function() {
    var eid = new Eid('20160110:220223', 'EX-556');
    describe('#getId()', function() {
      it('should return 20160110:220223 as id', function() {
        expect(eid.getId()).to.be('20160110:220223');
      });
    });
    describe('#getRef()', function() {
      it('should return EX-556 as ref', function() {
        expect(eid.getRef()).to.be('EX-556');
      });
    });
    describe('#getUniq()', function() {
      it('should return xxxxxx as uniq id', function() {
        expect(eid.getUniq()).to.match(/^[a-z0-9]{5,6}$/);
      });
    });
  });
});
