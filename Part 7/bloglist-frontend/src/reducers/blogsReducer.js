import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      const sortedBlogs = [...action.payload].sort((a, b) => b.likes - a.likes)
      return sortedBlogs
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      const updatedBloglist = state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog,
      )
      return [...updatedBloglist].sort((a, b) => b.likes - a.likes)
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.create(blogObject)
    dispatch(appendBlog(returnedBlog))
    dispatch(
      setNotification(
        1,
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        5,
      ),
    )
  }
}

export const updateLikes = (blogId, blogObject) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.update(blogId, blogObject)
    dispatch(updateBlog(returnedBlog))
  }
}

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blogId)
    dispatch(removeBlog(blogId))
  }
}

export default blogsSlice.reducer
