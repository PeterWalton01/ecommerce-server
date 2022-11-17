const { Pool } = require("pg");
require("dotenv").config();

// Provide pool for database
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const pool = new Pool({
  // create connection to database
  connectionString: process.env.DATABASE_URL, // use DATABASE_URL environment variable from Heroku app
});

module.exports = pool;
