const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
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

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => response.json(updatedNote))
    .catch(error => next(error))
})

module.exports = notesRouter
