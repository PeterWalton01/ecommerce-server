const pool = require("./pool");
const pgp = require("pg-promise")({ capSQL: true });

/*
 * Get all order items
 * @author Peter Walton
 * @return {object|null}  [object containing the order items]
 */
const read = () => pool.query("SELECT * FROM order_items");

/*
 * Get a specified order header
 * @author Peter Walton
 * @param {id}            [id of order item to get]
 * @return {object|null}  [object containing the order item]
 */
const readById = (id) =>
  pool.query("SELECT * FROM order_items WHERE order_Item_id = $1", [id]);

/*
 * Get order items for a specified order id
 * @author Peter Walton
 * @param {id}            [id of order header to get items for]
 * @return {object|null}  [object containing the order items]
 */
const readByOrderId = (id) =>
  pool.query("SELECT * FROM order_items WHERE order_id = $1", [id]);

/*
 * Get an order item for a specified order id  id and product id
 * used for validation purposes
 * @author Peter Walton
 * @param {id}            [id of cart header]
 * @param {product_id}    [product_id to seek]
 * @return {object|null}  [object containing the cart items found]
 */
const readByOrderIdAndProductId = (id, product_id) =>
  pool.query(
    "SELECT * FROM order_items WHERE order_id = $1 AND product_id = $2",
    [id, product_id]
  );

/*
 * Create new order item
 * @author Peter Walton
 * @param {body}          [body containing the data to be inserted]
 * @return {object|null}  [object containing the new item]
 */
const create = (body) => {
  const insert = pgp.helpers.insert(body, null, "order_items") + " RETURNING *";
  return pool.query(insert);
};

/*
 * Delete an order item
 * @author Peter Walton
 * @param {id}            [id of item to be deleted]
 */
const deleteById = (id) => {
  pool.query("DELETE FROM order_items WHERE order_item_id = $1", [id]);
};

/*
 * update a specified order item
 * @author Peter Walton
 * @param  {id}           [id of item to update]
 * @param  {body}         [body containing the data for update]
 * @return {object|null}  [object from update]
 */
const update = (id, body) => {
  const update =
    pgp.helpers.update(body, null, "order_items") +
    ` WHERE order_item_id = ${id}`;
  pool.query(update);
};

module.exports = {
  create,
  read,
  readById,
  readByOrderId,
  readByOrderIdAndProductId,
  deleteById,
  update,
};
