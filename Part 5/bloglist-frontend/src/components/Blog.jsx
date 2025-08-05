/* eslint-disable react/prop-types */
import { useState } from 'react'

const Blog = ({ blog, updateLikes, username, deleteBlog }) => {

  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const paragraphStyle = {
    margin: 0
  }

  const divLikeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const handleLike = () => {
    const updateBlogId = blog.id
    const updateBlogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateLikes(updateBlogId, updateBlogObject)
  }

  const handleDeleteBlog = () => {
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirmDelete) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'show'}
        </button>

        {detailsVisible && (
          <div>
            <p style={paragraphStyle}>{blog.url}</p>
            <div style={divLikeStyle}>
              <p style={paragraphStyle}>{blog.likes}</p>
              <button onClick={handleLike}>like</button>
            </div>
            <p style={paragraphStyle}>{blog.user.name}</p>
            { (username === blog.user.username) && (
              <button onClick={handleDeleteBlog}>delete</button>
            )}
          </div>
        )}
      </div>
    </div>
  )}

export default Blog
