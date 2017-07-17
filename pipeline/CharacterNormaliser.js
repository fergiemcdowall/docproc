// removes stopwords from indexed docs
const Transform = require('stream').Transform
const util = require('util')

const CharacterNormaliser = function (options) {
  Transform.call(this, { objectMode: true })
}
module.exports = CharacterNormaliser
util.inherits(CharacterNormaliser, Transform)
CharacterNormaliser.prototype._transform = function (doc, encoding, end) {
  var options = Object.assign({}, {
    fieldOptions: {},
    normaliseCharacters: false
  }, doc.options || {})
  for (var fieldName in doc.normalised) {
    var fieldOptions = Object.assign({}, {
      normaliseCharacters: options.normaliseCharacters
    }, options.fieldOptions[fieldName])
    // normalise characters
    if (fieldOptions.normaliseCharacters && (fieldName !== 'id')) {
      doc.tokenised[fieldName] =
        doc.tokenised[fieldName].map(function (token) {
          return Array.from(token).map(function (c) {
            return c.normalize('NFKD')[0]
          }).join('')
        })
    }
  }
  this.push(doc)
  return end()
}
