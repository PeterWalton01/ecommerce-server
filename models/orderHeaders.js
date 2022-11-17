const pool = require("./pool");
const pgp = require("pg-promise")({ capSQL: true });

/*
 * Get all order headers
 * @author Peter Walton
 * @return {object|null}  [object containing all order headers]
 */
const read = () => pool.query("SELECT * FROM orders");

/*
 * Get order headers by email
 * @author Peter Walton
 * @return {object|null}  [object with all order headers for email]
 */
const readByEmail = (email) =>
  pool.query("SELECT * FROM orders WHERE email = $1", [email]);

/*
 * Get a specified order header
 * @author Peter Walton
 * @param {id}            [id of order header to get]
 * @return {object|null}  [object containing the order header]
 */
const readById = (id) =>
  pool.query("SELECT * FROM orders WHERE order_id = $1", [id]);

/*
 * Create new order header
 * @author Peter Walton
 * @param {body}          [body containing the data to be inserted]
 * @return {object|null}  [object containing the new header]
 */
const create = (body) => {
  const insert = pgp.helpers.insert(body, null, "orders") + " RETURNING *";
  return pool.query(insert);
};

/*
 * Delete a order header
 * @author Peter Walton
 * @param {id}            [id of header to be deleted]
 */
const deleteById = (id) => {
  pool.query("DELETE FROM orders WHERE order_id = $1", [id]);
};

/*
 * update a specified order header
 * @author Peter Walton
 * @param  {id}           [id of header to update]
 * @param  {body}         [body containing the data for update]
 * @return {null}         [object from update]
 */
const update = (id, body) => {
  const update =
    pgp.helpers.update(body, null, "orders") + ` WHERE order_id = ${id}`;
  pool.query(update);
};

module.exports = {
  create,
  read,
  readById,
  readByEmail,
  deleteById,
  update,
};
