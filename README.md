# localforage-find

Adds find function to [localforage](https://github.com/localForage/localForage).

## Install and Setup

Works with localforage 1.2.0 or later.

```
npm install localforage-find
```

### commonjs

```js
const localforage = require('localforage');
require('localforage-find')(localforage);
```

### es6

```js
import localforage from 'localforage';
import addFind from 'localforage-find';

addFind(localforage);
```

### globals

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

### With Promises

```js
const limit = 2;

localforage.find((key, value) => value.score > 20, limit)
  .then(resultsArray => {
    // everything in resultsArray has score > 20
    // resultsArray.length is at most 2
  });
```

### With callbacks

```js
const limit = 2;

localforage.find((key, value) => value.score > 20, limit,
  (err, resultsArray) => {
    // everything in resultsArray has score > 20
    // resultsArray.length is at most 2
  });
```

## License

MIT
