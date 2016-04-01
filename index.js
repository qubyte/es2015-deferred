export default function Deferred() {
  var deferred = this;

  if (!(deferred instanceof Deferred)) {
    return new Deferred();
  }

  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = function (value) {
        resolve(value);
        return deferred.promise;
    };

    deferred.reject = function (error) {
        reject(error);
        return deferred.promise;
    };
  });
}
