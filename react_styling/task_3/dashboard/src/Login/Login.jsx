import WithLogging from '../HOC/WithLogging'

function Login() {
  return (
    <div className="App-login border-t-4 border-(--main-color) h-120 pt-5 pl-10 text-lg">
      <p className="text-xl mb-8">Login to access the full dashboard</p>
      {/* Le formulaire est une rangée flex, plutôt qu'une suite d'éléments en
          ligne. Les champs et le bouton retrouvent la bordure que le preflight
          leur avait retirée. */}
      <div className="flex items-center gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="border border-black rounded-xs px-2 py-0"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="border border-black rounded-xs px-2 py-0"
        />
        <button type="submit" className="border border-black rounded-xs px-1 py-0">
          OK
        </button>
      </div>
    </div>
  )
}

// Exported wrapped, so every mount and unmount of the form is logged.
const LoginWithLogging = WithLogging(Login)

export default LoginWithLogging
