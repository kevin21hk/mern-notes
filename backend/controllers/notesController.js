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
                if (note.notePublicity === 'Private') {
                    if (req.session.authenticatedHash && req.session.loggedIn) {
                        res.status(200).json({...note.toObject()
                        })
                    } else {
                        res.status(401).json('Not Authorized')
                    }
                } else {
                    res.status(200).json(note)
                }
            } else {
                res.status(404).json({ error: 'Note not found' })
            }
            } catch (err) {
                console.error(err)
                res.status(500).json({ error: 'Internal server error' })
          }
    },
    updateNote: async(req, res) => {
        const {updatedNote, noteHash} = req.body
        try {
            const result = await Notes.updateOne(
                { noteHash:noteHash }, 
                { $set : {noteData:updatedNote} } 
            )
           if (result.acknowledged) {
                console.log("Note updated to DB")
                console.log(updatedNote)
                res.status(200).json({result})
            } else {
                console.log("There was an issue updating to DB")
                res.status(404).json({ error: "Issue updating Note in DB" })
            }
        } catch (err) {
            console.error('Error saving data to DB:', err)
            res.status(500).json({ error: 'Failed to save data to DB' })
        }
    },
    updateTitle: async(req, res) => {
        const {updatedTitle, noteHash} = req.body
            try {
                const result = await Notes.updateOne(
                    { noteHash:noteHash }, 
                    { $set : {noteTitle:updatedTitle} } 
                )
                    if (result.acknowledged) {
                            console.log("Title updated to DB")
                            console.log(updatedTitle)
                            res.status(200).json({result})
                        } else {
                            console.log("There was an issue updating to DB")
                            res.status(404).json({ error: "Issue updating Title in DB" })
                    }
            } catch (err) {
                console.error('Error saving data to DB:', err)
                res.status(500).json({ error: 'Failed to save data to DB' })
            }
    },
    getPublicNotes: async(req,res) => {
        try {
            const result = await Notes.find({notePublicity: 'Public'})
            .sort({ createdAt: -1 })
            .limit(20)

            if (result.length > 0) {
                res.status(200).json(result)
            }
            else {
                res.status(404).json({ message: 'No public notes found'})
            }
        }
        catch (err) {
            console.error('Error retrieving public notes:', err)
            res.status(500).json({ message: 'Internal server error'})
        }
    },
    deleteNote: async(req, res) => {
        const id = req.params.id
        try {
            const result = await Notes.deleteOne({ noteHash: id })
            if (result.acknowledged) {
                res.status(200).json()
            } else {
                res.status(400).json({ error: 'Note deletion erorr' })
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}