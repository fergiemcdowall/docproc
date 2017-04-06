const util = require('util')
const Transform = require('stream').Transform

const NormaliseFields = function () {
  Transform.call(this, { objectMode: true })
}
module.exports = NormaliseFields
util.inherits(NormaliseFields, Transform)
NormaliseFields.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.raw) {
    if (Object.prototype.toString.call(doc.raw[fieldName]) === '[object Array]') {
      doc.normalised[fieldName] = doc.raw[fieldName].map(function (item) {
        return JSON.stringify(item).split(/[[\],{}:"]+/).join(' ').trim()
      })
    } else if (Object.prototype.toString.call(doc.raw[fieldName]) !== '[object String]') {
      // if the input object is not a string: jsonify and split on JSON
      // characters
      doc.normalised[fieldName] = JSON.stringify(doc.raw[fieldName])
        .split(/[[\],{}:"]+/).join(' ').trim()
    } else {
      doc.normalised[fieldName] = doc.raw[fieldName].trim()
    }
  }
  this.push(doc)
  return end()
}
