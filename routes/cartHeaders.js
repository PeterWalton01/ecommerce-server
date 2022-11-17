const express = require("express");
const cartsRouter = express.Router();
/*
 * routes associate with cart headers
 */

const {
  addCartHeader,
  getCartHeaders,
  getCartHeaderById,
  updateCartHeader,
  deleteCartHeader,
} = require("../controller/cartHeaderContoller");

const { checkAuthenticated } = require("../routes/auth");

cartsRouter.get("/", checkAuthenticated, (req, res) => {
  getCartHeaders(req, res);
});

cartsRouter.get("/:id", checkAuthenticated, (req, res) => {
  getCartHeaderById(req, res);
});

cartsRouter.post("/", checkAuthenticated, (req, res) => {
  addCartHeader(req, res);
});

cartsRouter.put("/:id", checkAuthenticated, (req, res) => {
  updateCartHeader(req, res);
});

cartsRouter.delete("/:id", checkAuthenticated, (req, res) => {
  deleteCartHeader(req, res);
});

module.exports = { cartsRouter };
