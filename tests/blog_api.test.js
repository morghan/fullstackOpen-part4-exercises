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

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const blogTitles = blogsAtEnd.map((blog) => blog.title)
      assert(!blogTitles.includes(blogToDelete.title))
    })
  })

  describe('update a blog', () => {
    test('update likes succeeds with status 201 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      let blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes++

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes)
    })

    test('fails with status code 404 for non existing id', async () => {
      const nonExistingId = await helper.nonExistingId()

      await api.put(`/api/blogs/${nonExistingId}`).send({}).expect(404)
    })
  })

  after(async () => {
    await mongoose.connection.close()
    console.log('🚀 ~ Database connection closed')
  })
})
