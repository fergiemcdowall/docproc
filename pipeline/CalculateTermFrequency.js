const tv = require('term-vector')
const tf = require('term-frequency')
const Transform = require('stream').Transform
const util = require('util')

// convert term-frequency vectors into object maps
const objectify = function (result, item) {
  result[item[0].join(' ')] = item[1]
  return result
}

const CalculateTermFrequency = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = CalculateTermFrequency
util.inherits(CalculateTermFrequency, Transform)
CalculateTermFrequency.prototype._transform = function (doc, encoding, end) {
  var options = Object.assign({}, {
    fieldOptions: {},
    nGramLength: 1,
    searchable: true,
    weight: 0,
    wildcard: true
  }, doc.options || {})
  for (var fieldName in doc.tokenised) {
    var fieldOptions = Object.assign({}, {
      nGramLength: options.nGramLength,
      searchable: options.searchable,
      weight: options.weight,
      wildcard: options.wildcard
    }, options.fieldOptions[fieldName])
    var field = doc.tokenised[fieldName]
    if (fieldOptions.searchable) {
      doc.vector[fieldName] = tf.getTermFrequency(
        tv.getVector(field, fieldOptions.nGramLength), {
          scheme: tf.doubleNormalization0point5,
          weight: fieldOptions.weight
        }
      ).reduce(objectify, {})
      if (fieldOptions.wildcard === true) doc.vector[fieldName]['*'] = 1  // wildcard search
    }
  }
  this.push(doc)
  return end()
}
