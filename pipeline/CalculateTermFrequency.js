const tv = require('term-vector')
const tf = require('term-frequency')
const Transform = require('stream').Transform
const _defaults = require('lodash.defaults')
const util = require('util')

// convert term-frequency vectors into object maps
const objectify = function (result, item) {
  result[item[0].join(' ')] = item[1]
  return result
}

const CalculateTermFrequency = function (options) {
  this.options = options || {}
  this.options.fieldOptions = this.options.fieldOptions || {}
  Transform.call(this, { objectMode: true })
}
module.exports = CalculateTermFrequency
util.inherits(CalculateTermFrequency, Transform)
CalculateTermFrequency.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    var field = doc.normalised[fieldName]
    var fieldOptions = _defaults(
      this.options.fieldOptions[fieldName] || {},  // TODO- this is wrong
      {
        fieldedSearch: this.options.fieldedSearch, // can search on this field individually
        nGramLength: this.options.nGramLength,
        searchable: this.options.searchable,       // included in the wildcard search ('*')
        weight: this.options.weight
      })

    if (fieldOptions.fieldedSearch || fieldOptions.searchable) {
      doc.vector[fieldName] = tf.getTermFrequency(
        tv.getVector(field, fieldOptions.nGramLength), {
          scheme: tf.doubleNormalization0point5,
          weight: fieldOptions.weight
        }
      ).reduce(objectify, {})
      doc.vector[fieldName]['*'] = 1  // wildcard search
    }
  }
  this.push(doc)
  return end()
}
