const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  author: String,
  title: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
