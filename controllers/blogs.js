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
      .then(blogs => {
        response.json(blogs)
    })
})
  
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    logger.info(request.body)
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
    })
})

module.exports = blogsRouter