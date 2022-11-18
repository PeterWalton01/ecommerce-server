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

// The options blow are for live deployment
// In development use the pool setting above
const pool = new Pool({
  // create connection to database
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
