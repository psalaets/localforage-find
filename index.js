module.exports = addLocalforageFind;

function addLocalforageFind(localforage) {
  localforage.find = function find(criteria, cb) {
    cb = cb || noOp;
    var lf = this;

    return lf.keys().then(function(keys) {
      if (!keys.length) return [];

      var results = [],
          pairsSeen = 0,
          expectedPairs = keys.length;

      return lf.iterate(function(value, key) {
        pairsSeen += 1;

        if (criteria(key, value)) {
          results.push(value);
        }

        if (pairsSeen == expectedPairs) {
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

function noOp() {}
