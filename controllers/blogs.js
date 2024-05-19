const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const cors = require('cors')
blogsRouter.use(cors())
blogsRouter.use(express.json())

const authenticate = (request, response, next) => {
  if (request.user === undefined) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  else {
    next()
  }
}

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1})
      .then(blogs => {
        response.json(blogs)
    })
})
  
blogsRouter.post('/', authenticate, async (request, response, next) => {
  request.body.user = request.user._id

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

blogsRouter.delete('/:id', authenticate, (request, response) => {
  Blog
    .findById(request.params.id)
    .then(result => {
      if (result.user.toString() === request.user._id.toString()) {
        Blog
          .findByIdAndRemove(request.params.id)
          .then(result => {
            return response.status(204).end()
        })
      }
      else {
        return response.status(403).json({ error: 'forbidden' })
      }
  })
})

blogsRouter.put('/:id', authenticate, (request, response) => {
  request.body.user = request.user._id
  const blog = request.body
  Blog
    .findById(request.params.id)
    .then(result => {
      if (result.user.toString() === request.user._id.toString()) {
        Blog
          .findByIdAndUpdate(request.params.id, blog, { new: true })
          .then(result => {
            return response.json(result)
        })
      }
      else {
        return response.status(403).json({ error: 'forbidden' })
      }
  })
})

module.exports = blogsRouter