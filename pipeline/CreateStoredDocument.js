// Creates the document that will be returned in the search
// results. There may be cases where the document that is searchable
// is not the same as the document that is returned
const Transform = require('stream').Transform
const util = require('util')

const CreateStoredDocument = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = CreateStoredDocument
util.inherits(CreateStoredDocument, Transform)
CreateStoredDocument.prototype._transform = function (doc, encoding, end) {
  var options = Object.assign({}, {
    fieldOptions: {},
    storeable: true
  }, doc.options || {})
  for (var fieldName in doc.raw) {
    var fieldOptions = Object.assign({}, {
      // Store a cache of this field in the index
      storeable: options.storeable
    }, options.fieldOptions[fieldName])
    if (fieldName === 'id') fieldOptions.storeable = true
    if (fieldOptions.storeable) {
      doc.stored[fieldName] = JSON.parse(JSON.stringify(doc.raw[fieldName]))
    }
  }
  this.push(doc)
  return end()
}
