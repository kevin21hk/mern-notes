const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
    
  genRanPass: (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPass = ''
    let charLength = characters.length
    
    while (randomPass.length < 8) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomPass += characters[randomIndex];
    }
    res.send(randomPass)
  },
  hashPassword: async(pass) => {
    return bcrypt.hash(pass,saltRounds)
  }
}