import * as React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {Editor} from '../post-editor-01-markup'

test('renders a form with title, content, tags, and a submit button', () => {
  render(<Editor />)
  screen.getByLabelText(/title/i)
  screen.getByLabelText(/content/i)
  screen.getByLabelText(/tags/i)
  screen.getByText(/submit/i)

  const submitButton = screen.getByText(/submit/i)

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
})

// disabling this rule for now. We'll get to this later
/*
eslint
  testing-library/prefer-explicit-assert: "off",
*/
