var expect = require('expect.js');
var EidRuntimeException =  require('../../lib/eid/exceptions').EidRuntimeException;
var EidNullPointerException =  require('../../lib/eid/exceptions').EidNullPointerException;
var EidIllegalArgumentException =  require('../../lib/eid/exceptions').EidIllegalArgumentException;
var EidIllegalStateException =  require('../../lib/eid/exceptions').EidIllegalStateException;
var EidIndexOfOfBoundsException =  require('../../lib/eid/exceptions').EidIndexOfOfBoundsException;

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
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
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
  });
});

describe('EidIllegalStateException', function() {
  var ex = new EidIllegalStateException('20160110:230112', 'A null pointer occured!');
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(/EidIllegalStateException: \[20160110:230112\]\<[a-z0-9]+\> A null pointer occured!/);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
  });
  it('should inherits Error and EidRuntimeException', function() {
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
  });
});

describe('EidIndexOfOfBoundsException', function() {
  var ex = new EidIndexOfOfBoundsException('20160110:230140', 'A null pointer occured!');
  it('should contain proper message', function() {
    expect(ex.toString()).to.match(/EidIndexOfOfBoundsException: \[20160110:230140\]\<[a-z0-9]+\> A null pointer occured!/);
  });
  it('should contain a stack trace', function() {
    expect(ex.stack).to.not.empty();
  });
  it('should inherits Error and EidRuntimeException', function() {
    expect(ex instanceof Error).to.be.ok();
    expect(ex instanceof EidRuntimeException).to.be.ok();
  });
});
