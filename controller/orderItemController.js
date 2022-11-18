const {
  create,
  read,
  readById,
  readByOrderId,
  readByOrderIdAndProductId,
  deleteById,
  update,
} = require("../models/orderItems");

const { now } = require("../utils/utils");
const { readById: getProductById } = require("../models/products");
const { readById: getOrderById } = require("../models/orderHeaders");

/*
 * update order item for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const updateOrderItem = async (req, res) => {
  try {
    // check given id is valid
    const orderItemChk = await readById(req.params.id);
    if (orderItemChk.rows.length < 1) {
      res.status(409).send({ success: false, message: "No such item Id" });
      return false;
    }
    // check value is valid
    if (isNaN(req.body.quantity) || req.body.quantity < 0) {
      res.status(409).send({ success: false, message: "Illegal quantity" });
      return false;
    }
    // check order is valid and get email
    const orderChk = await getOrderById(orderItemChk.rows[0].order_id);
    if (orderChk.rows.length < 1) {
      res.status(409).send({ success: false, message: "No such order found" });
      return false;
    }
    // check user is logged in and if so get user details
    const currentUser = await req.user;
    if (currentUser == null) {
      res.status(500).send({
        success: false,
        message: "You are not logged in.",
      });
      return;
    }

    // check user owns order
    const orderOwner = orderChk.rows[0].email;
    if (orderOwner !== currentUser.email) {
      res
        .status(409)
        .send({ success: false, message: "You do not own this order" });
      return false;
    }

    const orderStatus = orderChk.rows[0].order_status;
    if (orderStatus === "Ordered") {
      res.status(409).send({
        success: false,
        message: "Order placed - amendments not permitted.",
      });
      return false;
    }

    // form required body
    const newBody = { quantity: req.body.quantity, altered_date: now() };

    // complete update
    await update(req.params.id, newBody);

    res.status(200).send({ success: true, message: "Order item updated" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * delete order item for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const deleteOrderItem = async (req, res) => {
  try {
    // validate the id
    const chkItem = await readById(req.params.id);
    if (chkItem.rows.length < 1) {
      res.status(290).send({ success: false, message: "No such Id" });
      return false;
    }

    // validate the order id
    const orderChk = await getOrderById(chkItem.rows[0].order_id);
    if (orderChk.rows.length < 1) {
      res.status(409).send({ success: false, message: "No such order found" });
      return false;
    }

    // check user is logged in and if so get user details
    const currentUser = await req.user;
    if (currentUser == null) {
      res.status(500).send({
        success: false,
        message: "You are not logged in.",
      });
      return;
    }

    // check user owns order
    const orderOwner = orderChk.rows[0].email;
    if (orderOwner !== currentUser.email) {
      res
        .status(409)
        .send({ success: false, message: "You do not own this order" });
      return false;
    }

    // check order status
    const orderStatus = orderChk.rows[0].order_status;
    if (orderStatus === "Ordered") {
      res.status(409).send({
        success: false,
        message: "Order placed - amendments not permitted.",
      });
      return false;
    }

    // complete deletion
    await deleteById(req.params.id);
    res.status(200).send({ success: true, message: "Order item deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get order items for specified order id
 * @author Peter Walton
 * @param  {req, res}      [middleware parameters]
 * @return {object|null}   [object containing items]
 */
const getOrderItemsByOrderId = async (req, res) => {
  try {
    // attempt to get items for order and send
    // appropriate response
    const response = await readByOrderId(req.params.order_id);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      res
        .status(290)
        .send({ success: false, message: "Order items not found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get order item for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [object containing item]
 */
const getOrderItemById = async (req, res) => {
  try {
    // attempt to get order item and
    // send appropriate response
    const response = await readById(req.params.id);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows[0]);
    } else {
      res.status(290).send({ success: false, message: "Order item not found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get all order items
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [object containing order items]
 */
const getAllOrderItems = async (req, res) => {
  try {
    const response = await read();
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      res.status(290).send({ success: false, message: "No order items found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * create new order item
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {object|message}  [object containing order item]
 */
const addOrderItem = async (req, res) => {
  try {
    // check order is valid
    const orderChk = await getOrderById(req.body.order_id);
    if (orderChk.rows.length < 1) {
      res.status(409).send({ success: false, message: "No such order found" });
      return false;
    }

    // check user is logged in and if so get user details
    const currentUser = await req.user;
    if (currentUser == null) {
      res.status(500).send({
        success: false,
        message: "You are not logged in.",
      });
      return;
    }

    // check user own order
    const orderOwner = orderChk.rows[0].email;
    if (orderOwner !== currentUser.email) {
      res
        .status(409)
        .send({ success: false, message: "You do not own this order" });
      return false;
    }

    const orderStatus = orderChk.rows[0].order_status;
    if (orderStatus === "Ordered") {
      res.status(409).send({
        success: false,
        message: "Order placed - amendments not permitted.",
      });
      return false;
    }

    // check product and get description and
    // unit_price using product_id
    const chkProduct = await getProductById(req.body.product_id);
    if (chkProduct.rows.length < 1) {
      res
        .status(409)
        .send({ success: false, message: "No such product found" });
      return false;
    }
    const itemDescription = chkProduct.rows[0].description;
    const itemPrice = chkProduct.rows[0].unit_price;

    // check product is not already in order
    const chkOrderAndProd = await readByOrderIdAndProductId(
      req.body.order_id,
      req.body.product_id
    );

    if (chkOrderAndProd.rows.length > 0) {
      res
        .status(409)
        .send({ success: false, message: "Product already in order" });
      return false;
    }

    // check for valid quantity
    if (isNaN(req.body.quantity) || req.body.quantity <= 0) {
      res.status(409).send({ success: false, message: "Illegal quantity" });
      return false;
    }

    // form body and add item
    const newBody = {
      order_id: req.body.order_id,
      product_id: req.body.product_id,
      description: itemDescription,
      unit_price: itemPrice,
      quantity: req.body.quantity,
      creation_date: now(),
      altered_date: now(),
    };

    // create new order item
    const newOrderItem = await create(newBody);
    res.status(201).send(newOrderItem.rows[0]);
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Problem creating order item.",
    });
    return;
  }
};

module.exports = {
  addOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  deleteOrderItem,
  updateOrderItem,
};
