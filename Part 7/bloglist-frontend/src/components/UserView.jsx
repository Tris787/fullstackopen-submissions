import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserView = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.userData.find((u) => u.id === id))

  if (!user) return <p>User not found</p>

  console.log(user.blogs)

  return (
    <div>
      <h2>{user.username}</h2>
      <b>added blogs</b>
      <ul>
        {user.blogs.map((blog) => (
          <div key={blog.id}>
            <li>{blog.title}</li>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default UserView
