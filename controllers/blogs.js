const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const cors = require('cors')
blogsRouter.use(cors())
blogsRouter.use(express.json())


blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1})
      .then(blogs => {
        response.json(blogs)
    })
})
  
blogsRouter.post('/', (request, response) => {
  if (request.body.likes === undefined) {
    request.body.likes = 0
  }
  if (request.body.title === undefined || request.body.url === undefined) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  const blog = new Blog(request.body)
  logger.info(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
  })
})

blogsRouter.delete('/:id', (request, response) => {
  Blog
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
  })
})

blogsRouter.put('/:id', (request, response) => {
  const blog = request.body
  Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(result => {
      response.json(result)
  })
})

module.exports = blogsRouter