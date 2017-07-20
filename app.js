require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 6000
const { pathOr, keys, assoc } = require('ramda')
const checkfields = require('./lib/fieldchecker.js')
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

const checkArtFields = checkfields([
  'name',
  'movement',
  'artist',
  'yearCreated',
  'museum',
  'type'
])

//POST /art/paintings

// app.post('/art/paintings', function(req, res, next) {
//   const art = pathOr(null, ['body'], req)
//   const checkFields = checkArtFields(art)
//
//   checkfields.length > 0
//     ? new HTTPError(400, 'missing required art fields in request body')
//     : { fields: checkFields }
//
//   dal.addArt(art, function(err, result) {
//     if (err) return next(new HTTPError(err.status, err.message, err))
//     res.status(200).send(result)
//   })
// })
app.post('/art', function(req, res, next) {
  // const type = pathOr('', ['params', 'type'], req)
  const art = pathOr(null, ['body'], req)
  const checkFields = checkArtFields(art)

  checkfields.length > 0
    ? new HTTPError(400, 'missing required art fields in request body')
    : { fields: checkFields }

  dal.addArt(art, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

//GET /art/paintings/:id

app.get(`/art/:id`, function(req, res, next) {
  const artId = pathOr(null, ['params', 'id'], req)
  if (artId) {
    dal.getArt(artId, function(err, obj) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(obj)
    })
  } else {
    return next(new HTTPError(400, 'missing required art Id in path'))
  }
})

//PUT /art/paintings/:id

// app.put('/art/paintings/:id', function(req, res, next) {
//   const artId = pathOr(null, ['params', 'id'], req)
//   const body = pathOr(null, ['body'], req)
//   console.log(body)
//   if (!body || keys(body).length === 0)
//     return next(new HTTPError(400, 'the request body is missing required data'))
//   dal.updateArt(body, function(err, obj) {
//     if (err) return next(new HTTPError(err.status, err.message, err))
//     res.status(200).send(obj)
//   })
// })
app.put('/art/:id', function(req, res, next) {
  // const type = pathOr({ $all }, ['params', 'type'], req)
  const artId = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)
  console.log(body)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'the request body is missing required data'))
  dal.updateArt(body, function(err, obj) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(obj)
  })
})
//DELETE /art/paintings/:id

app.delete('/art/:id', function(req, res, next) {
  const artId = pathOr(null, ['params', 'id'], req)

  dal.deleteArt(artId, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

//GET /art/paintings
//app.get('/art')

app.get('/art/', function(req, res, next) {
  //const type = pathOr(assoc('$gte', null, {}), ['params', 'type'], req)
  //console.log('type: ', type)
  const limit = pathOr(15, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  var filter = pathOr(null, ['query', 'filter'], req)
  console.log('filter in app', filter)

  dal.listArt(Number(limit), lastItem, filter, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

///MIDDLEWARE///
app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})
app.listen(port, () => console.log('api is up and running on port: ', port))
