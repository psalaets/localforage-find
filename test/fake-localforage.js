// broken localforage stand-in that has the couple methods we need
var keys = ['a', 'b', 'c'];
var values = ['A', 'B', 'C'];

module.exports = class FakeLocalForage {
  constructor() {
    this.breakKeys = false;
    this.breakIterate = false;
  }

  resetState() {
    this.breakKeys = false;
    this.breakIterate = false;
  }

  keys() {
    return new Promise((resolve, reject) => {
      if (this.breakKeys) {
        reject(new Error('breakKeys is true so keys() is broken'));
      } else {
        resolve(keys);
      }
    });
  }

  iterate(iterationCallback) {
    return new Promise((resolve, reject) => {
      if (this.breakIterate) {
        reject(new Error('breakIterate is true so iterate() is broken'));
      } else {
        for (var i = 0; i < values.length; i++) {
          var result = iterationCallback(values[i], keys[i]);
          if (result !== void 0) {
              // make sure to return here so other resolve() doesn't fire
              return resolve(result);
          }
        }
        resolve();
      }
    });
  }
}
