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

(function(wnd) {
  'use strict';

  wnd.Eid = require('../../lib/eid');
  wnd.EidNullPointerException = require('../../lib/eid/exceptions').EidNullPointerException;
  wnd.EidIllegalArgumentException = require('../../lib/eid/exceptions').EidIllegalArgumentException;
  wnd.EidIllegalStateException = require('../../lib/eid/exceptions').EidIllegalStateException;
  wnd.EidIndexOutOfBoundsException = require('../../lib/eid/exceptions').EidIndexOutOfBoundsException;
  wnd.EidRuntimeException = require('../../lib/eid/exceptions').EidRuntimeException;
  wnd.EidPreconditions = require('../../lib/eid/preconditions');
})(window);