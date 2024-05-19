const password =  process.env.PASSWORD 

const TEST_MONGODB_URI = `mongodb+srv://hevemiko:${password}@cluster0.quqg3jx.mongodb.net/?retryWrites=true&w=majority`;
const PROD_MONGODB_URI = `mongodb+srv://hevemiko:${password}@cluster0.quqg3jx.mongodb.net/?retryWrites=true&w=majority`;

let PORT = process.env.PORT ? process.env.PORT : 3000
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? TEST_MONGODB_URI
  : process.env.MONGODB_URI ? process.env.MONGODB_URI : PROD_MONGODB_URI
const MONGODB_OPTIONS = process.env.NODE_ENV === 'test'
  ? {dbName: 'test'}
  : {dbName: 'prod'}

module.exports = {
  MONGODB_URI,
  MONGODB_OPTIONS,
  PORT
}