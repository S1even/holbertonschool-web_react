import { Component } from 'react'

class BodySection extends Component {
  render() {
    const { title, children } = this.props

    return (
      <div className="bodySection">
        <h2>{title}</h2>
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
