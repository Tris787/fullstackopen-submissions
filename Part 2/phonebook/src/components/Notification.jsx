const Notification = ({ status, message }) => {
  if (message === null) {
    return null
  }

  const getMessageStyle = status => {
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
      2: 'red'
    }

    return {
      ...baseStyle, color: statusColor[status] || 'black'
    }
  }

  return(
    <div style={getMessageStyle(status)}>
      {message}
    </div>
  )

}

export default Notification
