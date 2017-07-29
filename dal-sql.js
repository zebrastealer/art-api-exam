const mysql = require('mysql')
const HTTPError = require('node-http-error')
const dalHelper = require('./lib/dal-helper')

const {
  map,
  append,
  find,
  reject,
  compose,
  trim,
  merge,
  split,
  head,
  last,
  pick,
  omit,
  assoc,
  propOr,
  path,
  assocPath,
  flatten,
  prop
} = require('ramda')

//////////////////////////////
////////SQL CONST////////////
/////////////////////////////

const addArt = (art, callback) => {
  dalHelper.createArt('painting', art, artCreateFormatter, callback)
}

const getArt = (artId, callback) =>
  dalHelper.read('painting', '_id', artId, artFormatter, callback)

const updateArt = (art, callback) => dalHelper.updateArt(art, callback)

const deleteArt = (artId, callback) =>
  dalHelper.deleteRow('painting', artId, callback)

const listArt = (lastItem, filter, limit, callback) => {
  dalHelper.returnView(
    'painting',
    lastItem,
    filter,
    limit,
    formatter => formatter,
    (err, data) => (err ? callback(err) : callback(null, data))
  )
}

const artCountByCity = (lastItem, filter, limit, callback) => {
  dalHelper.returnView(
    'artcitycount',
    lastItem,
    filter,
    limit,
    reportCountFormatter,
    (err, data) => (err ? callback(err) : callback(null, data))
  )
}

////////////////////////////
//    helper functions    //
////////////////////////////

function createConnection() {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const update = (art, callback) => {
  if (art) {
    const connection = createConnection()
    //art = prepartForUpdate(art)
    art = omit('_rev', art)
    connection.query(
      'UPDATE painting SET ? WHERE _id = ?',
      [art, art._id],
      function(err, result) {
        if (err) return callback(err)
        console.log('Updated result: ', result)

        if (propOr(0, 'affectedRows', result) === 1) {
          return callback(null, { ok: true, id: art._id })
        } else if (propOr(0, 'affectedRows', result) === 0) {
          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return callback(new HTTPError(400, 'Missing information'))
  }
}

////////////////////////
//////FORMATTERS/////////
////////////////////////

const artFormatter = c => omit('_rev')(c)

const reportCountFormatter = art => {
  art = assocPath(
    ['reportName: Painting count by city', 'reportData', []],
    art,
    art
  )
  //console.log('COMPOSED!!!!! ', art)
  return art
}

const artCreateFormatter = art => {
  art = assoc('locationCity', path(['museum', 'location'], art), art)
  art = assoc('museumName', path(['museum', 'name'], art), art)
  art = assoc('movementName', path(['movement'], art), art)
  return compose(omit('_rev'), omit('movement'), omit('museum'))(art)
}

const dal = {
  addArt,
  listArt,
  getArt,
  deleteArt,
  updateArt,
  artCountByCity
}
module.exports = dal
