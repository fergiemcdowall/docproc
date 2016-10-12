const Transform = require('stream').Transform
const _defaults = require('lodash.defaults')
const util = require('util')

const Tokeniser = function (options) {
  this.options = options || {}
  this.options.fieldOptions = this.options.fieldOptions || {}
  Transform.call(this, { objectMode: true })
}
module.exports = Tokeniser
util.inherits(Tokeniser, Transform)
Tokeniser.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    var fieldOptions = _defaults(
      this.options.fieldOptions[fieldName] || {},  // TODO- this is wrong
      {
        // A string.split() expression to tokenize raw field input
        separator: this.options.separator
      })
    doc.tokenised[fieldName] =
      doc.normalised[fieldName].split(fieldOptions.separator)
  }
  this.push(doc)
  return end()
}
