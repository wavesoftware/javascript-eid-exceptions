/**
 * This is internal package, do not use it externally
 */

export default class MathRandom {
  private static get LONG_MAX(): number { return Math.pow(2, 53) - 1 };
  private static get LONG_MIN(): number { return -1 * Math.pow(2, 53) };
  nextLong() : number {
    return this.random(MathRandom.LONG_MIN, MathRandom.LONG_MAX);
  };
  nextInt(max : number) : number {
    return this.random(0, max);
  };
  private random(min : number, max: number) : number {
      return Math.floor(Math.random() * (max - min + 1)) + min
  };
}
