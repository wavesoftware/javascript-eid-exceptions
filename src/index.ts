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

export { Eid } from "./eid";
export type { UniqIdGenerator } from "./eid";
export {
  EidRuntimeException,
  EidNullPointerException,
  EidIllegalArgumentException,
  EidIllegalStateException,
  EidIndexOutOfBoundsException,
} from "./exceptions";
export { EidPreconditions } from "./preconditions";

import { Eid } from "./eid";
import {
  EidIllegalArgumentException,
  EidIllegalStateException,
  EidIndexOutOfBoundsException,
  EidNullPointerException,
  EidRuntimeException,
} from "./exceptions";
import { EidPreconditions } from "./preconditions";

interface EidExceptions {
  EidRuntimeException: typeof EidRuntimeException;
  EidNullPointerException: typeof EidNullPointerException;
  EidIllegalArgumentException: typeof EidIllegalArgumentException;
  EidIllegalStateException: typeof EidIllegalStateException;
  EidIndexOutOfBoundsException: typeof EidIndexOutOfBoundsException;
}

declare module "./eid" {
  interface Eid {
    constructor: typeof Eid;
  }
  namespace Eid {
    let preconditions: typeof EidPreconditions;
    let exceptions: EidExceptions;
  }
}

Eid.preconditions = EidPreconditions;
Eid.exceptions = {
  EidRuntimeException,
  EidNullPointerException,
  EidIllegalArgumentException,
  EidIllegalStateException,
  EidIndexOutOfBoundsException,
};

export default Eid;
