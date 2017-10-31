const docProc = require('../')
const test = require('tape')
const Readable = require('stream').Readable

const data = [
  {
    id: 'one',
    text: 'the first doc banana'
  }
]

test('test pipeline', function (t) {
  const ops = {
    fieldedSearch: true,
    nGramLength: 1,
    searchable: true,
    synonyms: {
      banana: 'apple'
    },
    separator: /[|' .,\-|(\\\n)]+/,
    stopwords: [] }
  var results = [
    { normalised: { id: 'one', text: 'the first doc banana' },
      options: {
        separator: /[|' .,\-|(\\\n)]+/,
        searchable: true,
        stopwords: [],
        synonyms: { banana: 'apple' },
        nGramLength: 1,
        fieldedSearch: true },
      raw: { id: 'one', text: 'the first doc banana' },
      stored: { id: 'one', text: 'the first doc banana' },
      tokenised: { id: [ 'one' ],
        text: [ 'the', 'first', 'doc', 'apple' ] },
      vector: { id: { one: 1, '*': 1 },
        text: { apple: 1, doc: 1, first: 1, the: 1, '*': 1 },
        '*': { one: 1, '*': 1, apple: 1, doc: 1, first: 1, the: 1 } },
      id: 'one' }
  ]
  t.plan(2)
  const s = new Readable({ objectMode: true })
  data.forEach(function (data) {
    s.push(data)
  })
  s.push(null)
  s.pipe(docProc.pipeline(ops))
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
