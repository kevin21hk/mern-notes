const mongoose = require('mongoose')
const NoteSchema = mongoose.Schema({
    noteHash: {
        type: String,
        required: true
    },
    noteTitle: {
        type: String,
    },
    noteData: {
        type: String,
        required: true
    },
    notePublicity: {
        type: String,
        default: true
    },
    notePassword: {
        type: String,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
})

const Notes = mongoose.model('Notes', NoteSchema)

module.exports = Notes