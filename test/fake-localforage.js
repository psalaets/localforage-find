// broken localforage stand-in that has the couple methods we need
var keys = ['a', 'b', 'c'];
var values = ['A', 'B', 'C'];

module.exports = {
  resetFlags: function() {
    this.breakKeys = this.breakIterate = false;
  },
  breakKeys: false,
  keys: function() {
    return new Promise(function(fulfill, reject) {
      if (this.breakKeys) {
        reject(new Error('breakKeys is true so keys() is broken'));
      } else {
        fulfill(keys);
      }
    }.bind(this));
  },
  breakIterate: false,
  iterate: function(iterationCallback) {
    return new Promise(function(fulfill, reject) {
      if (this.breakIterate) {
        reject(new Error('breakIterate is true so iterate() is broken'));
      } else {
        for (var i = 0; i < values.length; i++) {
          var result = iterationCallback(values[i], keys[i]);
          if (result !== void 0) {
              // make sure to return here so other fulfill() doesn't fire
              return fulfill(result);
          }
        }
        fulfill();
      }
    }.bind(this));
  }
};