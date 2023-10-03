require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 4001
const mongoose = require('mongoose')
const router = require('./routes')

app.use(cors)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
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

