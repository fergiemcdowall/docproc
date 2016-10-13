const Transform = require('stream').Transform
const util = require('util')

const Tokeniser = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    separator: /\\n|[\|' ><\.,\-|]+|\\u0003/
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = Tokeniser
util.inherits(Tokeniser, Transform)
Tokeniser.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    var fieldOptions = Object.assign({}, {
      // A string.split() expression to tokenize raw field input
      separator: this.options.separator
    }, this.options.fieldOptions[fieldName])
    doc.tokenised[fieldName] =
      doc.normalised[fieldName].split(fieldOptions.separator)
  }
  this.push(doc)
  return end()
}
