const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGO_URL } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Connected to ${MONGO_URL}`)
  })
  .catch((error) => {
    console.error(error)
  })

// Middleware
app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app
