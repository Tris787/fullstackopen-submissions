import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { username: '', name: '', token: '' },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload
    },
    setName(state, action) {
      state.name = action.payload
    },
    setToken(state, action) {
      state.token = action.payload
    },
    setUser(state, action) {
      state.username = action.payload.username
      state.name = action.payload.name
      state.token = action.payload.token
    },
    resetUser(state) {
      state.username = ''
      state.name = ''
      state.token = ''
    },
  },
})

export const { setUsername, setName, setToken, setUser, resetUser } =
  userSlice.actions

export default userSlice.reducer
