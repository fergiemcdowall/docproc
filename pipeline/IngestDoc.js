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
  var that = this
  var ingestedDoc = {
    normalised: {},
    options: that.options,
    raw: JSON.parse(JSON.stringify(doc)),
    stored: {},
    tokenised: {},
    vector: {}
  }

  // if there is no id, generate a a stringified one that is sorted
  // by time (higher values more recent), so that a natural sort will
  // yeild the most recent docs first
  if (!doc.id) {
    // TODO ++this.i should be left padded
    ingestedDoc.id = Date.now() + '-' + ++this.i
  } else {
    ingestedDoc.id = String(doc.id)
  }

  this.push(ingestedDoc)  // should this actually be stringified?
  return end()
}
