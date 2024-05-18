const { aggregate } = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length == 0 ? 0 : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    const reducer = (sum, item) => {
        return sum.likes > item.likes ? sum : item
    }

    return blogs.length == 0 ? undefined : blogs.reduce(reducer, { likes: 0 })
}

const mostBlogs = (blogs) => {
    const f = () => {
        const reducer = (aggregate, item) => {
            if (aggregate.hasOwnProperty(item.author)) {
                aggregate[item.author] += 1
            } else {
                aggregate[item.author] = 1
            }
            return aggregate
        }

        let authors = blogs.reduce(reducer, {})
        let author = ""
        let max = 0

        for (key in authors) {
            if (authors[key] > max) {
                max = authors[key];
                author = key;
            }
        
        }
        return {"author": author, "blogs":max }

    }
    return blogs.length == 0 ? undefined : f()
}

const mostLikes = (blogs) => {
    const f = () => {
        const reducer = (aggregate, item) => {
            if (aggregate.hasOwnProperty(item.author)) {
                aggregate[item.author] += item.likes
            } else {
                aggregate[item.author] = item.likes
            }
            return aggregate
        }

        let authors = blogs.reduce(reducer, {})
        let author = ""
        let max = 0

        for (key in authors) {
            if (authors[key] > max) {
                max = authors[key];
                author = key;
            }
        
        }
        return {"author": author, "likes":max }

    }
    return blogs.length == 0 ? undefined : f()
}

module.exports = {
    dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}