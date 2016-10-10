const util = require('util')
const Transform = require('stream').Transform

const NormaliseFields = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
module.exports = NormaliseFields
util.inherits(NormaliseFields, Transform)
NormaliseFields.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    // if the input object is not a string: jsonify and split on JSON
    // characters
    if (Object.prototype.toString.call(doc.normalised[fieldName]) !== '[object String]') {
      doc.normalised[fieldName] = JSON.stringify(doc.normalised[fieldName])
        .split(/[\[\],{}:"]+/).join(' ')
    }
    doc.normalised[fieldName] = doc.normalised[fieldName].trim()
  }
  this.push(doc)
  return end()
}
