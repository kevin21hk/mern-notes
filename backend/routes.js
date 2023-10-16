const express = require('express')
const router = express.Router()
const noteController = require('./controllers/notesController')
const hashController = require('./controllers/hashController')

router.post('/api/create-note', noteController.createNote)
router.get('/api/generate-pass', hashController.genRanPass)
router.get('/api/generate-hash', hashController.genRanHash)
router.get('/api/retrieve-note/:id', noteController.retrieveNote)

module.exports = router