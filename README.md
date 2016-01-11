# EID Runtime Exceptions and Utilities for Javascript

[![Build Status](https://travis-ci.org/wavesoftware/javascript-eid-exceptions.svg?branch=master)](https://travis-ci.org/wavesoftware/javascript-eid-exceptions) [![Coverage Status](https://coveralls.io/repos/wavesoftware/javascript-eid-exceptions/badge.svg?branch=master&service=github)](https://coveralls.io/github/wavesoftware/javascript-eid-exceptions?branch=master) [![npm](https://img.shields.io/npm/v/eid.js.svg)](https://www.npmjs.com/package/eid.js) [![Bower](https://img.shields.io/bower/v/eid.js.svg)]()

This small library holds a set of exceptions and utilities that implements idea of fast, reusable, error codes that can be simply thrown fast in case of unpredictable and unrecoverable application failure. It is meant to be used for application bugs.

## Idea

The idea is to use a set of simple runtime exceptions. They should always take the Exception ID (Eid) object in the making. This eid object will then be reported when displaying or logging that exception. It can also be viewed on the professional fatal error window of the application as a bug reference. EidRuntimeExceptions contains also additional unique ID to distinguish each single exception from others with same Eid. This approach simplifies the management of exceptions in the application and allows developers to focus on functionalities rather than coming up with the correct statement for the exception.

This approach is best to use with tools and plugins like:

 * [EidGenerator for Netbeans IDE](http://plugins.netbeans.org/plugin/53137/exception-id-eid-generator)
 * [Generating Exception Id number in Intellij IDEA with Live Templates](https://github.com/wavesoftware/java-eid-exceptions/wiki/Generating%20Exception%20Id%20number%20in%20Intellij%20IDEA%20with%20Live%20Templates)

Example:

```js
var cause = 'A extra message';
throw new EidIllegalStateException("20150721:100554", cause);
```

Example log:

```
ERROR 2016-01-11T22:48:42.445 EidIllegalStateException: [20150721:100554]<rww5y3> A extra message - Error
    at http://localhost:3000/browser/toplevel/eid.min.js:1:3959
    at Object.i.3.../eid (http://localhost:3000/browser/toplevel/eid.min.js:1:4211)
    at r (http://localhost:3000/browser/toplevel/eid.min.js:1:254)
    at http://localhost:3000/browser/toplevel/eid.min.js:1:305
    at http://localhost:3000/browser/toplevel/eid.min.js:1:536
    at Object.i.1.../../lib/eid (http://localhost:3000/browser/toplevel/eid.min.js:1:974)
    at r (http://localhost:3000/browser/toplevel/eid.min.js:1:254)
    at t (http://localhost:3000/browser/toplevel/eid.min.js:1:421)
    at http://localhost:3000/browser/toplevel/eid.min.js:1:438
```


## Caution

This classes shouldn't be used in any public API or library. It is designed to be used for in-house development of end user applications which will report bugs in standardized error pages or post them to issue tracker.

## NPM

```bash
npm install eid.js --save
```

## Bower

```bash
bower install eid.js --save
```

### `EidPreconditions` class

#### General use

`EidPreconditions` class consists static methods that help to use Eid in a method or constructor. This is solely for convenience purposes. Use them to check whether method or constructor was invoked correctly (whether its preconditions have been met). These methods generally accept a `boolean` expression which is expected to be `true` (or in the case of `checkNotNull`, an object reference which is expected to be non-null). When `false` (or `null`) is passed instead, the `EidPreconditions` method throws an unchecked exception, which helps the calling method communicate to its caller that that caller has made a mistake.

Each method accepts a EID string or Eid object, which is designed to ease of use and provide strict ID for given exception usage. This approach speed up development of large application and helps support teams by giving both static and random ID for each possible bug that could occur.

Each example uses static import:

```js
// nodejs
var EidPreconditions = require('eid/preconditions');

// browser using bower using toplevel version
window.EidPreconditions;
```

#### `checkArgument` method

`checkArgument` method should be used to check argument of the method, and validate it in technical terms (not business terms).

Example:

```js
// [..]
function sqrt(value) {
  checkArgument(value >= 0.0, "20150718:012333");
  // if ok, calculate the square root
}
```

In this example, `checkArgument` throws an `EidIllegalArgumentException` to indicate that developer made an error in its call to `sqrt`.

#### `checkState` method

`checkState` method should be used to check state of the class in given moment, and validate it in technical terms (not business terms).

Example:

```js
checkState(a >= 3.14 && b < 0., "20150721:115016");
```

#### `checkNotNull` method

`checkNotNull` method should be used to check if given non null argument is actually `null`

Example:

```js
var nonNullUserName = checkNotNull(userName, "20150721:115515");
```

#### `checkElementIndex` method

`checkElementIndex` method can be used to test parameters of an array, before being used

```js
checkElementIndex(index, list.length, "20150721:115749");
```

#### Formatted message support

There have been added additional `message` to method descriptors for `checkArgument`, `checkState`, `checkNotNull` and `checkElementIndex` method. Those method's parameter can sometimes be used to pass additional information to exceptions that will be displayed in log files.

For example:

```js
checkState(transation.isValid(), "20151119:120238", "Invalid transaction: " + transaction);
```

Will produce output similar to;

```
EidIllegalStateException: [20151119:120238]<xf4j1l> => Invalid transaction: <Transaction id=null, buyer=null, products=[]>
```

#### Functional try to execute blocks

You can use functional blocks to handle operations, that are intended to operate properly. This approach simplify the code and makes it more readable. It's also good way to deal with untested, uncovered `catch` blocks. It's easy and gives developers nice way of dealing with countless operations that suppose to work as intended.

Example:

```js
var content = EidPreconditions.tryToExecute(function() {
  var fs = require('fs');
  return fs.readFileSync('project.properties');
}, "20150718:121521");
```

#### Logging

Eid object can also be useful in logging. That are `makeLogMessage` method provided to do that. Message formatting is done using equivalent of Java's `String.format(String, Object[])` method.
For example:

```js
log.debug(new Eid("20151119:121814").makeLogMessage("REST request received: %s", request));
```

will unfold to something similar to:

```
2017-01-08T16:45:34,334 DEBUG [20151119:121814]<d1afca> REST request received: <RestRequest user=<User id=345> flow=ShowLastTransactions step=Confirm>
```

###Contributing

Contributions are welcome!

To contribute, follow the standard [git flow](http://danielkummer.github.io/git-flow-cheatsheet/) of:

1. Fork it
1. Create your feature branch (`git checkout -b feature/my-new-feature`)
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Push to the branch (`git push origin feature/my-new-feature`)
1. Create new Pull Request

Even if you can't contribute code, if you have an idea for an improvement please open an [issue](https://github.com/wavesoftware/javascript-eid-exceptions/issues).

## Requirements

* NodeJS >= 0.10
* Any modern browser, supported by browserify.


### Releases

- 1.0.0
  - initial release
  - library ported from Java version
