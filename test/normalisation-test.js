const Readable = require('stream').Readable
const docProc = require('../')
const test = require('tape')

const data = [
  {
    id: 'one',
    text: 'gâteaux is rather nice wä'
  },
  {
    id: 'two',
    text: 'gateaux is rather nice wä'
  }
]

test('test pipeline with normalisation', function (t) {
  t.plan(3)
  const ops = {
    compositeField: false,
    normaliseCharacters: true,
    searchable: true }
  var results = [
    {
      id: [ 'one' ],
      text: [ 'gateaux', 'is', 'rather', 'nice', 'wa' ]
    },
    {
      id: [ 'two' ],
      text: [ 'gateaux', 'is', 'rather', 'nice', 'wa' ]
    }
  ]
  const s = new Readable({ objectMode: true })
  data.forEach(function (data) {
    s.push(data)
  })
  s.push(null)
  s.pipe(docProc.pipeline(ops))
    .on('data', function (data) {
      t.looseEqual(data.tokenised, results.shift())
    })
    .on('error', function (err) {
      t.error(err)
    })
    .on('end', function () {
      t.ok('stream ENDed')
    })
})

test('test pipeline without normalisation', function (t) {
  t.plan(3)
  const ops = {
    compositeField: false,
    searchable: true }
  var results = [
    {
      id: [ 'one' ],
      text: [ 'gâteaux', 'is', 'rather', 'nice', 'wä' ]
    },
    {
      id: [ 'two' ],
      text: [ 'gateaux', 'is', 'rather', 'nice', 'wä' ]
    }
  ]
  const s = new Readable({ objectMode: true })
  data.forEach(function (data) {
    s.push(data)
  })
  s.push(null)
  s.pipe(docProc.pipeline(ops))
    .on('data', function (data) {
      t.looseEqual(data.tokenised, results.shift())
    })
    .on('error', function (err) {
      t.error(err)
    })
    .on('end', function () {
      t.ok('stream ENDed')
    })
})
