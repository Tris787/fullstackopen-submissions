import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    status: null,
    message: null,
  },
  reducers: {
    showNotification(state, action) {
      state.status = action.payload.status
      state.message = action.payload.message
    },
    resetNotification() {
      return {
        status: null,
        message: null,
      }
    },
  },
})

export const { showNotification, resetNotification } = notificationSlice.actions

export const setNotification = (status, message, seconds) => {
  return (dispatch) => {
    dispatch(showNotification({ status, message }))
    setTimeout(() => {
      dispatch(resetNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
