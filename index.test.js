import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import Deferred from 'es2015-deferred';

describe('Deferred', () => {
  it('is a function', () => {
    assert.equal(typeof Deferred, 'function');
  });

  it('returns an instance of Deferred when called with new', () => {
    assert.ok(new Deferred() instanceof Deferred);
  });

  it('returns an instance of Deferred when called without new', () => {
    assert.ok(Deferred() instanceof Deferred); // eslint-disable-line new-cap
  });

  describe('an instance', () => {
    it('has a promise property, which is an instance of Promise', () => {
      assert.ok(new Deferred().promise instanceof Promise);
    });

    it('has a resolve property, which is a method', () => {
      assert.equal(typeof new Deferred().resolve, 'function');
    });

    it('has a reject property, which is a method', () => {
      assert.equal(typeof new Deferred().reject, 'function');
    });

    it('resolves the promise property with a value when the resolve property is called with that value', async () => {
      const deferred = new Deferred();

      deferred.resolve('resolution-value');

      const value = await deferred.promise;

      assert.equal(value, 'resolution-value');
    });

    it('returns the promise from the resolve method', () => {
      const deferred = new Deferred();

      assert.equal(deferred.resolve('resolution-value'), deferred.promise);
    });

    it('rejects the promise property with a value when the reject property is called with that value', () => {
      const deferred = new Deferred();

      deferred.reject('rejection-value');

      return deferred.promise
        .then(
          () => assert.end(new Error('Promise should not resolve')),
          value => assert.equal(value, 'rejection-value')
        );
    });

    it('returns the promise from the reject method', () => {
      const deferred = new Deferred();

      assert.equal(deferred.reject('rejection-value'), deferred.promise);

      return deferred.promise.catch(() => {});
    });
  });
});
