const Transform = require('stream').Transform
const util = require('util')

const FieldedSearch = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    fieldedSearch: true
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = FieldedSearch
util.inherits(FieldedSearch, Transform)
FieldedSearch.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.vector) {
    var fieldOptions = Object.assign({}, {
      fieldedSearch: this.options.fieldedSearch
    }, this.options.fieldOptions[fieldName]) // can this field be searched on?
    if (!fieldOptions.fieldedSearch && fieldName !== '*') delete doc.vector[fieldName]
  }
  if (this.options.log) this.options.log.info(doc)
  this.push(doc)
  return end()
}
