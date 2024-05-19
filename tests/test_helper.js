const User = require('../models/user')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const { application } = require('express')

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

const beforeEach = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })

  const u = await user.save()
  const id = u.toJSON().id

  
  for (let blog of initialBlogs) {
      let blogObject = new Blog(blog)
      blogObject.user = id
      await blogObject.save()
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs,
  beforeEach,
  usersInDb,
  blogsInDb
}