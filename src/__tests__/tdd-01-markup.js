import * as React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {build, fake, sequence} from 'test-data-bot'
import {Editor} from '../post-editor-01-markup'
import {savePost as mockSavePost} from '../api'

jest.mock('../api')

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

const postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.word(), f.lorem.word()]),
})

const userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
})

test('renders a form with title, content, tags, and a submit button', () => {
  mockSavePost.mockResolvedValueOnce()
  const fakeUser = userBuilder()
  render(<Editor user={fakeUser} />)
  const fakePost = postBuilder()
  const preDate = new Date().getTime()
  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags
  screen.getByText(/submit/i)
  const submitButton = screen.getByText(/submit/i)

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    authorId: fakeUser.id,
    date: expect.any(String),
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  const postDate = new Date().getTime()
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()

  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)
})

test('renders the error message from the server', async () => {
  const testError = 'meow error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})
  const fakeUser = userBuilder()
  render(<Editor user={fakeUser} />)
  const submitButton = screen.getByText(/submit/i)

  fireEvent.click(submitButton)

  const postError = await screen.findByRole('alert')

  expect(postError).toHaveTextContent(testError)
  expect(submitButton).toBeEnabled()
})

// disabling this rule for now. We'll get to this later
/*
eslint
  testing-library/prefer-explicit-assert: "off",
*/
