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

(function(exports) {
  'use strict';

  var Eid = require('./eid');

  var prepareMessage = function(eid, message) {
    return message !== undefined ? (eid + " " + message) : eid;
  };

  var validateEid = function(eid) {
    if (eid === undefined) {
      throw new TypeError('You need to provide an valid Eid number to EidRuntimeExceptions, but given undefined');
    }
    if (!(eid instanceof Eid)) {
      eid = new Eid(eid.toString());
    }
    return eid;
  };

  var CorrectStackTrace = {
    modern: function(target, constructor) {
      Error.captureStackTrace(target, constructor);
    },
    fixLegancyStackTrace: function(stack, stringified) {
      var st = stack;
      if (typeof(stack) !== 'string') {
        // On IE the stack field is empty so setting to toString() :-/
        st = stringified;
      }
      // Hands down, if all fails, just replace Error with nice Eid string
      if (st.indexOf(stringified) < 0) {
        st = st.replace(/^(?:Error\n)?/, stringified + "\n").trim();
      }
      return st;
    },
    legancy: function(target, constructor, exceptionConstructor) {
      // Hacks for IE an Edge
      var stringified = target.toString();
      // try to fetch stacktrace from JS standard Error
      var st = (new exceptionConstructor()).stack;
      target.stack = CorrectStackTrace.fixLegancyStackTrace(st, stringified);
    }
  };
  CorrectStackTrace.fixLegancyStackTrace('Error\n');
  CorrectStackTrace.legancy({}, null, Object);

  var correctStackTrace = function(target, constructor) {
    var handler = typeof(Error.captureStackTrace) === 'function' ?
        CorrectStackTrace.modern : CorrectStackTrace.legancy;
    handler(target, constructor, Error);
  };

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
    eid = validateEid(eid);
    message = prepareMessage(eid, message);
    var tmp = Error.apply(this, [message]);
    tmp.name = this.name = 'EidRuntimeException';
    this.message = tmp.message;
    this.eid = eid;
    correctStackTrace(this, EidRuntimeException);

    return this;
  }
  EidRuntimeException.prototype = Object.create(Error.prototype, {
    constructor: { value: EidRuntimeException }
  });

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
    var tmp = EidRuntimeException.apply(this, [eid, message]);
    tmp.name = this.name = 'EidNullPointerException';
    correctStackTrace(this, EidNullPointerException);
    return this;
  }
  EidNullPointerException.prototype = Object.create(EidRuntimeException.prototype, {
    constructor: { value: EidNullPointerException }
  });

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
    var tmp = EidRuntimeException.apply(this, [eid, message]);
    tmp.name = this.name = 'EidIllegalArgumentException';
    correctStackTrace(this, EidIllegalArgumentException);
    return this;
  }
  EidIllegalArgumentException.prototype = Object.create(EidRuntimeException.prototype, {
    constructor: { value: EidIllegalArgumentException }
  });

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
    var tmp = EidRuntimeException.apply(this, [eid, message]);
    tmp.name = this.name = 'EidIllegalStateException';
    correctStackTrace(this, EidIllegalStateException);
    return this;
  }
  EidIllegalStateException.prototype = Object.create(EidRuntimeException.prototype, {
    constructor: { value: EidIllegalStateException }
  });

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
  function EidIndexOutOfBoundsException(eid, message) {
    var tmp = EidRuntimeException.apply(this, [eid, message]);
    tmp.name = this.name = 'EidIndexOutOfBoundsException';
    correctStackTrace(this, EidIndexOutOfBoundsException);
    return this;
  }
  EidIndexOutOfBoundsException.prototype = Object.create(EidRuntimeException.prototype, {
    constructor: { value: EidIndexOutOfBoundsException }
  });

  exports.EidRuntimeException = EidRuntimeException;
  exports.EidNullPointerException = EidNullPointerException;
  exports.EidIllegalArgumentException = EidIllegalArgumentException;
  exports.EidIllegalStateException = EidIllegalStateException;
  exports.EidIndexOutOfBoundsException = EidIndexOutOfBoundsException;

})(exports);
