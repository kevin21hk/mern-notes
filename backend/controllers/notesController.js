const mongoose = require('mongoose')
const Notes = require('../models/notesDB')
const bcryptController = require('./bcryptPassword')

module.exports = {

    createNote: async(req,res) => {
        const {notePassword, ...otherData } = req.body
        const hashedPassword = await bcryptController.hashPassword(notePassword)
        const newData = {
            notePassword: hashedPassword,
            ...otherData
        }
        console.log(hashedPassword)
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