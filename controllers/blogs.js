const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
  Blog.find({}).then((allBlogs) => {
    res.json(allBlogs)
  })
})

blogsRouter.post('/', (req, res) => {
  const { body } = req
  if (!body) {
    return res.status(400).send({ error: 'no info send' })
  }

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  })

  blog
    .save()
    .then((savedBlog) => {
      res.status(201).json(savedBlog)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).end()
    })
})

module.exports = blogsRouter
