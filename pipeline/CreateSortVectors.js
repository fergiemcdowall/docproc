const tf = require('term-frequency')
const tv = require('term-vector')
const Transform = require('stream').Transform
const _defaults = require('lodash.defaults')
const util = require('util')

// convert term-frequency vectors into object maps
const objectify = function (result, item) {
  result[item[0]] = item[1]
  return result
}

const CreateSortVectors = function (options) {
  this.options = _defaults(options || {}, {
    searchable: true,
    fieldOptions: {},
    sortable: false
  })
  Transform.call(this, { objectMode: true })
}
module.exports = CreateSortVectors
util.inherits(CreateSortVectors, Transform)
CreateSortVectors.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.vector) {
    var fieldOptions = _defaults(this.options.fieldOptions[fieldName] || {}, {
      sortable: this.options.sortable // Should this field be sortable
    })
    if (fieldOptions.sortable) {
      doc.vector[fieldName] = tf.getTermFrequency(
        tv.getVector(doc.tokenised[fieldName]),
        { scheme: tf.selfString }
      ).reduce(objectify, {})
    }
  }
  this.push(doc)
  return end()
}
