import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [statusMessage, setStatusMessage] = useState([0, null])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setStatusMessage([2, 'Invalid username or password'])
      setTimeout(() => {
        setStatusMessage([0,null])
      }, 2000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setStatusMessage([1, `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`])
    setTimeout(() => {
      setStatusMessage([0,null])
    }, 4000)
  }

  const updateLikes = async (blogId, blogObject) => {
    const returnedBlog = await blogService.update(blogId, blogObject)
    setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
    sortBlogs()
  }

  const sortBlogs = () => {
    setBlogs(blogs => [...blogs].sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async (blogId) => {
    await blogService.deleteBlog(blogId)
    setBlogs(blogs.filter(blog => blog.id !== blogId))
  }

  const blogFormRef = useRef()

  return (
    <div>
      {!user &&
        <div>
          <Notification status={statusMessage[0]} message={statusMessage[1]} />
          <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </div>}
      {user &&
        <div>
          <h2>blogs</h2>
          <Notification status={statusMessage[0]} message={statusMessage[1]} />
          {user.name} logged in
          <button onClick={handleLogout}>Logout</button>
          {<Togglable buttonLabel="new blog" ref={blogFormRef}>
            <NewBlogForm createBlog={createBlog} />
          </Togglable>}
          <div data-testid='bloglist'>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} updateLikes={updateLikes} username={user.username} deleteBlog={deleteBlog} />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App
