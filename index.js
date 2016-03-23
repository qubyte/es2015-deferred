export default function Deferred() {
  if (!(this instanceof Deferred)) {
    return new Deferred();
  }

  var deferred = this;

  this.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
}
