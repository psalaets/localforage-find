# localforage-find

Adds find function to [localforage](http://mozilla.github.io/localForage/).

## Setup

### From npm

```
var localforage = require('localforage');
require('localforage-find')(localforage);
```

### From bower

    <script>
      localforageFind(localforage);
    </script>

## Usage

Order of resultsArray is not guaranteed.

### With promises

```
localforage.find(function(key, value) {
  return value.score > 20;
}).then(function(resultsArray) {

});
```

### With callbacks

```
localforage.find(function(key, value) {
  return value.score > 20;
}, function(err, resultsArray) {

});
```

## Install

```
npm install localforage-find
```

or

```
bower install localforage-find
```

## Run Tests

You may need to delete ~/.config/browser-launcher/ first.

```
npm test
```

Also open test/scriptTag.html in a browser.

## License

MIT