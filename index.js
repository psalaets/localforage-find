;(function(global) {
  // commonjs environment
  if (typeof module == 'object' && module.exports) {
    module.exports = addFind;
  } else { // plain old <script>
    global.localforageFind = addFind;
  }

  function addFind(localforage) {
    localforage.find = function find(criteria, callbackOrLimit, maybeLimit) {
      var limit, callback;

      if (typeof callbackOrLimit == 'function') { // callback use case
        callback = callbackOrLimit;
        limit = defaultLimit(maybeLimit);
      } else { // promise use case
        callback = function() {};
        limit = defaultLimit(callbackOrLimit);
      }

      var lf = this;
      return lf.keys().then(function(keys) {
        if (!keys.length) return [];
        if (!limit) return [];

        var results = [],
            pairsSeen = 0,
            pairsExpected = keys.length;

        return lf.iterate(function(value, key) {
          pairsSeen += 1;

          if (criteria(key, value)) {
            results.push(value);
          }

          if (pairsSeen == pairsExpected || results.length == limit) {
            return results;
          }
        });
      }).then(function(results) {
        callback(null, results);

        // return results here so resulting promised is fulfilled with it
        return results;
      }, function(err) {
        callback(err, null);

        // relaunch err so resulting promise is rejected with it
        throw err;
      });
    };
  }

  function defaultLimit(optionalLimit) {
    if (optionalLimit || optionalLimit === 0) {
      return optionalLimit;
    } else {
      return Number.MAX_VALUE;
    }
  }
})(this);