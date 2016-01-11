'use strict';

var Eid = (function() {

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
    return random(LONG_MIN, LONG_MAX);
  };
  this.nextInt = function(max) {
    return random(0, max);
  };
  var random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}

function StdUniqIdGenerator() {
  var BASE36 = 36;
  var INTEGER_MAX_VALUE = Math.pow(2, 31);
  var generator = new MathRandom();
  this.generateUniqId = function() {
    var first = Math.abs(generator.nextLong() + 1);
    var second = Math.abs(generator.nextInt(INTEGER_MAX_VALUE));
    var calc = first + second;
    return (Math.abs(calc) % INTEGER_MAX_VALUE).toString(BASE36);
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

return Eid;
})();

module.exports = Eid;
