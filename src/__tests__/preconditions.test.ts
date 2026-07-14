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

import { describe, expect, it } from "vitest";
import { Eid } from "../eid";
import {
  EidIllegalArgumentException,
  EidIllegalStateException,
  EidIndexOutOfBoundsException,
  EidNullPointerException,
  EidRuntimeException,
} from "../exceptions";
import { EidPreconditions } from "../preconditions";

describe("EidPreconditions", () => {
  const eid = "20160111:004403";
  const eidRegex = /20160111:004403/;

  describe(".checkNotNullable()", () => {
    describe("giving a null value", () => {
      it("should throw EidNullPointerException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkNotNullable(null, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidNullPointerException);
        expect(caught).not.toBeInstanceOf(TypeError);
        expect(String(caught)).toMatch(eidRegex);
        expect((caught as EidNullPointerException).message).toMatch(eidRegex);
      });
    });

    describe("giving a undefined value", () => {
      it("should throw EidNullPointerException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkNotNullable(undefined, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidNullPointerException);
        expect(caught).not.toBeInstanceOf(TypeError);
        expect(String(caught)).toMatch(eidRegex);
        expect((caught as EidNullPointerException).message).toMatch(eidRegex);
      });
    });

    describe("giving a string value", () => {
      it("should return original value", () => {
        const given = "YjdlYjExZGQ0MzY3YjIxO";
        const result = EidPreconditions.checkNotNullable(given, eid);
        expect(result).toBe(given);
      });
    });
  });

  describe(".checkNotNull()", () => {
    describe("giving a null value", () => {
      it("should throw EidNullPointerException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkNotNull(null, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidNullPointerException);
        expect(caught).not.toBeInstanceOf(TypeError);
        expect(String(caught)).toMatch(eidRegex);
        expect((caught as EidNullPointerException).message).toMatch(eidRegex);
      });
    });

    describe("giving a string value", () => {
      it("should return original value", () => {
        const given = "YjdlYjExZGQ0MzY3YjIxO";
        const result = EidPreconditions.checkNotNull(given, eid);
        expect(result).toBe(given);
      });
    });
  });

  describe(".checkNotUndefined()", () => {
    describe("giving a undefined value", () => {
      it("should throw EidNullPointerException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkNotUndefined(undefined, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidNullPointerException);
        expect(caught).not.toBeInstanceOf(TypeError);
        expect(String(caught)).toMatch(eidRegex);
        expect((caught as EidNullPointerException).message).toMatch(eidRegex);
      });
    });

    describe("giving a string value", () => {
      it("should return original value", () => {
        const given = "YjdlYjExZGQ0MzY3YjIxO";
        const result = EidPreconditions.checkNotUndefined(given, eid);
        expect(result).toBe(given);
      });
    });
  });

  describe(".checkArgument()", () => {
    describe("giving an Eid object", () => {
      const eidObject = new Eid(eid);
      it("should run without errors", () => {
        const fn = () => {
          EidPreconditions.checkArgument(true, eidObject);
        };
        expect(fn).not.toThrow();
      });
    });

    describe("giving a nullable value", () => {
      it("should throw TypeError", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkArgument(true, undefined as unknown as string);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(TypeError);
        expect(String(caught)).toMatch(/Pass not-null Eid to EidPreconditions first!/);
      });
    });

    describe("giving a falsy value", () => {
      it("should throw EidIllegalArgumentException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkArgument(false, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidIllegalArgumentException);
        expect(String(caught)).toMatch(eidRegex);
      });
    });
  });

  describe(".checkState()", () => {
    describe("giving a falsy value", () => {
      it("should throw EidIllegalStateException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkState(false, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidIllegalStateException);
        expect(String(caught)).toMatch(eidRegex);
      });
    });
  });

  describe(".checkElementIndex()", () => {
    describe("giving a invalid size of -6", () => {
      it("should throw EidIllegalArgumentException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkElementIndex(0, -6, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidIllegalArgumentException);
        expect(String(caught)).toMatch(eidRegex);
      });
    });

    describe("giving a invalid index value of 6, and size of 2", () => {
      it("should throw EidIndexOutOfBoundsException", () => {
        let caught: unknown;
        try {
          EidPreconditions.checkElementIndex(6, 2, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidIndexOutOfBoundsException);
        expect(String(caught)).toMatch(eidRegex);
      });
    });

    describe("giving a valid index of 2 and size of 5", () => {
      it("should return index of 2", () => {
        const result = EidPreconditions.checkElementIndex(2, 5, eid);
        expect(result).toBe(2);
      });
    });
  });

  describe(".tryToExecute()", () => {
    describe("giving a valid supplier function", () => {
      it("should return supplier value", () => {
        const fn = () => 6;
        const result = EidPreconditions.tryToExecute(fn, eid);
        expect(result).toBe(6);
      });
    });

    describe("giving a supplier that throws TypeError function", () => {
      it("should throw EidRuntimeException with original error as cause", () => {
        const originalError = new TypeError("invalid type!");
        const fn = () => {
          throw originalError;
        };
        let caught: unknown;
        try {
          EidPreconditions.tryToExecute(fn, eid);
        } catch (e) {
          caught = e;
        }
        expect(caught).toBeInstanceOf(EidRuntimeException);
        expect(String(caught)).toMatch(eidRegex);
        expect(String(caught)).toMatch(/invalid type!/);
        expect((caught as EidRuntimeException).cause).toBe(originalError);
      });
    });
  });
});
