import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const userDataSlice = createSlice({
  name: 'userData',
  initialState: [],
  reducers: {
    setUserData(state, action) {
      return action.payload
    },
  },
})

export const { setUserData } = userDataSlice.actions

export const initializeUserData = () => {
  return async (dispatch) => {
    const userData = await userService.getAll()
    dispatch(setUserData(userData))
  }
}

export default userDataSlice.reducer
