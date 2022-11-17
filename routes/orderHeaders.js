const express = require("express");
const ordersRouter = express.Router();

/*
 * routes associate with order headers
 */

const {
  addOrderHeader,
  getAllOrderHeaders,
  getOrderHeadersByEmail,
  getOrderHeaderById,
  deleteOrderHeader,
  updateOrderHeader,
} = require("../controller/orderHeaderController");

const { checkAuthenticated } = require("../routes/auth");

ordersRouter.post("/", checkAuthenticated, (req, res) => {
  addOrderHeader(req, res);
});

ordersRouter.get("/", checkAuthenticated, (req, res) => {
  getAllOrderHeaders(req, res);
});

ordersRouter.get("/mine", checkAuthenticated, (req, res) => {
  getOrderHeadersByEmail(req, res);
});

ordersRouter.get("/:id", checkAuthenticated, (req, res) => {
  getOrderHeaderById(req, res);
});

ordersRouter.put("/:id", checkAuthenticated, (req, res) => {
  updateOrderHeader(req, res);
});

ordersRouter.delete("/:id", checkAuthenticated, (req, res) => {
  deleteOrderHeader(req, res);
});

module.exports = { ordersRouter };
