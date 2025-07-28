const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('general functionality', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok('id' in blog)
    })
  })
})

describe('adding a blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const newUser = {
      username: 'Tris',
      name: 'Tom',
      password: '12345',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'Tris', password: '12345' })

    token = loginResponse.body.token
  })

  test('blog with content can be added', async () => {
    const newBlog =   {
      title: 'Test Blog',
      author: 'Edsger W. Dijkstra',
      url: 'http:/test.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('Test Blog'))
  })

  test('if the likes property is missing, the default is 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Edsger W. Dijkstra',
      url: 'http:/test.html',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const foundBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(foundBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog =   {
      author: 'Edsger W. Dijkstra',
      url: 'http:/test.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog =   {
      title: 'Test blog',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  test('blog without token can not be added', async () => {
    const newBlog =   {
      title: 'Test Blog',
      author: 'Edsger W. Dijkstra',
      url: 'http:/test.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const newUser = {
      username: 'Tris',
      name: 'Tom',
      password: '12345',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'Tris', password: '12345' })

    token = loginResponse.body.token
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const newBlog = {
      title: 'Blog zum Löschen',
      author: 'Tom Tester',
      url: 'http://delete.me',
      likes: 5,
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const title = blogsAtEnd.map(n => n.title)

    assert(!title.includes(newBlog.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('failed with status code 400 because unvalid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    await api.delete('/api/blogs/687a02c2').set('Authorization', `Bearer ${token}`).expect(400)

    assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 200 if entry exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes += 1

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes)
  })
})

describe('new user creation', () => {
  test('succeeds with proper username and password', async () => {
    await User.deleteMany({})
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Tris',
      name: 'Tom',
      password: '12345',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))

  })

  test('fails with password too short', async () => {
    await User.deleteMany({})
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Tris',
      name: 'Tom',
      password: '1',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with username too short', async () => {
    await User.deleteMany({})
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'T',
      name: 'Tom',
      password: '1233',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with username not unique', async () => {
    await User.deleteMany({})
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'Tris',
      name: 'Tom',
      password: '1233',
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newUser2 = {
      username: 'Tris',
      name: 'Tom',
      password: '1233',
    }

    await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
