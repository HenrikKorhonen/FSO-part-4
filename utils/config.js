//require('dotenv').config()

const password =  process.env.PASSWORD 
//const MONGODB_URI = 'mongodb+srv://hevemiko:${process.env.PASSWORD}@cluster0.quqg3jx.mongodb.net/?retryWrites=true&w=majority'
const TEST_MONGODB_URI = `mongodb+srv://hevemiko:${password}@cluster0.quqg3jx.mongodb.net/?retryWrites=true&w=majority`;
// const TEST_MONGODB_URI = 'mongodb+srv://hevemiko:O3QuqXDKYDh458Zu@cluster0.quqg3jx.mongodb.net/?retryWrites=true&w=majority';


// console.log(process.env.NODE_ENV)
// console.log(process.env.PASSWORD)


let PORT = process.env.PORT ? process.env.PORT : 3000
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? TEST_MONGODB_URI
  : process.env.MONGODB_URI 
const MONGODB_OPTIONS = process.env.NODE_ENV === 'test'
  ? {dbName: 'test'}
  : {dbName: 'prod'}


// const MONGODB_URI = TEST_MONGODB_URI
// const MONGODB_OPTIONS = {dbName: 'test'}

module.exports = {
  MONGODB_URI,
  MONGODB_OPTIONS,
  PORT
}