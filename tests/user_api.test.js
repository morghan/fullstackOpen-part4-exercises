const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./user_api_test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map((user) => new User(user))
    const promises = userObjects.map((u) => u.save())
    await Promise.all(promises)
  })

  describe('Invalid users can not be created', () => {
    test('Username and password are required', async () => {
      const userWithoutUsername = {
        username: '',
        name: 'test',
        password: '123456',
      }
      const userWithoutPassword = {
        username: 'username',
        name: 'test',
        password: '',
      }

      await api.post('/api/users').send(userWithoutUsername).expect(400)
      await api.post('/api/users').send(userWithoutPassword).expect(400)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('Username and Password must be 3 or more characters long', async () => {
      const userShortUsername = {
        username: 'ab',
        name: 'test',
        password: '123456',
      }
      const userShortPassword = {
        username: 'abc',
        name: 'test',
        password: '12',
      }

      await api.post('/api/users').send(userShortUsername).expect(400)
      await api.post('/api/users').send(userShortPassword).expect(400)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
    test('Username must be unique', async () => {
      const userAlreadyInDB = helper.initialUsers[0]
      userAlreadyInDB.password = userAlreadyInDB.passwordHash
      delete userAlreadyInDB.passwordHash

      await api.post('/api/users').send(userAlreadyInDB).expect(400)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('🚀 Database connection closed!')
  })
})
