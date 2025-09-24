const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes, id } = request.body
  console.log(request.body)
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    id: id,
    user: request.user.id,
  })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response
    .status(201)
    .json(await savedBlog.populate('user', { username: 1, name: 1 }))
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== request.user.id) {
    //decodedToken.id) {
    return response
      .status(403)
      .json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(await updatedBlog.populate('user', { username: 1, name: 1 }))
})

blogsRouter.post('/:id/comments', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  console.log(req.params)
  if (!blog) return res.status(404).json({ error: 'Blog not found' })

  const comment = new Comment({
    content: req.body.content,
    blog: blog._id,
  })

  const savedComment = await comment.save()
  res.status(201).json(savedComment)
})

blogsRouter.get('/:id/comments', async (req, res) => {
  const comments = await Comment.find({ blog: req.params.id })
  res.json(comments)
})

module.exports = blogsRouter
