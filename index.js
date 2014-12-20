;(function(global) {
  // commonjs environment
  if (typeof module == 'object' && module.exports) {
    module.exports = addFind;
  } else { // plain old <script>
    global.localforageFind = addFind;
  }

  function addFind(localforage) {
    localforage.find = function find(criteria, cb) {
      cb = cb || function() {};
      var lf = this;

      return lf.keys().then(function(keys) {
        if (!keys.length) return [];

        var results = [],
            pairsSeen = 0,
            pairsExpected = keys.length;

        return lf.iterate(function(value, key) {
          pairsSeen += 1;

          if (criteria(key, value)) {
            results.push(value);
          }

          if (pairsSeen == pairsExpected) {
            return results;
          }
        });
      }).then(function(results) {
        cb(null, results);

        // return results here so resulting promised is fulfilled with it
        return results;
      }, function(err) {
        cb(err, null);

        // relaunch err so resulting promise is rejected with it
        throw err;
      });
    };
  }
})(this);
