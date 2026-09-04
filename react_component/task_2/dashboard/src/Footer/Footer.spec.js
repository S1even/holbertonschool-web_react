import { render } from '@testing-library/react'
import Footer from './Footer'
import { getCurrentYear } from '../utils/utils'

describe('Footer', () => {
  test('renders the copyright text', () => {
    const { container } = render(<Footer />)

    expect(container.querySelector('p')).toHaveTextContent(
      `Copyright ${getCurrentYear()} - Holberton School`
    )
  })
})
