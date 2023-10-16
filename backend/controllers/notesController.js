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
            const isDataSaved = true
            res.status(200).json({isDataSaved})
        } catch (err) {
            console.error('Error saving data to DB:', err)
            res.status(500).json({ error: 'Failed to save data to DB' })
        }
    },
    retrieveNote: (req, res) => {
        const id = req.params.id
        Notes.findOne({noteHash: id})
        .then((note)=>{
            if (note) {
                console.log(note)
                res.status(200).json(note)
            }   else {
                res.status(404).json({ error: 'Note not found' })
            }
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        } )

    }

}