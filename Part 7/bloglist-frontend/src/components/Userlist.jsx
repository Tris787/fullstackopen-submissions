import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Userlist = () => {
  const userData = useSelector((state) => state.userData)

  const baseStyle = {
    paddingRight: '10px',
  }

  const baseFlex = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  }

  return (
    <div>
      <h2>Users</h2>
      <p>
        <b>blogs created</b>
      </p>

      <div>
        {userData.map((user) => (
          <div key={user.id} style={baseFlex}>
            <Link to={`/users/${user.id}`} style={baseStyle}>
              {user.username}
            </Link>
            <p>{user.blogs.length}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Userlist
