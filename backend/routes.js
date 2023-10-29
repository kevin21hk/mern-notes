const express = require('express')
const router = express.Router()
const noteController = require('./controllers/notesController')
const hashController = require('./controllers/hashController')
const sessionController = require('./controllers/sessionController')

router.post('/api/create-note', noteController.createNote)
router.post('/api/auth', hashController.authNote)
router.post('/api/update-note', noteController.updateNote)
router.post('/api/update-title', noteController.updateTitle)

router.get('/api/generate-pass', hashController.genRanPass)
router.get('/api/generate-hash', hashController.genRanHash)
router.get('/api/retrieve-note/:id', noteController.retrieveNote)
router.get('/api/check-session', sessionController.checkSession)
router.get('/api/get-public-notes', noteController.getPublicNotes)

module.exports = router