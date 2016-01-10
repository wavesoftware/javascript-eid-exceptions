
import JFormatter from './internal/JFormatter';
import MathRandom from './internal/MathRandom';

export module Eid {
  /**
   * It is used to generate unique ID for each EID object. It's mustn't be secure because it just indicate EID object while
   * logging.
   */
  export interface UniqIdGenerator {
    /**
     * Generates a unique string ID
     *
     * @return a generated unique ID
     */
    generateUniqId(): string;
  }
}

class StdUniqIdGenerator implements Eid.UniqIdGenerator {
  private static BASE36 = 36;
  private static INTEGER_MAX_VALUE = Math.pow(2, 31);
  private static generator : MathRandom = new MathRandom();
  generateUniqId(): string {
    var first : number = Math.abs(StdUniqIdGenerator.generator.nextLong() + 1);
    var second : number = Math.abs(StdUniqIdGenerator.generator.nextInt(StdUniqIdGenerator.INTEGER_MAX_VALUE));
    var calc = first + second;
    return (Math.abs(calc) % StdUniqIdGenerator.INTEGER_MAX_VALUE).toString(StdUniqIdGenerator.BASE36);
  }
}
/**
 * <strong>This class shouldn't be used in any public API or library.</strong> It is designed to be used for in-house development
 * of end user applications which will report Bugs in standardized error pages or post them to issue tracker.
 * <p>
 * Exception identifier for all Eid Runtime Exceptions.
 *
 * @author Krzysztof Suszyński <krzysztof.suszynski@wavesoftware.pl>
 */
export default class Eid {
  public static get DEFAULT_FORMAT() : string { return "[%s]<%s>" };
  public static get DEFAULT_REF_FORMAT() : string { return "[%s|%s]<%s>" };
  public static get DEFAULT_MESSAGE_FORMAT() : string { return "%s => %s" };
  public static get DEFAULT_UNIQ_ID_GENERATOR() : Eid.UniqIdGenerator { return new StdUniqIdGenerator() };
  static FORMAT_NUM_SPEC : number = 2;
  static REF_FORMAT_NUM_SPEC : number = 3;
  private static MESSAGE_FORMAT_NUM_SPEC : number = 2;
  private static messageFormat : string = Eid.DEFAULT_MESSAGE_FORMAT;
  private static uniqIdGenerator : Eid.UniqIdGenerator = Eid.DEFAULT_UNIQ_ID_GENERATOR;
  private static format : string = Eid.DEFAULT_FORMAT;
  private static refFormat : string = Eid.DEFAULT_REF_FORMAT;
  private id : string;
  private ref : string;
  private uniq : string;

  /**
   * Constructor
   *
   * @param id the exception id, must be unique developer inserted string, from date
   * @param ref an optional reference
   */
  constructor(id : string, ref : string = null) {
    this.uniq = Eid.uniqIdGenerator.generateUniqId();
    this.id = id;
    this.ref = (ref == null ? '' : ref);
  }

  /**
   * Sets the actual unique ID generator that will be used to generate IDs for all Eid objects. It will return previously used
   * generator.
   *
   * @param uniqIdGenerator new instance of unique ID generator
   * @return a previously used unique ID generator
   * @throws TypeError if given generator was null
   */
  public static setUniqIdGenerator(uniqIdGenerator : Eid.UniqIdGenerator) : Eid.UniqIdGenerator {
    if (uniqIdGenerator == null) {
      throw new TypeError("Unique ID generator can't be null, but given one");
    }
    var previous : Eid.UniqIdGenerator = Eid.uniqIdGenerator;
    Eid.uniqIdGenerator = uniqIdGenerator;
    return previous;
  }

  /**
   * Sets a format that will be used for all Eid exceptions when printing a detail message.
   * <p>
   * Format must be non-null and contain two format specifiers <tt>"%s"</tt>
   *
   * @param format a format that will be used, must be non-null and contain two format specifiers <tt>"%s"</tt>
   * @return previously used format
   * @throws IllegalArgumentException if given format hasn't got two format specifiers <tt>"%s"</tt>, or if given format was
   * null
   */
  public static setMessageFormat(format : string) : string {
    Eid.validateFormat(format, Eid.MESSAGE_FORMAT_NUM_SPEC);
    var oldFormat : string = Eid.messageFormat;
    Eid.messageFormat = format;
    return oldFormat;
  }

  /**
   * Gets actually set message format
   *
   * @return actually set message format
   */
  public static getMessageFormat() : string {
    return Eid.messageFormat;
  }

  /**
   * Sets the actual format that will be used in {@link #toString()} method. It will return previously used format.
   *
   * @param format a format compliant with {@link JFormatter#format(String, Object...)} with 2 object arguments
   * @return a previously used format
   * @throws TypeError if given format hasn't got two format specifiers <tt>"%s"</tt>, or if given format was
   * null
   */
  public static setFormat(format : string) : string {
      Eid.validateFormat(format, Eid.FORMAT_NUM_SPEC);
      var previously:string = Eid.format;
      Eid.format = format;
      return previously;
  }

  /**
   * Sets the actual format that will be used in {@link #toString()} method
   *
   * @param refFormat a format compliant with {@link JFormatter#format(String, Object...)} with 3 object arguments
   * @return a previously used format
   * @throws TypeError if given format hasn't got tree format specifiers <tt>"%s"</tt>, or if given format was
   * null
   */
  public static setRefFormat(refFormat : string) : string {
      Eid.validateFormat(refFormat, Eid.REF_FORMAT_NUM_SPEC);
      var previously : string = Eid.refFormat;
      Eid.refFormat = refFormat;
      return previously;
  }

  /**
   * Makes a log message from this EID object
   * <p>
   * <p>This method is for convenience of usage of EID in logging. You can use it like this:
   * <p>
   * <pre>
   * log.debug(new Eid("20151025:202129").makeLogMessage("A request: %s", request));
   * </pre>
   * @param logMessageFormat a log message format as accepted by {@link JFormatter#format(String, Object...)}
   * @param parameters a parameters for logMessageFormat to by passed to {@link JFormatter#format(String, Object...)}
   * @return a formatted message
   */
  public makeLogMessage(logMessageFormat : string, ...parameters : any[]) {
      var message : string = JFormatter.format(logMessageFormat, parameters);
      return JFormatter.format(Eid.getMessageFormat(), this.toString(), message);
  }

  public toString() : string {
    if ("" === this.ref || null === this.ref) {
      return JFormatter.format(Eid.format, this.id, this.uniq);
    }
    return JFormatter.format(Eid.refFormat, this.id, this.ref, this.uniq);
  }

  /**
   * Getter for constant Exception ID
   *
   * @return ID of exception
   */
  public getId() : string {
    return this.id;
  }

  /**
   * Get custom ref passed to Exception ID
   *
   * @return ID of exception
   */
  public getRef() : string {
    return this.ref;
  }

  /**
   * Gets unique generated string for this instance of Eid
   *
   * @return a unique string
   */
  public getUniq() : string {
    return this.uniq;
  }

  private static validateFormat(format : string, numSpecifiers : number) : void {
    if (format == null) {
      throw new TypeError("Format can't be null, but just received one");
    }
    var specifiers:string[] = [];
    for (var i:number = 0; i < numSpecifiers; i++) {
      specifiers.push(i + "-test-id");
    }
    var formatted : string = JFormatter.format(format, specifiers);
    for (var specifier in specifiers) {
      if (!formatted.includes(specifier)) {
        throw new TypeError("Given format contains to little format specifiers, "
            + "expected " + numSpecifiers + " but given \"" + format + "\"");
      }
    }
  }

}
