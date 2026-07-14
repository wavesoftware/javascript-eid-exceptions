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

import { afterEach, describe, expect, it } from "vitest";
import { Eid } from "../eid";

describe("Eid", () => {
  describe(".setFormat()", () => {
    afterEach(() => {
      Eid.setFormat(Eid.DEFAULT_FORMAT);
    });

    it("should set a valid new format and return last", () => {
      const fmt = "{%s-%s}";
      let prev = Eid.setFormat(fmt);
      expect(prev).toEqual(Eid.DEFAULT_FORMAT);

      prev = Eid.setFormat(fmt);
      expect(prev).toEqual(fmt);
    });

    it("should throw error on null", () => {
      const fn = () => {
        Eid.setFormat(null as unknown as string);
      };
      expect(fn).toThrow(TypeError);
      expect(fn).toThrow("Format can't be null, but just received one");
    });

    it("should throw error on invalid format", () => {
      const fn = () => {
        Eid.setFormat("%s -->");
      };
      expect(fn).toThrow(TypeError);
      expect(fn).toThrow(
        /Given format contains to little format specifiers, expected 2 but given "%s -->"/,
      );
    });
  });

  describe(".setRefFormat()", () => {
    afterEach(() => {
      Eid.setRefFormat(Eid.DEFAULT_REF_FORMAT);
    });

    it("should set a valid new ref format and return last", () => {
      const fmt = "%s:%s --> %s";
      const prev = Eid.setRefFormat(fmt);
      expect(prev).toEqual(Eid.DEFAULT_REF_FORMAT);
    });
  });

  describe(".setMessageFormat()", () => {
    afterEach(() => {
      Eid.setMessageFormat(Eid.DEFAULT_MESSAGE_FORMAT);
    });

    it("should set a valid new message format and return last", () => {
      const fmt = "%s --> %s";
      const prev = Eid.setMessageFormat(fmt);
      expect(prev).toEqual(Eid.DEFAULT_MESSAGE_FORMAT);
    });
  });

  describe(".getMessageFormat()", () => {
    it("should return original actually set message format", () => {
      const fmt = Eid.getMessageFormat();
      expect(fmt).toEqual(Eid.DEFAULT_MESSAGE_FORMAT);
    });
  });

  describe(".setUniqIdGenerator()", () => {
    afterEach(() => {
      Eid.setUniqIdGenerator(Eid.DEFAULT_UNIQ_ID_GENERATOR);
    });

    it("should throw error if given null", () => {
      const fn = () => {
        Eid.setUniqIdGenerator(null as unknown as { generateUniqId(): string });
      };
      expect(fn).toThrow(TypeError);
      expect(fn).toThrow(/^Unique ID generator can't be null, but given one$/);
    });

    it("should set properly if given correct implementation", () => {
      const gen = {
        generateUniqId: () => "5", // just like SONY here :-)
      };
      const prev = Eid.setUniqIdGenerator(gen);
      expect(prev).toBe(Eid.DEFAULT_UNIQ_ID_GENERATOR);
      const eid = new Eid("20160110:221413");
      expect(eid.toString()).toEqual("[20160110:221413]<5>");
    });
  });

  describe(".DEFAULT_MESSAGE_FORMAT", () => {
    it('should be equal "%s => %s"', () => {
      expect(Eid.DEFAULT_MESSAGE_FORMAT).toEqual("%s => %s");
    });
  });

  describe(".DEFAULT_FORMAT", () => {
    it('should be equal "[%s]<%s>"', () => {
      expect(Eid.DEFAULT_FORMAT).toEqual("[%s]<%s>");
    });
  });

  describe(".DEFAULT_REF_FORMAT", () => {
    it('should be equal "[%s|%s]<%s>"', () => {
      expect(Eid.DEFAULT_REF_FORMAT).toEqual("[%s|%s]<%s>");
    });
  });

  describe(".DEFAULT_UNIQ_ID_GENERATOR", () => {
    it("should be instance of UniqIdGenerator", () => {
      expect(Eid.DEFAULT_UNIQ_ID_GENERATOR.generateUniqId()).toMatch(/^[a-z0-9]{6}$/);
    });
  });

  describe("#toString()", () => {
    describe("without ref number", () => {
      const subject = new Eid("20160110:214452");
      it("should print object with eid and uniq id", () => {
        expect(subject.toString()).toMatch(/^\[20160110:214452\]<[a-z0-9]{6}>$/);
      });
    });

    describe("with ref number", () => {
      const subject = new Eid("20160110:214944", "ORA-1029");
      it("should print object with eid, ref and uniq id", () => {
        expect(subject.toString()).toMatch(/^\[20160110:214944\|ORA-1029\]<[a-z0-9]{6}>$/);
      });
    });
  });

  describe("#makeLogMessage()", () => {
    const eid = new Eid("20160110:215138");
    const messageFormat = "My test object is: %s";
    const testObject = {
      a: 67,
      toString() {
        return JSON.stringify(this);
      },
    };

    it('should print log message as: [20160110:215138]<xxxxx> => My test object is: {"a":67}', () => {
      expect(eid.makeLogMessage(messageFormat, testObject)).toMatch(
        /^\[20160110:215138\]<[a-z0-9]{6}> => My test object is: {"a":67}$/,
      );
    });
  });

  describe('given a eid == new Eid("20160110:220223", "EX-556")', () => {
    const eid = new Eid("20160110:220223", "EX-556");

    describe("#getId()", () => {
      it("should return 20160110:220223 as id", () => {
        expect(eid.getId()).toBe("20160110:220223");
      });
    });

    describe("#getRef()", () => {
      it("should return EX-556 as ref", () => {
        expect(eid.getRef()).toBe("EX-556");
      });
    });

    describe("#getUniq()", () => {
      it("should return xxxxxx as uniq id", () => {
        expect(eid.getUniq()).toMatch(/^[a-z0-9]{6}$/);
      });
    });
  });
});
