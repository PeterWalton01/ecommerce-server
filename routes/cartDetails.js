const express = require("express");
const cartItemsRouter = express.Router();
/*
 * routes associate with cart details
 */

const {
  getAllCartItems,
  getCartItemById,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controller/cartItemController");

const { checkAuthenticated } = require("../routes/auth");

cartItemsRouter.get("/", checkAuthenticated, (req, res) => {
  getAllCartItems(req, res);
});

cartItemsRouter.get("/:id", checkAuthenticated, (req, res) => {
  getCartItemById(req, res);
});

cartItemsRouter.post("/", checkAuthenticated, (req, res) => {
  addCartItem(req, res);
});

cartItemsRouter.put("/:id", checkAuthenticated, (req, res) => {
  updateCartItem(req, res);
});

cartItemsRouter.delete("/:id", checkAuthenticated, (req, res) => {
  deleteCartItem(req, res);
});

module.exports = { cartItemsRouter };
