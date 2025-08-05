import { render, screen } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import userEvent from '@testing-library/user-event'

test('<NewBlogForm /> calls createBlog with correct input', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<NewBlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  await user.type(inputs[0], 'Testblog')
  await user.type(inputs[1], 'Testauthor')
  await user.type(inputs[2], 'www.test.de')
  await user.click(createButton)

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls[0][0].title).toBe('Testblog')
  expect(createBlog.mock.calls[0][0].author).toBe('Testauthor')
  expect(createBlog.mock.calls[0][0].url).toBe('www.test.de')
})

