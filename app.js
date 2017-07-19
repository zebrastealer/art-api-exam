require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})
