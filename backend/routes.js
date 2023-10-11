const express = require('express')
const router = express.Router()
const createNoteController = require('./controllers/notesController')
const hashController = require('./controllers/hashController')

router.post('/api/create-note', createNoteController.createNote)
router.get('/api/generate-pass', hashController.genRanPass)
router.get('/api/generate-hash', hashController.genRanHash)
module.exports = router