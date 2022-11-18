const express = require("express");
const auxiliaryRouter = express.Router();
/*
 * a small set of routes that are slightly
 * unusual.
 * 1. Getting cart items under a cart header id
 * 2. Getting order items under an order id
 * 3. Create an order based on a pre-existing
 *    cart using the cart id.
 */
const { checkAuthenticated } = require("../routes/auth");

const { getCartItemsByCartId } = require("../controller/cartItemController");

const { copyCartToOrder } = require("../controller/auxiliaryController");

const { getOrderItemsByOrderId } = require("../controller/orderItemController");

const {
  getOrderHeadersByEmail,
} = require("../controller/orderHeaderController");

auxiliaryRouter.get("/cart/:cart_id/items", checkAuthenticated, (req, res) => {
  getCartItemsByCartId(req, res);
});

auxiliaryRouter.get(
  "/order/:order_id/items",
  checkAuthenticated,
  (req, res) => {
    getOrderItemsByOrderId(req, res);
  }
);

auxiliaryRouter.post("/cart_to_order/:id", (req, res) => {
  copyCartToOrder(req, res);
});

auxiliaryRouter.get("/history", (req, res) => {
  getOrderHeadersByEmail(req, res);
});

auxiliaryRouter.get("", (req, res) => {
  res.status(200).send({ success: true, message: "Server here" });
});

module.exports = { auxiliaryRouter };
