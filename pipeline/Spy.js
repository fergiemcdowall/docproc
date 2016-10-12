const Transform = require('stream').Transform
const util = require('util')

const Spy = function () {
  Transform.call(this, { objectMode: true })
}
module.exports = Spy
util.inherits(Spy, Transform)
Spy.prototype._transform = function (doc, encoding, end) {
  console.log(JSON.stringify(doc, null, 2))
  this.push(doc)
  return end()
}
