/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { deleteBlog, updateLikes } from '../reducers/blogsReducer'
import blogService from '../services/blogs'

const Blog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { id } = useParams()
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const username = useSelector((state) => state.user.username)

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const loadComments = async () => {
      const comments = await blogService.getBlogComments(id)
      setComments(comments)
    }
    loadComments()
  }, [])

  const paragraphStyle = {
    margin: 0,
  }

  const divLikeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const handleLike = () => {
    const updateBlogId = blog.id
    const updateBlogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    dispatch(updateLikes(updateBlogId, updateBlogObject))
  }

  const handleDeleteBlog = () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    )
    if (confirmDelete) {
      dispatch(deleteBlog(blog.id))
      navigate('/')
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    const newCommentObject = {
      content: newComment,
    }
    const response = await blogService.createBlogComment(id, newCommentObject)
    setComments((prevComments) => [...prevComments, response])
    setNewComment('')
  }

  if (!blog) return <p>Blog not found</p>

  return (
    <div>
      <div>
        <h1>{`${blog.title} - ${blog.author}`}</h1>
        <a
          href={blog.url.startsWith('http') ? blog.url : `https://${blog.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blog.url}
        </a>
        <div style={divLikeStyle}>
          <p style={paragraphStyle}>{`${blog.likes} likes`}</p>
          <button onClick={handleLike}>like</button>
        </div>
        <p>{`added by ${blog.user.username}`}</p>
        {username === blog.user.username && (
          <button onClick={handleDeleteBlog}>delete</button>
        )}
        <h1>comments</h1>
        <form onSubmit={addComment}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              data-testid="title"
              type="text"
              value={newComment}
              onChange={({ target }) => setNewComment(target.value)}
            />
            <button type="submit">add comment</button>
          </div>
        </form>
        <ul>
          {comments.map((c) => (
            <li key={c.id}>{c.content}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog
