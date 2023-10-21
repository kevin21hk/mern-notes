const Notes = require('../models/notesDB')
const hashController = require('./hashController')

module.exports = {

    createNote: async(req,res) => {
        const {notePassword, ...otherData } = req.body
        if (notePassword.length >= 8) {
            const hashedPassword = await hashController.hashPassword(notePassword)
            otherData.notePassword = hashedPassword
        } else {
            otherData.notePassword = undefined
        }
        if (otherData.noteTitle === ''){
            otherData.noteTitle = 'Untitled'
        }
        if (otherData.notePublicity === 'Private') {
            req.session.loggedIn = true
            req.session.authenticatedHash = otherData.noteHash
        }
        const newNote = new Notes(otherData)
        try {
            await newNote.save()
            console.log("Data saved to DB")
            const isDataSaved = true
            res.status(200).json({isDataSaved})
        } catch (err) {
            console.error('Error saving data to DB:', err)
            res.status(500).json({ error: 'Failed to save data to DB' })
        }
    },
    retrieveNote: async(req, res) => {
        const id = req.params.id
        try {
            const note = await Notes.findOne({ noteHash: id })
            if (note) {
                res.status(200).json(note);
                } else {
                res.status(404).json({ error: 'Note not found' })
            }
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' })
          }
        }
}