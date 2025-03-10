const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'superuser',
    passwordHash: 'admin',
  },
  {
    username: 'morghan831',
    name: 'jerzon',
    passwordHash: 'pass',
  },
  {
    username: 'sonchan',
    name: 'joel',
    passwordHash: 'word',
  },
]

const usersInDb = async () => {
  const result = await User.find({})
  return result.map((u) => u.toJSON())
}

const nonExistingId = async () => {
  const user = new User({
    username: 'sucito',
    name: 'john',
    password: 'semeolvida',
  })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

module.exports = { initialUsers, usersInDb, nonExistingId }
