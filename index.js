export default function Deferred() {
  const deferred = this;

  if (!(deferred instanceof Deferred)) {
    return new Deferred();
  }

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = value => {
      resolve(value);
      return this.promise;
    };

    deferred.reject = error => {
      reject(error);
      return this.promise;
    };
  });
}
