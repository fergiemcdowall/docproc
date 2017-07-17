const pumpify = require('pumpify')
const stopwords = []

const CalculateTermFrequency = exports.CalculateTermFrequency =
  require('./pipeline/CalculateTermFrequency.js')

const CharacterNormaliser = exports.CharacterNormaliser =
  require('./pipeline/CharacterNormaliser.js')

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

const Spy = exports.Spy = require('./pipeline/Spy.js') // eslint-disable-line 

const Tokeniser = exports.Tokeniser =
  require('./pipeline/Tokeniser.js')

exports.pipeline = function (options) {
  options = Object.assign({}, {
    separator: /[|' .,\-|(\\\n)]+/,
    searchable: true,
    stopwords: stopwords,
    nGramLength: 1,
    fieldedSearch: true
  }, options)
  var pl = [
    new IngestDoc(options),
    new CreateStoredDocument(),
    new NormaliseFields(),
    new LowCase(),
    new Tokeniser(),
    new RemoveStopWords(),
    new CharacterNormaliser(),
    new CalculateTermFrequency(),
    new CreateCompositeVector(),
    new CreateSortVectors(),
    new FieldedSearch()
  ]
  return pumpify.obj.apply(this, pl)
}

exports.customPipeline = function (pl) {
  return pumpify.obj.apply(this, pl)
}
