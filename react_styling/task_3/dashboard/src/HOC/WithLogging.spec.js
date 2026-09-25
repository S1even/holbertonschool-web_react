import { Component } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import WithLogging from './WithLogging'

class MockApp extends Component {
  render() {
    return <h1>Hello from Mock App Component</h1>
  }
}

const MockAppWithLogging = WithLogging(MockApp)

describe('WithLogging', () => {
  let consoleSpy

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    consoleSpy.mockRestore()
  })

  test('renders the wrapped component', () => {
    render(<MockAppWithLogging />)

    expect(
      screen.getByRole('heading', { name: /hello from mock app component/i })
    ).toBeInTheDocument()
  })

  test('logs that the wrapped component is mounted', () => {
    render(<MockAppWithLogging />)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/component mockapp is mounted/i)
    )
  })

  test('logs that the wrapped component is going to unmount', () => {
    const { unmount } = render(<MockAppWithLogging />)

    // Nothing about unmounting is logged while the component is still there.
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/going to unmount/i)
    )

    unmount()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/component mockapp is going to unmount/i)
    )
  })

  test('names itself after the component it wraps', () => {
    expect(MockAppWithLogging.displayName).toBe('WithLogging(MockApp)')
  })

  test('falls back to Component for an element with no name', () => {
    const Anonymous = WithLogging(() => <p>anonymous</p>)

    const { unmount } = render(<Anonymous />)

    expect(Anonymous.displayName).toBe('WithLogging(Component)')
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/component component is mounted/i)
    )

    unmount()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/component component is going to unmount/i)
    )
  })

  test('passes its props down to the wrapped component', () => {
    const Greeting = ({ name }) => <p>Hello {name}</p>
    const GreetingWithLogging = WithLogging(Greeting)

    render(<GreetingWithLogging name="Holberton" />)

    expect(screen.getByText(/hello holberton/i)).toBeInTheDocument()
  })
})
