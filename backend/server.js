require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 4001
const mongoose = require('mongoose')
const session = require('express-session')
const router = require('./routes')
const tenMinutes = 1000 * 60 * 10

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(session({
    secret: 'secretKey4Note',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: tenMinutes
}
}))
app.use(router)

mongoose.connect(process.env.DBURL)
.then(()=> {
    console.log(`Connected to DB`)
    app.listen(port, ()=> {
    console.log(`Listening to port ${port}`)
    })
})
.catch((err) => {
    console.error(`Error`, err) 
})

