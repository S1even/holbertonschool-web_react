import { Component } from 'react'

// Falls back to Component when the wrapped element carries no name of its own.
const getDisplayName = (WrappedComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

function WithLogging(WrappedComponent) {
  const name = getDisplayName(WrappedComponent)

  class WithLoggingComponent extends Component {
    componentDidMount() {
      console.log(`Component ${name} is mounted`)
    }

    componentWillUnmount() {
      console.log(`Component ${name} is going to unmount`)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WithLoggingComponent.displayName = `WithLogging(${name})`

  return WithLoggingComponent
}

export default WithLogging
