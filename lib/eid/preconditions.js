'use strict';

var Eid = require('../eid');
var EidNullPointerException =  require('./exceptions').EidNullPointerException;
var EidIllegalArgumentException =  require('./exceptions').EidIllegalArgumentException;
var EidIllegalStateException =  require('./exceptions').EidIllegalStateException;
var EidIndexOfOfBoundsException =  require('./exceptions').EidIndexOfOfBoundsException;

var EidPreconditions = (function() {
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
  if (!(candidate instanceof Eid)) {
    eid = new Eid(candidate.toString());
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
EidPreconditions.checkNotNullLike = function(reference, eid, message) {
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
  if (!EidPreconditions.checkNotNullLike(expression, checkedEid)) {
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
  if (!EidPreconditions.checkNotNullLike(expression, checkedEid)) {
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
    return supplier.apply();
  } catch (throwable) {
    throw new EidRuntimeException(checkedEid, throwable);
  }
};

return EidPreconditions;
})();

module.exports = EidPreconditions;
