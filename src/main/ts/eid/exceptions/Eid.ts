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

class Random {
  private static get LONG_MAX(): number { return Math.pow(2, 53) - 1 };
  private static get LONG_MIN(): number { return -1 * Math.pow(2, 53) };
  nextLong() : number {
    return this.random(Random.LONG_MIN, Random.LONG_MAX);
  };
  nextInt(max : number) : number {
    return this.random(0, max);
  };
  private random(min : number, max: number) : number {
      return Math.floor(Math.random() * (max - min + 1)) + min
  };
}

class StdUniqIdGenerator implements UniqIdGenerator {
  private static BASE36 = 36;
  private static INTEGER_MAX_VALUE = Math.pow(2, 31);
  private static generator : Random = new Random();
  generateUniqId(): string {
    var first : number = Math.abs(StdUniqIdGenerator.generator.nextLong() + 1);
    var second : number = Math.abs(StdUniqIdGenerator.generator.nextInt(StdUniqIdGenerator.INTEGER_MAX_VALUE));
    var calc = first + second;
    return (Math.abs(calc) % StdUniqIdGenerator.INTEGER_MAX_VALUE).toString(StdUniqIdGenerator.BASE36);
  }
}

class StringFormatter {
  static format(format : string, ...args : any[]) : string {
    var regex = /%s/;
    var _r = function(p,c) { return p.replace(regex, c); }
    return args.reduce(_r, format);
  }
}

export default class Eid {
  public static get DEFAULT_FORMAT() : string { return "[%s]<%s>" };
  public static get DEFAULT_REF_FORMAT() : string { return "[%s|%s]<%s>" };
  public static get DEFAULT_MESSAGE_FORMAT() : string { return "%s => %s" };
  public static get DEFAULT_UNIQ_ID_GENERATOR() : UniqIdGenerator { return new StdUniqIdGenerator() };
  static FORMAT_NUM_SPEC : number = 2;
  static REF_FORMAT_NUM_SPEC : number = 3;
  private static MESSAGE_FORMAT_NUM_SPEC : number = 2;
  private static messageFormat : string = Eid.DEFAULT_MESSAGE_FORMAT;
  private static uniqIdGenerator : UniqIdGenerator = Eid.DEFAULT_UNIQ_ID_GENERATOR;
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
    this.ref = ref;
  }

  public toString() : string {
      if ("" === this.ref || null === this.ref) {
          return StringFormatter.format(Eid.format, this.id, this.uniq);
      }
      return StringFormatter.format(Eid.refFormat, this.id, this.ref, this.uniq);
  }

  public static setUniqIdGenerator(uniqIdGenerator : UniqIdGenerator) : UniqIdGenerator {
    if (uniqIdGenerator == null) {
      throw new TypeError("Unique ID generator can't be null, but given one");
    }
    var previous : UniqIdGenerator = Eid.uniqIdGenerator;
    Eid.uniqIdGenerator = uniqIdGenerator;
    return previous;
  }

}
