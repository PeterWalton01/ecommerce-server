const pool = require("./pool");
const pgp = require("pg-promise")({ capSQL: true });

/*
 * Get all product
 * @author Peter Walton
 * @return {object|null}  [object containing the products]
 */
const read = () => pool.query("SELECT * FROM products");

/*
 * Get a specified product by id
 * @author Peter Walton
 * @param {id}            [id of product to get]
 * @return {object|null}  [object containing the product]
 */
const readById = (id) =>
  pool.query("SELECT * FROM products WHERE product_id = $1", [id]);

/*
 * Get the product for a specified product code
 * @author Peter Walton
 * @param {id}            [product code of product to get]
 * @return {object|null}  [object containing the product]
 */
const readByProductCode = (productCode) =>
  pool.query("SELECT * FROM products WHERE product_code = $1", [productCode]);

/*
 * Get the product for a specified product code
 * @author Peter Walton
 * @param {id}            [product code of product to get]
 * @return {object|null}  [object containing the product]
 */
const readByPartDescription = (q) =>
  pool.query(
    "SELECT * FROM products WHERE LOWER(description) LIKE '%" +
      q.toLowerCase() +
      "%'"
  );

/*
 * Create new product
 * @author Peter Walton
 * @param {body}          [body containing the data to be inserted]
 * @return {object|null}  [object containing the product]
 */
const create = (body) => {
  const insert = pgp.helpers.insert(body, null, "products") + " RETURNING *";
  return pool.query(insert);
};

/*
 * Delete a product
 * @author Peter Walton
 * @param {id}            [id of product to be deleted]
 */
const deleteById = (id) => {
  pool.query("DELETE FROM products WHERE product_id = $1", [id]);
};

/*
 * update a specified product
 * @author Peter Walton
 * @param  {id}           [id of product to update]
 * @param  {body}         [body containing the data for update]
 * @return {object|null}  [object from update]
 */
const update = (id, body) => {
  const update =
    pgp.helpers.update(body, null, "products") + ` WHERE product_id = ${id}`;
  pool.query(update);
};

module.exports = {
  create,
  read,
  readById,
  readByProductCode,
  deleteById,
  update,
  readByPartDescription,
};
