const Transform = require('stream').Transform
const util = require('util')

const CreateStoredDocument = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    storeable: true
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = CreateStoredDocument
util.inherits(CreateStoredDocument, Transform)
CreateStoredDocument.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.raw) {
    var fieldOptions = Object.assign({}, {
      // Store a cache of this field in the index
      storeable: this.options.storeable
    }, this.options.fieldOptions[fieldName])
    if (fieldName === 'id') fieldOptions.storeable = true
    if (fieldOptions.storeable) {
      doc.stored[fieldName] = JSON.parse(JSON.stringify(doc.raw[fieldName]))
    }
  }
  this.push(doc)
  return end()
}
