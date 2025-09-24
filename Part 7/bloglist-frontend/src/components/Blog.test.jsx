import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('render only name and author', () => {
  const blog = {
    author: 'Testuser',
    id: '123456',
    likes: 10,
    title: 'Testblog',
    url: 'www.test.de',
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testuser', { exact: false })

  expect(element).toBeDefined()
  expect(element).toHaveTextContent('Testblog')
  expect(element).not.toHaveTextContent('www.test.de')
})

test('clicking the button to show blog details', async () => {
  const blog = {
    author: 'Testuser',
    id: '123456',
    likes: 10,
    title: 'Testblog',
    url: 'www.test.de',
    user: {
      name: 'tom',
    },
  }
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)
  const urlElement = screen.getByText('www.test.de')
  const likeElement = screen.getByText('10')

  expect(urlElement).toBeDefined()
  expect(likeElement).toBeDefined()
})

test('two times clicking the like button calls the event handler twice', async () => {
  const blog = {
    author: 'Testuser',
    id: '123456',
    likes: 10,
    title: 'Testblog',
    url: 'www.test.de',
    user: {
      name: 'tom',
    },
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} updateLikes={mockHandler} />)
  const user = userEvent.setup()
  const detailButton = screen.getByText('show')
  await user.click(detailButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
