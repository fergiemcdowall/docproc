const Transform = require('stream').Transform
const util = require('util')

const RemoveStopWords = function (options) {
  this.options = Object.assign({}, {
    fieldOptions: {},
    stopwords: []
  }, options)
  Transform.call(this, { objectMode: true })
}
module.exports = RemoveStopWords
util.inherits(RemoveStopWords, Transform)
RemoveStopWords.prototype._transform = function (doc, encoding, end) {
  for (var fieldName in doc.normalised) {
    var fieldOptions = Object.assign({}, {
      stopwords: this.options.stopwords
    }, this.options.fieldOptions[fieldName])
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
