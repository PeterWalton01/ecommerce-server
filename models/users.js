const pool = require("./pool");

/*
 * create a new user - used in registration
 * @author Peter Walton
 * @param  {user}         [object of values to be inserted]
 * @return {object|null}  [object inserted]
 */
const create = (user) =>
  pool.query(
    "INSERT INTO users (email, first_name, last_name, creation_date, last_access, password ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    user
  );

/*
 * get user by id
 * @author Peter Walton
 * @param  {id}           [id used for search]
 * @return {object|null}  [user found]
 */
const readById = (id) =>
  pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

/*
 * get user by email
 * @author Peter Walton
 * @param  {email}        [email used for search]
 * @return {object|null}  [user found]
 */
const readByEmail = (email) =>
  pool.query("SELECT * FROM users WHERE email = $1", [email]);

module.exports = { create, readById, readByEmail };
