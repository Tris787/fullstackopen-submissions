/* eslint-disable react/prop-types */
import { setUsername, setPassword } from '../reducers/loginFormReducer'
import { useDispatch, useSelector } from 'react-redux'

const LoginForm = ({ handleLogin }) => {
  const dispatch = useDispatch()
  const username = useSelector((state) => state.username)
  const password = useSelector((state) => state.password)

  return (
    <div>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            onChange={({ target }) => dispatch(setUsername(target.value))}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => dispatch(setPassword(target.value))}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
