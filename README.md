# ES2015 Deferred

This library contains a small constructor which produces deferred objects. These
are useful for testing purposes, and their use in production JS is discouraged
(it's usually better to use the promise constructor directly).

This module has no production dependencies.

## installation

```
npm i es2015-deferred
```

### ES2015

ES2015 module loaders can directly consume `index.js`. If you're using
[rollup](http://rollupjs.org) or another ES2015 compatible module loader
configured to look for the [`module`](./package.json#L6) field and in a
`package.json` file, then you can import with:

```javascript
import Deferred from 'es2015-deferred';
```

The
[@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)
package may be useful to you.

If you want to try this module out directly without installation, it can be used
via unpkg:

```javascript
import Deferred from 'https://unpkg.com/es2015-deferred?module';
```

## API

With `Deferred` in your environment you can create `deferred` objects.

```javascript
var deferred = new Deferred();

// new is optional...

var deferred = Deferred();
```

A promise is managed by the deferred object.

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

Resolve and reject return the promise for easy chaining, e.g.

```javascript
deferred.resolve('a-resolution').then(/* ... */);
```

## example

This module is intended for use with unit test runners like
[mocha](http://mochajs.org/). Let's say you want to test a module which makes a
request using
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
and parses the response as JSON:

```javascript
export default function fetchAndParse(url) {
  return self.fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Unexpected response: ${response.status}`);
    }

    return response.json();
  });
}
```

Fetch uses promises, so testing it can be tricky! Here's a set of tests for this
module written in mocha and sinon. What follows is bulky, but exhaustive. It can
be surprising how much branching promises hide!

```javascript
import assert from 'assert';
import sinon from 'sinon';
import fetchAndParse from './fetchAndParse';

// For failing tests on promises which should reject but do not.
function failResolve() {
  throw new Error('Promise should reject.');
}

describe('fetchAndParse', () => {
  const sandbox = sinon.sandbox.create();

  let fetchDeferred;
  let promise;

  beforeEach(() => {
    fetchDeferred = new Deferred();

    // Stub fetch with a function which returns a promise we control.
    sandbox.stub(self, 'fetch').returns(fetchDeferred.promise);

    // Using a deferred above means we can use this promise throughout
    // the tests, resolve or rejecting steps as we go along. A deferred
    // allows test cases to be built progressively as describe nest.
    promise = fetchAndParse('some-url');
  });

  afterEach(() => {
    sandbox.reset();
  });

  it('calls fetch with the given url', () => {
    assert.equal(self.fetch.callCount, 1);
    assert.ok(self.fetch.calledWithExactly('some-url'));
  });

  describe('when the call to fetch rejects', () => {
    let error;

    beforeEach(() => {
      error = new Error();

      // By rejecting here, the promise set up above gets is rejected.
      fetchDeferred.reject(error);
    });

    it('rejects the promise returned from fetchAndParse with the same error', () => {
      // Mocha treats a resolved promise as a success. This line
      // converts and checks rejected promises to resolved, and turns
      // resolve promises to rejections before returning for mocha.
      return promise.then(
        failResolve,
        err => assert.equal(err, error)
      );
    });
  });

  describe('when the call to fetch resolves with an unsuccessful status', () => {
    beforeEach(() => {
      // Fetch resolves to a response object. Instruct the deferred
      // object to follow that behaviour.
      fetchDeferred.resolve({
        ok: false,
        status: 404
      });
    });

    it('rejects with an unexpected response error', () => {
      return promise.then(failResolve, err => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'Unexpected response: 404');
      });
    });
  });

  describe('when the call to fetch resolves with a successful status', () => {
    let jsonDeferred;
    let response;

    beforeEach(() => {
      // The json method of the response returns a promise. Use a deferred
      // object to manage that.
      jsonDeferred = new Deferred();

      response = {
        ok: true,
        json: sansbox.stub().returns(jsonDeferred.promise);
      };

      fetchDeferred.resolve(response);
    });

    it('calls the json method of the response object', () => {
      return fetchDeferred.promise.then(() => assert.equal(response.json.callCount, 1));
    });

    describe('when response.json rejects', () => {
      let error;

      beforeEach(() => {
        error = new Error();

        jsonDeferred.reject(error);
      });

      it('rejects the promise returned from fetchAndParse with the same error', () => {
        return promise.then(
          failResolve,
          err => assert.equal(err, error)
        );
      });
    });

    describe('when response.json resolves', () => {
      beforeEach(() => {
        jsonDeferred.resolve('parsed-response-body')
      });

      it('resolves the promise returned from fetchAndParse with the result', () => {
        return promise.then(result => assert.equal(result, 'parsed-response-body'));
      });
    });
  });
});
```
