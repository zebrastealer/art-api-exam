const { difference, keys } = require('ramda')

module.exports = checkfields => data => difference(checkfields, keys(data))
