require('dotenv').config()

const MONGO_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_TEST_URL
    : process.env.MONGO_URL
const PORT = process.env.PORT

module.exports = { MONGO_URL, PORT }
