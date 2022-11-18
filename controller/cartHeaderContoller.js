const {
  create,
  read,
  readById,
  deleteById,
  update,
} = require("../models/cartHeaders");

const { now } = require("../utils/utils");

/*
 * delete cart header based in id provided in req.params.id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {success|message} [status and message]
 */
const deleteCartHeader = async (req, res) => {
  try {
    // check that id is valid
    const chkId = await readById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(290).send({ success: false, message: "No matching Id" });
      throw new Error("No matching Id");
    }
    // delete cart header
    deleteById(req.params.id);
    res.status(200).send({ success: true, message: "Product deleted" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * update cart header based in id provided in req.params.id
 * data for update is in req.body
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {success|message} [status and message]
 */
const updateCartHeader = async (req, res) => {
  try {
    // check id is valid
    const chkId = await readById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(290).send({ success: false, message: "No matching Id" });
      throw new Error("No matching Id");
    }
    // perform update
    update(req.params.id, req.body);
    res.status(200).send({ success: true, message: "Product updated" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * add new cart header based in information in req.body
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {object|message}  [object containing new header]
 */
const addCartHeader = async (req, res) => {
  try {
    // form new cart header
    const newBody = {
      creation_date: now(),
      cart_status: "New",
    };

    // create new cart header
    const newCart = await create(newBody);
    res.status(201).send(newCart.rows[0]);
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get cart header based on id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {success|message} [object containing cart header]
 */
const getCartHeaderById = async (req, res) => {
  try {
    // check validity of id
    const response = await readById(req.params.id);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows[0]);
    } else {
      res.status(290).send({ success: false, message: "No cart with that id" });
      return;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get all cart headers
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing all order headers]
 */
const getCartHeaders = async (req, res) => {
  try {
    const response = await read();
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      res
        .status(290)
        .send({ success: false, message: "No order headers found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

module.exports = {
  addCartHeader,
  getCartHeaders,
  getCartHeaderById,
  updateCartHeader,
  deleteCartHeader,
};
