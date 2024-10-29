const blogsRouter = require('express').Router()
const { query } = require('express')
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

blogsRouter.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { author, title, url, likes } = req.body
  const blog = { author, title, url, likes }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
      runValidators: true
    })
    if (!updatedBlog) {
      res.status(404).end()
    } else {
      res.status(201).json(updatedBlog)
    }
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
})

module.exports = blogsRouter
