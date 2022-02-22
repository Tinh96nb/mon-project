'use strict'
require('dotenv').config()
module.exports = Object.freeze({
  db: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3306',
      database: process.env.DB_NAME || 'root',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'xxx',
      charset: 'utf8mb4'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  app: {
    port: parseInt(process.env.PORT) || 3003
  }
})
