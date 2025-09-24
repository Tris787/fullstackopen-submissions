import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import { createBlog } from '../reducers/blogsReducer'

const Bloglist = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)

  const handleCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  const blogFormRef = useRef()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      {
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <NewBlogForm createBlog={handleCreate} />
        </Togglable>
      }
      <div data-testid="bloglist">
        {blogs.map((blog) => (
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bloglist
