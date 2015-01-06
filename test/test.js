require('./array-bind-polyfill');
var test = require('tape');

var localforage = require('localforage');
var fakeLocalforage = require('./fake-localforage');

var addFind = require('../');
addFind(localforage);
addFind(fakeLocalforage);

// test data
var scores = [
  {id: 1, score: 40},
  {id: 2, score: 5},
  {id: 3, score: 25}
];

test('localforage.find()', function(t) {
  t.test('finds items by criteria [promise]', wrap(function(st) {
    st.plan(4);

    var promise = localforage.find(function(key, value) {
      return value.score > 10;
    });

    promise.then(function(results) {
      // results are not ordered, just make sure both scores are here
      st.equal(results.length, 2);
      st.ok(results[0].score > 10, 'score should be > 10');
      st.ok(results[1].score > 10, 'other score should be > 10');
      st.notEqual(results[0], results[1]);
    }).then(end(st), end(st));
  }));

  t.test('finds items by criteria [callback]', wrap(function(st) {
    st.plan(5);

    localforage.find(function(key, value) {
      return value.score > 10;
    }, function(err, results) {
      st.equal(err, null);

      // results are not ordered, just make sure both scores are here
      st.equal(results.length, 2);
      st.ok(results[0].score > 10, 'score should be > 10');
      st.ok(results[1].score > 10, 'other score should be > 10');
      st.notEqual(results[0], results[1]);

      st.end();
    });
  }));

  t.test('can limit number of items returned [promise]', wrap(function(st) {
    st.plan(2);

    var promise = localforage.find(function(key, value) {
      return value.score > 10;
    }, 1);

    promise.then(function(results) {
      st.equal(results.length, 1);
      st.ok(results[0].score > 10, 'score should be > 10');
    }).then(end(st), end(st));
  }));

  t.test('can limit number of items returned [callback]', wrap(function(st) {
    st.plan(3);

    localforage.find(function(key, value) {
      return value.score > 10;
    }, function(err, results) {
      st.equal(err, null);

      st.equal(results.length, 1);
      st.ok(results[0].score > 10, 'score should be > 10');

      st.end();
    }, 1);
  }));

  t.test('can ask for zero items [promise]', wrap(function(st) {
    st.plan(1);

    var promise = localforage.find(function(key, value) {
      return value.score > 10;
    }, 0);

    promise.then(function(results) {
      st.equal(results.length, 0);
    }).then(end(st), end(st));
  }));

  t.test('can ask for zero items [callback]', wrap(function(st) {
    st.plan(2);

    localforage.find(function(key, value) {
      return value.score > 10;
    }, function(err, results) {
      st.equal(err, null);
      st.equal(results.length, 0);

      st.end();
    }, 0);
  }));

  t.test('result is empty array if nothing matches criteria [promise]', function(st) {
    st.plan(1);

    var promise = localforage.find(function(key, value) {
      return false;
    });

    promise.then(function(results) {
      st.equal(results.length, 0);
    }).then(end(st), end(st));
  });

  t.test('result is empty array if nothing matches criteria [callback]', function(st) {
    st.plan(2);

    localforage.find(function(key, value) {
      return false;
    }, function(err, results) {
      st.equal(err, null);
      st.equal(results.length, 0);

      st.end();
    });
  });

  t.test('result is empty array when there is no data stored [promise]', function(st) {
    st.plan(1);

    var promise = localforage.clear().then(function() {
      return localforage.find(function(key, value) {
        return true;
      });
    });

    promise.then(function(results) {
      st.equal(results.length, 0);
    }).then(end(st), end(st));
  });

  t.test('result is empty array when there is no data stored [callback]', function(st) {
    st.plan(2);

    localforage.clear(function() {
      localforage.find(function(key, value) {
        return true;
      }, function(err, results) {
        st.equal(err, null);
        st.equal(results.length, 0);
      });
    });
  });

  t.test('returns rejected promise if localforage.keys() fails [promise]', wrap(function(st) {
    st.plan(1);

    fakeLocalforage.breakKeys = true;
    var promise = fakeLocalforage.find(function(key, value) {
      return value.score > 10;
    });

    promise.then(function(results) {
      st.fail(results);
    }, function(err) {
      st.ok(err, 'error expected');
    }).then(end(st), end(st));
  }));

  t.test('returns rejected promise if localforage.iterate() fails [promise]', wrap(function(st) {
    st.plan(1);

    fakeLocalforage.breakIterate = true;
    var promise = fakeLocalforage.find(function(key, value) {
      return value.score > 10;
    });

    promise.then(function(results) {
      st.fail(results);
    }, function(err) {
      st.ok(err, 'error expected');
    }).then(end(st), end(st));
  }));


  t.test('invokes callback with error if localforage.keys() fails [callback]', wrap(function(st) {
    st.plan(2);

    fakeLocalforage.breakKeys = true;
    fakeLocalforage.find(function(key, value) {
      return value.score > 10;
    }, function(err, results) {
      st.ok(err, 'error expected');
      st.equal(results, null);

      st.end();
    });
  }));

  t.test('invokes callback with error if localforage.iterate() fails [callback]', wrap(function(st) {
    st.plan(2);

    fakeLocalforage.breakIterate = true;
    fakeLocalforage.find(function(key, value) {
      return value.score > 10;
    }, function(err, results) {
      st.ok(err, 'error expected');
      st.equal(results, null);

      st.end();
    });
  }));
});

// param: the t (or st) from tape
function end(t) {
  return function() {
    t.end();
  };
}

function wrap(testCallback) {
  return function(t) {
    beforeEach(function() {
      testCallback(t);
    });
  };
}

function beforeEach(done) {
  // set up localforage mock
  fakeLocalforage.resetFlags();

  // clear real localforage then add some test data
  var promise = localforage.clear();

  scores.forEach(function(score) {
    promise = promise.then(function() {
      return localforage.setItem(score.id, score);
    });
  });

  promise.done(done);
}