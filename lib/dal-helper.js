require('dotenv').config()
const HTTPError = require('node-http-error')
const {
  propOr,
  assoc,
  split,
  head,
  last,
  map,
  prop,
  omit,
  path,
  compose,
  assocPath
} = require('ramda')
const mysql = require('mysql')

//////////////////////////////
///  HELPERS
//////////////////////////////

function createConnection() {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const read = (tableName, columnName, id, formatter, callback) => {
  if (id && tableName) {
    const connection = createConnection()

    connection.query(
      'SELECT * FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ? ',
      //SELECT * FROM vOrchestra WHERE orchestraID = 2

      [id],
      function(err, result) {
        if (err) return callback(err)
        if (propOr(0, 'length', result) > 0) {
          const formattedResult = formatter(head(result))
          console.log('Formatted Result: ', formattedResult)
          return callback(null, formattedResult)
        } else {
          //send back a 404

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
  }
}

const deleteRow = (tableName, id, callback) => {
  if (tableName && id) {
    const connection = createConnection()
    console.log('tableName: ', tableName)
    console.log('id: ', id)

    connection.query(
      'DELETE FROM ' + connection.escapeId(tableName) + ' WHERE _id = ?',
      [id],
      function(err, result) {
        if (err) return callback(err)

        if (result && result.affectedRows === 1) {
          return callback(null, { ok: true, id: id })
        } else if (result && result.affectedRows === 0) {
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
    connection.end(err => err)
  } else {
    return callback(new HTTPError(400, 'Missing id or entity name.'))
  }
}
//////////
//CREATE//
//////////

const create = (tableName, data, formatter, callback) => {
  if (data) {
    const connection = createConnection()

    const sql = `INSERT INTO ${connection.escapeId(tableName)} SET ? `
    connection.query(sql, data, (err, result) => {
      if (err) return callback(err)

      propOr(null, 'insertId', result)
        ? callback(null, { ok: true, id: result.insertId })
        : callback(null, { ok: false, id: null })
    })

    connection.end(err => callback(err))
  }
}

const createArt = (tableName, data, formatter, callback) => {
  if (data) {
    const connection = createConnection()

    const sql = `INSERT INTO ${connection.escapeId(tableName)} SET ? `
    connection.query(sql, formatter(data), (err, result) => {
      if (err) return callback(err)

      propOr(null, 'insertId', result)
        ? callback(null, { ok: true, id: result.insertId })
        : callback(null, { ok: false, id: null })
    })

    connection.end(err => callback(err))
  }
}

const queryDB = (tableName, lastItem, filter, limit, formatter, callback) => {
  limit = limit ? limit : 5

  const connection = createConnection()

  if (filter) {
    console.log('FILTER MODE')
    const arrFilter = split(':', filter) //
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ${filterField} = ?
    ORDER BY name
    LIMIT ${limit}`

    console.log('sql:', sql)

    connection.query(sql, [filterValue], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else if (lastItem) {
    console.log('NEXT PAGE MODE')

    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE name > ?
    ORDER BY name
    LIMIT ${limit}`

    console.log('SQL', sql)

    connection.query(sql, [lastItem], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else {
    console.log('SIMPLE LIST. FIRST PAGE')
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    ORDER BY name
    LIMIT ${limit}`

    console.log('SQL', sql)

    connection.query(sql, function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  }
}

///////////////////////////////
////ReturnView
//////////////////////////////

const returnView = (
  tableName,
  lastItem,
  filter,
  limit,
  formatter,
  callback
) => {
  limit = limit ? limit : 5

  const connection = createConnection()
  // ORDER BY artist
  if (filter) {
    console.log('FILTER MODE')
    const arrFilter = split(':', filter) //
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ${filterField} = ?
    LIMIT ${limit}`

    console.log('sql:', sql)

    connection.query(sql, [filterValue], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else if (lastItem) {
    console.log('NEXT PAGE MODE')

    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE name > ?
    LIMIT ${limit}`

    console.log('SQL', sql)

    connection.query(sql, [lastItem], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else {
    console.log('SIMPLE LIST. FIRST PAGE')
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    LIMIT ${limit}`

    console.log('SQL', sql)

    connection.query(sql, function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  }
}

///////////////////
///UPDATE/////////
//////////////////
const updateArt = (art, callback) => {
  if (art) {
    const connection = createConnection()
    art = prepArtForUpdate(art)
    // art = omit('_rev', art)
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

const prepArtForUpdate = art => {
  art = assoc('locationCity', path(['museum', 'location'], art), art)
  art = assoc('museumName', path(['museum', 'name'], art), art)
  art = assoc('movementName', path(['movement'], art), art)
  return compose(omit('_rev'), omit('movement'), omit('museum'))(art)
  //return compose(
  //    omit('_rev'),
  //    omit('museum.location'),
  //    omit('movement'),
  //    omit('museum')
  console.log('Updated :', art)
}

const dalHelper = {
  read,
  queryDB,
  returnView,
  createArt,
  updateArt,
  deleteRow,
  create
}

module.exports = dalHelper
