const tf = require('term-frequency')
const tv = require('term-vector')
const Transform = require('stream').Transform
const util = require('util')

// convert term-frequency vectors into object maps
const objectify = function (result, item) {
  result[item[0]] = item[1]
  return result
}

const CreateSortVectors = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    sortable: false
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = CreateSortVectors
util.inherits(CreateSortVectors, Transform)
CreateSortVectors.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.vector) {
    var fieldOptions = Object.assign({}, {
      sortable: this.options.sortable
    }, this.options.fieldOptions[fieldName])
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
