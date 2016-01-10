'use strict';

var Eid = require('../eid');
var commonExConstructor = function(eid, message) {
  if (!(eid instanceof Eid)) {
    eid = new Eid(eid.toString());
  }
  this.message = message !== undefined ? (eid + " " + message) : eid;
  this.eid = eid;
}
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
    this.name = 'EidRuntimeException';
    commonExConstructor.apply(this, [eid, message]);
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
    this.name = 'EidNullPointerException';
    commonExConstructor.apply(this, [eid, message]);
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
    this.name = 'EidIllegalArgumentException';
    commonExConstructor.apply(this, [eid, message]);
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
    this.name = 'EidIllegalStateException';
    commonExConstructor.apply(this, [eid, message]);
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
    this.name = 'EidIndexOfOfBoundsException';
    commonExConstructor.apply(this, [eid, message]);
  }
  EidIndexOfOfBoundsException.prototype = EidRuntimeException.prototype;
  return EidIndexOfOfBoundsException;
})();

exports.EidRuntimeException = EidRuntimeException;
exports.EidNullPointerException = EidNullPointerException;
exports.EidIllegalArgumentException = EidIllegalArgumentException;
exports.EidIllegalStateException = EidIllegalStateException;
exports.EidIndexOfOfBoundsException = EidIndexOfOfBoundsException;
