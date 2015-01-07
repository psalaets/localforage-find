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
        callback = defaultCallback(maybeCallback);
      } else { // no limit
        limit = UNLIMITED;
        callback = defaultCallback(callbackOrLimit);
      }

      var lf = this;
      return lf.keys().then(function(keys) {
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
      }).then(function(results) {
        callback(null, results);

        // return results here so resulting promise is fulfilled with it
        return results;
      }, function(err) {
        callback(err, null);

        // relaunch err so resulting promise is rejected with it
        throw err;
      });
    };
  }

  function defaultCallback(optionalCallback) {
    return optionalCallback || function() {};
  }
})(this);