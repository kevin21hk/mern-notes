const mongoose = require('mongoose')
const Notes = require('../models/notesDB')

module.exports = {

    createNote: (req,res) => {
        const newNote = new Notes({
            noteTitle: "Title test",
            noteData: "Data test",
            notePublicity: true,
        })
    newNote.save()
        .then(()=> {
            console.log("Data saved to DB")
            res.status(200).json()
        })
    }
}

// noteTitle: {
//     type: String,
// },
// noteData: {
//     type: String,
//     required: true
// },
// notePublicity: {
//     type: Boolean,
//     default: true
// },
// notePassword: {
//     type: String,
//     minlength: 6
// },
// createdAt: {
//     type: Date,
//     default: Date.now
//   }