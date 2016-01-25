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

var expect = require('expect.js');
var EidRuntimeException =  require('../../lib/eid/exceptions').EidRuntimeException;
var EidNullPointerException =  require('../../lib/eid/exceptions').EidNullPointerException;
var EidIllegalArgumentException =  require('../../lib/eid/exceptions').EidIllegalArgumentException;
var EidIllegalStateException =  require('../../lib/eid/exceptions').EidIllegalStateException;
var EidIndexOutOfBoundsException =  require('../../lib/eid/exceptions').EidIndexOutOfBoundsException;

describe('EidRuntimeException', function() {
  var ex = new EidRuntimeException('20160110:230223', 'A null pointer occured!');
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(/EidRuntimeException: \[20160110:230223\]\<[a-z0-9]+\> A null pointer occured!/);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
  });
  it('should inherits Error', function() {
    expect(ex instanceof Error).to.be.ok();
  });
  it('should not inherits TypeError or other types of Eid*Exception', function() {
    expect(ex instanceof TypeError).not.to.be.ok();
    expect(ex instanceof EidIllegalStateException).not.to.be.ok();
    expect(ex instanceof EidIllegalArgumentException).not.to.be.ok();
    expect(ex instanceof EidIndexOutOfBoundsException).not.to.be.ok();
    expect(ex instanceof EidNullPointerException).not.to.be.ok();
  });
  describe('construction without passing eid object', function() {
    it('should fail with TypeError', function() {
      expect(function() { new EidRuntimeException() }).to.throwException(function(e) {
        expect(e.message).to.eql('You need to provide an valid Eid number to EidRuntimeExceptions, but given undefined');
        expect(e).to.be.a(TypeError);
      });
    });
  });
});

describe('EidNullPointerException', function() {
  var ex = new EidNullPointerException('20160110:223238', 'A null pointer occured!');
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(/EidNullPointerException: \[20160110:223238\]\<[a-z0-9]+\> A null pointer occured!/);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
  });
  it('should inherits Error and EidRuntimeException', function() {
    expect(ex instanceof EidNullPointerException).to.be.ok();
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
  });
  it('should not inherits TypeError or other types of Eid*Exception', function() {
    expect(ex instanceof TypeError).not.to.be.ok();
    expect(ex instanceof EidIllegalStateException).not.to.be.ok();
    expect(ex instanceof EidIllegalArgumentException).not.to.be.ok();
    expect(ex instanceof EidIndexOutOfBoundsException).not.to.be.ok();
  });
});

describe('EidIllegalArgumentException', function() {
  var ex = new EidIllegalArgumentException('20160110:230031', 'A null pointer occured!');
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(/EidIllegalArgumentException: \[20160110:230031\]\<[a-z0-9]+\> A null pointer occured!/);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
  });
  it('should inherits Error and EidRuntimeException', function() {
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
    expect(ex instanceof EidIllegalArgumentException).to.be.ok();
  });
  it('should not inherits TypeError or other types of Eid*Exception', function() {
    expect(ex instanceof TypeError).not.to.be.ok();
    expect(ex instanceof EidIllegalStateException).not.to.be.ok();
    expect(ex instanceof EidNullPointerException).not.to.be.ok();
    expect(ex instanceof EidIndexOutOfBoundsException).not.to.be.ok();
  });
});

describe('EidIllegalStateException', function() {
  var ex = new EidIllegalStateException('20160110:230112', 'Illegal state!');
  var regex = /EidIllegalStateException: \[20160110:230112\]\<[a-z0-9]+\> Illegal state!/;
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(regex);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
    expect(ex.stack).to.match(regex);
  });
  it('should inherits Error and EidRuntimeException', function() {
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
    expect(ex instanceof EidIllegalStateException).to.be.ok();
  });
  it('should not inherits TypeError or other types of Eid*Exception', function() {
    expect(ex instanceof TypeError).not.to.be.ok();
    expect(ex instanceof EidIllegalArgumentException).not.to.be.ok();
    expect(ex instanceof EidNullPointerException).not.to.be.ok();
    expect(ex instanceof EidIndexOutOfBoundsException).not.to.be.ok();
  });
});

describe('EidIndexOutOfBoundsException', function() {
  var ex = new EidIndexOutOfBoundsException('20160110:230140', 'Index is out of bounds!');
  var regex = /EidIndexOutOfBoundsException: \[20160110:230140\]\<[a-z0-9]+\> Index is out of bounds!/;
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(regex);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
    expect(ex.stack).to.match(regex);
  });
  it('should inherits Error and EidRuntimeException', function() {
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
    expect(ex instanceof EidIndexOutOfBoundsException).to.be.ok();
  });
  it('should not inherits TypeError or other types of Eid*Exception', function() {
    expect(ex instanceof TypeError).not.to.be.ok();
    expect(ex instanceof EidIllegalArgumentException).not.to.be.ok();
    expect(ex instanceof EidIllegalStateException).not.to.be.ok();
    expect(ex instanceof EidNullPointerException).not.to.be.ok();
  });
});
