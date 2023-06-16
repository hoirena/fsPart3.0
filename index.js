require('dotenv').config()
const express = require('express')
const cors = require('cors') // Node's cors middleware
const app = express() // app - http server
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('build')) // built-in middleware from express
// Whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address.
// GET requests to the address .../api/notes will be handled by the backend's code.
app.use(express.json()) // json parser "To access the data easily" vjerojatno za response.json(note)
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log('result', result)
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.post('/api/notes', (request, response, next) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  note.save()
    .then((savedNote) => response.json(savedNote))
    .catch(error => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => response.json(updatedNote))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('error.message: ', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
