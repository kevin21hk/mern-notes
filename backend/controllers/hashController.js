const bcrypt = require('bcrypt')
const saltRounds = 10
const Notes = require('../models/notesDB')

module.exports = {
    
  genRanPass: (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomPass = ''
    let charLength = characters.length
    
    while (randomPass.length < 8) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomPass += characters[randomIndex]
    }
    res.send(randomPass)
  },
  hashPassword: async(pass) => {
    return bcrypt.hash(pass,saltRounds)
  },
  genRanHash: async(req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let randomHash = ''
    let charLength = characters.length
    let isUnique = false
    
    while (!isUnique) {
      while (randomHash.length < 5) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        randomHash += characters[randomIndex]
      }
        try {
          const notes = await Notes.find({noteHash: randomHash}).exec()
          if (notes.length > 0) {
            console.log(`${randomHash} - Hash exists in DB`)
            randomHash = ''
            } else {
              console.log(`${randomHash} - Hash is unique`)
              isUnique = true
              res.send(randomHash)
              break
            }
        } catch (err){
            console.error('Error checking hash in the database:', err)
        }
    }
  },
  authNote: async(req, res) => {
      const {enteredPass, id} = req.body
      try {
        const notes = await Notes.findOne({noteHash : id}).exec()
        if (notes) {
          const passwordMatch = await bcrypt.compare(enteredPass, notes.notePassword)
          if (passwordMatch) {
          console.log('Authenticated :)')
          let noteIsAuth = true
          req.session.loggedIn = true
          req.session.authenticatedHash = id
          console.dir(req.session.authenticatedHash)
          res.status(200).json(noteIsAuth)
          } else {
            console.log('Invalid password')
            res.status(404).json({ error: 'Password not match' })
          }
        }
      } catch (err) {
        console.error('Error checking hash in the database:', err)
      }
    }
}