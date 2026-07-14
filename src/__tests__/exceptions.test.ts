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
import {
  EidIllegalArgumentException,
  EidIllegalStateException,
  EidIndexOutOfBoundsException,
  EidNullPointerException,
  EidRuntimeException,
} from "../exceptions";

describe("EidRuntimeException", () => {
  const ex = new EidRuntimeException("20160110:230223", "A null pointer occured!");

  it("should contain proper message", () => {
    expect(ex.toString()).toMatch(
      /EidRuntimeException: \[20160110:230223\]<[a-z0-9]+> A null pointer occured!/,
    );
  });

  it("should contain a stack trace", () => {
    expect(ex.stack).toBeTruthy();
  });

  it("should inherits Error", () => {
    expect(ex instanceof Error).toBe(true);
  });

  it("should not inherits TypeError or other types of Eid*Exception", () => {
    expect(ex instanceof TypeError).toBe(false);
    expect(ex instanceof EidIllegalStateException).toBe(false);
    expect(ex instanceof EidIllegalArgumentException).toBe(false);
    expect(ex instanceof EidIndexOutOfBoundsException).toBe(false);
    expect(ex instanceof EidNullPointerException).toBe(false);
  });

  describe("construction without passing eid object", () => {
    it("should fail with TypeError", () => {
      let caught: unknown;
      try {
        new EidRuntimeException(undefined);
      } catch (e) {
        caught = e;
      }
      expect(caught).toBeInstanceOf(TypeError);
      expect((caught as TypeError).message).toEqual(
        "You need to provide an valid Eid number to EidRuntimeExceptions, but given undefined",
      );
    });
  });
});

describe("EidNullPointerException", () => {
  const ex = new EidNullPointerException("20160110:223238", "A null pointer occured!");

  it("should contain proper message", () => {
    expect(ex.toString()).toMatch(
      /EidNullPointerException: \[20160110:223238\]<[a-z0-9]+> A null pointer occured!/,
    );
  });

  it("should contain a stack trace", () => {
    expect(ex.stack).toBeTruthy();
  });

  it("should inherits Error and EidRuntimeException", () => {
    expect(ex instanceof EidNullPointerException).toBe(true);
    expect(ex instanceof Error).toBe(true);
    expect(ex instanceof EidRuntimeException).toBe(true);
  });

  it("should not inherits TypeError or other types of Eid*Exception", () => {
    expect(ex instanceof TypeError).toBe(false);
    expect(ex instanceof EidIllegalStateException).toBe(false);
    expect(ex instanceof EidIllegalArgumentException).toBe(false);
    expect(ex instanceof EidIndexOutOfBoundsException).toBe(false);
  });
});

describe("EidIllegalArgumentException", () => {
  const ex = new EidIllegalArgumentException("20160110:230031", "A null pointer occured!");

  it("should contain proper message", () => {
    expect(ex.toString()).toMatch(
      /EidIllegalArgumentException: \[20160110:230031\]<[a-z0-9]+> A null pointer occured!/,
    );
  });

  it("should contain a stack trace", () => {
    expect(ex.stack).toBeTruthy();
  });

  it("should inherits Error and EidRuntimeException", () => {
    expect(ex instanceof Error).toBe(true);
    expect(ex instanceof EidRuntimeException).toBe(true);
    expect(ex instanceof EidIllegalArgumentException).toBe(true);
  });

  it("should not inherits TypeError or other types of Eid*Exception", () => {
    expect(ex instanceof TypeError).toBe(false);
    expect(ex instanceof EidIllegalStateException).toBe(false);
    expect(ex instanceof EidNullPointerException).toBe(false);
    expect(ex instanceof EidIndexOutOfBoundsException).toBe(false);
  });
});

describe("EidIllegalStateException", () => {
  const ex = new EidIllegalStateException("20160110:230112", "Illegal state!");
  const regex = /EidIllegalStateException: \[20160110:230112\]<[a-z0-9]+> Illegal state!/;

  it("should contain proper message", () => {
    expect(ex.toString()).toMatch(regex);
  });

  it("should contain a stack trace", () => {
    expect(ex.stack).toBeTruthy();
    expect(ex.stack).toMatch(regex);
  });

  it("should inherits Error and EidRuntimeException", () => {
    expect(ex instanceof Error).toBe(true);
    expect(ex instanceof EidRuntimeException).toBe(true);
    expect(ex instanceof EidIllegalStateException).toBe(true);
  });

  it("should not inherits TypeError or other types of Eid*Exception", () => {
    expect(ex instanceof TypeError).toBe(false);
    expect(ex instanceof EidIllegalArgumentException).toBe(false);
    expect(ex instanceof EidNullPointerException).toBe(false);
    expect(ex instanceof EidIndexOutOfBoundsException).toBe(false);
  });
});

describe("EidIndexOutOfBoundsException", () => {
  const ex = new EidIndexOutOfBoundsException("20160110:230140", "Index is out of bounds!");
  const regex =
    /EidIndexOutOfBoundsException: \[20160110:230140\]<[a-z0-9]+> Index is out of bounds!/;

  it("should contain proper message", () => {
    expect(ex.toString()).toMatch(regex);
  });

  it("should contain a stack trace", () => {
    expect(ex.stack).toBeTruthy();
    expect(ex.stack).toMatch(regex);
  });

  it("should inherits Error and EidRuntimeException", () => {
    expect(ex instanceof Error).toBe(true);
    expect(ex instanceof EidRuntimeException).toBe(true);
    expect(ex instanceof EidIndexOutOfBoundsException).toBe(true);
  });

  it("should not inherits TypeError or other types of Eid*Exception", () => {
    expect(ex instanceof TypeError).toBe(false);
    expect(ex instanceof EidIllegalArgumentException).toBe(false);
    expect(ex instanceof EidIllegalStateException).toBe(false);
    expect(ex instanceof EidNullPointerException).toBe(false);
  });
});

describe("cause support", () => {
  it("should store cause when provided to EidRuntimeException", () => {
    const originalError = new TypeError("original failure");
    const ex = new EidRuntimeException("20260714:100000", "wrapped", originalError);
    expect(ex.cause).toBe(originalError);
    expect(ex.message).toMatch(/wrapped/);
  });

  it("should have undefined cause when not provided", () => {
    const ex = new EidRuntimeException("20260714:100001", "no cause");
    expect(ex.cause).toBeUndefined();
  });

  it("should propagate cause through subclasses", () => {
    const cause = new RangeError("out of range");
    const ex = new EidIllegalStateException("20260714:100002", "state error", cause);
    expect(ex.cause).toBe(cause);
    expect(ex).toBeInstanceOf(EidRuntimeException);
    expect(ex).toBeInstanceOf(Error);
  });

  it("should accept non-Error cause values", () => {
    const ex = new EidRuntimeException("20260714:100003", "string cause", "a string cause");
    expect(ex.cause).toBe("a string cause");
  });
});
