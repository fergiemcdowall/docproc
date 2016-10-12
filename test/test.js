const Readable = require('stream').Readable
const docProc = require('../')
const test = require('tape')

const data = [
  {
    id: 'one',
    text: 'the first doc'
  },
  {
    id: 'two',
    text: 'the second doc'
  },
  {
    id: 'three',
    text: {the: 'third doc'}
  },
  {
    id: 'four',
    text: 'the FOURTH doc'
  }
]

test('test pipeline', function (t) {
  var results = [
    { id: 'one',
      normalised: { id: 'one', text: 'the first doc' },
      raw: { id: 'one', text: 'the first doc' },
      stored: { id: 'one', text: 'the first doc' },
      tokenised: { id: [ 'one' ], text: [ 'the', 'first', 'doc' ] },
      vector:
      { id: { one: 1, '*': 1 },
        text: { doc: 1, first: 1, the: 1, '*': 1 },
        '*': { one: 1, '*': 1, doc: 1, first: 1, the: 1 } } },
    { id: 'two',
      normalised: { id: 'two', text: 'the second doc' },
      raw: { id: 'two', text: 'the second doc' },
      stored: { id: 'two', text: 'the second doc' },
      tokenised: { id: [ 'two' ], text: [ 'the', 'second', 'doc' ] },
      vector:
      { id: { two: 1, '*': 1 },
        text: { doc: 1, second: 1, the: 1, '*': 1 },
        '*': { two: 1, '*': 1, doc: 1, second: 1, the: 1 } } },
    { id: 'three',
      normalised: { id: 'three', text: 'the third doc' },
      raw: { id: 'three', text: { the: 'third doc' } },
      stored: { id: 'three', text: { the: 'third doc' } },
      tokenised: { id: [ 'three' ], text: [ 'the', 'third', 'doc' ] },
      vector:
      { id: { three: 1, '*': 1 },
        text: { doc: 1, the: 1, third: 1, '*': 1 },
        '*': { three: 1, '*': 1, doc: 1, the: 1, third: 1 } } },
    { id: 'four',
      normalised: { id: 'four', text: 'the fourth doc' },
      raw: { id: 'four', text: 'the FOURTH doc' },
      stored: { id: 'four', text: 'the FOURTH doc' },
      tokenised: { id: [ 'four' ], text: [ 'the', 'fourth', 'doc' ] },
      vector:
      { id: { four: 1, '*': 1 },
        text: { doc: 1, fourth: 1, the: 1, '*': 1 },
        '*': { four: 1, '*': 1, doc: 1, fourth: 1, the: 1 } } }
  ]
  t.plan(5)
  const s = new Readable({ objectMode: true })
  data.forEach(function (data) {
    s.push(data)
  })
  s.push(null)
  s.pipe(docProc.pipeline({
    stopwords: []
  }))
    .on('data', function (data) {
      t.looseEqual(data, results.shift())
    })
    .on('error', function (err) {
      t.error(err)
    })
    .on('end', function () {
      t.ok('stream ENDed')
    })
})

test('test custom pipeline by removing lowcase stage', function (t) {
  var results = [
    { id: 'one',
      normalised: { id: 'one', text: 'the first doc' },
      raw: { id: 'one', text: 'the first doc' },
      stored: { id: 'one', text: 'the first doc' },
      tokenised: { id: [ 'one' ], text: [ 'the', 'first', 'doc' ] },
      vector: { '*': { one: 1, '*': 1, doc: 1, first: 1, the: 1 } } },
    { id: 'two',
      normalised: { id: 'two', text: 'the second doc' },
      raw: { id: 'two', text: 'the second doc' },
      stored: { id: 'two', text: 'the second doc' },
      tokenised: { id: [ 'two' ], text: [ 'the', 'second', 'doc' ] },
      vector: { '*': { two: 1, '*': 1, doc: 1, second: 1, the: 1 } } },
    { id: 'three',
      normalised: { id: 'three', text: 'the third doc' },
      raw: { id: 'three', text: { the: 'third doc' } },
      stored: { id: 'three', text: { the: 'third doc' } },
      tokenised: { id: [ 'three' ], text: [ 'the', 'third', 'doc' ] },
      vector: { '*': { three: 1, '*': 1, doc: 1, the: 1, third: 1 } } },
    { id: 'four',
      normalised: { id: 'four', text: 'the FOURTH doc' },
      raw: { id: 'four', text: 'the FOURTH doc' },
      stored: { id: 'four', text: 'the FOURTH doc' },
      tokenised: { id: [ 'four' ], text: [ 'the', 'FOURTH', 'doc' ] },
      vector: { '*': { four: 1, '*': 1, FOURTH: 1, doc: 1, the: 1 } } }
  ]
  t.plan(5)
  const s = new Readable({ objectMode: true })
  data.forEach(function (data) {
    s.push(data)
  })
  s.push(null)
  s.pipe(docProc.customPipeline([
    new docProc.IngestDoc(),
    new docProc.CreateStoredDocument(),
    new docProc.NormaliseFields(),
    new docProc.Tokeniser({separator: ' '}),
    new docProc.RemoveStopWords({stopwords: []}),
    new docProc.CalculateTermFrequency(),
    new docProc.CreateCompositeVector(),
    new docProc.CreateSortVectors(),
    new docProc.FieldedSearch({fieldedSearch: false})
  ]))
    .on('data', function (data) {
      t.looseEqual(data, results.shift())
    })
    .on('error', function (err) {
      t.error(err)
    })
    .on('end', function () {
      t.ok('stream ENDed')
    })
})
