const Transform = require('stream').Transform
const util = require('util')

const CreateCompositeVector = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    searchable: true
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = CreateCompositeVector
util.inherits(CreateCompositeVector, Transform)
CreateCompositeVector.prototype._transform = function (doc, encoding, end) {
  doc.vector['*'] = {}
  for (var fieldName in doc.vector) {
    var fieldOptions = Object.assign({}, {
      searchable: this.options.searchable
    }, this.options.fieldOptions[fieldName])
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
