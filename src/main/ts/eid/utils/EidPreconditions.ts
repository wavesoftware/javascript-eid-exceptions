

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
class EidPreconditions {
  static checkArgument(expression : boolean, eid: String) {

  }
}

export default EidPreconditions;
