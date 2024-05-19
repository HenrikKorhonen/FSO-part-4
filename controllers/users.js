const bcrypt = require('bcrypt')
const cors = require('cors')
const User = require('../models/user')
const logger = require('../utils/logger')
const express = require('express')
const usersRouter = express.Router()
usersRouter.use(cors())
usersRouter.use(express.json())


usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'password is shorter than 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    user.save().then(savedUser => {
        response.status(201).json(savedUser)
    }).catch((err) => {
        next(err)
    })
})

module.exports = usersRouter