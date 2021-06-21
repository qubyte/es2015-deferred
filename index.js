export default function Deferred() {
  if (!(this instanceof Deferred)) {
    return new Deferred();
  }

  this.promise = new Promise((resolve, reject) => {
    this.resolve = value => resolve(value) || this.promise;
    this.reject = error => reject(error) || this.promise;
  });
}
