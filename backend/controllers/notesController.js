const Notes = require('../models/notesDB')
const hashController = require('./hashController')

module.exports = {

    createNote: async(req,res) => {

        const {notePassword, ...otherData } = req.body
      
        if (notePassword) {
            const hashedPassword = await hashController.hashPassword(notePassword)
            var newData = {
                notePassword: hashedPassword,
                ...otherData
            }
        } else {
            var newData = req.body   
        }
      
        if (newData.noteTitle === ''){
            newData.noteTitle = 'Untitled'
        }
        const newNote = new Notes(newData)
        try {
            await newNote.save()
            console.log("Data saved to DB")
            res.status(200).json()
        } catch (err) {
            console.error('Error saving data to DB:', err)
            res.status(500).json({ error: 'Failed to save data to DB' })
        }
    }
}