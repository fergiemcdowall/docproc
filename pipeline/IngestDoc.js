const util = require('util')
const Transform = require('stream').Transform

const IngestDoc = function (options) {
  this.options = options
  this.i = 0
  Transform.call(this, { objectMode: true })
}
module.exports = IngestDoc
util.inherits(IngestDoc, Transform)
IngestDoc.prototype._transform = function (doc, encoding, end) {
  var ingestedDoc = {
    id: String(String(doc.id) || (Date.now() + '-' + ++this.i)),
    normalised: {},
    raw: JSON.parse(JSON.stringify(doc)),
    stored: {},
    tokenised: {},
    vector: {}
  }
  this.push(ingestedDoc)  // should this actually be stringified?
  return end()
}

