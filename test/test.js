require('./array-bind-polyfill');

var test = require('tape');
var localforage = require('localforage');

require('../')(localforage);

// test data
var score1 = {id: 'score1', score: 40},
    score2 = {id: 'score2', score: 5},
    score3 = {id: 'score3', score: 25};

test('localforage.find()', function(t) {
  t.test('finds items by criteria', wrap(function(st) {
    st.plan(4);

    var promise = localforage.find(function(key, value) {
      return value.score > 10;
    });

    promise.then(function(results) {
      // results are not ordered, just make sure they're both here
      st.equal(results.length, 2);
      st.ok(results[0].score > 10);
      st.ok(results[1].score > 10);
      st.notEqual(results[0], results[1]);
    }).then(end(st), end(st));
  }));

  t.test('result is empty array if nothing matches criteria', function(st) {
    st.plan(1);

    var promise = localforage.find(function(key, value) {
      return false;
    });

    promise.then(function(results) {
      st.equal(results.length, 0);
    }).then(end(st), end(st));
  });

  t.test('result is empty array when there is no data stored', function(st) {
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
  var promise = localforage.clear();

  [score1, score2, score3].forEach(function(score) {
    promise = promise.then(function() {
      return localforage.setItem(score.id, score);
    });
  });

  promise.done(done);
}