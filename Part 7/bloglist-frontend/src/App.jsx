/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Bloglist from './components/Bloglist'
import Userlist from './components/Userlist'
import UserView from './components/UserView'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogsReducer'
import { resetForm } from './reducers/loginFormReducer'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, setUser } from './reducers/userReducer'
import { initializeUserData } from './reducers/userDataReducer'
import Blog from './components/Blog'
import Menu from './components/Menu'
import { Container } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUserData())
  }, [])

  const username = useSelector((state) => state.loginForm.username)
  const password = useSelector((state) => state.loginForm.password)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(resetForm())
    } catch (exception) {
      dispatch(setNotification(2, 'Invalid username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(resetUser())
  }

  return (
    <Container>
      <div>
        {!user.username && (
          <div>
            <Notification />
            <LoginForm handleLogin={handleLogin} />
          </div>
        )}
        {user.username && (
          <div>
            <h2>blogs</h2>
            <Notification />
            <Menu user={user.username} handleLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Bloglist />} />
              <Route path="/users/" element={<Userlist />} />
              <Route path="/users/:id" element={<UserView />} />
              <Route path="/blogs/:id" element={<Blog />} />
            </Routes>
          </div>
        )}
      </div>
    </Container>
  )
}

export default App
