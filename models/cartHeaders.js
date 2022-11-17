const pool = require("./pool");
const pgp = require("pg-promise")({ capSQL: true });

/*
 * Get all cart headers
 * @author Peter Walton
 * @return {object|null}  [object containing all cart headers]
 */
const read = () => pool.query("SELECT * FROM carts");

/*
 * Get a specified cart header
 * @author Peter Walton
 * @param {id}            [id of cart header to get]
 * @return {object|null}  [object containing the cart header]
 */
const readById = (id) =>
  pool.query("SELECT * FROM carts WHERE cart_id = $1", [id]);

/*
 * Create new cart header
 * @author Peter Walton
 * @param {body}          [body containing the data to be inserted]
 * @return {object|null}  [object containing the new header]
 */
const create = (body) => {
  const insert = pgp.helpers.insert(body, null, "carts") + " RETURNING *";
  return pool.query(insert);
};

/*
 * Delete a cart header
 * @author Peter Walton
 * @param {id}            [id of header to be deleted]
 */
const deleteById = (id) => {
  pool.query("DELETE FROM carts WHERE cart_id = $1", [id]);
};

/*
 * update a specified cart header
 * @author Peter Walton
 * @param  {id}           [id of header to update]
 * @param  {body}         [body containing the data for update]
 * @return {null}         [object from update]
 */
const update = (id, body) => {
  const update =
    pgp.helpers.update(body, null, "carts") + ` WHERE cart_id = ${id}`;
  return pool.query(update);
};

module.exports = {
  create,
  read,
  readById,
  deleteById,
  update,
};
