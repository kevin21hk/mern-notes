const mongoose = require('mongoose');
const NoteSchema = mongoose.Schema({
  noteHash: {
    type: String,
    required: true
  },
  noteTitle: {
    type: String
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
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockoutTime: {
    type: Date
  }
});

const Notes = mongoose.model('Notes', NoteSchema);

module.exports = Notes;
