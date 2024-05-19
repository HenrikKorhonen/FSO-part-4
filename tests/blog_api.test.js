const mongoose = require('mongoose')
const supertest = require('supertest')
const {app} = require('../app')
const api = supertest.agent(app.listen())

const helper = require('./test_helper')
const Blog = require('../models/blog')

let token = null

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await helper.beforeEach()
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
        })

    test('a specific note is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)

        expect(contents).toContain(
            'Type wars'
            )
        })

    test('returned blogs have an id property', async () => {
        const response = await api.get('/api/blogs')
        for (let blog of response.body) {
            expect(blog.id).toBeDefined()
        }
    })

    test('returned blogs have a user property', async () => {
        const response = await api.get('/api/blogs')
        for (let blog of response.body) {
            expect(blog.user).toBeDefined()
        }
    })
})


describe('when adding blogs', () => {
    beforeEach(async () => {
        await helper.beforeEach()
        token = await api.post('/api/login').send({username: 'root', password: 'sekret'})
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "A blog's a blog",
            author: "Rob Blogger",
            url: "http://example.com",
            likes: 3,
        }
    
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const contents = response.body.map(r => {
            return { 'title':r.title, 'name': r.user.name  }
        })
    
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(contents).toContainEqual(
            {title: "A blog's a blog", name: 'Superuser'}
        )
    })

    test('a blog without likes will default to 0', async () => {
       
        const newBlog = {
            title: "A blog's a blog",
            author: "Rob Blogger",
            url: "http://example.com",
            //user: users[0].id
        }

        const initial = await api.get('/api/blogs')
    
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const blogs = response.body.map(r => {
            return {title: r.title, likes: r.likes}
        })
    
        expect(response.body).toHaveLength(initial.body.length + 1)
        expect(blogs).toContainEqual(
            {title: "A blog's a blog", likes: 0}
        )
    })

    test('fails with status code 400 if url is missing', async () => {
        const newBlog = {
            title: "A blog's a blog",
            author: "Rob Blogger"
        }

        const inital = await api.get('/api/blogs')
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token.body.token}`)
            .send(newBlog)
            .expect(400)
        
       const eventual = await api.get('/api/blogs')
    
        expect(inital.body).toHaveLength(eventual.body.length)
        })

    test('fails with status code 400 if title is missing', async () => {
        const newBlog = {
            author: "Rob Blogger",
            url: "http://example.com"
        }

        const inital = await api.get('/api/blogs')
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token.body.token}`)
            .send(newBlog)
            .expect(400)
        
        const eventual = await api.get('/api/blogs')
    
        expect(inital.body).toHaveLength(eventual.body.length)
        })
})

describe('when modifying blogs', () => {
    beforeEach(async () => {
        await helper.beforeEach()
        token = await api.post('/api/login').send({username: 'root', password: 'sekret'})
    })

    test('a blog can be deleted', async () => { 
        const blogs = await api.get('/api/blogs')
        const id = blogs.body[0].id
        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token.body.token}`)
            .expect(204)

        await api
            .get(`/api/blogs/${id}`)
            .expect(404)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(blogs.body.length - 1)
    })

    test('a blog can be updated', async () => {
        const blogs = await api.get('/api/blogs')
        const blog = blogs.body[0]
        
        blog.likes += 1
        let blogObject = new Blog(blog)
        bO = await blogObject.populate('user', { username: 1, name: 1, id: 1})

        await api
            .put(`/api/blogs/${blog.id}`)
            .send(blog)
            .set('Authorization', `Bearer ${token.body.token}`)
            .expect(200)
    
        const response = await api.get('/api/blogs')
        
        expect(response.body).toHaveLength(blogs.body.length)
        expect(response.body).toContainEqual(bO.toJSON())
    })      
})



afterAll(async () => {
   //await mongoose.connection.close()
})