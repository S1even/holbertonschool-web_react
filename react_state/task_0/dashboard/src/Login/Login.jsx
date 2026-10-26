import WithLogging from '../HOC/WithLogging'

function Login() {
  return (
    <div className="App-login border-t-4 border-(--main-color) h-120 max-[912px]:h-115 pt-5 pl-10 text-lg max-[912px]:pl-1">
      <p className="text-xl mb-8">
        Login to access the full dashboard
      </p>
      {/* Rangée sur grand écran ; sur mobile chaque étiquette passe au-dessus
          de son champ, d'où la colonne et l'alignement à gauche. */}
      <div className="flex items-center gap-2 max-[912px]:flex-col max-[912px]:gap-0 max-[912px]:items-start">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="border border-black rounded-xs px-2 py-0 max-[912px]:w-60 max-[912px]:mb-1.5"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="border border-black rounded-xs px-2 py-0 max-[912px]:w-60 max-[912px]:mb-1.5"
        />
        <button
          type="submit"
          className="border border-black rounded-xs px-1 py-0"
        >
          OK
        </button>
      </div>
    </div>
  )
}

// Exported wrapped, so every mount and unmount of the form is logged.
const LoginWithLogging = WithLogging(Login)

export default LoginWithLogging
