import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return null
    }    
  }
})

export const { showNotification, resetNotification } = notificationSlice.actions

export const setNotification = (notification, seconds) => {
  return dispatch => {
    dispatch(showNotification(`you voted for '${notification}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
