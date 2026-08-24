import { render } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  test('renders without crashing', () => {
    render(<Header />)
  })
})
