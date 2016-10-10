const Transform = require('stream').Transform
const _defaults = require('lodash.defaults')
const util = require('util')

const LowCase = function (options) {
  this.options = options || {}
  this.options.fieldOptions = this.options.fieldOptions || {}
  options.log.info('Pipeline stage: LowCase')
  Transform.call(this, { objectMode: true })
}
module.exports = LowCase
util.inherits(LowCase, Transform)
LowCase.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    if (fieldName === 'id') continue  // dont lowcase ID field
    var fieldOptions = _defaults(
      this.options.fieldOptions[fieldName] || {},  // TODO- this is wrong
      {
        preserveCase: this.options.preserveCase
      })
    if (!fieldOptions.preserveCase) {
      doc.normalised[fieldName] = doc.normalised[fieldName].toLowerCase()
    }
  }
  this.push(doc)
  return end()
}
