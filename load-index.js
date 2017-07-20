require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

//1st Example
// db
//   .createIndex({
//     index: { fields: ['movement'] }
//   })
//   .then(() => console.log("created Index on the 'movement' property"))
//   .catch(err => console.log(err))
// db
//   .find({
//     selector: { movement: 'impressionism' },
//     fields: ['name', 'movement', 'artist'],
//     sort: ['artist']
//   })
//   .then(function(result) {
//     console.log(result)
//   })
//   .catch(function(err) {
//     console.log(err)
//   })

//2nd Example Index
// db
//   .createIndex({
//     index: { fields: ['type'] }
//   })
//   .then(() => console.log("created Index on the 'type' property"))
//   .catch(err => console.log(err))
// db
//   .find({
//     selector: { type: '$all' },
//     sort: ['type']
//   })
//   .then(function(result) {
//     console.log(result)
//   })
//   .catch(function(err) {
//     console.log(err)
//   })
