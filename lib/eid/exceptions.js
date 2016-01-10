'use strict';

var Eid = require('../eid');

var EidRuntimeException = (function() {
  /**
   * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
   * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
   * <p>
   * This exception class is baseline of all Eid runtime exception classes. It is designed to ease of use and provide strict ID for
   * given Exception usage. This approach speed up development of large application and helps support teams to by giving the both
   * static and random ID for each possible unpredicted bug.
   * <p>
   * This is best to use with tools and plugins like
   * <a href="http://plugins.netbeans.org/plugin/53137/exception-id-eid-generator">EidGenerator for Netbeans IDE</a>
   * <p>
   * For convenience use {@link eid.Preconditions}
   *
   * @constructor
   * @param {string} eid - an exception Id, should be generated
   * @param {string} message - an message for the exception
   * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
   */
  function EidRuntimeException(eid, message) {
    if (!(eid instanceof Eid)) {
      eid = new Eid(eid.toString());
    }
    this.name = 'EidRuntimeException';
    this.message = eid + " " + message;
    this.eid = eid;
  }
  EidRuntimeException.prototype = new Error();
  return EidRuntimeException;
})();

var EidNullPointerException = (function() {
  /**
   * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
   * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
   * <p>
   * This id Eid version of {@link NullPointerException}
   *
   * @constructor
   * @param {string} eid - an exception Id, should be generated
   * @param {string} message - an message for the exception
   * @see NullPointerException
   * @see EidRuntimeException
   * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
   */
  function EidNullPointerException(eid, message) {
    if (!(eid instanceof Eid)) {
      eid = new Eid(eid.toString());
    }
    this.name = 'EidNullPointerException';
    this.message = eid + " " + message;
    this.eid = eid;
  }
  EidNullPointerException.prototype = EidRuntimeException.prototype;
  return EidNullPointerException;
})();

var EidIllegalArgumentException = (function() {
  /**
   * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
   * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
   * <p>
   * This is Eid version of {@link IllegalArgumentException}
   *
   * @constructor
   * @param {string} eid - an exception Id, should be generated
   * @param {string} message - an message for the exception
   * @see IllegalArgumentException
   * @see EidRuntimeException
   * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
   */
  function EidIllegalArgumentException(eid, message) {
    if (!(eid instanceof Eid)) {
      eid = new Eid(eid.toString());
    }
    this.name = 'EidIllegalArgumentException';
    this.message = eid + " " + message;
    this.eid = eid;
  }
  EidIllegalArgumentException.prototype = EidRuntimeException.prototype;
  return EidIllegalArgumentException;
})();

var EidIllegalStateException = (function() {
  /**
   * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
   * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
   * <p>
   * This id Eid version of {@link IllegalStateException}
   *
   * @constructor
   * @param {string} eid - an exception Id, should be generated
   * @param {string} message - an message for the exception
   * @see IllegalStateException
   * @see EidRuntimeException
   * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
   */
  function EidIllegalStateException(eid, message) {
    if (!(eid instanceof Eid)) {
      eid = new Eid(eid.toString());
    }
    this.name = 'EidIllegalStateException';
    this.message = eid + " " + message;
    this.eid = eid;
  }
  EidIllegalStateException.prototype = EidRuntimeException.prototype;
  return EidIllegalStateException;
})();

var EidIndexOfOfBoundsException = (function() {
  /**
   * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
   * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
   * <p>
   * This id Eid version of {@link IndexOutOfBoundsException}
   *
   * @constructor
   * @param {string} eid - an exception Id, should be generated
   * @param {string} message - an message for the exception
   * @see IndexOutOfBoundsException
   * @see EidRuntimeException
   * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
   */
  function EidIndexOfOfBoundsException(eid, message) {
    if (!(eid instanceof Eid)) {
      eid = new Eid(eid.toString());
    }
    this.name = 'EidIndexOfOfBoundsException';
    this.message = eid + " " + message;
    this.eid = eid;
  }
  EidIndexOfOfBoundsException.prototype = EidRuntimeException.prototype;
  return EidIndexOfOfBoundsException;
})();

exports.EidRuntimeException = EidRuntimeException;
exports.EidNullPointerException = EidNullPointerException;
exports.EidIllegalArgumentException = EidIllegalArgumentException;
exports.EidIllegalStateException = EidIllegalStateException;
exports.EidIndexOfOfBoundsException = EidIndexOfOfBoundsException;
