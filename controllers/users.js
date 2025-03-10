const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'expect `password` to be 3 or more characters long' })
  }
  const saltRounds = 10

  const newUser = new User({
    username,
    name,
    passwordHash: await bcrypt.hash(password, saltRounds),
  })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    // console.log(error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    } else if (
      error.name === 'MongoServerError' &&
      error.message.includes('E11000 duplicate key')
    ) {
      return res.status(400).json({ error: 'expected `username` to be unique' })
    }
    res.status(500).json(error.name)
    // Error handler middleware should handle ValidationError and MongoServerError
    next(error)
  }
})

usersRouter.get('/', async (req, res) => {
  try {
    const allUsers = await User.find({})
    res.json(allUsers)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
