// removes stopwords from indexed docs
const Transform = require('stream').Transform
const util = require('util')

const Synonyms = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = Synonyms
util.inherits(Synonyms, Transform)
Synonyms.prototype._transform = function (doc, encoding, end) {
  var options = Object.assign({}, {
    fieldOptions: {},
    synonyms: {}
  }, doc.options || {})
  for (var fieldName in doc.tokenised) {
    var fieldOptions = Object.assign({}, {
      synonyms: options.synonyms
    }, options.fieldOptions[fieldName])
    // swap in synonyms
    doc.tokenised[fieldName] = doc.tokenised[fieldName].map(token => {
      return fieldOptions.synonyms[token] || token
    })
  }
  this.push(doc)
  return end()
}
