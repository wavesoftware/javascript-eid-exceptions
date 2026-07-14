# EID Runtime Exceptions and Utilities for JavaScript/TypeScript

[![CI](https://github.com/wavesoftware/javascript-eid-exceptions/actions/workflows/ci.yml/badge.svg)](https://github.com/wavesoftware/javascript-eid-exceptions/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/eid.js.svg)](https://www.npmjs.com/package/eid.js)

A small, zero-dependency library for [defensive programming](https://en.wikipedia.org/wiki/Defensive_programming) in JavaScript and TypeScript. It provides reusable Exception IDs (EIDs), precondition checks, and standardized error handling for fail-fast detection of programming errors.

Instead of writing ad-hoc validation with generic `Error` messages, you assign a unique, permanent ID to each check site. When a bug reaches production, the ID links the error page (or log entry) directly to the line of code that failed.

## How it works

Every exception takes an `Eid` object that combines two identifiers:

- A **static ID** (e.g. `"20260714:120000"`) -- a permanent label inserted by the developer at the throw site.
- A **unique ID** (e.g. `<a3f7x1>`) -- generated at runtime to distinguish individual occurrences.

When the exception is logged or displayed on an error page, both IDs appear together. Support teams search by the static ID to find the code path, and by the unique ID to pinpoint the exact occurrence.

```typescript
import { EidIllegalStateException } from "eid.js";

throw new EidIllegalStateException("20260714:120000", "An extra message");
```

Output:

```
EidIllegalStateException: [20260714:120000]<a3f7x1> An extra message
    at Object.<anonymous> (/app/src/service.ts:42:11)
```

Static IDs can be generated using [Live Templates in IntelliJ IDEA](https://github.com/wavesoftware/java-eid-exceptions/wiki/Generating%20Exception%20Id%20number%20in%20Intellij%20IDEA%20with%20Live%20Templates).

## Intended use

This library is not intended for public APIs or shared libraries. It is designed for in-house, end-user applications that report bugs through standardized error pages or issue trackers.

## Installation

```bash
npm install eid.js
```

### ESM (recommended)

```typescript
import { Eid, EidPreconditions, EidIllegalStateException } from "eid.js";
```

### CommonJS

```javascript
const { Eid, EidPreconditions, EidIllegalStateException } = require("eid.js");
```

### Browser (IIFE)

```html
<script src="https://unpkg.com/eid.js/dist/index.global.js"></script>
<script>
  const { Eid, EidPreconditions } = window.Eid;
</script>
```

## Error cause support

All Eid exceptions support the standard ES2022 `Error.cause` property, preserving the original error and its full stack trace:

```typescript
import { EidRuntimeException } from "eid.js";

try {
  riskyOperation();
} catch (err) {
  throw new EidRuntimeException("20260714:120000", "operation failed", err);
  // The original error is available via .cause
}
```

`tryToExecute` chains the caught error as `cause` automatically:

```typescript
import { EidPreconditions } from "eid.js";

const result = EidPreconditions.tryToExecute(() => {
  return JSON.parse(untrustedInput);
}, "20260714:120100");
// If JSON.parse throws, the SyntaxError is available via .cause
```

## `EidPreconditions`

A collection of static methods for validating preconditions. Each method accepts an EID string (or an `Eid` object) and throws a typed Eid exception when the check fails.

### `checkArgument`

Validates a method argument in technical terms (not business rules).

```typescript
import { EidPreconditions } from "eid.js";

function sqrt(value: number): number {
  EidPreconditions.checkArgument(value >= 0.0, "20150718:012333");
  return Math.sqrt(value);
}
```

Throws `EidIllegalArgumentException` if `value` is negative.

### `checkState`

Validates the internal state of an object at a given moment.

```typescript
EidPreconditions.checkState(a >= 3.14 && b < 0, "20150721:115016");
```

### `checkNotNull`

Ensures that a reference is not `null`.

```typescript
const nonNullUserName = EidPreconditions.checkNotNull(userName, "20150721:115515");
```

### `checkElementIndex`

Validates that an index is within bounds of an array or list.

```typescript
EidPreconditions.checkElementIndex(index, list.length, "20150721:115749");
```

### Optional message

All check methods accept an optional `message` parameter with additional context for the exception:

```typescript
EidPreconditions.checkState(
  transaction.isValid(),
  "20151119:120238",
  `Invalid transaction: ${transaction}`
);
```

Output:

```
EidIllegalStateException: [20151119:120238]<xf4j1l> Invalid transaction: <Transaction id=null, buyer=null, products=[]>
```

### `tryToExecute`

Wraps a block of code that is expected to succeed. If it throws, the error is re-thrown as an `EidRuntimeException` with the original error preserved as `cause`.

```typescript
import { EidPreconditions } from "eid.js";
import { readFileSync } from "node:fs";

const content = EidPreconditions.tryToExecute(() => {
  return readFileSync("project.properties", "utf-8");
}, "20150718:121521");
```

### Logging

The `Eid` object provides a `makeLogMessage` method for structured log output. Use `%s` as a format specifier:

```typescript
import { Eid } from "eid.js";

log.debug(new Eid("20151119:121814").makeLogMessage("REST request received: %s", request));
```

Output:

```
[20151119:121814]<d1afca> => REST request received: <RestRequest user=<User id=345>>
```

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Open a Pull Request

If you have an idea for an improvement, please open an [issue](https://github.com/wavesoftware/javascript-eid-exceptions/issues).

## Requirements

* Node.js >= 20
* TypeScript >= 5.0 (optional, types are included)

## Releases

- 2.0.0
  - Full rewrite to TypeScript
  - ESM + CommonJS + IIFE browser bundle
  - ES2022 `Error.cause` support
  - Vitest test suite, Biome linting, GitHub Actions CI
  - Dropped: Bower, Gulp, Travis CI, Node < 20
- 1.0.0
  - Initial release
  - Library ported from Java version
