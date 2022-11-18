const {
  create,
  read,
  readById,
  readByEmail,
  deleteById,
  update,
} = require("../models/orderHeaders");

const { now } = require("../utils/utils");

/*
 * update order header for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const updateOrderHeader = async (req, res) => {
  try {
    // validate id
    const chkId = await readById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(290).send({ success: false, message: "No matching Id" });
      throw new Error("No matching Id");
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
    const orderOwner = chkId.rows[0].email;
    if (orderOwner !== currentUser.email) {
      res
        .status(409)
        .send({ success: false, message: "You do not own this order" });
      return false;
    }

    // check status
    const orderStatus = chkId.rows[0].order_status;
    if (orderStatus === "Ordered") {
      res.status(409).send({
        success: false,
        message: "Order placed - amendments not permitted.",
      });
      return false;
    }

    // validate status
    if (req.body.order_status.length > 10) {
      res.status(409).send({
        success: false,
        message: "Code must be 10 characters or less.",
      });
      return false;
    }

    // complete update
    update(req.params.id, { order_status: req.body.order_status });
    res.status(200).send({ success: true, message: "Order header amended" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * delete order header for a given id
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {status|message}  [status and message]
 */
const deleteOrderHeader = async (req, res) => {
  try {
    // validate id
    const chkId = await readById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(290).send({ success: false, message: "No matching Id" });
      throw new Error("No matching Id");
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
    const orderOwner = chkId.rows[0].email;
    if (orderOwner !== currentUser.email) {
      res
        .status(409)
        .send({ success: false, message: "You do not own this order" });
      return false;
    }

    const orderStatus = chkId.rows[0].order_status;
    if (orderStatus === "Ordered") {
      res.status(409).send({
        success: false,
        message: "Order placed - amendments not permitted.",
      });
      return false;
    }

    // complete delete
    deleteById(req.params.id);
    res.status(200).send({ success: true, message: "Order header deleted" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * create new order header
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing new order header]
 */
const addOrderHeader = async (req, res) => {
  try {
    // check user is logged in and get account email
    const currentUser = await req.user;
    if (currentUser == null) {
      res.status(290).send({
        success: false,
        message: "You are not logged in.",
      });
      return;
    }
    // form required body
    const newBody = {
      email: currentUser.email,
      order_status: "New",
      creation_date: now(),
    };

    // create new header
    const newOrderHeader = await create(newBody);
    res.status(201).send(newOrderHeader.rows[0]);
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Problem creating order header.",
    });
    return;
  }
};

/*
 * create new cart item
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing all order headers]
 */
const getAllOrderHeaders = async (req, res) => {
  try {
    const response = await read();
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get order header for the specified id
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing order header]
 */
const getOrderHeaderById = async (req, res) => {
  try {
    // attempt to get order header and send
    // appropriate response
    const response = await readById(req.params.id);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows[0]);
    } else {
      res.status(290).send({ success: false, message: "No such Id." });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

const getOrderHeadersByEmail = async (req, res) => {
  try {
    // attempt to get order header and send
    // appropriate response
    const currentUser = await req.user;
    if (currentUser == null) {
      res.status(290).send({
        success: false,
        message: "You are not logged in.",
      });
      return;
    }
    const response = await readByEmail(currentUser.email);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      res.status(290).send({ success: false, message: "No orders found." });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

module.exports = {
  addOrderHeader,
  getAllOrderHeaders,
  getOrderHeaderById,
  getOrderHeadersByEmail,
  deleteOrderHeader,
  updateOrderHeader,
};
