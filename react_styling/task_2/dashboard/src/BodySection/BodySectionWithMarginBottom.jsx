import { Component } from 'react'
import './BodySectionWithMarginBottom.css'
import BodySection from './BodySection'

class BodySectionWithMarginBottom extends Component {
  render() {
    // Every prop is handed down, children included, so the wrapper stays agnostic.
    return (
      <div className="bodySectionWithMargin">
        <BodySection {...this.props} />
      </div>
    )
  }
}

export default BodySectionWithMarginBottom
