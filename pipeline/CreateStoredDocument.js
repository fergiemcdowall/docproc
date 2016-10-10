const Transform = require('stream').Transform
const _defaults = require('lodash.defaults')
const util = require('util')

const CreateStoredDocument = function (options) {
  this.options = options || {}
  this.options.fieldOptions = this.options.fieldOptions || {}
  Transform.call(this, { objectMode: true })
}
module.exports = CreateStoredDocument
util.inherits(CreateStoredDocument, Transform)
CreateStoredDocument.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.raw) {
    var fieldOptions = _defaults(
      this.options.fieldOptions[fieldName] || {},  // TODO- this is wrong
      {
        storeable: this.options.storeable // Store a cache of this field in the index
      })
    if (fieldName === 'id') fieldOptions.storeable = true
    if (fieldOptions.storeable) {
      doc.stored[fieldName] = doc.raw[fieldName]
    }
  }
  this.push(doc)
  return end()
}
