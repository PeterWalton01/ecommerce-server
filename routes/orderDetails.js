const express = require("express");
const orderItemsRouter = express.Router();

/*
 * routes associate with order details
 */

const {
  addOrderItem,
  getAllOrderItems,
  getOrderItemById,
  deleteOrderItem,
  updateOrderItem,
} = require("../controller/orderItemController");

const { checkAuthenticated } = require("../routes/auth");

orderItemsRouter.post("/", checkAuthenticated, (req, res) => {
  addOrderItem(req, res);
});

orderItemsRouter.get("/", checkAuthenticated, (req, res) => {
  getAllOrderItems(req, res);
});

orderItemsRouter.get("/:id", checkAuthenticated, (req, res) => {
  getOrderItemById(req, res);
});

orderItemsRouter.delete("/:id", checkAuthenticated, (req, res) => {
  deleteOrderItem(req, res);
});

orderItemsRouter.put("/:id", checkAuthenticated, (req, res) => {
  updateOrderItem(req, res);
});

module.exports = { orderItemsRouter };
