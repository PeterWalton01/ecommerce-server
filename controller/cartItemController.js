const {
  create,
  read,
  readById,
  readByCartId,
  readByCartIdAndProductId,
  deleteById,
  update,
} = require("../models/cartItems");

const { now } = require("../utils/utils");
const { readById: getProductById } = require("../models/products");
const { readById: getCartById } = require("../models/cartHeaders");

/*
 * delete cart item given by id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const deleteCartItem = async (req, res) => {
  try {
    // check validity of id
    const chkItem = await readById(req.params.id);
    if (chkItem.rows.length < 1) {
      res.status(404).send({ success: false, message: "No such Id" });
      return false;
    }
    // attempt delete
    await deleteById(req.params.id);
    res.status(200).send({ success: true, message: "Cart item deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * update cart item given by id
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {status|message}  [status and message]
 */
const updateCartItem = async (req, res) => {
  try {
    // check given id and type of quantity
    const cartItemChk = await readById(req.params.id);
    if (cartItemChk.rows.length < 1) {
      res.status(409).send({ success: false, message: "No such item Id" });
      return false;
    }
    if (isNaN(req.body.quantity) || req.body.quantity <= 0) {
      res.status(409).send({ success: false, message: "Illegal quantity" });
      return false;
    }

    // form required update body
    const newBody = { quantity: req.body.quantity };

    // complete update
    await update(req.params.id, newBody);

    res.status(200).send({ success: true, message: "Cart item updated" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * create new cart item
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing all order headers]
 */
const addCartItem = async (req, res) => {
  try {
    // check cart is valid
    const cartChk = await getCartById(req.body.cart_id);
    if (cartChk.rows.length < 1) {
      res.status(409).send({ success: false, message: "No such cart found" });
      return false;
    }

    // check product and get description using product_id
    const chkProduct = await getProductById(req.body.product_id);
    if (chkProduct.rows.length < 1) {
      res
        .status(409)
        .send({ success: false, message: "No such product found" });
      return false;
    }
    const itemDescription = chkProduct.rows[0].description;
    const itemPrice = chkProduct.rows[0].unit_price;

    // check product is not already in cart
    const chkCartAndProd = await readByCartIdAndProductId(
      req.body.cart_id,
      req.body.product_id
    );

    if (chkCartAndProd.rows.length > 0) {
      res
        .status(409)
        .send({ success: false, message: "Product already in cart" });
      return false;
    }

    // check for valid quantity
    if (isNaN(req.body.quantity) || req.body.quantity <= 0) {
      res.status(409).send({ success: false, message: "Illegal quantity" });
      return false;
    }

    // form body and add item
    const newBody = {
      cart_id: req.body.cart_id,
      product_id: req.body.product_id,
      description: itemDescription,
      unit_price: itemPrice,
      quantity: req.body.quantity,
      creation_date: now(),
    };

    const newCartItem = await create(newBody);
    res.status(201).send(newCartItem.rows[0]);
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get all cart items
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing all cart items]
 */
const getAllCartItems = async (req, res) => {
  try {
    const response = await read();
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      res.status(404).send({ success: false, message: "No cart items found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get cart item given by id
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing all order headers]
 */
const getCartItemById = async (req, res) => {
  try {
    // check validity of id
    const response = await readById(req.params.id);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows[0]);
    } else {
      res.status(404).send({ success: false, message: "Cart item not found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get all cart items for a given cart id
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing all order headers]
 */
const getCartItemsByCartId = async (req, res) => {
  try {
    // check validity of id
    const response = await readByCartId(req.params.cart_id);
    if (response.rows.length > 0) {
      res.status(200).send(response.rows);
    } else {
      res.status(404).send({ success: false, message: "Cart items not found" });
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

module.exports = {
  getAllCartItems,
  addCartItem,
  getCartItemById,
  getCartItemsByCartId,
  updateCartItem,
  deleteCartItem,
};
