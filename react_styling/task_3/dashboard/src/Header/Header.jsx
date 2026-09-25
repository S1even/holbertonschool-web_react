import holbertonLogo from '../assets/holberton-logo.jpg'

function Header() {
  return (
    <div className="App-header flex items-center pt-2.5">
      <img src={holbertonLogo} alt="holberton logo" className="w-60" />
      {/* Le preflight remet les titres à `font-size: inherit` et
          `font-weight: inherit` : taille et graisse sont donc explicites. */}
      <h1 className="text-5xl font-bold text-(--main-color)">
        School Dashboard
      </h1>
    </div>
  )
}

export default Header
