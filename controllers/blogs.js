const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


// GET
blogsRouter.get('/', async  (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// POST
blogsRouter.post('/', async  (request, response) => {
  const body = request.body

  if(!body.title || !body.url){
    response.status(400).end()
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0
  })

  const savedBlog = await blog.save()
  response.json(savedBlog)
})

// DELETE
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// PUT
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body  

    const oldBlog = await Blog.findById(request.params.id)
    const updatedBlog = {
        title: body.title ? body.title : oldBlog.title,
        author: body.author ? body.author : oldBlog.author,
        url: body.url ? body.url : oldBlog.url,
        likes: body.likes ? body.likes : oldBlog.likes,
    }

    const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    response.json(blog.toJSON())

})


module.exports = blogsRouter