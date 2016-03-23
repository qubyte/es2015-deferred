# ES2015 Deferred

This library contains a small constructor which produces deferred objects. These
are useful for testing purposes, and their use in production JS is discouraged
(it's usually better to use the promise constructor directly).

This library assumes that a `Promise` constructor is available, but nothing
else. Provided `Promise` is a global this module should work everywhere JS does.
This stretches to the module system you're using. This library contains both a
UMD module and an ES2015 module, so it works everywhere in that respect too.

This module has no production dependencies.

## API

Require ES2015 Deferred.

```javascript
var Deferred = require('es2015-deferred');
```

Create a deferred object.

```javascript
var deferred = new Deferred();
```

The promise managed by the deferred object.

```javascript
var promise = deferred.promise;
```

Resolve `deferred.promise` with a given value.

```javascript
deferred.resolve('a-resolution');
```

Reject `deferred.promise` with an error.

```javascript
deferred.reject(new Error('Oh noes!'));
```
