import * as React from 'react'
import {fireEvent, screen, render} from '@testing-library/react'
import {reportError as mockReportError} from '../api'
import {ErrorBoundary} from '../error-boundary'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error')
})

afterAll(() => {
  jest.restoreAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('💣')
  } else {
    return null
  }
}

test('calls reportError and displays a try again message', () => {
  mockReportError.mockResolvedValueOnce({success: true})
  const {rerender} = render(<Bomb />, {wrapper: ErrorBoundary})

  expect(mockReportError).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()

  rerender(<Bomb shouldThrow={true} />)

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )
  expect(console.error).toHaveBeenCalledTimes(2)

  console.error.mockClear()
  mockReportError.mockClear()

  rerender(<Bomb />)

  fireEvent.click(screen.getByText(/try again/i))

  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
})

// this is only here to make the error output not appear in the project's output
// even though in the course we don't include this bit and leave it in it's incomplete state.
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

/*
eslint
  jest/prefer-hooks-on-top: off
*/
