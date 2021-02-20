const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(2)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'test',
    author: 'Author',
    url: 'www.eine-url.de',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain(
    'test'
  )
})

test('unique identifier property of blog posts is named id', async () => {

  const response = await api.get('/api/blogs')

  response.body.forEach(b => {
    expect(b.id).toBeDefined()
  });  
})


test('likes default value is 0', async () => {
  const newBlog = {
    title: 'test',
    author: 'Author',
    url: 'www.eine-url.de'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.filter(b => b.title === newBlog.title)
  expect(titles).toHaveLength(1)
  expect(titles[0].likes).toBe(0)
})

test('title property is missing, backend responds with 400', async () => {
  const newBlog = {
    author: 'Author',
    url: 'www.eine-url.de'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('url property is missing, backend responds with 400', async () => {
  const newBlog = {
    title: 'test',
    author: 'Author'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})




describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating likes of a blog', () => {
  test('succeeds with status code 200', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const updatedlog = {
      title: 'test',
      author: 'Author',
      likes: 123
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const blogs = blogsAtEnd.filter(r => r.id === blogToUpdate.id)
    expect(blogs).toHaveLength(1)
    expect(blogs[0].likes).toBe(updatedlog.likes)
  })
})


afterAll(() => {
  mongoose.connection.close()
})