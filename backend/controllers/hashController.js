const bcrypt = require('bcrypt')
const saltRounds = 10
const Notes = require('../models/notesDB')
const { now } = require('mongoose')

module.exports = {
    
  genRanPass: (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomPass = ''
    let charLength = characters.length
    
    while (randomPass.length < 8) {
      const randomIndex = Math.floor(Math.random() * charLength)
      randomPass += characters[randomIndex]
    }
    res.send(randomPass)
  },
  hashPassword: async(pass) => {
    return await bcrypt.hash(pass,saltRounds)
  },
  genRanHash: async(req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let randomHash = ''
    let charLength = characters.length
    let isUnique = false
    
    while (!isUnique) {
      while (randomHash.length < 5) {
        const randomIndex = Math.floor(Math.random() * charLength)
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
      const lockoutDuration5Mins = 1000 * 60 * 5
      try {
        const notes = await Notes.findOne({noteHash : id}).exec()
        if (notes) {
          let failedLoginAttempts = notes.failedLoginAttempts
          let lockoutTime = notes.lockoutTime
            if (
              (failedLoginAttempts < 3 && lockoutTime) ||
              (!lockoutTime || Date.now() - lockoutTime >= lockoutDuration5Mins)
            ) 
            {
              const passwordMatch = await bcrypt.compare(enteredPass, notes.notePassword)
              if (passwordMatch) {
                console.log('Authenticated :)')
                let noteIsAuth = true
                req.session.loggedIn = true
                req.session.authenticatedHash = id
                failedLoginAttempts = 0
                res.status(200).json({noteIsAuth})
                try {
                  const result = await Notes.updateOne(
                      { noteHash:id }, 
                      { $set : {
                        failedLoginAttempts
                      } } 
                  )
                  if (result.acknowledged) {
                    console.log('The failed login attempts is updated to the DB')
                  } else {
                    console.log('Error: Problem with updating failed login attempts to the DB')
                    res.status(500).json()
                  }
                } catch (err) {
                  console.error('Error updating failed login attempts')
                  res.status(500).json()
                }
              } else {
                  console.log('Invalid password')
                  let updateFields = {
                    lockoutTime,
                    failedLoginAttempts
                  }
                  if (lockoutTime && Date.now() - lockoutTime >= lockoutDuration5Mins && failedLoginAttempts === 3) {
                    failedLoginAttempts = 1
                  } else {
                    failedLoginAttempts += 1
                  }
                    updateFields.failedLoginAttempts = failedLoginAttempts
                    updateFields.lockoutTime = Date.now()
                    res.status(401).json({ failedLoginAttempts })
                    try {
                    const result = await Notes.updateOne(
                        { noteHash: id }, 
                        { $set: updateFields} 
                    )
                      if (result.acknowledged) {
                        console.log('The updateFields is updated to the DB')
                      } else {
                        console.log('Error: Problem with updating updateFields to the DB')
                      }
                    } catch (err) {
                        console.error('Error: Problem with updating updateFields to the DB')
                    }
              }
            } else {
                if (lockoutTime && Date.now() - lockoutTime < lockoutDuration5Mins) { 
                  const remainingTime = lockoutDuration5Mins - (Date.now() - lockoutTime)
                  console.log(`remaining time: ${remainingTime}`)
                  res.status(423).json({remainingTime})
                }
            }
        }
      } catch (err) {
          console.error('Error checking hash in the database:', err)
      }
  }
}