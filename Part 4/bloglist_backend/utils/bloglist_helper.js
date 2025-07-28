const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs) {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  } else {
    return 0
  }
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs
    .filter(blog => blog.likes === maxLikes)
    .map(blog => blog.title)
}

const mostBlogs = (blogs) => {
  const counts = _.countBy(blogs, 'author')
  // eslint-disable-next-line no-unused-vars
  const topEntry = _.maxBy(_.entries(counts), ([_, count]) => count)

  return {
    author: topEntry[0],
    blogs: topEntry[1]
  }
}

const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs, 'author')
  const mostLikes = _.maxBy(
    _.map(grouped, (blog, author) => ({
      author,
      likes: _.sumBy(blog, 'likes')
    })),
    'likes'
  )

  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}