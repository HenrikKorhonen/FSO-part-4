const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const cors = require('cors')
const mongoose = require('mongoose')

const password =  "nCbny4JcwEnixj2B"  //process.env.PASSWORD
const mongoUrl = 'mongodb+srv://hevemiko:nCbny4JcwEnixj2B@cluster0.quqg3jx.mongodb.net/?retryWrites=true&w=majority'


mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
module.exports = {
    app
}