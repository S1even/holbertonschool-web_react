import newContext from '../Context/context'
import { getCurrentYear, getFooterCopy } from '../utils/utils'

// Nommé en capitale : ESLint, sans plugin React, ne reconnaît comme utilisée
// en JSX qu'une variable qui commence par une majuscule.
const ContextConsumer = newContext.Consumer

function Footer() {
  return (
    // `mt-auto` colle le pied de page au bas de la colonne flex ouverte par App.
    <div className="App-footer mt-auto border-t-4 border-(--main-color) p-4 max-[912px]:p-2 text-center">
      <p className="text-xl italic max-[912px]:text-base">
        Copyright {getCurrentYear()} - {getFooterCopy(false)}
      </p>
      {/* Le Consumer abonne le pied de page au contexte sans en faire une
          classe : il se redessine à chaque changement d'utilisateur. */}
      <ContextConsumer>
        {({ user }) =>
          user && user.isLoggedIn && (
            <p>
              <a href="#" className="underline">
                Contact us
              </a>
            </p>
          )
        }
      </ContextConsumer>
    </div>
  )
}

export default Footer
