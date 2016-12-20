const Transform = require('stream').Transform
const util = require('util')

const FieldedSearch = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = FieldedSearch
util.inherits(FieldedSearch, Transform)
FieldedSearch.prototype._transform = function (doc, encoding, end) {
  var options = Object.assign({}, {
    fieldOptions: {},
    fieldedSearch: true
  }, doc.options || {})
  for (var fieldName in doc.vector) {
    var fieldOptions = Object.assign({}, {
      fieldedSearch: options.fieldedSearch
    }, options.fieldOptions[fieldName]) // can this field be searched on?
    if (!fieldOptions.fieldedSearch && fieldName !== '*') delete doc.vector[fieldName]
  }
  if (options.log) options.log.info(doc)
  this.push(doc)
  return end()
}
