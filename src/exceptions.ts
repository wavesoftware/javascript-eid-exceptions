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

import { Eid } from "./eid";

function prepareMessage(eid: Eid, message: string | undefined): string {
  return message !== undefined ? `${eid} ${message}` : String(eid);
}

function validateEid(eid: string | Eid | undefined): Eid {
  if (eid === undefined) {
    throw new TypeError(
      "You need to provide an valid Eid number to EidRuntimeExceptions, but given undefined",
    );
  }
  if (!(eid instanceof Eid)) {
    return new Eid(String(eid));
  }
  return eid;
}

interface ErrorWithCaptureStackTrace {
  captureStackTrace?(targetObject: object, constructorOpt?: unknown): void;
}

function correctStackTrace(target: Error, ctor: unknown): void {
  const ErrorCtor = Error as unknown as ErrorWithCaptureStackTrace;
  if (typeof ErrorCtor.captureStackTrace === "function") {
    ErrorCtor.captureStackTrace(target, ctor);
  } /* v8 ignore start -- legacy fallback for environments without Error.captureStackTrace */ else {
    const stringified = target.toString();
    let st: string = new Error().stack ?? stringified;
    if (typeof st !== "string") {
      st = stringified;
    }
    if (st.indexOf(stringified) < 0) {
      st = st.replace(/^(?:Error\n)?/, `${stringified}\n`).trim();
    }
    target.stack = st;
  } /* v8 ignore stop */
}

/**
 * Baseline of all Eid runtime exception classes.
 *
 * This class shouldn't be used in any public API or library. It is designed
 * to be used for in-house development of end user applications which will
 * report Bugs in standardized error pages or post them to issue tracker.
 */
export class EidRuntimeException extends Error {
  readonly eid: Eid;

  constructor(eid: string | Eid | undefined, message?: string, cause?: unknown) {
    const checkedEid = validateEid(eid);
    const fullMessage = prepareMessage(checkedEid, message);
    super(fullMessage, cause !== undefined ? { cause } : undefined);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EidRuntimeException";
    this.eid = checkedEid;
    correctStackTrace(this, EidRuntimeException);
  }
}

/**
 * Eid version of NullPointerException.
 *
 * This class shouldn't be used in any public API or library.
 */
export class EidNullPointerException extends EidRuntimeException {
  constructor(eid: string | Eid | undefined, message?: string, cause?: unknown) {
    super(eid, message, cause);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EidNullPointerException";
    correctStackTrace(this, EidNullPointerException);
  }
}

/**
 * Eid version of IllegalArgumentException.
 *
 * This class shouldn't be used in any public API or library.
 */
export class EidIllegalArgumentException extends EidRuntimeException {
  constructor(eid: string | Eid | undefined, message?: string, cause?: unknown) {
    super(eid, message, cause);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EidIllegalArgumentException";
    correctStackTrace(this, EidIllegalArgumentException);
  }
}

/**
 * Eid version of IllegalStateException.
 *
 * This class shouldn't be used in any public API or library.
 */
export class EidIllegalStateException extends EidRuntimeException {
  constructor(eid: string | Eid | undefined, message?: string, cause?: unknown) {
    super(eid, message, cause);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EidIllegalStateException";
    correctStackTrace(this, EidIllegalStateException);
  }
}

/**
 * Eid version of IndexOutOfBoundsException.
 *
 * This class shouldn't be used in any public API or library.
 */
export class EidIndexOutOfBoundsException extends EidRuntimeException {
  constructor(eid: string | Eid | undefined, message?: string, cause?: unknown) {
    super(eid, message, cause);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "EidIndexOutOfBoundsException";
    correctStackTrace(this, EidIndexOutOfBoundsException);
  }
}
