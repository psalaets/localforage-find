# localforage-find

Adds find function to [localforage](http://mozilla.github.io/localForage/).

## Install and Setup

Works with localforage 1.2.0 or later.

### npm

```
npm install localforage-find
```

```javascript
var localforage = require('localforage');
require('localforage-find')(localforage);
```

### bower

```
bower install localforage-find
```

```html
<script>
  localforageFind(localforage);
</script>
```

## API

#### localforage.find(criteria)
#### localforage.find(criteria, limit)
#### localforage.find(criteria, callback)
#### localforage.find(criteria, limit, callback)

- criteria - function that takes (key, value) and returns truthy if value should be in results
- limit - Optional max length of results, defaults to unlimited
- callback - Optional function that takes (error, resultsArray)

Returns Promise fulfilled with Array of results. Array ordering is not guaranteed.

## Examples

### With promises

```javascript
var limit = 2;

localforage.find(function(key, value) {
  return value.score > 20;
}, limit).then(function(resultsArray) {
  // everything in resultsArray has score > 20
  // resultsArray.length is at most 2
});
```

### With callbacks

```javascript
var limit = 2;

localforage.find(function(key, value) {
  return value.score > 20;
}, limit, function(err, resultsArray) {
  // everything in resultsArray has score > 20
  // resultsArray.length is at most 2
});
```

## Run Tests

You may need to delete ~/.config/browser-launcher/ first.

```
npm test
```

Also open test/scriptTag.html in a browser.

## License

MIT