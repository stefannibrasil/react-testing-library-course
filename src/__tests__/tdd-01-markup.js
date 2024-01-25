import * as React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
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

function renderEditor() {
  const fakeUser = userBuilder()
  render(<Editor user={fakeUser} />)
  const fakePost = postBuilder()
  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags
  screen.getByText(/submit/i)
  const submitButton = screen.getByText(/submit/i)

  return {
    submitButton,
    fakeUser,
    fakePost,
  }
}

test('renders a form with title, content, tags, and a submit button', async () => {
  const promise = Promise.resolve()
  jest.fn(() => promise)
  mockSavePost.mockResolvedValueOnce()
  const preDate = new Date().getTime()

  const {submitButton, fakePost, fakeUser} = renderEditor()

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

  await act(async () => {
    await promise
  })
})

test('renders the error message from the server', async () => {
  const testError = 'meow error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})

  const {submitButton} = renderEditor()

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
