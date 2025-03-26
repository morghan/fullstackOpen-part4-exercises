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

blogsRouter.post('/', async (req, res) => {
  const { body } = req

  if (!body) {
    return res.status(400).send({ error: 'no info send' })
  }
  try {
    // tokenExtractor middleware adds `token` property to the request object
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken) {
      return res.status(401).json({ error: 'invalid token' })
    }
    // userExtractor middleware adds `user` property to the request object
    const user = req.user

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
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken) {
      return res.status(401).json({ error: 'invalid token' })
    }

    const blogToDelete = await Blog.findById(req.params.id)
    if (!blogToDelete) {
      return res.status(400).json({ error: 'invalid blog id' })
    }
    const blogUserId = blogToDelete.user.toString()
    const tokenId = decodedToken.id

    if (blogUserId !== tokenId) {
      return res.status(401).json({
        error: 'Invalid user. Can not delete a blog that is not yours!',
      })
    }
    // Delete Blog
    await Blog.findByIdAndDelete(req.params.id)

    // Remove deleted Blog from User's blog list
    // user is added to the request object from tokenExtractor and userExtractor middlewares
    const user = req.user
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== req.params.id
    )
    await user.save()

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
