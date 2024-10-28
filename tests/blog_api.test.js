const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./blog_api_test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const { title } = require('node:process')

const api = supertest(app)

describe('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promises = blogObjects.map((blog) => blog.save())
    await Promise.all(promises)

    console.log('🚀 ~ Database reset with initial test data')
  })

  test('Blogs are returned as JSON', async () => {
    const blogsInStart = await helper.blogsInDb()
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogsInStart.length)
  })

  test('Unique identifier of blogs is named "id"', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert('id' in blogs[0])
  })

  test('A new blog can be created', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      author: 'Jerzon',
      title: 'Web dev is fun',
      url: 'x.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, blogsAtStart.length + 1)

    const blogTitles = response.body.map((blog) => blog.title)

    assert(blogTitles.includes('Web dev is fun'))
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('🚀 ~ Database connection closed')
  })
})
