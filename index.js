;(function(global) {
  // commonjs environment
  if (typeof module == 'object' && module.exports) {
    module.exports = addFind;
  } else { // plain old <script> tag
    global.localforageFind = addFind;
  }

  var UNLIMITED = -1;

  function addFind(localforage) {
    localforage.find = function find(criteria, callbackOrLimit, maybeCallback) {
      var limit, callback;

      // limit was specified
      if (typeof callbackOrLimit == 'number') {
        limit = callbackOrLimit;
        callback = maybeCallback;
      } else { // no limit
        limit = UNLIMITED;
        callback = callbackOrLimit;
      }

      var lf = this;
      var promise = lf.keys().then(function(keys) {
        // no data stored
        if (!keys.length) return [];
        // asked for no results
        if (!limit) return [];

        var results = [],
            pairsSeen = 0,
            pairsExpected = keys.length;

        return lf.iterate(function(value, key) {
          if (criteria(key, value)) {
            results.push(value);
          }

          pairsSeen += 1;

          // Stop iterating and return results if we...

          // have checked every key/value pair
          if (pairsSeen == pairsExpected) return results;
          // or have found enough results
          if (limit != UNLIMITED && results.length == limit) return results;
        });
      });

      return chainCallback(promise, callback);
    };
  }

  /**
  * Hook callback into a promise.
  *
  * @param promise Promise to chain onto
  * @param callback Optional error-first callback to invoke with promise
  * @return a promise
  */
  function chainCallback(promise, callback) {
    if (callback) {
      return promise.then(function fulfilled(result) {
        callback(null, result);
      }, function rejected(reason) {
        callback(reason);
      });
    } else {
      return promise;
    }
  }
})(this);