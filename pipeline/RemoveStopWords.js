// removes stopwords from indexed docs
const Transform = require('stream').Transform
const util = require('util')

const RemoveStopWords = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = RemoveStopWords
util.inherits(RemoveStopWords, Transform)
RemoveStopWords.prototype._transform = function (doc, encoding, end) {
  var options = Object.assign({}, {
    fieldOptions: {},
    stopwords: []
  }, doc.options || {})
  for (var fieldName in doc.normalised) {
    var fieldOptions = Object.assign({}, {
      stopwords: options.stopwords
    }, options.fieldOptions[fieldName])
    // remove stopwords
    doc.tokenised[fieldName] =
      doc.tokenised[fieldName].filter(function (item) {
        return (fieldOptions.stopwords.indexOf(item) === -1)
      }).filter(function (i) {  // strip out empty elements
        return i
      })
  }
  this.push(doc)
  return end()
}
