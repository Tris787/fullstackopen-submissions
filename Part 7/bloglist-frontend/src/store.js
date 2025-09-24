import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogsReducer from './reducers/blogsReducer'
import loginFormReducer from './reducers/loginFormReducer'
import userReducer from './reducers/userReducer'
import userDataReducer from './reducers/userDataReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    loginForm: loginFormReducer,
    user: userReducer,
    userData: userDataReducer,
  },
})

export default store
