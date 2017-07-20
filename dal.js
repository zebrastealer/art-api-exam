const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const {
  pathOr,
  assoc,
  concat,
  head,
  last,
  split,
  slice,
  startsWith,
  forEach,
  toLower,
  filter,
  contains
} = require('ramda')
const HTTPError = require('node-http-error')
const pkbuilder = require('./lib/pkbuilder')
const artPkGenerator = pkbuilder('')

const dal = {
  addArt,
  getArt,
  updateArt,
  deleteArt,
  listArt
}

///CREATE///

function addArt(art, callback) {
  const name = pathOr('', ['name'], art)
  const type = concat(pathOr('painting', ['type'], art), '_')
  var artPk = artPkGenerator(`${name}`)
  if (startsWith('the_', artPk)) {
    newartPk = slice(4, Infinity, artPk)
  } else if (startsWith('a_', artPk)) {
    newartPk = slice(2, Infinity, artPk)
  } else newartPk = artPk
  art = assoc('_id', concat(type, newartPk), art)
  //art = assoc('type', concat(type, art), art)
  createDoc(art, callback)
}
///READ///

function getArt(artId, callback) {
  db.get(artId, function(err, doc) {
    if (err) return callback(err)
    callback(null, doc)
  })
}
///UPDATE///
function updateArt(art, callback) {
  //art = assoc('type', 'painting', art)
  createDoc(art, callback)
}

///DELETE///
function deleteArt(artId, callback) {
  db
    .get(artId)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

///LIST ALL ART///
function listArt(limit, lastItem, filter, callback) {
  var query = {}
  var selectorValue = {}
  //TODO add an adjustment to filter to look for core pouchdb-find commands - gt, gte, lt,lte, eq and modifies selectorValue accordingly
  if (filter) {
    // TODO:  finish reasearch on support of multiple field queries
    // console.log('filter in dal is: ', filter)
    //
    // if (contains('*', filter)) {
    //   var temparr = split('*', filter)
    //   var newfilter = []
    //   var artFilter = []
    //   const temparrlen = temparr.length
    //   for (var i = 0; i < temparrlen; i++) {
    //     newfilter.push(split(':', temparr[i]))
    //     var filterField = newfilter[i]
    //     console.log('XXXXX', filterField)
    //     var filterValue = Number(newfilter[i + 1])
    //       ? Number(newfilter[i + 1])
    //       : newfilter[i + 1]
    //     selectorValue = { filterField: filterValue }
    //     console.log('selectorvalue', selectorValue)
    //     query = {
    //       selector: selectorValue,
    //       limit
    //     }
    //   }
    // const filterField = head(artFilter)
    // const filterValue = Number(last(artFilter))
    //   ? Number(last(artFilter))
    //   : last(artFilter)
    // } else {
    // console.log('went to else in dal')
    const artFilter = split(':', filter)
    const filterField = head(artFilter)
    const filterValue = Number(last(artFilter))
      ? Number(last(artFilter))
      : last(artFilter)
    const selectorValue = assoc(filterField, filterValue, {})
    query = {
      selector: selectorValue,
      limit
    }
    // }
  } else if (lastItem) {
    query = {
      selector: { _id: { $gt: lastItem }, type: { $gte: null } },
      limit
    }
  } else {
    query = { selector: { _id: { $gte: null }, type: { $gte: null } }, limit }
  }
  find(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

///HELPER FN///

function createDoc(doc, callback) {
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

function find(query, callback) {
  console.log('query', JSON.stringify(query, null, 2))
  query ? db.find(query, callback) : callback(null, [])
}

module.exports = dal
