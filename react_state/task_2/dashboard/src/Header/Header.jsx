import holbertonLogo from '../assets/holberton-logo.jpg'

function Header() {
  return (
    // Rangée sur grand écran, colonne centrée dès que la largeur ne suffit plus.
    <div className="App-header flex items-center pt-2.5 max-[912px]:flex-col max-[912px]:gap-2">
      <img src={holbertonLogo} alt="holberton logo" className="w-60" />
      {/* Le preflight remet les titres à `font-size: inherit` et
          `font-weight: inherit` : taille et graisse sont donc explicites. */}
      <h1 className="text-5xl font-bold text-(--main-color) max-[520px]:text-4xl">
        School Dashboard
      </h1>
    </div>
  )
}

export default Header
