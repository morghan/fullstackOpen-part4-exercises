const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./blog_api_test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

describe('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promises = blogObjects.map((blog) => blog.save())
    await Promise.all(promises)

    console.log('🚀 ~ Database reset with initial test data')
  })

  test('blogs are returned as JSON', async () => {
    const blogsInStart = await helper.blogsInDb()
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogsInStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('🚀 ~ Database connection closed')
  })
})
