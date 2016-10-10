# docproc
A document processing pipeline mostly used with
[search-index](https://www.npmjs.com/package/search-index)

```javascript
docProc = require('docproc')
readableStream.pipe(docProc.pipeline(ops))
```

DocProc is a [pumpify](https://www.npmjs.com/package/pumpify) chain of
transform streams that turns Plain Old JSON Objects into a format that
can be indexed by `search-index`.

Each processed document must have the following fields:

 * `id` - document id
 * `vector` - searchable vector, used for ranking
 * `stored` - the document that will be cached
 * `raw` - the unadulterated document
 * `normalised` - the "cleaned up" document.

So

```javascript
  {
    id: 'one',
    text: 'the first doc'
  }
```

becomes

```javascript
  { id: 'one',
    vector: 
    { id: { one: 1, '*': 1 },
      text: { doc: 1, first: 1, the: 1, '*': 1 },
      '*': { one: 1, '*': 1, doc: 1, first: 1, the: 1 } },
    stored: { id: 'one' },
    raw: { id: 'one', text: 'the first doc' },
    normalised: { id: [ 'one' ], text: [ 'the', 'first', 'doc' ] } }
```

...after being passeds through docProc.

## Options

See: https://github.com/fergiemcdowall/search-index/blob/master/doc/API.md#options-and-settings