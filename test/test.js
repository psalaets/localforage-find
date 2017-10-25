const assert = require('assert');

var localforage = require('localforage');
var FakeLocalForage = require('./fake-localforage');

const fakeLocalforage = new FakeLocalForage();

var addFind = require('../');
addFind(localforage);
addFind(fakeLocalforage);

// test data
var scores = [
  {id: '1', score: 40},
  {id: '2', score: 5},
  {id: '3', score: 25}
];

beforeEach(() => {
  // set up localforage mock
  fakeLocalforage.resetState();

  // clear real localforage then add some test data
  let promise = localforage.clear();

  scores.forEach(function(score) {
    promise = promise.then(function() {
      return localforage.setItem(score.id, score);
    });
  });

  return promise;
});

describe('find()', () => {
  describe('using Promises', () => {
    it('finds items by criteria', () => {
      const promise = localforage.find(function(key, value) {
        return value.score > 10;
      });

      return promise.then(function(results) {
        // results are not ordered, just make sure both scores are here
        assert.equal(results.length, 2);
        assert.ok(results[0].score > 10, 'score should be > 10');
        assert.ok(results[1].score > 10, 'other score should be > 10');
        assert.notEqual(results[0], results[1]);
      });
    });

    it('can limit number of items returned', () => {
      const promise = localforage.find(function(key, value) {
        return value.score > 10;
      }, 1);

      return promise.then(function(results) {
        assert.equal(results.length, 1);
        assert.ok(results[0].score > 10, 'score should be > 10');
      });
    });

    it('can ask for zero items', () => {
      const promise = localforage.find(function(key, value) {
        return value.score > 10;
      }, 0);

      return promise.then(function(results) {
        assert.equal(results.length, 0);
      });
    });

    it('result is empty array if nothing matches criteria', () => {
      const promise = localforage.find(function(key, value) {
        return false;
      });

      return promise.then(function(results) {
        assert.equal(results.length, 0);
      });
    });

    it('result is empty array when there is no data stored', () => {
      const promise = localforage.clear().then(function() {
        return localforage.find(function(key, value) {
          return true;
        });
      });

      return promise.then(function(results) {
        assert.equal(results && results.length, 0);
      });
    });

    it('returns rejected promise if localforage.keys() fails', () => {
      fakeLocalforage.breakKeys = true;
      const promise = fakeLocalforage.find(function(key, value) {
        return value.score > 10;
      });

      return promise.then(function(results) {
        assert.fail(results);
      }, function(err) {
        assert.ok(err, 'error expected');
      });
    });

    it('returns rejected promise if localforage.iterate() fails', () => {
      fakeLocalforage.breakIterate = true;
      const promise = fakeLocalforage.find(function(key, value) {
        return value.score > 10;
      });

      return promise.then(function(results) {
        assert.fail(results);
      }, function(err) {
        assert.ok(err, 'error expected');
      });
    });
  });

  describe('using callbacks', () => {
    it('finds items by criteria', done => {
      localforage.find(function(key, value) {
        return value.score > 10;
      }, function(err, results) {
        assert.equal(err, null);

        // results are not ordered, just make sure both scores are here
        assert.equal(results.length, 2);
        assert.ok(results[0].score > 10, 'score should be > 10');
        assert.ok(results[1].score > 10, 'other score should be > 10');
        assert.notEqual(results[0], results[1]);
        done();
      });
    });

    it('can limit number of items returned', done => {
      localforage.find(function(key, value) {
        return value.score > 10;
      }, 1, function(err, results) {
        assert.equal(err, null);

        assert.equal(results.length, 1);
        assert.ok(results[0].score > 10, 'score should be > 10');
        done();
      });
    });

    it('can ask for zero items', done => {
      localforage.find(function(key, value) {
        return value.score > 10;
      }, 0, function(err, results) {
        assert.equal(err, null);
        assert.equal(results.length, 0);

        done();
      });
    });

    it('result is empty array if nothing matches criteria', done => {
      localforage.find(function(key, value) {
        return false;
      }, function(err, results) {
        assert.equal(err, null);
        assert.equal(results.length, 0);

        done();
      });
    });

    it('result is empty array when there is no data stored', done => {
      localforage.clear(function() {
        localforage.find(function(key, value) {
          return true;
        }, function(err, results) {
          assert.equal(err, null);
          assert.equal(results && results.length, 0);

          done();
        });
      });
    });

    it('invokes callback with error if localforage.keys() fails', done => {
      fakeLocalforage.breakKeys = true;
      fakeLocalforage.find(function(key, value) {
        return value.score > 10;
      }, function(err, results) {
        assert.ok(err, 'error expected');
        done();
      });
    });

    it('invokes callback with error if localforage.iterate() fails', done => {
      fakeLocalforage.breakIterate = true;
      fakeLocalforage.find(function(key, value) {
        return value.score > 10;
      }, function(err, results) {
        assert.ok(err, 'error expected');
        done();
      });
    });
  });

  describe('on localforage store instances', () => {
    it('exists', () => {
      const store = localforage.createInstance({
        name: 'test'
      });

      assert.equal(typeof store.find, 'function');
    });

    it('works (smoke test)', () => {
      const store = localforage.createInstance({
        name: 'test'
      });

      return store.clear()
        .then(() => store.setItem('a', 'A'))
        .then(() => {
          return store.find(function(key, value) {
            return key === 'a';
          });
        })
        .then(function(results) {
          assert.equal(results.length, 1);
          assert.equal(results[0], 'A');
        });
    });
  });
});
