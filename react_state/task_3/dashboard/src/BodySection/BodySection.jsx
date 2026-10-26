import { Component } from 'react'

class BodySection extends Component {
  render() {
    const { title, children } = this.props

    return (
      <div className="bodySection">
        {/* Comme pour le h1 du Header, le preflight impose de redonner au
            titre sa taille et sa graisse. */}
        <h2 className="text-xl font-bold">{title}</h2>
        {children}
      </div>
    )
  }
}

BodySection.defaultProps = {
  title: '',
  children: null,
}

export default BodySection
