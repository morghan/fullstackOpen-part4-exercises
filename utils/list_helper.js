const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const numberOfBlogs = blogs.length
  if (numberOfBlogs > 0) {
    if (numberOfBlogs === 1) {
      return blogs[0].likes
    } else {
      const reducer = (previous, current) => {
        return previous + current.likes
      }
      const totalLikes = blogs.reduce(reducer, 0)
      return totalLikes
    }
  } else {
    return 0
  }
}

const favoriteBlog = (blogs) => {
  const numberOfBlogs = blogs.length
  if (numberOfBlogs > 0) {
    if (numberOfBlogs === 1) {
      return blogs[0]
    } else {
      const reducer = (previous, current) => {
        return current.likes > previous.likes ? current : previous
      }
      const favoriteBlog = blogs.reduce(reducer)

      return favoriteBlog
    }
  } else {
    return null
  }
}

module.exports = { dummy, totalLikes, favoriteBlog }
