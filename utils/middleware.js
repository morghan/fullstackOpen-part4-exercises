const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = async (request, response, next) => {
  const auth = request.get('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  try {
    if (request.token) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      request.user = await User.findById(decodedToken.id)
    } else {
      request.user = null
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { tokenExtractor, userExtractor }
