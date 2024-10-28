const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const allBlogs = await Blog.find({})
  res.json(allBlogs)
})

blogsRouter.post('/', async (req, res) => {
  const { body } = req
  if (!body) {
    return res.status(400).send({ error: 'no info send' })
  }

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  })

  try {
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
})

module.exports = blogsRouter
