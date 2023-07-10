const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // before you import your routes
const app = express() // app - http server
const cors = require('cors') // Node's cors middleware
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then((result) => {
    logger.info(`connected to MongoDB - ${result}`)
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build')) // built-in middleware from express
// Whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address.
// GET requests to the address .../api/notes will be handled by the backend's code.
app.use(express.json()) // json parser "To access the data easily" vjerojatno za response.json(note)
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
