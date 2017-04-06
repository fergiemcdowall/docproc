// split up fields in to arrays of tokens
const Transform = require('stream').Transform
const util = require('util')

const Tokeniser = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = Tokeniser
util.inherits(Tokeniser, Transform)
Tokeniser.prototype._transform = function (doc, encoding, end) {
  var options = this.options = Object.assign({}, {
    fieldOptions: {},
    separator: /\\n|[|' ><.,\-|]+|\\u0003/
  }, doc.options || {})
  for (var fieldName in doc.normalised) {
    var fieldOptions = Object.assign({}, {
      // A string.split() expression to tokenize raw field input
      separator: options.separator
    }, options.fieldOptions[fieldName])
    // if field is already an array, simply leave it as such
    if (Object.prototype.toString.call(doc.normalised[fieldName]) === '[object Array]') {
      doc.tokenised[fieldName] = doc.normalised[fieldName]
    } else {
      doc.tokenised[fieldName] =
        doc.normalised[fieldName].split(fieldOptions.separator)
    }
  }
  this.push(doc)
  return end()
}
