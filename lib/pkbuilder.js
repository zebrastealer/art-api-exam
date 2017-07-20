const {
  concat,
  compose,
  toLower,
  trim,
  toString,
  replace,
  slice,
  startsWith
} = require('ramda')

// function identifyStart(name) {
//   if (startsWith('the_', name)) {
//     slice(4, Infinity, name)
//   } else if (startsWith('a_', name)) {
//     slice(2, Infinity, name)
//   } else {
//   }
// }
module.exports = prefix => value =>
  compose(trim, toLower, replace(/ /g, '_'), concat(prefix))(value)
