import './Login.css'
import WithLogging from '../HOC/WithLogging'

function Login() {
  return (
    <div className="App-login">
      <p>Login to access the full dashboard</p>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" />
      <button type="submit">OK</button>
    </div>
  )
}

// Exported wrapped, so every mount and unmount of the form is logged.
const LoginWithLogging = WithLogging(Login)

export default LoginWithLogging
