const Transform = require('stream').Transform
const util = require('util')

const LowCase = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    preserveCase: false
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = LowCase
util.inherits(LowCase, Transform)
LowCase.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    if (fieldName === 'id') continue  // dont lowcase ID field
    var fieldOptions = Object.assign({}, {
      preserveCase: this.options.preserveCase
    }, this.options.fieldOptions[fieldName])
    if (!fieldOptions.preserveCase) {
      doc.normalised[fieldName] = doc.normalised[fieldName].toLowerCase()
    }
  }
  this.push(doc)
  return end()
}
