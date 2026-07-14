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
import {
  EidIllegalArgumentException,
  EidIllegalStateException,
  EidIndexOutOfBoundsException,
  EidNullPointerException,
  EidRuntimeException,
} from "./exceptions";

function isNullike(reference: unknown): reference is null | undefined {
  return reference === null || reference === undefined;
}

function checkNotNullEid(candidate: unknown): string | Eid {
  if (isNullike(candidate)) {
    throw new TypeError("Pass not-null Eid to EidPreconditions first!");
  }
  return candidate as string | Eid;
}

function ensureEid(candidate: string | Eid | null | undefined): Eid {
  const checked = checkNotNullEid(candidate);
  if (!(checked instanceof Eid)) {
    return new Eid(String(checked));
  }
  return checked;
}

function isIndexAndSizeIllegal(index: number, size: number): boolean {
  return index < 0 || index >= size;
}

function isSizeIllegal(size: number): boolean {
  return size < 0;
}

/**
 * Static convenience methods that help a method or constructor check whether
 * it was invoked correctly (whether its preconditions have been met).
 *
 * This class shouldn't be used in any public API or library. It is designed
 * to be used for in-house development of end user applications which will
 * report Bugs in standardized error pages or post them to issue tracker.
 */
export class EidPreconditions {
  /* v8 ignore next 3 -- private constructor for static-only class */
  private constructor() {
    // static-only class
  }

  /**
   * Ensures that an object reference passed as a parameter to the calling
   * method is not null-like (null or undefined).
   */
  static checkNotNullable<T>(
    reference: T | null | undefined,
    eid: string | Eid,
    message?: string,
  ): T {
    const checkedEid = ensureEid(eid);
    if (isNullike(reference)) {
      throw new EidNullPointerException(checkedEid, message);
    }
    return reference;
  }

  /**
   * Ensures that an object reference passed as a parameter to the calling
   * method is not null.
   */
  static checkNotNull<T>(reference: T | null, eid: string | Eid, message?: string): T {
    const checkedEid = ensureEid(eid);
    if (reference === null) {
      throw new EidNullPointerException(checkedEid, message);
    }
    return reference;
  }

  /**
   * Ensures that an object reference passed as a parameter to the calling
   * method is not undefined.
   */
  static checkNotUndefined<T>(reference: T | undefined, eid: string | Eid, message?: string): T {
    const checkedEid = ensureEid(eid);
    if (reference === undefined) {
      throw new EidNullPointerException(checkedEid, message);
    }
    return reference;
  }

  /**
   * Ensures the truth of an expression involving one or more parameters to
   * the calling method.
   */
  static checkArgument(
    expression: boolean | null | undefined,
    eid: string | Eid,
    message?: string,
  ): void {
    const checkedEid = ensureEid(eid);
    if (!EidPreconditions.checkNotNullable(expression, checkedEid)) {
      throw new EidIllegalArgumentException(checkedEid, message);
    }
  }

  /**
   * Ensures the truth of an expression involving the state of the calling
   * instance, but not involving any parameters to the calling method.
   */
  static checkState(
    expression: boolean | null | undefined,
    eid: string | Eid,
    message?: string,
  ): void {
    const checkedEid = ensureEid(eid);
    if (!EidPreconditions.checkNotNullable(expression, checkedEid)) {
      throw new EidIllegalStateException(checkedEid, message);
    }
  }

  /**
   * Ensures that index specifies a valid element in an array, list or string
   * of size size. An element index may range from zero, inclusive, to size,
   * exclusive.
   */
  static checkElementIndex(
    index: number,
    size: number,
    eid: string | Eid,
    message?: string,
  ): number {
    const checkedEid = ensureEid(eid);
    if (isSizeIllegal(size)) {
      throw new EidIllegalArgumentException(checkedEid, message);
    }
    if (isIndexAndSizeIllegal(index, size)) {
      throw new EidIndexOutOfBoundsException(checkedEid, message);
    }
    return index;
  }

  /**
   * Tries to execute code in given unsafe supplier code block, and if
   * exception is thrown, it will get rethrown as an EidRuntimeException
   * with eid given as argument.
   */
  static tryToExecute<R>(supplier: () => R, eid: string | Eid): R {
    const checkedEid = ensureEid(eid);
    try {
      return EidPreconditions.checkNotNullable(supplier, checkedEid)();
    } catch (throwable) {
      throw new EidRuntimeException(checkedEid, String(throwable), throwable);
    }
  }
}
