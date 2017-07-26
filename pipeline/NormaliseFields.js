const util = require('util')
const Transform = require('stream').Transform

const NormaliseFields = function () {
  Transform.call(this, { objectMode: true })
}
module.exports = NormaliseFields
util.inherits(NormaliseFields, Transform)
NormaliseFields.prototype._transform = function (doc, encoding, end) {
  var options = this.options = Object.assign({}, {
    fieldOptions: {},
    normaliser: /[[\],{}:"]+/g
  }, doc.options || {})
  for (var fieldName in doc.raw) {
    var fieldOptions = Object.assign({}, {
      normaliser: options.normaliser
    }, options.fieldOptions[fieldName])
    if (Object.prototype.toString.call(doc.raw[fieldName]) === '[object Array]') {
      doc.normalised[fieldName] = doc.raw[fieldName].map(function (item) {
        // if not array of strings then stringify each non-stringy item
        if (Object.prototype.toString.call(item) !== '[object String]') {
          item = JSON.stringify(item)
        }
        return item
          .replace(fieldOptions.normaliser, ' ')
          .replace(/\s\s+/g, ' ')
          .trim()
      })
    } else if (Object.prototype.toString.call(doc.raw[fieldName]) !== '[object String]') {
      // if the input object is not a string: jsonify and split on JSON
      // characters
      doc.normalised[fieldName] = JSON.stringify(doc.raw[fieldName])
        .replace(fieldOptions.normaliser, ' ')
        .replace(/\s\s+/g, ' ')
        .trim()
    } else {
      doc.normalised[fieldName] = doc.raw[fieldName].trim()
    }
  }
  this.push(doc)
  return end()
}
