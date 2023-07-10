const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

// const url = `mongodb+srv://fullstack:${password}@cluster0.jlaalv2.mongodb.net/noteApp?retryWrites=true&w=majority` //`mongodb+srv://fullstack:${password}@cluster0.jlaalv2.mongodb.net/` //
const url = `mongodb+srv://fullstack:${password}@cluster0.jlaalv2.mongodb.net/testNoteApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
/*
  In the Note model definition, the first "Note" parameter is the singular name of the model.
  The name of the collection will be the lowercase plural notes, because the Mongoose convention is
  to automatically name collections as the plural (e.g. notes) when the schema refers to them in
  the singular (e.g. Note).
*/

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log((note))
//   })
//   mongoose.connection.close()
// })
const note = new Note({
  content: 'CSS is Easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved! result -> ', result)
  mongoose.connection.close()
})
