const mongoose = require('mongoose')
const Notes = require('../models/notesDB')

module.exports = {

    createNote: (req,res) => {
        const newData = req.body
        
        if (newData.noteTitle === ''){
            newData.noteTitle = 'Untitled'
        }

        const newNote = new Notes(newData)
        newNote.save()
        .then(() => {
            console.log("Data saved to DB")
            res.status(200).json()
        })
        .catch((err) => {
            console.error('Error saving data to DB:', err);
            res.status(500).json({ error: 'Failed to save data to DB' });
        })
    }
}