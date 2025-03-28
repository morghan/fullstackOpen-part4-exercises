const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGO_URL } = require('./utils/config')
const { tokenExtractor, userExtractor } = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

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
app.use(tokenExtractor)

// Routes
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app
