import { getCurrentYear, getFooterCopy } from '../utils/utils'

function Footer() {
  return (
    // `mt-auto` colle le pied de page au bas de la colonne flex ouverte par
    // `#root`, quelle que soit la hauteur du contenu.
    <div className="App-footer mt-auto border-t-4 border-(--main-color) p-4 text-center">
      <p className="text-xl italic">
        Copyright {getCurrentYear()} - {getFooterCopy(true)}
      </p>
    </div>
  )
}

export default Footer
