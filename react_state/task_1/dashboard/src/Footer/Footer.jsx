import { getCurrentYear, getFooterCopy } from '../utils/utils'

function Footer() {
  return (
    // `mt-auto` colle le pied de page au bas de la colonne flex ouverte par App.
    <div className="App-footer mt-auto border-t-4 border-(--main-color) p-4 max-[912px]:p-2 text-center">
      <p className="text-xl italic max-[912px]:text-base">
        Copyright {getCurrentYear()} - {getFooterCopy(false)}
      </p>
    </div>
  )
}

export default Footer
