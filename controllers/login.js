const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const correctPassword =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && correctPassword)) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  const tokenPayload = {
    id: user._id,
    username: user.username,
  }

  const token = jwt.sign(tokenPayload, process.env.SECRET)

  res.status(201).json({
    token,
    username: user.username,
  })
})

module.exports = loginRouter
