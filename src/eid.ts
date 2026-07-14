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

export interface UniqIdGenerator {
  generateUniqId(): string;
}

class JFormatter {
  private readonly template: string;

  constructor(template: string) {
    this.template = template;
  }

  format(args: unknown[]): string {
    let i = 0;
    return this.template.replace(/%s/g, () => {
      return i < args.length ? String(args[i++]) : "%s";
    });
  }
}

class MathRandom {
  private static readonly LONG_MAX = 2 ** 53 - 1;
  private static readonly LONG_MIN = -1 * 2 ** 53;

  nextLong(): number {
    return this.nextNumber(MathRandom.LONG_MIN, MathRandom.LONG_MAX);
  }

  nextInt(max: number): number {
    return this.nextNumber(0, max);
  }

  nextNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

class StdUniqIdGenerator implements UniqIdGenerator {
  private static readonly BASE36 = 36;
  private static readonly INTEGER_MAX_VALUE = 2 ** 31;
  private static readonly MIN_6_CHAR_HASH = 60466177; // for '100001' in base36

  private readonly padding: string;
  private readonly generator: MathRandom;

  constructor() {
    this.generator = new MathRandom();
    this.padding = this.generator
      .nextNumber(StdUniqIdGenerator.MIN_6_CHAR_HASH, StdUniqIdGenerator.INTEGER_MAX_VALUE)
      .toString(StdUniqIdGenerator.BASE36);
  }

  generateUniqId(): string {
    const first = Math.abs(this.generator.nextLong() + 1);
    const second = Math.abs(this.generator.nextInt(StdUniqIdGenerator.INTEGER_MAX_VALUE));
    const calc = first + second;
    const hash = (Math.abs(calc) % StdUniqIdGenerator.INTEGER_MAX_VALUE).toString(
      StdUniqIdGenerator.BASE36,
    );
    return String(this.padding + hash).slice(-6);
  }
}

const DEFAULT_FORMAT = "[%s]<%s>";
const DEFAULT_REF_FORMAT = "[%s|%s]<%s>";
const DEFAULT_MESSAGE_FORMAT = "%s => %s";
const DEFAULT_UNIQ_ID_GENERATOR: UniqIdGenerator = new StdUniqIdGenerator();

const FORMAT_NUM_SPEC = 2;
const REF_FORMAT_NUM_SPEC = 3;
const MESSAGE_FORMAT_NUM_SPEC = 2;

interface EidState {
  format: string;
  refFormat: string;
  messageFormat: string;
  uniqIdGenerator: UniqIdGenerator;
}

const EidInternal: EidState = {
  format: DEFAULT_FORMAT,
  refFormat: DEFAULT_REF_FORMAT,
  messageFormat: DEFAULT_MESSAGE_FORMAT,
  uniqIdGenerator: DEFAULT_UNIQ_ID_GENERATOR,
};

function validateFormat(format: string | null | undefined, numSpecifiers: number): void {
  if (format === null || format === undefined) {
    throw new TypeError("Format can't be null, but just received one");
  }
  const specifiers: string[] = [];
  for (let i = 0; i < numSpecifiers; i++) {
    specifiers.push(`${i}-test-id`);
  }
  const formatted = new JFormatter(format).format(specifiers);
  for (const specifier of specifiers) {
    if (formatted.indexOf(specifier) === -1) {
      throw new TypeError(
        `Given format contains to little format specifiers, expected ${numSpecifiers} but given "${format}"`,
      );
    }
  }
}

/**
 * Exception identifier for all Eid Runtime Exceptions.
 *
 * This class shouldn't be used in any public API or library. It is designed
 * to be used for in-house development of end user applications which will
 * report Bugs in standardized error pages or post them to issue tracker.
 */
export class Eid {
  static readonly DEFAULT_FORMAT: string = DEFAULT_FORMAT;
  static readonly DEFAULT_REF_FORMAT: string = DEFAULT_REF_FORMAT;
  static readonly DEFAULT_MESSAGE_FORMAT: string = DEFAULT_MESSAGE_FORMAT;
  static readonly DEFAULT_UNIQ_ID_GENERATOR: UniqIdGenerator = DEFAULT_UNIQ_ID_GENERATOR;

  private readonly id: string;
  private readonly ref: string;
  private readonly uniq: string;

  constructor(id: string, ref?: string | null) {
    this.id = id;
    this.ref = ref === null || ref === undefined ? "" : ref;
    this.uniq = EidInternal.uniqIdGenerator.generateUniqId();
  }

  toString(): string {
    if (this.ref === "") {
      return new JFormatter(EidInternal.format).format([this.id, this.uniq]);
    }
    return new JFormatter(EidInternal.refFormat).format([this.id, this.ref, this.uniq]);
  }

  getId(): string {
    return this.id;
  }

  getRef(): string {
    return this.ref;
  }

  getUniq(): string {
    return this.uniq;
  }

  makeLogMessage(logMessageFormat: string, ...params: unknown[]): string {
    const message = new JFormatter(logMessageFormat).format(params);
    return new JFormatter(Eid.getMessageFormat()).format([this.toString(), message]);
  }

  static setFormat(format: string): string {
    validateFormat(format, FORMAT_NUM_SPEC);
    const previously = EidInternal.format;
    EidInternal.format = format;
    return previously;
  }

  static setRefFormat(refFormat: string): string {
    validateFormat(refFormat, REF_FORMAT_NUM_SPEC);
    const previously = EidInternal.refFormat;
    EidInternal.refFormat = refFormat;
    return previously;
  }

  static setMessageFormat(format: string): string {
    validateFormat(format, MESSAGE_FORMAT_NUM_SPEC);
    const oldFormat = EidInternal.messageFormat;
    EidInternal.messageFormat = format;
    return oldFormat;
  }

  static getMessageFormat(): string {
    return EidInternal.messageFormat;
  }

  static setUniqIdGenerator(uniqIdGenerator: UniqIdGenerator): UniqIdGenerator {
    if (uniqIdGenerator === null || uniqIdGenerator === undefined) {
      throw new TypeError("Unique ID generator can't be null, but given one");
    }
    const previous = EidInternal.uniqIdGenerator;
    EidInternal.uniqIdGenerator = uniqIdGenerator;
    return previous;
  }
}

export default Eid;
