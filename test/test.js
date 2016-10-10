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
    text: 'the third doc'
  },
  {
    id: 'four',
    text: 'the FOURTH doc'
  }
]
var results = [
  { id: 'one',
    vector:
    { id: { one: 1, '*': 1 },
      text: { doc: 1, first: 1, the: 1, '*': 1 },
      '*': { one: 1, '*': 1, doc: 1, first: 1, the: 1 } },
    stored: { id: 'one' },
    raw: { id: 'one', text: 'the first doc' },
    normalised: { id: [ 'one' ], text: [ 'the', 'first', 'doc' ] } },
  { id: 'two',
    vector:
    { id: { two: 1, '*': 1 },
      text: { doc: 1, second: 1, the: 1, '*': 1 },
      '*': { two: 1, '*': 1, doc: 1, second: 1, the: 1 } },
    stored: { id: 'two' },
    raw: { id: 'two', text: 'the second doc' },
    normalised: { id: [ 'two' ], text: [ 'the', 'second', 'doc' ] } },
  { id: 'three',
    vector:
    { id: { three: 1, '*': 1 },
      text: { doc: 1, the: 1, third: 1, '*': 1 },
      '*': { three: 1, '*': 1, doc: 1, the: 1, third: 1 } },
    stored: { id: 'three' },
    raw: { id: 'three', text: 'the third doc' },
    normalised: { id: [ 'three' ], text: [ 'the', 'third', 'doc' ] } },
  { id: 'four',
    vector:
    { id: { four: 1, '*': 1 },
      text: { doc: 1, fourth: 1, the: 1, '*': 1 },
      '*': { four: 1, '*': 1, doc: 1, fourth: 1, the: 1 } },
    stored: { id: 'four' },
    raw: { id: 'four', text: 'the FOURTH doc' },
    normalised: { id: [ 'four' ], text: [ 'the', 'fourth', 'doc' ] } }
]

test('test pipeline', function (t) {
  t.plan(5)
  const s = new Readable({ objectMode: true })
  data.forEach(function (data) {
    s.push(data)
  })
  s.push(null)
  s.pipe(docProc.pipeline())
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
