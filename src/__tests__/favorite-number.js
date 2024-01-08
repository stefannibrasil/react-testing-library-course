import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FavoriteNumber} from '../favorite-number'

test('renders a number input with a label "Favorite Number"', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
})

describe('when the number input is invalid', () => {
  test('displays an error message', () => {
    const {rerender} = render(<FavoriteNumber />)
    const input = screen.getByLabelText(/favorite number/i)

    userEvent.type(input, '10')

    expect(screen.getByRole('alert')).toHaveTextContent(
      /the number is invalid/i,
    )

    rerender(<FavoriteNumber max={14} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
