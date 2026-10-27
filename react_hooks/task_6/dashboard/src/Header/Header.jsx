import holbertonLogo from '../assets/holberton-logo.jpg'

// L'utilisateur et la déconnexion viennent d'App, par les props. Sans
// utilisateur, la section de déconnexion n'est simplement pas affichée.
function Header({ user, logOut }) {

  return (
    <>
      {/* Rangée sur grand écran, colonne centrée dès que la largeur ne
          suffit plus. */}
      <div className="App-header flex items-center pt-2.5 max-[912px]:flex-col max-[912px]:gap-2">
        <img src={holbertonLogo} alt="holberton logo" className="w-60" />
        {/* Le preflight remet les titres à `font-size: inherit` et
            `font-weight: inherit` : taille et graisse sont donc explicites. */}
        <h1 className="text-5xl font-bold text-(--main-color) max-[520px]:text-4xl">
          School Dashboard
        </h1>
      </div>
      {user?.isLoggedIn && (
        <div id="logoutSection" className="mt-2">
          {/* L'email dans son propre élément : il se retrouve tel quel, comme
              dans la solution du staff. */}
          Welcome <b>{user.email}</b> (
          <a
            href="#"
            className="cursor-pointer italic"
            onClick={(event) => {
              // Le lien ne navigue nulle part : seul l'appel compte.
              event.preventDefault()
              if (logOut) logOut()
            }}
          >
            logout
          </a>
          )
        </div>
      )}
    </>
  )
}

export default Header
