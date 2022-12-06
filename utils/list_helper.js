const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  console.log('🚀 > totalLikes > blogs', blogs)
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
  console.log('🚀 > favoriteBlog > blogs', blogs)
  const numberOfBlogs = blogs.length
  if (numberOfBlogs > 0) {
    if (numberOfBlogs === 1) {
      return {
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes,
      }
    } else {
      const reducer = (previous, current) => {
        console.log('🚀 > reducer > previous', previous)
        console.log('🚀 > reducer > current', current)

        return current.likes > previous.likes ? current : previous
      }
      const favoriteBlog = blogs.reduce(reducer)

      return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes,
      }
    }
  } else {
    return 'none'
  }
}

module.exports = { dummy, totalLikes, favoriteBlog }
