const express = require('express')
const router = express.Router()
const createNoteController = require('./controllers/notesController')

router.post('/api/create-note', createNoteController.createNote)

module.exports = router