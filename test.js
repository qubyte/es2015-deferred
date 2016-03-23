const test = require('tape');
const Deferred = require('./');

test('it is a function', t => {
  t.equals(typeof Deferred, 'function');
  t.end();
});

test('it returns an instance of Deferred when called with new', t => {
  t.ok(new Deferred() instanceof Deferred);
  t.end();
});

test('it returns an instance of Deferred when called without new', t => {
  t.ok(Deferred() instanceof Deferred);
  t.end();
});

test('instances have a promise property, which is an instance of Promise', t => {
  t.ok(new Deferred().promise instanceof Promise);
  t.end();
});

test('instances have a resolve property, which is a method', t => {
  t.equals(typeof new Deferred().resolve, 'function');
  t.end();
});

test('instances have a reject property, which is a method', t => {
  t.equals(typeof new Deferred().reject, 'function');
  t.end();
});

test('the promise property is resolved with a value when the resolve property is called with that value', t => {
  var deferred = new Deferred();

  deferred.resolve('resolution-value');

  deferred.promise
    .then(value => {
      t.equals(value, 'resolution-value');
      t.end();
    })
    .catch(err => t.end(err));
});

test('the promise property is rejected with a value when the reject property is called with that value', t => {
  var deferred = new Deferred();

  deferred.reject('rejection-value');

  deferred.promise
    .then(
      () => t.end(new Error('Promise should not resolve')),
      value => {
        t.equals(value, 'rejection-value');
        t.end();
      }
    );
});
