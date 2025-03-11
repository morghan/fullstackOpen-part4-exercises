const blogsRouter = require('express').Router()
const { query } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const allBlogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  res.json(allBlogs)
})

const extractTokenFrom = (request) => {
  const auth = request.get('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', async (req, res) => {
  const { body } = req

  if (!body) {
    return res.status(400).send({ error: 'no info send' })
  }
  try {
    const decodedToken = jwt.verify(extractTokenFrom(req), process.env.SECRET)

    if (!decodedToken) {
      return res.status(401).json({ error: 'invalid token' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      author: body.author,
      title: body.title,
      user: user._id,
      url: body.url,
      likes: body.likes,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'invalid token' })
    }
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
      runValidators: true,
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
