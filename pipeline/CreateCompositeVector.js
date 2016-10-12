const Transform = require('stream').Transform
const _defaults = require('lodash.defaults')
const util = require('util')

const CreateCompositeVector = function (options) {
  this.options = options || {}
  this.options.fieldOptions = this.options.fieldOptions || {}
  Transform.call(this, { objectMode: true })
}
module.exports = CreateCompositeVector
util.inherits(CreateCompositeVector, Transform)
CreateCompositeVector.prototype._transform = function (doc, encoding, end) {
  doc.vector['*'] = {}
  for (var fieldName in doc.vector) {
    var fieldOptions = _defaults(
      this.options.fieldOptions[fieldName] || {},  // TODO- this is wrong
      {
        searchable: this.options.searchable || true // Should this field be searchable in the composite field
      })
    if (fieldOptions.searchable) {
      var vec = doc.vector[fieldName]
      for (var token in vec) {
        doc.vector['*'][token] = doc.vector['*'][token] || vec[token]
        doc.vector['*'][token] = (doc.vector['*'][token] + vec[token]) / 2
      }
    }
  }
  this.push(doc)
  return end()
}
