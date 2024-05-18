const mongoose = require('mongoose')
const supertest = require('supertest')
const {server} = require('../index')
const api = supertest.agent(server)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        //_id: "5a422a851b54a676234d17f7",
        //__v: 0,
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        //_id: "5a422aa71b54a676234d17f8",
        //__v: 0,
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        //_id: "5a422b3a1b54a676234d17f9",
        //__v: 0,
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        //_id: "5a422b891b54a676234d17fa",
        //__v: 0,
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        //_id: "5a422ba71b54a676234d17fb",
        //__v: 0,
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        //_id: "5a422bc61b54a676234d17fc",
        //__v: 0,
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }
]

describe('when there is initially some notes saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        for (let blog of initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })
    
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })

    test('all notes are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length)
        })

    test('a specific note is within the returned notes', async () => {
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
})


test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "A blog's a blog",
        author: "Rob Blogger",
        url: "http://example.com",
        likes: 3
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
  
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain(
      "A blog's a blog"
    )
  })

afterAll(async () => {
    await mongoose.connection.close()
    server.close()
})