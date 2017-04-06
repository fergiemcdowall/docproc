// insert all search tokens in lower case
const Transform = require('stream').Transform
const util = require('util')

const LowCase = function () {
  Transform.call(this, { objectMode: true })
}
module.exports = LowCase
util.inherits(LowCase, Transform)
LowCase.prototype._transform = function (doc, encoding, end) {
  var options = this.options = Object.assign({}, {
    fieldOptions: {},
    preserveCase: false
  }, doc.options || {})
  for (var fieldName in doc.normalised) {
    if (fieldName === 'id') continue  // dont lowcase ID field
    var fieldOptions = Object.assign({}, {
      preserveCase: options.preserveCase
    }, options.fieldOptions[fieldName])
    if (!fieldOptions.preserveCase) {
      if (Object.prototype.toString.call(doc.normalised[fieldName]) === '[object Array]') {
        doc.normalised[fieldName].map(function (token) {
          return token.toLowerCase()
        })
      } else {
        doc.normalised[fieldName] = doc.normalised[fieldName].toLowerCase()
      }
    }
  }
  this.push(doc)
  return end()
}
