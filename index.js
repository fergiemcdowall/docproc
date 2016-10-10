const bunyan = require('bunyan')
const pumpify = require('pumpify')
const _defaults = require('lodash.defaults')

const CalculateTermFrequency = exports.CalculateTermFrequency =
  require('./pipeline/CalculateTermFrequency.js')

const CreateCompositeVector = exports.CreateCompositeVector =
  require('./pipeline/CreateCompositeVector.js')

const CreateSortVectors = exports.CreateSortVectors =
  require('./pipeline/CreateSortVectors.js')

const CreateStoredDocument = exports.CreateStoredDocument =
  require('./pipeline/CreateStoredDocument.js')

const FieldedSearch = exports.FieldedSearch =
  require('./pipeline/FieldedSearch.js')

const IngestDoc = exports.IngestDoc =
  require('./pipeline/IngestDoc.js')

const LowCase = exports.LowCase =
  require('./pipeline/LowCase.js')

const NormaliseFields = exports.NormaliseFields =
  require('./pipeline/NormaliseFields.js')

const RemoveStopWords = exports.RemoveStopWords =
  require('./pipeline/RemoveStopWords.js')

const Spy = exports.Spy =
  require('./pipeline/Spy.js')

Spy  // appease linter

const Tokeniser = exports.Tokeniser =
  require('./pipeline/Tokeniser.js')

exports.pipeline = function (options) {
  options = _defaults(options || {}, {
    log: bunyan.createLogger({
      name: 'pipeline',
      level: 'error'
    }),
    separator: ' ',
    searchable: true,
    nGramLength: 1,
    fieldedSearch: true
  })
  var pl = [
    new IngestDoc(options),
    new CreateStoredDocument(options),
    new NormaliseFields(options),
    new LowCase(options),
    new Tokeniser(options),
    new RemoveStopWords(options),
    new CalculateTermFrequency(options),
    new CreateCompositeVector(options),
    new CreateSortVectors(options),
    new FieldedSearch(options)
  ]
  return pumpify.obj.apply(this, pl)
}

