
/**
 * Internal class, do not use it.
 * @internal
 */
export default class JFormatter {
  static format(format : string, ...args : any[]) : string {
    var regex = /%s/;
    var _r = function(p,c) { return p.replace(regex, c); }
    return args.reduce(_r, format);
  }
}
