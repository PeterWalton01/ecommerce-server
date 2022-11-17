const pool = require("./pool");
const pgp = require("pg-promise")({ capSQL: true });

/*
 * Get all cart items
 * @author Peter Walton
 * @return {object|null}  [object containing the cart items]
 */
const read = () => pool.query("SELECT * FROM cart_items");

/*
 * Get a specified cart header
 * @author Peter Walton
 * @param {id}            [id of cart item to get]
 * @return {object|null}  [object containing the cart item]
 */
const readById = (id) =>
  pool.query("SELECT * FROM cart_items WHERE cart_Item_id = $1", [id]);

/*
 * Get a cart items for a specified cart id
 * @author Peter Walton
 * @param {id}            [id of cart header to get items for]
 * @return {object|null}  [object containing the cart items]
 */
const readByCartId = (id) =>
  pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [id]);

/*
 * Get a cart item for a specified cart id and product id
 * used for validation purposes
 * @author Peter Walton
 * @param {id}            [id of cart header]
 * @param {product_id}    [product_id to seek]
 * @return {object|null}  [object containing the cart items found]
 */
const readByCartIdAndProductId = (id, product_id) =>
  pool.query(
    "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [id, product_id]
  );

/*
 * Create new cart item
 * @author Peter Walton
 * @param {body}          [body containing the data to be inserted]
 * @return {bject|null}  [object containing the new item]
 */
const create = (body) => {
  const insert = pgp.helpers.insert(body, null, "cart_items") + " RETURNING *";
  return pool.query(insert);
};

/*
 * Delete a cart item
 * @author Peter Walton
 * @param {id}            [id of item to be deleted]
 */
const deleteById = (id) => {
  pool.query("DELETE FROM cart_items WHERE cart_item_id = $1", [id]);
};

/*
 * update a specified cart item
 * @author Peter Walton
 * @param  {id}           [id of item to update]
 * @param  {body}         [body containing the data for update]
 * @return {object|null}  [object from update]
 */
const update = (id, body) => {
  const update =
    pgp.helpers.update(body, null, "cart_items") +
    ` WHERE cart_item_id = ${id}`;
  return pool.query(update);
};

module.exports = {
  create,
  read,
  readById,
  readByCartId,
  // readByOrderId,
  readByCartIdAndProductId,
  deleteById,
  update,
};
