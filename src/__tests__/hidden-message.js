import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {HiddenMessage} from '../hidden-message'

test('shows hidden message when toggle is clicked', async () => {
  const myMessage = 'meow'
  render(<HiddenMessage>{myMessage}</HiddenMessage>)
  const toggleButton = screen.getByText(/toggle/i)

  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()

  fireEvent.click(toggleButton)

  expect(screen.getByText(myMessage)).toBeInTheDocument()

  fireEvent.click(toggleButton)

  await waitFor(() =>
    expect(screen.queryByText(myMessage)).not.toBeInTheDocument(),
  )
})
