const express = require('express')
const router = express.Router()
const createNoteController = require('./controllers/notesController')

const bcryptPassword = require('./controllers/bcryptPassword')

router.post('/api/create-note', createNoteController.createNote)
router.get('/api/generate-pass', bcryptPassword.genRanPass)
module.exports = router