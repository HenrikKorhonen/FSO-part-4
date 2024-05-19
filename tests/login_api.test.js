const mongoose = require('mongoose')
const supertest = require('supertest')
const {app} = require('../app')
const api = supertest.agent(app.listen())

const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('logging in', () => {
    beforeEach(async () => {
        await helper.beforeEach()
    })

    test('works when credentials are correct', async () => {
        const response = await api
            .post('/api/login')
            .send({username: 'root', password: 'sekret'})
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.token).toBeDefined()
        expect(response.body.username).toEqual('root')
        })
        
    })

afterAll(async () => {
   //await mongoose.connection.close()
})