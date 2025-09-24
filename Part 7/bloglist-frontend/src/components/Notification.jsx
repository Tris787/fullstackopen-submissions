/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  const getMessageStyle = (status) => {
    const baseStyle = {
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }

    const statusColor = {
      1: 'green',
      2: 'red',
    }

    return {
      ...baseStyle,
      color: statusColor[status] || 'black',
    }
  }

  if (notification.status === null) {
    return null
  }

  return (
    <div style={getMessageStyle(notification.status)}>
      {notification.message}
    </div>
  )
}

export default Notification
