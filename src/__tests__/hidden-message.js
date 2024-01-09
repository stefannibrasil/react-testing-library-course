import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {HiddenMessage} from '../hidden-message'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props) => (props.in ? props.children : null),
  }
})

test('shows hidden message when toggle is clicked', () => {
  const myMessage = 'meow'
  render(<HiddenMessage>{myMessage}</HiddenMessage>)
  const toggleButton = screen.getByText(/toggle/i)

  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()

  fireEvent.click(toggleButton)

  expect(screen.getByText(myMessage)).toBeInTheDocument()

  fireEvent.click(toggleButton)

  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()
})
