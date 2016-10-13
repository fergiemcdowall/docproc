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
 * `vector` - vector, used for ranking
 * `stored` - the document that will be cached
 * `raw` - the unadulterated document
 * `normalised` - the "cleaned up" document.
 * `tokenised` - the tokenised document.

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
    normalised: { id: 'one', text: 'the first doc' },
    raw: { id: 'one', text: 'the first doc' },
    stored: { id: 'one', text: 'the first doc' },
    tokenised: { id: [ 'one' ], text: [ 'the', 'first', 'doc' ] },
    vector:
    { id: { one: 1, '*': 1 },
      text: { doc: 1, first: 1, the: 1, '*': 1 },
      '*': { one: 1, '*': 1, doc: 1, first: 1, the: 1 } } },
```

...after being passeds through docProc.

You can also compose document processing pipelines by reusing the
stages provided, or by creating new ones using the [node.js transform
stream
specification](https://nodejs.org/api/stream.html#stream_implementing_a_transform_stream):

```javascript
  docProc.customPipeline([
    new docProc.IngestDoc(),
    new docProc.CreateStoredDocument(),
    new docProc.NormaliseFields(),
    new docProc.Tokeniser({separator: ' '}),
    new docProc.RemoveStopWords({stopwords: []}),
    new docProc.CalculateTermFrequency(),
    new docProc.CreateCompositeVector(),
    new docProc.CreateSortVectors(),
    new docProc.FieldedSearch({fieldedSearch: false})
  ])
```


## API

### .defaultPipeline(options)

A function that returns a writable stream  that contains a sensible
default document processing pipeline

### .customPipeline(pipeline)

A function that takes in an Array of pipeline stages where every stage
is a transform stream and returns a writable stream.

### CalculateTermFrequency

A transform stream that calculates term frequency.

### CreateCompositeVector

A transform stream that calculates the composite vector- used for
searching accross all fields.

### CreateSortVectors

A transform stream that creates sort vectors.

### CreateStoredDocument

A transform stream that defines the parts of each document that are to
be cached in the index itself.

### FieldedSearch

A transform stream that determines which fields can be searched on
individually. In order to make indexes smaller, you can index fields
that can be searched on.

### IngestDoc

A transform stream that takes an unprocessed document and converts it
into a structure that can be processed by `search-index`.

### LowCase

A transform stream that converts text to lower case.

### NormaliseFields

A transform stream that converts non-string fields into Strings.

### RemoveStopWords

A transform stream that removes stopwords

### Spy

A transform stream that will do nothing other than print out the state
of the document to `console.log`. Use this when developing and
debugging.

### Tokeniser

A transform stream that splits fields down into their individual
linguistic tokens

## Options

See: https://github.com/fergiemcdowall/search-index/blob/master/doc/API.md#options-and-settings