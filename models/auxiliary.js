const pool = require("./pool");
const pgp = require("pg-promise")({ capSQL: true });
/*
 * creates an order for the current user (email)
 * that mirrors a given car and items
 * @author Peter Walton
 * @param  {id}           [cart id used to form order]
 * @param  {email}        [order owner]
 * @param  {now}          [timestamp]
 * @return {object|null}  [object containing new order]
 */
const cardToOrder = async (id, email, now) => {
  const client = await pool.connect();
  try {
    // begin transaction
    await client.query("BEGIN");

    // create order header and capture order Id
    const insert =
      pgp.helpers.insert(
        {
          email: email,
          order_status: "New",
          creation_date: now,
        },
        null,
        "orders"
      ) + " RETURNING *";

    const newHeader = await client.query(insert);

    const newOrder_id = newHeader.rows[0].order_id;

    // form order detail using the id of the cart provided
    // and capture line items
    const ins_clause = `INSERT INTO 
  order_items (
  product_id,
  order_id,
  description,
  unit_price,
  quantity,
  creation_date,
  altered_date) 
  SELECT product_id, ${newOrder_id}, 
       description, 
       unit_price, 
       quantity, 
       '${now}', 
       '${now}'  FROM cart_items WHERE cart_id = ${id} RETURNING *`;

    const itemList = await client.query(ins_clause);

    // form order object
    const newOrder = { header: newHeader.rows[0], items: itemList.rows };

    // commit transaction and return order object
    client.query("COMMIT");
    return newOrder;
  } catch (error) {
    /// error - rollback transaction and write error message
    await client.query("ROLLBACK");
    console.error(error.message);
  } finally {
    // release database connection
    client.release();
  }
};



module.exports = { cardToOrder };
