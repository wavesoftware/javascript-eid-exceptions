(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

(function(wnd) {
  'use strict';
  wnd.Eid = require('../../lib/eid');
})(window);

},{"../../lib/eid":2}],2:[function(require,module,exports){
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

(function(module) {
'use strict';

var Eid = require('./eid/eid');
Eid.preconditions = require('./eid/preconditions');
Eid.exceptions = require('./eid/exceptions');

module.exports = Eid;

})(module);

},{"./eid/eid":3,"./eid/exceptions":4,"./eid/preconditions":5}],3:[function(require,module,exports){
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

(function(module) {
'use strict';

function JFormatter(format) {
  this.format = function(arr) {
    var args = [];
    if (arguments.length === 1 && typeof(arr) === 'object') {
      args = arr;
    } else {
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }
    var regex = /%s/;
    var _r = function(p,c) { return p.replace(regex, c); }
    return args.reduce(_r, format);
  };
}

/**
 * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
 * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
 * <p>
 * Exception identifier for all Eid Runtime Exceptions.
 * @constructor
 * @param {string} id - the exception id, must be unique developer inserted string, from date
 * @param {string} ref - an optional reference
 */
function Eid(id, ref) {
  var uniq = EidInternal.uniqIdGenerator.generateUniqId();
  ref = (ref === null || ref == undefined) ? "" : ref;

  /**
   * Makes a log message from this EID object
   * <p>
   * <p>This method is for convenience of usage of EID in logging. You can use it like this:
   * <p>
   * <pre>
   * log.debug(new Eid("20151025:202129").makeLogMessage("A request: %s", request));
   * </pre>
   * @param {string} logMessageFormat - a log message format as accepted by {@link String#format(String, Object...)}
   * @param {Object...} parameters - a parameters for logMessageFormat to by passed to {@link String#format(String, Object...)}
   * @return {string} a formatted message
   */
  this.makeLogMessage = function(logMessageFormat) {
    var parameters = [];
    for (var i = 1; i < arguments.length; i++) {
      parameters.push(arguments[i]);
    }
    var message = new JFormatter(logMessageFormat).format(parameters);
    return new JFormatter(Eid.getMessageFormat()).format(this.toString(), message);
  }

  /**
   * Standard to string method
   */
  this.toString = function() {
      if ("" === ref) {
          return new JFormatter(EidInternal.format).format(id, uniq);
      }
      return new JFormatter(EidInternal.refFormat).format(id, ref, uniq);
  }

  /**
   * Getter for constant Exception ID
   *
   * @return {string} ID of exception
   */
  this.getId = function() {
      return id;
  }

  /**
   * Get custom ref passed to Exception ID
   *
   * @return {string} ID of exception
   */
  this.getRef = function() {
      return ref;
  }

  /**
   * Gets unique generated string for this instance of Eid
   *
   * @return {string} a unique string
   */
  this.getUniq = function() {
      return uniq;
  }
}

function MathRandom() {
  var LONG_MAX = Math.pow(2, 53) - 1;
  var LONG_MIN = -1 * Math.pow(2, 53);
  this.nextLong = function() {
    return this.nextNumber(LONG_MIN, LONG_MAX);
  };
  this.nextInt = function(max) {
    return this.nextNumber(0, max);
  };
  this.nextNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}

function StdUniqIdGenerator() {
  var BASE36 = 36;
  var INTEGER_MAX_VALUE = Math.pow(2, 31);
  var MIN_6_CHAR_HASH = 60466177; // for '100001' in base64
  var generator = new MathRandom();
  var padding = generator.nextNumber(MIN_6_CHAR_HASH, INTEGER_MAX_VALUE).toString(BASE36);
  this.generateUniqId = function() {
    var first = Math.abs(generator.nextLong() + 1);
    var second = Math.abs(generator.nextInt(INTEGER_MAX_VALUE));
    var calc = first + second;
    var hash = (Math.abs(calc) % INTEGER_MAX_VALUE).toString(BASE36);
    return String(padding + hash).slice(-6); // pad output string to six chars using random padding
  };
}

var DEFAULT_FORMAT = "[%s]<%s>";
var DEFAULT_REF_FORMAT = "[%s|%s]<%s>";
var DEFAULT_MESSAGE_FORMAT = "%s => %s";
var DEFAULT_UNIQ_ID_GENERATOR = new StdUniqIdGenerator();

Object.defineProperty(Eid, "DEFAULT_FORMAT", {
  get: function() { return DEFAULT_FORMAT; }
});
Object.defineProperty(Eid, "DEFAULT_MESSAGE_FORMAT", {
  get: function() { return DEFAULT_MESSAGE_FORMAT; }
});
Object.defineProperty(Eid, "DEFAULT_REF_FORMAT", {
  get: function() { return DEFAULT_REF_FORMAT; }
});
Object.defineProperty(Eid, "DEFAULT_UNIQ_ID_GENERATOR", {
  get: function() { return DEFAULT_UNIQ_ID_GENERATOR; }
});

var FORMAT_NUM_SPEC = 2;
var REF_FORMAT_NUM_SPEC = 3;
var MESSAGE_FORMAT_NUM_SPEC = 2;

var EidInternal = {
  messageFormat: DEFAULT_MESSAGE_FORMAT,
  uniqIdGenerator: DEFAULT_UNIQ_ID_GENERATOR,
  format: DEFAULT_FORMAT,
  refFormat: DEFAULT_REF_FORMAT
};

var validateFormat = function(format, numSpecifiers) {
  if (format === null || format === undefined) {
    throw new TypeError("Format can't be null, but just received one");
  }
  var specifiers = [];
  for (var i = 0; i < numSpecifiers; i++) {
    specifiers.push(i + "-test-id");
  }
  var formatted = new JFormatter(format).format(specifiers);
  for (var specifier in specifiers) {
    if (formatted.indexOf(specifier) === -1) {
      throw new TypeError("Given format contains to little format specifiers, " +
          "expected " + numSpecifiers + " but given \"" + format + "\"");
    }
  }
};

/**
 * Sets the actual unique ID generator that will be used to generate IDs for all Eid objects. It will return previously used
 * generator.
 *
 * @param {UniqIdGenerator} uniqIdGenerator - new instance of unique ID generator
 * @return {UniqIdGenerator} a previously used unique ID generator
 * @throws {TypeError} if given generator was null
 */
Eid.setUniqIdGenerator = function(uniqIdGenerator) {
  if (uniqIdGenerator === null || uniqIdGenerator === undefined) {
    throw new TypeError("Unique ID generator can't be null, but given one");
  }
  var previous = EidInternal.uniqIdGenerator;
  EidInternal.uniqIdGenerator = uniqIdGenerator;
  return previous;
};

/**
 * Sets the actual format that will be used in {@link #toString()} method. It will return previously used format.
 *
 * @param {string} format - a format compliant with {@link String#format(String, Object...)} with 2 object arguments
 * @return {string} a previously used format
 * @throws {TypeError} if given format hasn't got two format specifiers <tt>"%s"</tt>, or if given format was
 * null
 */
Eid.setFormat = function(format) {
  validateFormat(format, FORMAT_NUM_SPEC);
  var previously = EidInternal.format;
  EidInternal.format = format;
  return previously;
};

/**
 * Sets the actual format that will be used in {@link #toString()} method
 *
 * @param {string} refFormat - a format compliant with {@link String#format(String, Object...)} with 3 object arguments
 * @return {string} a previously used format
 * @throws {TypeError} if given format hasn't got tree format specifiers <tt>"%s"</tt>, or if given format was
 * null
 */
Eid.setRefFormat = function(refFormat) {
  validateFormat(refFormat, REF_FORMAT_NUM_SPEC);
  var previously = EidInternal.refFormat;
  EidInternal.refFormat = refFormat;
  return previously;
};

/**
 * Sets a format that will be used for all Eid exceptions when printing a detail message.
 * <p>
 * Format must be non-null and contain two format specifiers <tt>"%s"</tt>
 *
 * @param {string} format - a format that will be used, must be non-null and contain two format specifiers <tt>"%s"</tt>
 * @return {string} previously used format
 * @throws {TypeError} if given format hasn't got two format specifiers <tt>"%s"</tt>, or if given format was
 * null
 */
Eid.setMessageFormat = function(format) {
  validateFormat(format, MESSAGE_FORMAT_NUM_SPEC);
  var oldFormat = EidInternal.messageFormat;
  EidInternal.messageFormat = format;
  return oldFormat;
};

/**
 * Gets actually set message format
 *
 * @return {string} actually setted message format
 */
Eid.getMessageFormat = function() {
  return EidInternal.messageFormat;
};

module.exports = Eid;

})(module);

},{}],4:[function(require,module,exports){
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

},{"./eid":3}],5:[function(require,module,exports){
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

(function(module) {
'use strict';

var Eid = require('./eid');
var EidRuntimeException = require('./exceptions').EidRuntimeException;
var EidNullPointerException = require('./exceptions').EidNullPointerException;
var EidIllegalArgumentException = require('./exceptions').EidIllegalArgumentException;
var EidIllegalStateException = require('./exceptions').EidIllegalStateException;
var EidIndexOutOfBoundsException = require('./exceptions').EidIndexOutOfBoundsException;

/**
 * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
 * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
 * <p/>
 * Static convenience methods that help a method or constructor check whether it was invoked correctly (whether its
 * <i>preconditions</i>
 * have been met). These methods generally accept a {@code boolean} expression which is expected to be {@code true} (or in the
 * case of {@code
 * checkNotNull}, an object reference which is expected to be non-null). When {@code false} (or {@code null}) is passed instead,
 * the {@code EidPreconditions} method throws an unchecked exception, which helps the calling method communicate to <i>its</i>
 * caller that
 * <i>that</i> caller has made a mistake.
 * <p/>
 * Each method accepts a EID String or {@link Eid} object, which is designed to ease of use and provide strict ID for given
 * Exception usage. This approach speed up development of large application and helps support teams to by giving the both static
 * and random ID for each possible unpredicted bug.
 * <p/>
 * This is best to use with tools and plugins like
 * <a href="http://plugins.netbeans.org/plugin/53137/exception-id-eid-generator">EidGenerator for Netbeans IDE</a>
 * <p/>
 * Example:
 * <pre>   {@code
 *
 *   /**
 *    * Returns the positive square root of the given value.
 *    *
 *    * @throws EidIllegalArgumentException if the value is negative
 *    *}{@code /
 *   public static double sqrt(double value) {
 *     EidPreconditions.checkArgument(value >= 0.0, "20150718:012333");
 *     // calculate the square root
 *   }
 *
 *   void exampleBadCaller() {
 *     double d = sqrt(-1.0);
 *   }
 * }</pre>
 * <p/>
 * In this example, {@code checkArgument} throws an {@code EidIllegalArgumentException} to indicate that {@code exampleBadCaller}
 * made an error in <i>its</i> call to {@code sqrt}. Exception, when it will be printed will contain user given Eid and also
 * Randomly generated ID. Those fields can be displayed to user on error page on posted directly to issue tracker.
 * <p/>
 * Example:
 * <p/>
 * <pre>
 *
 * {@code
 *   // Main application class for ex.: http servlet
 *    try {
 *        performRequest(request, response);
 *    } catch (EidRuntimeException ex) {
 *        issuesTracker.put(ex);
 *        throw ex;
 *    }
 * }</pre>
 * <p/>
 * <p/>
 * <h3>Functional try to execute blocks</h3>
 * <p/>
 * <p/>
 * Using functional blocks to handle operations, that are intended to operate properly, simplify the code and makes it more
 * readable. It's also good way to deal with untested, uncovered {@code catch} blocks. It's easy and gives developers nice way of
 * dealing with countless operations that suppose to work as intended.
 * <p/>
 * <p/>
 * Example:
 * <pre><code>
 *
 *     InputStream is = EidPreconditions.tryToExecute({@code new UnsafeSupplier<InputStream>}() {
 *        {@literal @}Override
 *         public InputStream get() throws IOException {
 *             return this.getClass().getClassLoader()
 *                 .getResourceAsStream("project.properties");
 *         }
 *     }, "20150718:121521");
 * </code></pre>
 *
 * @constructor
 * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
 * @since 0.1.0 (idea imported from Guava Library and COI code)
 */
function EidPreconditions() {}

function isNullike(reference) {
  return reference === null || reference === undefined;
}

function checkNotNull(reference) {
  if (isNullike(reference)) {
    throw new TypeError("Pass not-null Eid to EidPreconditions first!");
  }
  return reference;
}

function ensureEid(candidate) {
  candidate = checkNotNull(candidate);
  var eid;
  if (!(candidate instanceof Eid)) {
    eid = new Eid(candidate + '');
  } else {
    eid = candidate;
  }
  return eid;
}

/**
 * Ensures that an object reference passed as a parameter to the calling method is not null-like.
 *
 * @param {Object} reference - an object reference
 * @param {string|Eid} eid - the exception ID to use if the check fails
 * @param {string} message - message for produced exception
 * @return {Object} the non-null reference that was validated
 * @throws {EidNullPointerException} if {@code reference} is null-like
 */
EidPreconditions.checkNotNullable = function(reference, eid, message) {
  var checkedEid = ensureEid(eid);
  if (isNullike(reference)) {
    throw new EidNullPointerException(checkedEid, message);
  }
  return reference;
};

/**
 * Ensures that an object reference passed as a parameter to the calling method is not null.
 *
 * @param {Object} reference - an object reference
 * @param {string|Eid} eid - the exception ID to use if the check fails
 * @param {string} message - message for produced exception
 * @return {Object} the non-null reference that was validated
 * @throws {EidNullPointerException} if {@code reference} is null-like
 */
EidPreconditions.checkNotNull = function(reference, eid, message) {
  var checkedEid = ensureEid(eid);
  if (reference === null) {
    throw new EidNullPointerException(checkedEid, message);
  }
  return reference;
};

/**
 * Ensures that an object reference passed as a parameter to the calling method is not undefined.
 *
 * @param {Object} reference - an object reference
 * @param {string|Eid} eid - the exception ID to use if the check fails
 * @param {string} message - message for produced exception
 * @return {Object} the non-null reference that was validated
 * @throws {EidNullPointerException} if {@code reference} is null-like
 */
EidPreconditions.checkNotUndefined = function(reference, eid, message) {
  var checkedEid = ensureEid(eid);
  if (reference === undefined) {
    throw new EidNullPointerException(checkedEid, message);
  }
  return reference;
};

/**
 * Ensures the truth of an expression involving one or more parameters to the calling method.
 *
 * @param {boolean} expression - a boolean expression
 * @param {string|Eid} eid - the exception ID to use if the check fails
 * @param {string} message - optional message for generated exception
 * @throws {EidIllegalArgumentException} if {@code expression} is false
 * @throws {EidNullPointerException}     if {@code expression} is null
 */
EidPreconditions.checkArgument = function(expression, eid, message) {
  var checkedEid = ensureEid(eid);
  if (!EidPreconditions.checkNotNullable(expression, checkedEid)) {
    throw new EidIllegalArgumentException(checkedEid, message)
  }
};

/**
 * Ensures the truth of an expression involving the state of the calling instance, but not involving any parameters to the
 * calling method.
 *
 * @param {boolean} expression - a boolean expression
 * @param {string|Eid} eid - the exception ID to use if the check fails
 * @param {string} message - optional message for generated exception
 * @throws {EidIllegalStateException} if {@code expression} is false
 * @throws {EidNullPointerException}     if {@code expression} is null
 */
EidPreconditions.checkState = function(expression, eid, message) {
  var checkedEid = ensureEid(eid);
  if (!EidPreconditions.checkNotNullable(expression, checkedEid)) {
    throw new EidIllegalStateException(checkedEid, message);
  }
};

function isIndexAndSizeIllegal(index, size) {
  return index < 0 || index > size;
}

function isSizeIllegal(size) {
  return size < 0;
}

/**
 * Ensures that {@code index} specifies a valid <i>element</i> in an array, list or string of size {@code size}. An element
 * index may range from zero, inclusive, to {@code size}, exclusive.
 *
 * @param {number} index - a user-supplied index identifying an element of an array, list or string
 * @param {numer} size - the size of that array, list or string
 * @param {string|Eid} eid - the text to use to describe this index in an error message
 * @param {string} message - optional message for generated exception
 * @return {number} the value of {@code index}
 * @throws {EidIndexOutOfBoundsException} if {@code index} is negative or is not less than {@code size}
 * @throws {EidIllegalArgumentException}  if {@code size} is negative
 */
EidPreconditions.checkElementIndex = function(index, size, eid, message) {
  var checkedEid = ensureEid(eid);
  if (isSizeIllegal(size)) {
    throw new EidIllegalArgumentException(checkedEid, message);
  }
  if (isIndexAndSizeIllegal(index, size)) {
    throw new EidIndexOutOfBoundsException(checkedEid, message);
  }
  return index;
};

/**
 * Tries to execute code in given unsafe supplier code block, and if exception is thrown, it will gets rethrown as a
 * {@link EidRuntimeException} with eid given as a argument. This is because this exception is threaded as a software bug!
 * <p/>
 * Example:
 * <pre><code>
 *
 * Document doc = EidPreconditions.tryToExecute({@code new UnsafeSupplier<Document>}() {
 *    {@literal @}Override
 *     public Document get() throws IOException {
 *          DocumentBuilder docBuilder = ...
 *          return docBuilder.parse(new InputSource(reader));
 *     }
 * }, new Eid("20150718:121521"));
 * </code></pre>
 *
 * @param <R>      return type
 * @param supplier unsafe supplier code to be executed within a try-catch block
 * @param eid      unique developer identifier from date for ex.: "20150716:123200"
 * @return A block of code return type, if exception is not thrown
 * @throws EidRuntimeException if code block thrown any exception, which in that case is wrapped in EidRuntimeException
 */
EidPreconditions.tryToExecute = function(supplier, eid) {
  var checkedEid = ensureEid(eid);
  try {
    return EidPreconditions.checkNotNullable(supplier, checkedEid).apply();
  } catch (throwable) {
    throw new EidRuntimeException(checkedEid, throwable);
  }
};

module.exports = EidPreconditions;
})(module);

},{"./eid":3,"./exceptions":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJndWxwL2J1aWxkL3RvcGxldmVsLmpzIiwibGliL2VpZC5qcyIsImxpYi9laWQvZWlkLmpzIiwibGliL2VpZC9leGNlcHRpb25zLmpzIiwibGliL2VpZC9wcmVjb25kaXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNiBXYXZlIFNvZnR3YXJlXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbih3bmQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB3bmQuRWlkID0gcmVxdWlyZSgnLi4vLi4vbGliL2VpZCcpO1xufSkod2luZG93KTtcbiIsIi8qXG4gKiBDb3B5cmlnaHQgMjAxNiBXYXZlIFNvZnR3YXJlXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIEVpZCA9IHJlcXVpcmUoJy4vZWlkL2VpZCcpO1xuRWlkLnByZWNvbmRpdGlvbnMgPSByZXF1aXJlKCcuL2VpZC9wcmVjb25kaXRpb25zJyk7XG5FaWQuZXhjZXB0aW9ucyA9IHJlcXVpcmUoJy4vZWlkL2V4Y2VwdGlvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFaWQ7XG5cbn0pKG1vZHVsZSk7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTYgV2F2ZSBTb2Z0d2FyZVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEpGb3JtYXR0ZXIoZm9ybWF0KSB7XG4gIHRoaXMuZm9ybWF0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YoYXJyKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFyZ3MgPSBhcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgcmVnZXggPSAvJXMvO1xuICAgIHZhciBfciA9IGZ1bmN0aW9uKHAsYykgeyByZXR1cm4gcC5yZXBsYWNlKHJlZ2V4LCBjKTsgfVxuICAgIHJldHVybiBhcmdzLnJlZHVjZShfciwgZm9ybWF0KTtcbiAgfTtcbn1cblxuLyoqXG4gKiA8c3Ryb25nPlRoaXMgY2xhc3Mgc2hvdWxkbid0IGJlIHVzZWQgaW4gYW55IHB1YmxpYyBBUEkgb3IgbGlicmFyeS48L3N0cm9uZz4gSXQgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCBmb3IgaW4taG91c2UgZGV2ZWxvcG1lbnRcbiAqIG9mIGVuZCB1c2VyIGFwcGxpY2F0aW9ucyB3aGljaCB3aWxsIHJlcG9ydCBCdWdzIGluIHN0YW5kYXJkaXplZCBlcnJvciBwYWdlcyBvciBwb3N0IHRoZW0gdG8gaXNzdWUgdHJhY2tlci5cbiAqIDxwPlxuICogRXhjZXB0aW9uIGlkZW50aWZpZXIgZm9yIGFsbCBFaWQgUnVudGltZSBFeGNlcHRpb25zLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgZXhjZXB0aW9uIGlkLCBtdXN0IGJlIHVuaXF1ZSBkZXZlbG9wZXIgaW5zZXJ0ZWQgc3RyaW5nLCBmcm9tIGRhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSBhbiBvcHRpb25hbCByZWZlcmVuY2VcbiAqL1xuZnVuY3Rpb24gRWlkKGlkLCByZWYpIHtcbiAgdmFyIHVuaXEgPSBFaWRJbnRlcm5hbC51bmlxSWRHZW5lcmF0b3IuZ2VuZXJhdGVVbmlxSWQoKTtcbiAgcmVmID0gKHJlZiA9PT0gbnVsbCB8fCByZWYgPT0gdW5kZWZpbmVkKSA/IFwiXCIgOiByZWY7XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgbG9nIG1lc3NhZ2UgZnJvbSB0aGlzIEVJRCBvYmplY3RcbiAgICogPHA+XG4gICAqIDxwPlRoaXMgbWV0aG9kIGlzIGZvciBjb252ZW5pZW5jZSBvZiB1c2FnZSBvZiBFSUQgaW4gbG9nZ2luZy4gWW91IGNhbiB1c2UgaXQgbGlrZSB0aGlzOlxuICAgKiA8cD5cbiAgICogPHByZT5cbiAgICogbG9nLmRlYnVnKG5ldyBFaWQoXCIyMDE1MTAyNToyMDIxMjlcIikubWFrZUxvZ01lc3NhZ2UoXCJBIHJlcXVlc3Q6ICVzXCIsIHJlcXVlc3QpKTtcbiAgICogPC9wcmU+XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlRm9ybWF0IC0gYSBsb2cgbWVzc2FnZSBmb3JtYXQgYXMgYWNjZXB0ZWQgYnkge0BsaW5rIFN0cmluZyNmb3JtYXQoU3RyaW5nLCBPYmplY3QuLi4pfVxuICAgKiBAcGFyYW0ge09iamVjdC4uLn0gcGFyYW1ldGVycyAtIGEgcGFyYW1ldGVycyBmb3IgbG9nTWVzc2FnZUZvcm1hdCB0byBieSBwYXNzZWQgdG8ge0BsaW5rIFN0cmluZyNmb3JtYXQoU3RyaW5nLCBPYmplY3QuLi4pfVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGEgZm9ybWF0dGVkIG1lc3NhZ2VcbiAgICovXG4gIHRoaXMubWFrZUxvZ01lc3NhZ2UgPSBmdW5jdGlvbihsb2dNZXNzYWdlRm9ybWF0KSB7XG4gICAgdmFyIHBhcmFtZXRlcnMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgcGFyYW1ldGVycy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuICAgIHZhciBtZXNzYWdlID0gbmV3IEpGb3JtYXR0ZXIobG9nTWVzc2FnZUZvcm1hdCkuZm9ybWF0KHBhcmFtZXRlcnMpO1xuICAgIHJldHVybiBuZXcgSkZvcm1hdHRlcihFaWQuZ2V0TWVzc2FnZUZvcm1hdCgpKS5mb3JtYXQodGhpcy50b1N0cmluZygpLCBtZXNzYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCB0byBzdHJpbmcgbWV0aG9kXG4gICAqL1xuICB0aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoXCJcIiA9PT0gcmVmKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBKRm9ybWF0dGVyKEVpZEludGVybmFsLmZvcm1hdCkuZm9ybWF0KGlkLCB1bmlxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgSkZvcm1hdHRlcihFaWRJbnRlcm5hbC5yZWZGb3JtYXQpLmZvcm1hdChpZCwgcmVmLCB1bmlxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNvbnN0YW50IEV4Y2VwdGlvbiBJRFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IElEIG9mIGV4Y2VwdGlvblxuICAgKi9cbiAgdGhpcy5nZXRJZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXN0b20gcmVmIHBhc3NlZCB0byBFeGNlcHRpb24gSURcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBJRCBvZiBleGNlcHRpb25cbiAgICovXG4gIHRoaXMuZ2V0UmVmID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdW5pcXVlIGdlbmVyYXRlZCBzdHJpbmcgZm9yIHRoaXMgaW5zdGFuY2Ugb2YgRWlkXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYSB1bmlxdWUgc3RyaW5nXG4gICAqL1xuICB0aGlzLmdldFVuaXEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB1bmlxO1xuICB9XG59XG5cbmZ1bmN0aW9uIE1hdGhSYW5kb20oKSB7XG4gIHZhciBMT05HX01BWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBMT05HX01JTiA9IC0xICogTWF0aC5wb3coMiwgNTMpO1xuICB0aGlzLm5leHRMb25nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubmV4dE51bWJlcihMT05HX01JTiwgTE9OR19NQVgpO1xuICB9O1xuICB0aGlzLm5leHRJbnQgPSBmdW5jdGlvbihtYXgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXh0TnVtYmVyKDAsIG1heCk7XG4gIH07XG4gIHRoaXMubmV4dE51bWJlciA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gIH07XG59XG5cbmZ1bmN0aW9uIFN0ZFVuaXFJZEdlbmVyYXRvcigpIHtcbiAgdmFyIEJBU0UzNiA9IDM2O1xuICB2YXIgSU5URUdFUl9NQVhfVkFMVUUgPSBNYXRoLnBvdygyLCAzMSk7XG4gIHZhciBNSU5fNl9DSEFSX0hBU0ggPSA2MDQ2NjE3NzsgLy8gZm9yICcxMDAwMDEnIGluIGJhc2U2NFxuICB2YXIgZ2VuZXJhdG9yID0gbmV3IE1hdGhSYW5kb20oKTtcbiAgdmFyIHBhZGRpbmcgPSBnZW5lcmF0b3IubmV4dE51bWJlcihNSU5fNl9DSEFSX0hBU0gsIElOVEVHRVJfTUFYX1ZBTFVFKS50b1N0cmluZyhCQVNFMzYpO1xuICB0aGlzLmdlbmVyYXRlVW5pcUlkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpcnN0ID0gTWF0aC5hYnMoZ2VuZXJhdG9yLm5leHRMb25nKCkgKyAxKTtcbiAgICB2YXIgc2Vjb25kID0gTWF0aC5hYnMoZ2VuZXJhdG9yLm5leHRJbnQoSU5URUdFUl9NQVhfVkFMVUUpKTtcbiAgICB2YXIgY2FsYyA9IGZpcnN0ICsgc2Vjb25kO1xuICAgIHZhciBoYXNoID0gKE1hdGguYWJzKGNhbGMpICUgSU5URUdFUl9NQVhfVkFMVUUpLnRvU3RyaW5nKEJBU0UzNik7XG4gICAgcmV0dXJuIFN0cmluZyhwYWRkaW5nICsgaGFzaCkuc2xpY2UoLTYpOyAvLyBwYWQgb3V0cHV0IHN0cmluZyB0byBzaXggY2hhcnMgdXNpbmcgcmFuZG9tIHBhZGRpbmdcbiAgfTtcbn1cblxudmFyIERFRkFVTFRfRk9STUFUID0gXCJbJXNdPCVzPlwiO1xudmFyIERFRkFVTFRfUkVGX0ZPUk1BVCA9IFwiWyVzfCVzXTwlcz5cIjtcbnZhciBERUZBVUxUX01FU1NBR0VfRk9STUFUID0gXCIlcyA9PiAlc1wiO1xudmFyIERFRkFVTFRfVU5JUV9JRF9HRU5FUkFUT1IgPSBuZXcgU3RkVW5pcUlkR2VuZXJhdG9yKCk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFaWQsIFwiREVGQVVMVF9GT1JNQVRcIiwge1xuICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gREVGQVVMVF9GT1JNQVQ7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEVpZCwgXCJERUZBVUxUX01FU1NBR0VfRk9STUFUXCIsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIERFRkFVTFRfTUVTU0FHRV9GT1JNQVQ7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEVpZCwgXCJERUZBVUxUX1JFRl9GT1JNQVRcIiwge1xuICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gREVGQVVMVF9SRUZfRk9STUFUOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFaWQsIFwiREVGQVVMVF9VTklRX0lEX0dFTkVSQVRPUlwiLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBERUZBVUxUX1VOSVFfSURfR0VORVJBVE9SOyB9XG59KTtcblxudmFyIEZPUk1BVF9OVU1fU1BFQyA9IDI7XG52YXIgUkVGX0ZPUk1BVF9OVU1fU1BFQyA9IDM7XG52YXIgTUVTU0FHRV9GT1JNQVRfTlVNX1NQRUMgPSAyO1xuXG52YXIgRWlkSW50ZXJuYWwgPSB7XG4gIG1lc3NhZ2VGb3JtYXQ6IERFRkFVTFRfTUVTU0FHRV9GT1JNQVQsXG4gIHVuaXFJZEdlbmVyYXRvcjogREVGQVVMVF9VTklRX0lEX0dFTkVSQVRPUixcbiAgZm9ybWF0OiBERUZBVUxUX0ZPUk1BVCxcbiAgcmVmRm9ybWF0OiBERUZBVUxUX1JFRl9GT1JNQVRcbn07XG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uKGZvcm1hdCwgbnVtU3BlY2lmaWVycykge1xuICBpZiAoZm9ybWF0ID09PSBudWxsIHx8IGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZvcm1hdCBjYW4ndCBiZSBudWxsLCBidXQganVzdCByZWNlaXZlZCBvbmVcIik7XG4gIH1cbiAgdmFyIHNwZWNpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1TcGVjaWZpZXJzOyBpKyspIHtcbiAgICBzcGVjaWZpZXJzLnB1c2goaSArIFwiLXRlc3QtaWRcIik7XG4gIH1cbiAgdmFyIGZvcm1hdHRlZCA9IG5ldyBKRm9ybWF0dGVyKGZvcm1hdCkuZm9ybWF0KHNwZWNpZmllcnMpO1xuICBmb3IgKHZhciBzcGVjaWZpZXIgaW4gc3BlY2lmaWVycykge1xuICAgIGlmIChmb3JtYXR0ZWQuaW5kZXhPZihzcGVjaWZpZXIpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdpdmVuIGZvcm1hdCBjb250YWlucyB0byBsaXR0bGUgZm9ybWF0IHNwZWNpZmllcnMsIFwiICtcbiAgICAgICAgICBcImV4cGVjdGVkIFwiICsgbnVtU3BlY2lmaWVycyArIFwiIGJ1dCBnaXZlbiBcXFwiXCIgKyBmb3JtYXQgKyBcIlxcXCJcIik7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGFjdHVhbCB1bmlxdWUgSUQgZ2VuZXJhdG9yIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGdlbmVyYXRlIElEcyBmb3IgYWxsIEVpZCBvYmplY3RzLiBJdCB3aWxsIHJldHVybiBwcmV2aW91c2x5IHVzZWRcbiAqIGdlbmVyYXRvci5cbiAqXG4gKiBAcGFyYW0ge1VuaXFJZEdlbmVyYXRvcn0gdW5pcUlkR2VuZXJhdG9yIC0gbmV3IGluc3RhbmNlIG9mIHVuaXF1ZSBJRCBnZW5lcmF0b3JcbiAqIEByZXR1cm4ge1VuaXFJZEdlbmVyYXRvcn0gYSBwcmV2aW91c2x5IHVzZWQgdW5pcXVlIElEIGdlbmVyYXRvclxuICogQHRocm93cyB7VHlwZUVycm9yfSBpZiBnaXZlbiBnZW5lcmF0b3Igd2FzIG51bGxcbiAqL1xuRWlkLnNldFVuaXFJZEdlbmVyYXRvciA9IGZ1bmN0aW9uKHVuaXFJZEdlbmVyYXRvcikge1xuICBpZiAodW5pcUlkR2VuZXJhdG9yID09PSBudWxsIHx8IHVuaXFJZEdlbmVyYXRvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuaXF1ZSBJRCBnZW5lcmF0b3IgY2FuJ3QgYmUgbnVsbCwgYnV0IGdpdmVuIG9uZVwiKTtcbiAgfVxuICB2YXIgcHJldmlvdXMgPSBFaWRJbnRlcm5hbC51bmlxSWRHZW5lcmF0b3I7XG4gIEVpZEludGVybmFsLnVuaXFJZEdlbmVyYXRvciA9IHVuaXFJZEdlbmVyYXRvcjtcbiAgcmV0dXJuIHByZXZpb3VzO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBhY3R1YWwgZm9ybWF0IHRoYXQgd2lsbCBiZSB1c2VkIGluIHtAbGluayAjdG9TdHJpbmcoKX0gbWV0aG9kLiBJdCB3aWxsIHJldHVybiBwcmV2aW91c2x5IHVzZWQgZm9ybWF0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXQgLSBhIGZvcm1hdCBjb21wbGlhbnQgd2l0aCB7QGxpbmsgU3RyaW5nI2Zvcm1hdChTdHJpbmcsIE9iamVjdC4uLil9IHdpdGggMiBvYmplY3QgYXJndW1lbnRzXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGEgcHJldmlvdXNseSB1c2VkIGZvcm1hdFxuICogQHRocm93cyB7VHlwZUVycm9yfSBpZiBnaXZlbiBmb3JtYXQgaGFzbid0IGdvdCB0d28gZm9ybWF0IHNwZWNpZmllcnMgPHR0PlwiJXNcIjwvdHQ+LCBvciBpZiBnaXZlbiBmb3JtYXQgd2FzXG4gKiBudWxsXG4gKi9cbkVpZC5zZXRGb3JtYXQgPSBmdW5jdGlvbihmb3JtYXQpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0LCBGT1JNQVRfTlVNX1NQRUMpO1xuICB2YXIgcHJldmlvdXNseSA9IEVpZEludGVybmFsLmZvcm1hdDtcbiAgRWlkSW50ZXJuYWwuZm9ybWF0ID0gZm9ybWF0O1xuICByZXR1cm4gcHJldmlvdXNseTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgYWN0dWFsIGZvcm1hdCB0aGF0IHdpbGwgYmUgdXNlZCBpbiB7QGxpbmsgI3RvU3RyaW5nKCl9IG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWZGb3JtYXQgLSBhIGZvcm1hdCBjb21wbGlhbnQgd2l0aCB7QGxpbmsgU3RyaW5nI2Zvcm1hdChTdHJpbmcsIE9iamVjdC4uLil9IHdpdGggMyBvYmplY3QgYXJndW1lbnRzXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGEgcHJldmlvdXNseSB1c2VkIGZvcm1hdFxuICogQHRocm93cyB7VHlwZUVycm9yfSBpZiBnaXZlbiBmb3JtYXQgaGFzbid0IGdvdCB0cmVlIGZvcm1hdCBzcGVjaWZpZXJzIDx0dD5cIiVzXCI8L3R0Piwgb3IgaWYgZ2l2ZW4gZm9ybWF0IHdhc1xuICogbnVsbFxuICovXG5FaWQuc2V0UmVmRm9ybWF0ID0gZnVuY3Rpb24ocmVmRm9ybWF0KSB7XG4gIHZhbGlkYXRlRm9ybWF0KHJlZkZvcm1hdCwgUkVGX0ZPUk1BVF9OVU1fU1BFQyk7XG4gIHZhciBwcmV2aW91c2x5ID0gRWlkSW50ZXJuYWwucmVmRm9ybWF0O1xuICBFaWRJbnRlcm5hbC5yZWZGb3JtYXQgPSByZWZGb3JtYXQ7XG4gIHJldHVybiBwcmV2aW91c2x5O1xufTtcblxuLyoqXG4gKiBTZXRzIGEgZm9ybWF0IHRoYXQgd2lsbCBiZSB1c2VkIGZvciBhbGwgRWlkIGV4Y2VwdGlvbnMgd2hlbiBwcmludGluZyBhIGRldGFpbCBtZXNzYWdlLlxuICogPHA+XG4gKiBGb3JtYXQgbXVzdCBiZSBub24tbnVsbCBhbmQgY29udGFpbiB0d28gZm9ybWF0IHNwZWNpZmllcnMgPHR0PlwiJXNcIjwvdHQ+XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdCAtIGEgZm9ybWF0IHRoYXQgd2lsbCBiZSB1c2VkLCBtdXN0IGJlIG5vbi1udWxsIGFuZCBjb250YWluIHR3byBmb3JtYXQgc3BlY2lmaWVycyA8dHQ+XCIlc1wiPC90dD5cbiAqIEByZXR1cm4ge3N0cmluZ30gcHJldmlvdXNseSB1c2VkIGZvcm1hdFxuICogQHRocm93cyB7VHlwZUVycm9yfSBpZiBnaXZlbiBmb3JtYXQgaGFzbid0IGdvdCB0d28gZm9ybWF0IHNwZWNpZmllcnMgPHR0PlwiJXNcIjwvdHQ+LCBvciBpZiBnaXZlbiBmb3JtYXQgd2FzXG4gKiBudWxsXG4gKi9cbkVpZC5zZXRNZXNzYWdlRm9ybWF0ID0gZnVuY3Rpb24oZm9ybWF0KSB7XG4gIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCwgTUVTU0FHRV9GT1JNQVRfTlVNX1NQRUMpO1xuICB2YXIgb2xkRm9ybWF0ID0gRWlkSW50ZXJuYWwubWVzc2FnZUZvcm1hdDtcbiAgRWlkSW50ZXJuYWwubWVzc2FnZUZvcm1hdCA9IGZvcm1hdDtcbiAgcmV0dXJuIG9sZEZvcm1hdDtcbn07XG5cbi8qKlxuICogR2V0cyBhY3R1YWxseSBzZXQgbWVzc2FnZSBmb3JtYXRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGFjdHVhbGx5IHNldHRlZCBtZXNzYWdlIGZvcm1hdFxuICovXG5FaWQuZ2V0TWVzc2FnZUZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRWlkSW50ZXJuYWwubWVzc2FnZUZvcm1hdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWlkO1xuXG59KShtb2R1bGUpO1xuIiwiLypcbiAqIENvcHlyaWdodCAyMDE2IFdhdmUgU29mdHdhcmVcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBFaWQgPSByZXF1aXJlKCcuL2VpZCcpO1xuXG4gIHZhciBwcmVwYXJlTWVzc2FnZSA9IGZ1bmN0aW9uKGVpZCwgbWVzc2FnZSkge1xuICAgIHJldHVybiBtZXNzYWdlICE9PSB1bmRlZmluZWQgPyAoZWlkICsgXCIgXCIgKyBtZXNzYWdlKSA6IGVpZDtcbiAgfTtcblxuICB2YXIgdmFsaWRhdGVFaWQgPSBmdW5jdGlvbihlaWQpIHtcbiAgICBpZiAoZWlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBuZWVkIHRvIHByb3ZpZGUgYW4gdmFsaWQgRWlkIG51bWJlciB0byBFaWRSdW50aW1lRXhjZXB0aW9ucywgYnV0IGdpdmVuIHVuZGVmaW5lZCcpO1xuICAgIH1cbiAgICBpZiAoIShlaWQgaW5zdGFuY2VvZiBFaWQpKSB7XG4gICAgICBlaWQgPSBuZXcgRWlkKGVpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVpZDtcbiAgfTtcblxuICB2YXIgQ29ycmVjdFN0YWNrVHJhY2UgPSB7XG4gICAgbW9kZXJuOiBmdW5jdGlvbih0YXJnZXQsIGNvbnN0cnVjdG9yKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0YXJnZXQsIGNvbnN0cnVjdG9yKTtcbiAgICB9LFxuICAgIGZpeExlZ2FuY3lTdGFja1RyYWNlOiBmdW5jdGlvbihzdGFjaywgc3RyaW5naWZpZWQpIHtcbiAgICAgIHZhciBzdCA9IHN0YWNrO1xuICAgICAgaWYgKHR5cGVvZihzdGFjaykgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIE9uIElFIHRoZSBzdGFjayBmaWVsZCBpcyBlbXB0eSBzbyBzZXR0aW5nIHRvIHRvU3RyaW5nKCkgOi0vXG4gICAgICAgIHN0ID0gc3RyaW5naWZpZWQ7XG4gICAgICB9XG4gICAgICAvLyBIYW5kcyBkb3duLCBpZiBhbGwgZmFpbHMsIGp1c3QgcmVwbGFjZSBFcnJvciB3aXRoIG5pY2UgRWlkIHN0cmluZ1xuICAgICAgaWYgKHN0LmluZGV4T2Yoc3RyaW5naWZpZWQpIDwgMCkge1xuICAgICAgICBzdCA9IHN0LnJlcGxhY2UoL14oPzpFcnJvclxcbik/Lywgc3RyaW5naWZpZWQgKyBcIlxcblwiKS50cmltKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3Q7XG4gICAgfSxcbiAgICBsZWdhbmN5OiBmdW5jdGlvbih0YXJnZXQsIGNvbnN0cnVjdG9yLCBleGNlcHRpb25Db25zdHJ1Y3Rvcikge1xuICAgICAgLy8gSGFja3MgZm9yIElFIGFuIEVkZ2VcbiAgICAgIHZhciBzdHJpbmdpZmllZCA9IHRhcmdldC50b1N0cmluZygpO1xuICAgICAgLy8gdHJ5IHRvIGZldGNoIHN0YWNrdHJhY2UgZnJvbSBKUyBzdGFuZGFyZCBFcnJvclxuICAgICAgdmFyIHN0ID0gKG5ldyBleGNlcHRpb25Db25zdHJ1Y3RvcigpKS5zdGFjaztcbiAgICAgIHRhcmdldC5zdGFjayA9IENvcnJlY3RTdGFja1RyYWNlLmZpeExlZ2FuY3lTdGFja1RyYWNlKHN0LCBzdHJpbmdpZmllZCk7XG4gICAgfVxuICB9O1xuICBDb3JyZWN0U3RhY2tUcmFjZS5maXhMZWdhbmN5U3RhY2tUcmFjZSgnRXJyb3JcXG4nKTtcbiAgQ29ycmVjdFN0YWNrVHJhY2UubGVnYW5jeSh7fSwgbnVsbCwgT2JqZWN0KTtcblxuICB2YXIgY29ycmVjdFN0YWNrVHJhY2UgPSBmdW5jdGlvbih0YXJnZXQsIGNvbnN0cnVjdG9yKSB7XG4gICAgdmFyIGhhbmRsZXIgPSB0eXBlb2YoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgQ29ycmVjdFN0YWNrVHJhY2UubW9kZXJuIDogQ29ycmVjdFN0YWNrVHJhY2UubGVnYW5jeTtcbiAgICBoYW5kbGVyKHRhcmdldCwgY29uc3RydWN0b3IsIEVycm9yKTtcbiAgfTtcblxuICAvKipcbiAgICogPHN0cm9uZz5UaGlzIGNsYXNzIHNob3VsZG4ndCBiZSB1c2VkIGluIGFueSBwdWJsaWMgQVBJIG9yIGxpYnJhcnkuPC9zdHJvbmc+IEl0IGlzIGRlc2lnbmVkIHRvIGJlIHVzZWQgZm9yIGluLWhvdXNlIGRldmVsb3BtZW50XG4gICAqIG9mIGVuZCB1c2VyIGFwcGxpY2F0aW9ucyB3aGljaCB3aWxsIHJlcG9ydCBCdWdzIGluIHN0YW5kYXJkaXplZCBlcnJvciBwYWdlcyBvciBwb3N0IHRoZW0gdG8gaXNzdWUgdHJhY2tlci5cbiAgICogPHA+XG4gICAqIFRoaXMgZXhjZXB0aW9uIGNsYXNzIGlzIGJhc2VsaW5lIG9mIGFsbCBFaWQgcnVudGltZSBleGNlcHRpb24gY2xhc3Nlcy4gSXQgaXMgZGVzaWduZWQgdG8gZWFzZSBvZiB1c2UgYW5kIHByb3ZpZGUgc3RyaWN0IElEIGZvclxuICAgKiBnaXZlbiBFeGNlcHRpb24gdXNhZ2UuIFRoaXMgYXBwcm9hY2ggc3BlZWQgdXAgZGV2ZWxvcG1lbnQgb2YgbGFyZ2UgYXBwbGljYXRpb24gYW5kIGhlbHBzIHN1cHBvcnQgdGVhbXMgdG8gYnkgZ2l2aW5nIHRoZSBib3RoXG4gICAqIHN0YXRpYyBhbmQgcmFuZG9tIElEIGZvciBlYWNoIHBvc3NpYmxlIHVucHJlZGljdGVkIGJ1Zy5cbiAgICogPHA+XG4gICAqIFRoaXMgaXMgYmVzdCB0byB1c2Ugd2l0aCB0b29scyBhbmQgcGx1Z2lucyBsaWtlXG4gICAqIDxhIGhyZWY9XCJodHRwOi8vcGx1Z2lucy5uZXRiZWFucy5vcmcvcGx1Z2luLzUzMTM3L2V4Y2VwdGlvbi1pZC1laWQtZ2VuZXJhdG9yXCI+RWlkR2VuZXJhdG9yIGZvciBOZXRiZWFucyBJREU8L2E+XG4gICAqIDxwPlxuICAgKiBGb3IgY29udmVuaWVuY2UgdXNlIHtAbGluayBlaWQuUHJlY29uZGl0aW9uc31cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlaWQgLSBhbiBleGNlcHRpb24gSWQsIHNob3VsZCBiZSBnZW5lcmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBhbiBtZXNzYWdlIGZvciB0aGUgZXhjZXB0aW9uXG4gICAqIEBhdXRob3IgS3J6eXN6dG9mIFN1c3p5xYRza2kgPGtyenlzenRvZi5zdXN6eW5za2lAd2F2ZXNvZnR3YXJlLnBsPlxuICAgKi9cbiAgZnVuY3Rpb24gRWlkUnVudGltZUV4Y2VwdGlvbihlaWQsIG1lc3NhZ2UpIHtcbiAgICBlaWQgPSB2YWxpZGF0ZUVpZChlaWQpO1xuICAgIG1lc3NhZ2UgPSBwcmVwYXJlTWVzc2FnZShlaWQsIG1lc3NhZ2UpO1xuICAgIHZhciB0bXAgPSBFcnJvci5hcHBseSh0aGlzLCBbbWVzc2FnZV0pO1xuICAgIHRtcC5uYW1lID0gdGhpcy5uYW1lID0gJ0VpZFJ1bnRpbWVFeGNlcHRpb24nO1xuICAgIHRoaXMubWVzc2FnZSA9IHRtcC5tZXNzYWdlO1xuICAgIHRoaXMuZWlkID0gZWlkO1xuICAgIGNvcnJlY3RTdGFja1RyYWNlKHRoaXMsIEVpZFJ1bnRpbWVFeGNlcHRpb24pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgRWlkUnVudGltZUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBFaWRSdW50aW1lRXhjZXB0aW9uIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIDxzdHJvbmc+VGhpcyBjbGFzcyBzaG91bGRuJ3QgYmUgdXNlZCBpbiBhbnkgcHVibGljIEFQSSBvciBsaWJyYXJ5Ljwvc3Ryb25nPiBJdCBpcyBkZXNpZ25lZCB0byBiZSB1c2VkIGZvciBpbi1ob3VzZSBkZXZlbG9wbWVudFxuICAgKiBvZiBlbmQgdXNlciBhcHBsaWNhdGlvbnMgd2hpY2ggd2lsbCByZXBvcnQgQnVncyBpbiBzdGFuZGFyZGl6ZWQgZXJyb3IgcGFnZXMgb3IgcG9zdCB0aGVtIHRvIGlzc3VlIHRyYWNrZXIuXG4gICAqIDxwPlxuICAgKiBUaGlzIGlkIEVpZCB2ZXJzaW9uIG9mIHtAbGluayBOdWxsUG9pbnRlckV4Y2VwdGlvbn1cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlaWQgLSBhbiBleGNlcHRpb24gSWQsIHNob3VsZCBiZSBnZW5lcmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBhbiBtZXNzYWdlIGZvciB0aGUgZXhjZXB0aW9uXG4gICAqIEBzZWUgTnVsbFBvaW50ZXJFeGNlcHRpb25cbiAgICogQHNlZSBFaWRSdW50aW1lRXhjZXB0aW9uXG4gICAqIEBhdXRob3IgS3J6eXN6dG9mIFN1c3p5xYRza2kgPGtyenlzenRvZi5zdXN6eW5za2lAd2F2ZXNvZnR3YXJlLnBsPlxuICAgKi9cbiAgZnVuY3Rpb24gRWlkTnVsbFBvaW50ZXJFeGNlcHRpb24oZWlkLCBtZXNzYWdlKSB7XG4gICAgdmFyIHRtcCA9IEVpZFJ1bnRpbWVFeGNlcHRpb24uYXBwbHkodGhpcywgW2VpZCwgbWVzc2FnZV0pO1xuICAgIHRtcC5uYW1lID0gdGhpcy5uYW1lID0gJ0VpZE51bGxQb2ludGVyRXhjZXB0aW9uJztcbiAgICBjb3JyZWN0U3RhY2tUcmFjZSh0aGlzLCBFaWROdWxsUG9pbnRlckV4Y2VwdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgRWlkTnVsbFBvaW50ZXJFeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFaWRSdW50aW1lRXhjZXB0aW9uLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBFaWROdWxsUG9pbnRlckV4Y2VwdGlvbiB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiA8c3Ryb25nPlRoaXMgY2xhc3Mgc2hvdWxkbid0IGJlIHVzZWQgaW4gYW55IHB1YmxpYyBBUEkgb3IgbGlicmFyeS48L3N0cm9uZz4gSXQgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCBmb3IgaW4taG91c2UgZGV2ZWxvcG1lbnRcbiAgICogb2YgZW5kIHVzZXIgYXBwbGljYXRpb25zIHdoaWNoIHdpbGwgcmVwb3J0IEJ1Z3MgaW4gc3RhbmRhcmRpemVkIGVycm9yIHBhZ2VzIG9yIHBvc3QgdGhlbSB0byBpc3N1ZSB0cmFja2VyLlxuICAgKiA8cD5cbiAgICogVGhpcyBpcyBFaWQgdmVyc2lvbiBvZiB7QGxpbmsgSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9ufVxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVpZCAtIGFuIGV4Y2VwdGlvbiBJZCwgc2hvdWxkIGJlIGdlbmVyYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIGFuIG1lc3NhZ2UgZm9yIHRoZSBleGNlcHRpb25cbiAgICogQHNlZSBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb25cbiAgICogQHNlZSBFaWRSdW50aW1lRXhjZXB0aW9uXG4gICAqIEBhdXRob3IgS3J6eXN6dG9mIFN1c3p5xYRza2kgPGtyenlzenRvZi5zdXN6eW5za2lAd2F2ZXNvZnR3YXJlLnBsPlxuICAgKi9cbiAgZnVuY3Rpb24gRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uKGVpZCwgbWVzc2FnZSkge1xuICAgIHZhciB0bXAgPSBFaWRSdW50aW1lRXhjZXB0aW9uLmFwcGx5KHRoaXMsIFtlaWQsIG1lc3NhZ2VdKTtcbiAgICB0bXAubmFtZSA9IHRoaXMubmFtZSA9ICdFaWRJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24nO1xuICAgIGNvcnJlY3RTdGFja1RyYWNlKHRoaXMsIEVpZElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRWlkUnVudGltZUV4Y2VwdGlvbi5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIDxzdHJvbmc+VGhpcyBjbGFzcyBzaG91bGRuJ3QgYmUgdXNlZCBpbiBhbnkgcHVibGljIEFQSSBvciBsaWJyYXJ5Ljwvc3Ryb25nPiBJdCBpcyBkZXNpZ25lZCB0byBiZSB1c2VkIGZvciBpbi1ob3VzZSBkZXZlbG9wbWVudFxuICAgKiBvZiBlbmQgdXNlciBhcHBsaWNhdGlvbnMgd2hpY2ggd2lsbCByZXBvcnQgQnVncyBpbiBzdGFuZGFyZGl6ZWQgZXJyb3IgcGFnZXMgb3IgcG9zdCB0aGVtIHRvIGlzc3VlIHRyYWNrZXIuXG4gICAqIDxwPlxuICAgKiBUaGlzIGlkIEVpZCB2ZXJzaW9uIG9mIHtAbGluayBJbGxlZ2FsU3RhdGVFeGNlcHRpb259XG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWlkIC0gYW4gZXhjZXB0aW9uIElkLCBzaG91bGQgYmUgZ2VuZXJhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gYW4gbWVzc2FnZSBmb3IgdGhlIGV4Y2VwdGlvblxuICAgKiBAc2VlIElsbGVnYWxTdGF0ZUV4Y2VwdGlvblxuICAgKiBAc2VlIEVpZFJ1bnRpbWVFeGNlcHRpb25cbiAgICogQGF1dGhvciBLcnp5c3p0b2YgU3VzennFhHNraSA8a3J6eXN6dG9mLnN1c3p5bnNraUB3YXZlc29mdHdhcmUucGw+XG4gICAqL1xuICBmdW5jdGlvbiBFaWRJbGxlZ2FsU3RhdGVFeGNlcHRpb24oZWlkLCBtZXNzYWdlKSB7XG4gICAgdmFyIHRtcCA9IEVpZFJ1bnRpbWVFeGNlcHRpb24uYXBwbHkodGhpcywgW2VpZCwgbWVzc2FnZV0pO1xuICAgIHRtcC5uYW1lID0gdGhpcy5uYW1lID0gJ0VpZElsbGVnYWxTdGF0ZUV4Y2VwdGlvbic7XG4gICAgY29ycmVjdFN0YWNrVHJhY2UodGhpcywgRWlkSWxsZWdhbFN0YXRlRXhjZXB0aW9uKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBFaWRJbGxlZ2FsU3RhdGVFeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFaWRSdW50aW1lRXhjZXB0aW9uLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBFaWRJbGxlZ2FsU3RhdGVFeGNlcHRpb24gfVxuICB9KTtcblxuICAvKipcbiAgICogPHN0cm9uZz5UaGlzIGNsYXNzIHNob3VsZG4ndCBiZSB1c2VkIGluIGFueSBwdWJsaWMgQVBJIG9yIGxpYnJhcnkuPC9zdHJvbmc+IEl0IGlzIGRlc2lnbmVkIHRvIGJlIHVzZWQgZm9yIGluLWhvdXNlIGRldmVsb3BtZW50XG4gICAqIG9mIGVuZCB1c2VyIGFwcGxpY2F0aW9ucyB3aGljaCB3aWxsIHJlcG9ydCBCdWdzIGluIHN0YW5kYXJkaXplZCBlcnJvciBwYWdlcyBvciBwb3N0IHRoZW0gdG8gaXNzdWUgdHJhY2tlci5cbiAgICogPHA+XG4gICAqIFRoaXMgaWQgRWlkIHZlcnNpb24gb2Yge0BsaW5rIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb259XG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWlkIC0gYW4gZXhjZXB0aW9uIElkLCBzaG91bGQgYmUgZ2VuZXJhdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gYW4gbWVzc2FnZSBmb3IgdGhlIGV4Y2VwdGlvblxuICAgKiBAc2VlIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb25cbiAgICogQHNlZSBFaWRSdW50aW1lRXhjZXB0aW9uXG4gICAqIEBhdXRob3IgS3J6eXN6dG9mIFN1c3p5xYRza2kgPGtyenlzenRvZi5zdXN6eW5za2lAd2F2ZXNvZnR3YXJlLnBsPlxuICAgKi9cbiAgZnVuY3Rpb24gRWlkSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbihlaWQsIG1lc3NhZ2UpIHtcbiAgICB2YXIgdG1wID0gRWlkUnVudGltZUV4Y2VwdGlvbi5hcHBseSh0aGlzLCBbZWlkLCBtZXNzYWdlXSk7XG4gICAgdG1wLm5hbWUgPSB0aGlzLm5hbWUgPSAnRWlkSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbic7XG4gICAgY29ycmVjdFN0YWNrVHJhY2UodGhpcywgRWlkSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgRWlkSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVpZFJ1bnRpbWVFeGNlcHRpb24ucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHsgdmFsdWU6IEVpZEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24gfVxuICB9KTtcblxuICBleHBvcnRzLkVpZFJ1bnRpbWVFeGNlcHRpb24gPSBFaWRSdW50aW1lRXhjZXB0aW9uO1xuICBleHBvcnRzLkVpZE51bGxQb2ludGVyRXhjZXB0aW9uID0gRWlkTnVsbFBvaW50ZXJFeGNlcHRpb247XG4gIGV4cG9ydHMuRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uID0gRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uO1xuICBleHBvcnRzLkVpZElsbGVnYWxTdGF0ZUV4Y2VwdGlvbiA9IEVpZElsbGVnYWxTdGF0ZUV4Y2VwdGlvbjtcbiAgZXhwb3J0cy5FaWRJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uID0gRWlkSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbjtcblxufSkoZXhwb3J0cyk7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTYgV2F2ZSBTb2Z0d2FyZVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBFaWQgPSByZXF1aXJlKCcuL2VpZCcpO1xudmFyIEVpZFJ1bnRpbWVFeGNlcHRpb24gPSByZXF1aXJlKCcuL2V4Y2VwdGlvbnMnKS5FaWRSdW50aW1lRXhjZXB0aW9uO1xudmFyIEVpZE51bGxQb2ludGVyRXhjZXB0aW9uID0gcmVxdWlyZSgnLi9leGNlcHRpb25zJykuRWlkTnVsbFBvaW50ZXJFeGNlcHRpb247XG52YXIgRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uID0gcmVxdWlyZSgnLi9leGNlcHRpb25zJykuRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uO1xudmFyIEVpZElsbGVnYWxTdGF0ZUV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4vZXhjZXB0aW9ucycpLkVpZElsbGVnYWxTdGF0ZUV4Y2VwdGlvbjtcbnZhciBFaWRJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uID0gcmVxdWlyZSgnLi9leGNlcHRpb25zJykuRWlkSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbjtcblxuLyoqXG4gKiA8c3Ryb25nPlRoaXMgY2xhc3Mgc2hvdWxkbid0IGJlIHVzZWQgaW4gYW55IHB1YmxpYyBBUEkgb3IgbGlicmFyeS48L3N0cm9uZz4gSXQgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCBmb3IgaW4taG91c2UgZGV2ZWxvcG1lbnRcbiAqIG9mIGVuZCB1c2VyIGFwcGxpY2F0aW9ucyB3aGljaCB3aWxsIHJlcG9ydCBCdWdzIGluIHN0YW5kYXJkaXplZCBlcnJvciBwYWdlcyBvciBwb3N0IHRoZW0gdG8gaXNzdWUgdHJhY2tlci5cbiAqIDxwLz5cbiAqIFN0YXRpYyBjb252ZW5pZW5jZSBtZXRob2RzIHRoYXQgaGVscCBhIG1ldGhvZCBvciBjb25zdHJ1Y3RvciBjaGVjayB3aGV0aGVyIGl0IHdhcyBpbnZva2VkIGNvcnJlY3RseSAod2hldGhlciBpdHNcbiAqIDxpPnByZWNvbmRpdGlvbnM8L2k+XG4gKiBoYXZlIGJlZW4gbWV0KS4gVGhlc2UgbWV0aG9kcyBnZW5lcmFsbHkgYWNjZXB0IGEge0Bjb2RlIGJvb2xlYW59IGV4cHJlc3Npb24gd2hpY2ggaXMgZXhwZWN0ZWQgdG8gYmUge0Bjb2RlIHRydWV9IChvciBpbiB0aGVcbiAqIGNhc2Ugb2Yge0Bjb2RlXG4gKiBjaGVja05vdE51bGx9LCBhbiBvYmplY3QgcmVmZXJlbmNlIHdoaWNoIGlzIGV4cGVjdGVkIHRvIGJlIG5vbi1udWxsKS4gV2hlbiB7QGNvZGUgZmFsc2V9IChvciB7QGNvZGUgbnVsbH0pIGlzIHBhc3NlZCBpbnN0ZWFkLFxuICogdGhlIHtAY29kZSBFaWRQcmVjb25kaXRpb25zfSBtZXRob2QgdGhyb3dzIGFuIHVuY2hlY2tlZCBleGNlcHRpb24sIHdoaWNoIGhlbHBzIHRoZSBjYWxsaW5nIG1ldGhvZCBjb21tdW5pY2F0ZSB0byA8aT5pdHM8L2k+XG4gKiBjYWxsZXIgdGhhdFxuICogPGk+dGhhdDwvaT4gY2FsbGVyIGhhcyBtYWRlIGEgbWlzdGFrZS5cbiAqIDxwLz5cbiAqIEVhY2ggbWV0aG9kIGFjY2VwdHMgYSBFSUQgU3RyaW5nIG9yIHtAbGluayBFaWR9IG9iamVjdCwgd2hpY2ggaXMgZGVzaWduZWQgdG8gZWFzZSBvZiB1c2UgYW5kIHByb3ZpZGUgc3RyaWN0IElEIGZvciBnaXZlblxuICogRXhjZXB0aW9uIHVzYWdlLiBUaGlzIGFwcHJvYWNoIHNwZWVkIHVwIGRldmVsb3BtZW50IG9mIGxhcmdlIGFwcGxpY2F0aW9uIGFuZCBoZWxwcyBzdXBwb3J0IHRlYW1zIHRvIGJ5IGdpdmluZyB0aGUgYm90aCBzdGF0aWNcbiAqIGFuZCByYW5kb20gSUQgZm9yIGVhY2ggcG9zc2libGUgdW5wcmVkaWN0ZWQgYnVnLlxuICogPHAvPlxuICogVGhpcyBpcyBiZXN0IHRvIHVzZSB3aXRoIHRvb2xzIGFuZCBwbHVnaW5zIGxpa2VcbiAqIDxhIGhyZWY9XCJodHRwOi8vcGx1Z2lucy5uZXRiZWFucy5vcmcvcGx1Z2luLzUzMTM3L2V4Y2VwdGlvbi1pZC1laWQtZ2VuZXJhdG9yXCI+RWlkR2VuZXJhdG9yIGZvciBOZXRiZWFucyBJREU8L2E+XG4gKiA8cC8+XG4gKiBFeGFtcGxlOlxuICogPHByZT4gICB7QGNvZGVcbiAqXG4gKiAgIC8qKlxuICogICAgKiBSZXR1cm5zIHRoZSBwb3NpdGl2ZSBzcXVhcmUgcm9vdCBvZiB0aGUgZ2l2ZW4gdmFsdWUuXG4gKiAgICAqXG4gKiAgICAqIEB0aHJvd3MgRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uIGlmIHRoZSB2YWx1ZSBpcyBuZWdhdGl2ZVxuICogICAgKn17QGNvZGUgL1xuICogICBwdWJsaWMgc3RhdGljIGRvdWJsZSBzcXJ0KGRvdWJsZSB2YWx1ZSkge1xuICogICAgIEVpZFByZWNvbmRpdGlvbnMuY2hlY2tBcmd1bWVudCh2YWx1ZSA+PSAwLjAsIFwiMjAxNTA3MTg6MDEyMzMzXCIpO1xuICogICAgIC8vIGNhbGN1bGF0ZSB0aGUgc3F1YXJlIHJvb3RcbiAqICAgfVxuICpcbiAqICAgdm9pZCBleGFtcGxlQmFkQ2FsbGVyKCkge1xuICogICAgIGRvdWJsZSBkID0gc3FydCgtMS4wKTtcbiAqICAgfVxuICogfTwvcHJlPlxuICogPHAvPlxuICogSW4gdGhpcyBleGFtcGxlLCB7QGNvZGUgY2hlY2tBcmd1bWVudH0gdGhyb3dzIGFuIHtAY29kZSBFaWRJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb259IHRvIGluZGljYXRlIHRoYXQge0Bjb2RlIGV4YW1wbGVCYWRDYWxsZXJ9XG4gKiBtYWRlIGFuIGVycm9yIGluIDxpPml0czwvaT4gY2FsbCB0byB7QGNvZGUgc3FydH0uIEV4Y2VwdGlvbiwgd2hlbiBpdCB3aWxsIGJlIHByaW50ZWQgd2lsbCBjb250YWluIHVzZXIgZ2l2ZW4gRWlkIGFuZCBhbHNvXG4gKiBSYW5kb21seSBnZW5lcmF0ZWQgSUQuIFRob3NlIGZpZWxkcyBjYW4gYmUgZGlzcGxheWVkIHRvIHVzZXIgb24gZXJyb3IgcGFnZSBvbiBwb3N0ZWQgZGlyZWN0bHkgdG8gaXNzdWUgdHJhY2tlci5cbiAqIDxwLz5cbiAqIEV4YW1wbGU6XG4gKiA8cC8+XG4gKiA8cHJlPlxuICpcbiAqIHtAY29kZVxuICogICAvLyBNYWluIGFwcGxpY2F0aW9uIGNsYXNzIGZvciBleC46IGh0dHAgc2VydmxldFxuICogICAgdHJ5IHtcbiAqICAgICAgICBwZXJmb3JtUmVxdWVzdChyZXF1ZXN0LCByZXNwb25zZSk7XG4gKiAgICB9IGNhdGNoIChFaWRSdW50aW1lRXhjZXB0aW9uIGV4KSB7XG4gKiAgICAgICAgaXNzdWVzVHJhY2tlci5wdXQoZXgpO1xuICogICAgICAgIHRocm93IGV4O1xuICogICAgfVxuICogfTwvcHJlPlxuICogPHAvPlxuICogPHAvPlxuICogPGgzPkZ1bmN0aW9uYWwgdHJ5IHRvIGV4ZWN1dGUgYmxvY2tzPC9oMz5cbiAqIDxwLz5cbiAqIDxwLz5cbiAqIFVzaW5nIGZ1bmN0aW9uYWwgYmxvY2tzIHRvIGhhbmRsZSBvcGVyYXRpb25zLCB0aGF0IGFyZSBpbnRlbmRlZCB0byBvcGVyYXRlIHByb3Blcmx5LCBzaW1wbGlmeSB0aGUgY29kZSBhbmQgbWFrZXMgaXQgbW9yZVxuICogcmVhZGFibGUuIEl0J3MgYWxzbyBnb29kIHdheSB0byBkZWFsIHdpdGggdW50ZXN0ZWQsIHVuY292ZXJlZCB7QGNvZGUgY2F0Y2h9IGJsb2Nrcy4gSXQncyBlYXN5IGFuZCBnaXZlcyBkZXZlbG9wZXJzIG5pY2Ugd2F5IG9mXG4gKiBkZWFsaW5nIHdpdGggY291bnRsZXNzIG9wZXJhdGlvbnMgdGhhdCBzdXBwb3NlIHRvIHdvcmsgYXMgaW50ZW5kZWQuXG4gKiA8cC8+XG4gKiA8cC8+XG4gKiBFeGFtcGxlOlxuICogPHByZT48Y29kZT5cbiAqXG4gKiAgICAgSW5wdXRTdHJlYW0gaXMgPSBFaWRQcmVjb25kaXRpb25zLnRyeVRvRXhlY3V0ZSh7QGNvZGUgbmV3IFVuc2FmZVN1cHBsaWVyPElucHV0U3RyZWFtPn0oKSB7XG4gKiAgICAgICAge0BsaXRlcmFsIEB9T3ZlcnJpZGVcbiAqICAgICAgICAgcHVibGljIElucHV0U3RyZWFtIGdldCgpIHRocm93cyBJT0V4Y2VwdGlvbiB7XG4gKiAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGFzcygpLmdldENsYXNzTG9hZGVyKClcbiAqICAgICAgICAgICAgICAgICAuZ2V0UmVzb3VyY2VBc1N0cmVhbShcInByb2plY3QucHJvcGVydGllc1wiKTtcbiAqICAgICAgICAgfVxuICogICAgIH0sIFwiMjAxNTA3MTg6MTIxNTIxXCIpO1xuICogPC9jb2RlPjwvcHJlPlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1dGhvciBLcnp5c3p0b2YgU3VzennFhHNraSA8a3J6eXN6dG9mLnN1c3p5bnNraUB3YXZlc29mdHdhcmUucGw+XG4gKiBAc2luY2UgMC4xLjAgKGlkZWEgaW1wb3J0ZWQgZnJvbSBHdWF2YSBMaWJyYXJ5IGFuZCBDT0kgY29kZSlcbiAqL1xuZnVuY3Rpb24gRWlkUHJlY29uZGl0aW9ucygpIHt9XG5cbmZ1bmN0aW9uIGlzTnVsbGlrZShyZWZlcmVuY2UpIHtcbiAgcmV0dXJuIHJlZmVyZW5jZSA9PT0gbnVsbCB8fCByZWZlcmVuY2UgPT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY2hlY2tOb3ROdWxsKHJlZmVyZW5jZSkge1xuICBpZiAoaXNOdWxsaWtlKHJlZmVyZW5jZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFzcyBub3QtbnVsbCBFaWQgdG8gRWlkUHJlY29uZGl0aW9ucyBmaXJzdCFcIik7XG4gIH1cbiAgcmV0dXJuIHJlZmVyZW5jZTtcbn1cblxuZnVuY3Rpb24gZW5zdXJlRWlkKGNhbmRpZGF0ZSkge1xuICBjYW5kaWRhdGUgPSBjaGVja05vdE51bGwoY2FuZGlkYXRlKTtcbiAgdmFyIGVpZDtcbiAgaWYgKCEoY2FuZGlkYXRlIGluc3RhbmNlb2YgRWlkKSkge1xuICAgIGVpZCA9IG5ldyBFaWQoY2FuZGlkYXRlICsgJycpO1xuICB9IGVsc2Uge1xuICAgIGVpZCA9IGNhbmRpZGF0ZTtcbiAgfVxuICByZXR1cm4gZWlkO1xufVxuXG4vKipcbiAqIEVuc3VyZXMgdGhhdCBhbiBvYmplY3QgcmVmZXJlbmNlIHBhc3NlZCBhcyBhIHBhcmFtZXRlciB0byB0aGUgY2FsbGluZyBtZXRob2QgaXMgbm90IG51bGwtbGlrZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVmZXJlbmNlIC0gYW4gb2JqZWN0IHJlZmVyZW5jZVxuICogQHBhcmFtIHtzdHJpbmd8RWlkfSBlaWQgLSB0aGUgZXhjZXB0aW9uIElEIHRvIHVzZSBpZiB0aGUgY2hlY2sgZmFpbHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gbWVzc2FnZSBmb3IgcHJvZHVjZWQgZXhjZXB0aW9uXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBub24tbnVsbCByZWZlcmVuY2UgdGhhdCB3YXMgdmFsaWRhdGVkXG4gKiBAdGhyb3dzIHtFaWROdWxsUG9pbnRlckV4Y2VwdGlvbn0gaWYge0Bjb2RlIHJlZmVyZW5jZX0gaXMgbnVsbC1saWtlXG4gKi9cbkVpZFByZWNvbmRpdGlvbnMuY2hlY2tOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKHJlZmVyZW5jZSwgZWlkLCBtZXNzYWdlKSB7XG4gIHZhciBjaGVja2VkRWlkID0gZW5zdXJlRWlkKGVpZCk7XG4gIGlmIChpc051bGxpa2UocmVmZXJlbmNlKSkge1xuICAgIHRocm93IG5ldyBFaWROdWxsUG9pbnRlckV4Y2VwdGlvbihjaGVja2VkRWlkLCBtZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gcmVmZXJlbmNlO1xufTtcblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYW4gb2JqZWN0IHJlZmVyZW5jZSBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgdG8gdGhlIGNhbGxpbmcgbWV0aG9kIGlzIG5vdCBudWxsLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2UgLSBhbiBvYmplY3QgcmVmZXJlbmNlXG4gKiBAcGFyYW0ge3N0cmluZ3xFaWR9IGVpZCAtIHRoZSBleGNlcHRpb24gSUQgdG8gdXNlIGlmIHRoZSBjaGVjayBmYWlsc1xuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBtZXNzYWdlIGZvciBwcm9kdWNlZCBleGNlcHRpb25cbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG5vbi1udWxsIHJlZmVyZW5jZSB0aGF0IHdhcyB2YWxpZGF0ZWRcbiAqIEB0aHJvd3Mge0VpZE51bGxQb2ludGVyRXhjZXB0aW9ufSBpZiB7QGNvZGUgcmVmZXJlbmNlfSBpcyBudWxsLWxpa2VcbiAqL1xuRWlkUHJlY29uZGl0aW9ucy5jaGVja05vdE51bGwgPSBmdW5jdGlvbihyZWZlcmVuY2UsIGVpZCwgbWVzc2FnZSkge1xuICB2YXIgY2hlY2tlZEVpZCA9IGVuc3VyZUVpZChlaWQpO1xuICBpZiAocmVmZXJlbmNlID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVpZE51bGxQb2ludGVyRXhjZXB0aW9uKGNoZWNrZWRFaWQsIG1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiByZWZlcmVuY2U7XG59O1xuXG4vKipcbiAqIEVuc3VyZXMgdGhhdCBhbiBvYmplY3QgcmVmZXJlbmNlIHBhc3NlZCBhcyBhIHBhcmFtZXRlciB0byB0aGUgY2FsbGluZyBtZXRob2QgaXMgbm90IHVuZGVmaW5lZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVmZXJlbmNlIC0gYW4gb2JqZWN0IHJlZmVyZW5jZVxuICogQHBhcmFtIHtzdHJpbmd8RWlkfSBlaWQgLSB0aGUgZXhjZXB0aW9uIElEIHRvIHVzZSBpZiB0aGUgY2hlY2sgZmFpbHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gbWVzc2FnZSBmb3IgcHJvZHVjZWQgZXhjZXB0aW9uXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBub24tbnVsbCByZWZlcmVuY2UgdGhhdCB3YXMgdmFsaWRhdGVkXG4gKiBAdGhyb3dzIHtFaWROdWxsUG9pbnRlckV4Y2VwdGlvbn0gaWYge0Bjb2RlIHJlZmVyZW5jZX0gaXMgbnVsbC1saWtlXG4gKi9cbkVpZFByZWNvbmRpdGlvbnMuY2hlY2tOb3RVbmRlZmluZWQgPSBmdW5jdGlvbihyZWZlcmVuY2UsIGVpZCwgbWVzc2FnZSkge1xuICB2YXIgY2hlY2tlZEVpZCA9IGVuc3VyZUVpZChlaWQpO1xuICBpZiAocmVmZXJlbmNlID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRWlkTnVsbFBvaW50ZXJFeGNlcHRpb24oY2hlY2tlZEVpZCwgbWVzc2FnZSk7XG4gIH1cbiAgcmV0dXJuIHJlZmVyZW5jZTtcbn07XG5cbi8qKlxuICogRW5zdXJlcyB0aGUgdHJ1dGggb2YgYW4gZXhwcmVzc2lvbiBpbnZvbHZpbmcgb25lIG9yIG1vcmUgcGFyYW1ldGVycyB0byB0aGUgY2FsbGluZyBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBleHByZXNzaW9uIC0gYSBib29sZWFuIGV4cHJlc3Npb25cbiAqIEBwYXJhbSB7c3RyaW5nfEVpZH0gZWlkIC0gdGhlIGV4Y2VwdGlvbiBJRCB0byB1c2UgaWYgdGhlIGNoZWNrIGZhaWxzXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIG9wdGlvbmFsIG1lc3NhZ2UgZm9yIGdlbmVyYXRlZCBleGNlcHRpb25cbiAqIEB0aHJvd3Mge0VpZElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbn0gaWYge0Bjb2RlIGV4cHJlc3Npb259IGlzIGZhbHNlXG4gKiBAdGhyb3dzIHtFaWROdWxsUG9pbnRlckV4Y2VwdGlvbn0gICAgIGlmIHtAY29kZSBleHByZXNzaW9ufSBpcyBudWxsXG4gKi9cbkVpZFByZWNvbmRpdGlvbnMuY2hlY2tBcmd1bWVudCA9IGZ1bmN0aW9uKGV4cHJlc3Npb24sIGVpZCwgbWVzc2FnZSkge1xuICB2YXIgY2hlY2tlZEVpZCA9IGVuc3VyZUVpZChlaWQpO1xuICBpZiAoIUVpZFByZWNvbmRpdGlvbnMuY2hlY2tOb3ROdWxsYWJsZShleHByZXNzaW9uLCBjaGVja2VkRWlkKSkge1xuICAgIHRocm93IG5ldyBFaWRJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oY2hlY2tlZEVpZCwgbWVzc2FnZSlcbiAgfVxufTtcblxuLyoqXG4gKiBFbnN1cmVzIHRoZSB0cnV0aCBvZiBhbiBleHByZXNzaW9uIGludm9sdmluZyB0aGUgc3RhdGUgb2YgdGhlIGNhbGxpbmcgaW5zdGFuY2UsIGJ1dCBub3QgaW52b2x2aW5nIGFueSBwYXJhbWV0ZXJzIHRvIHRoZVxuICogY2FsbGluZyBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBleHByZXNzaW9uIC0gYSBib29sZWFuIGV4cHJlc3Npb25cbiAqIEBwYXJhbSB7c3RyaW5nfEVpZH0gZWlkIC0gdGhlIGV4Y2VwdGlvbiBJRCB0byB1c2UgaWYgdGhlIGNoZWNrIGZhaWxzXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIG9wdGlvbmFsIG1lc3NhZ2UgZm9yIGdlbmVyYXRlZCBleGNlcHRpb25cbiAqIEB0aHJvd3Mge0VpZElsbGVnYWxTdGF0ZUV4Y2VwdGlvbn0gaWYge0Bjb2RlIGV4cHJlc3Npb259IGlzIGZhbHNlXG4gKiBAdGhyb3dzIHtFaWROdWxsUG9pbnRlckV4Y2VwdGlvbn0gICAgIGlmIHtAY29kZSBleHByZXNzaW9ufSBpcyBudWxsXG4gKi9cbkVpZFByZWNvbmRpdGlvbnMuY2hlY2tTdGF0ZSA9IGZ1bmN0aW9uKGV4cHJlc3Npb24sIGVpZCwgbWVzc2FnZSkge1xuICB2YXIgY2hlY2tlZEVpZCA9IGVuc3VyZUVpZChlaWQpO1xuICBpZiAoIUVpZFByZWNvbmRpdGlvbnMuY2hlY2tOb3ROdWxsYWJsZShleHByZXNzaW9uLCBjaGVja2VkRWlkKSkge1xuICAgIHRocm93IG5ldyBFaWRJbGxlZ2FsU3RhdGVFeGNlcHRpb24oY2hlY2tlZEVpZCwgbWVzc2FnZSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGlzSW5kZXhBbmRTaXplSWxsZWdhbChpbmRleCwgc2l6ZSkge1xuICByZXR1cm4gaW5kZXggPCAwIHx8IGluZGV4ID4gc2l6ZTtcbn1cblxuZnVuY3Rpb24gaXNTaXplSWxsZWdhbChzaXplKSB7XG4gIHJldHVybiBzaXplIDwgMDtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQge0Bjb2RlIGluZGV4fSBzcGVjaWZpZXMgYSB2YWxpZCA8aT5lbGVtZW50PC9pPiBpbiBhbiBhcnJheSwgbGlzdCBvciBzdHJpbmcgb2Ygc2l6ZSB7QGNvZGUgc2l6ZX0uIEFuIGVsZW1lbnRcbiAqIGluZGV4IG1heSByYW5nZSBmcm9tIHplcm8sIGluY2x1c2l2ZSwgdG8ge0Bjb2RlIHNpemV9LCBleGNsdXNpdmUuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gYSB1c2VyLXN1cHBsaWVkIGluZGV4IGlkZW50aWZ5aW5nIGFuIGVsZW1lbnQgb2YgYW4gYXJyYXksIGxpc3Qgb3Igc3RyaW5nXG4gKiBAcGFyYW0ge251bWVyfSBzaXplIC0gdGhlIHNpemUgb2YgdGhhdCBhcnJheSwgbGlzdCBvciBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfEVpZH0gZWlkIC0gdGhlIHRleHQgdG8gdXNlIHRvIGRlc2NyaWJlIHRoaXMgaW5kZXggaW4gYW4gZXJyb3IgbWVzc2FnZVxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBvcHRpb25hbCBtZXNzYWdlIGZvciBnZW5lcmF0ZWQgZXhjZXB0aW9uXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB2YWx1ZSBvZiB7QGNvZGUgaW5kZXh9XG4gKiBAdGhyb3dzIHtFaWRJbmRleE91dE9mQm91bmRzRXhjZXB0aW9ufSBpZiB7QGNvZGUgaW5kZXh9IGlzIG5lZ2F0aXZlIG9yIGlzIG5vdCBsZXNzIHRoYW4ge0Bjb2RlIHNpemV9XG4gKiBAdGhyb3dzIHtFaWRJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb259ICBpZiB7QGNvZGUgc2l6ZX0gaXMgbmVnYXRpdmVcbiAqL1xuRWlkUHJlY29uZGl0aW9ucy5jaGVja0VsZW1lbnRJbmRleCA9IGZ1bmN0aW9uKGluZGV4LCBzaXplLCBlaWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGNoZWNrZWRFaWQgPSBlbnN1cmVFaWQoZWlkKTtcbiAgaWYgKGlzU2l6ZUlsbGVnYWwoc2l6ZSkpIHtcbiAgICB0aHJvdyBuZXcgRWlkSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uKGNoZWNrZWRFaWQsIG1lc3NhZ2UpO1xuICB9XG4gIGlmIChpc0luZGV4QW5kU2l6ZUlsbGVnYWwoaW5kZXgsIHNpemUpKSB7XG4gICAgdGhyb3cgbmV3IEVpZEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24oY2hlY2tlZEVpZCwgbWVzc2FnZSk7XG4gIH1cbiAgcmV0dXJuIGluZGV4O1xufTtcblxuLyoqXG4gKiBUcmllcyB0byBleGVjdXRlIGNvZGUgaW4gZ2l2ZW4gdW5zYWZlIHN1cHBsaWVyIGNvZGUgYmxvY2ssIGFuZCBpZiBleGNlcHRpb24gaXMgdGhyb3duLCBpdCB3aWxsIGdldHMgcmV0aHJvd24gYXMgYVxuICoge0BsaW5rIEVpZFJ1bnRpbWVFeGNlcHRpb259IHdpdGggZWlkIGdpdmVuIGFzIGEgYXJndW1lbnQuIFRoaXMgaXMgYmVjYXVzZSB0aGlzIGV4Y2VwdGlvbiBpcyB0aHJlYWRlZCBhcyBhIHNvZnR3YXJlIGJ1ZyFcbiAqIDxwLz5cbiAqIEV4YW1wbGU6XG4gKiA8cHJlPjxjb2RlPlxuICpcbiAqIERvY3VtZW50IGRvYyA9IEVpZFByZWNvbmRpdGlvbnMudHJ5VG9FeGVjdXRlKHtAY29kZSBuZXcgVW5zYWZlU3VwcGxpZXI8RG9jdW1lbnQ+fSgpIHtcbiAqICAgIHtAbGl0ZXJhbCBAfU92ZXJyaWRlXG4gKiAgICAgcHVibGljIERvY3VtZW50IGdldCgpIHRocm93cyBJT0V4Y2VwdGlvbiB7XG4gKiAgICAgICAgICBEb2N1bWVudEJ1aWxkZXIgZG9jQnVpbGRlciA9IC4uLlxuICogICAgICAgICAgcmV0dXJuIGRvY0J1aWxkZXIucGFyc2UobmV3IElucHV0U291cmNlKHJlYWRlcikpO1xuICogICAgIH1cbiAqIH0sIG5ldyBFaWQoXCIyMDE1MDcxODoxMjE1MjFcIikpO1xuICogPC9jb2RlPjwvcHJlPlxuICpcbiAqIEBwYXJhbSA8Uj4gICAgICByZXR1cm4gdHlwZVxuICogQHBhcmFtIHN1cHBsaWVyIHVuc2FmZSBzdXBwbGllciBjb2RlIHRvIGJlIGV4ZWN1dGVkIHdpdGhpbiBhIHRyeS1jYXRjaCBibG9ja1xuICogQHBhcmFtIGVpZCAgICAgIHVuaXF1ZSBkZXZlbG9wZXIgaWRlbnRpZmllciBmcm9tIGRhdGUgZm9yIGV4LjogXCIyMDE1MDcxNjoxMjMyMDBcIlxuICogQHJldHVybiBBIGJsb2NrIG9mIGNvZGUgcmV0dXJuIHR5cGUsIGlmIGV4Y2VwdGlvbiBpcyBub3QgdGhyb3duXG4gKiBAdGhyb3dzIEVpZFJ1bnRpbWVFeGNlcHRpb24gaWYgY29kZSBibG9jayB0aHJvd24gYW55IGV4Y2VwdGlvbiwgd2hpY2ggaW4gdGhhdCBjYXNlIGlzIHdyYXBwZWQgaW4gRWlkUnVudGltZUV4Y2VwdGlvblxuICovXG5FaWRQcmVjb25kaXRpb25zLnRyeVRvRXhlY3V0ZSA9IGZ1bmN0aW9uKHN1cHBsaWVyLCBlaWQpIHtcbiAgdmFyIGNoZWNrZWRFaWQgPSBlbnN1cmVFaWQoZWlkKTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gRWlkUHJlY29uZGl0aW9ucy5jaGVja05vdE51bGxhYmxlKHN1cHBsaWVyLCBjaGVja2VkRWlkKS5hcHBseSgpO1xuICB9IGNhdGNoICh0aHJvd2FibGUpIHtcbiAgICB0aHJvdyBuZXcgRWlkUnVudGltZUV4Y2VwdGlvbihjaGVja2VkRWlkLCB0aHJvd2FibGUpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVpZFByZWNvbmRpdGlvbnM7XG59KShtb2R1bGUpO1xuIl19
