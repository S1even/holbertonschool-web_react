import { useContext } from 'react'
import newContext from '../Context/context'
import { getCurrentYear, getFooterCopy } from '../utils/utils'

function Footer() {
  // Le hook abonne le pied de page au contexte : il se redessine à chaque
  // changement d'utilisateur.
  const { user } = useContext(newContext)

  return (
    // `mt-auto` colle le pied de page au bas de la colonne flex ouverte par App.
    <div className="App-footer mt-auto border-t-4 border-(--main-color) p-4 max-[912px]:p-2 text-center">
      <p className="text-xl italic max-[912px]:text-base">
        Copyright {getCurrentYear()} - {getFooterCopy(false)}
      </p>
      {user && user.isLoggedIn && (
        <p>
          <a href="#" className="underline">
            Contact us
          </a>
        </p>
      )}
    </div>
  )
}

export default Footer
