# localforage-find

Adds a O(n) find function to [localforage](http://mozilla.github.io/localForage/).

## Usage

```
var localforage = require('localforage');
require('localforage-find')(localforage);

localforage.find(function(key, value) {
  return value.score > 20;
}).then(function(resultsArray) {

});
```

Note: order of resultsArray is not guaranteed

## Install

```
npm install localforage-find
```

## License

MIT