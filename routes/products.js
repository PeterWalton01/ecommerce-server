const express = require("express");
const productsRouter = express.Router();

/*
 * routes associate with products
 */

const {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductByQuery,
} = require("../controller/productController");

const { checkAuthenticated } = require("./auth");

productsRouter.get("/", checkAuthenticated, (req, res) => {
  getAllProducts(req, res);
});

productsRouter.get("/:id", checkAuthenticated, (req, res) => {
  getProductById(req, res);
});

productsRouter.get("/query/:query", checkAuthenticated, (req, res) => {
  getProductByQuery(req, res);
});

productsRouter.post("/", checkAuthenticated, (req, res) => {
  addProduct(req, res);
});

productsRouter.delete("/:id", checkAuthenticated, (req, res) => {
  deleteProduct(req, res);
});

productsRouter.put("/:id", checkAuthenticated, (req, res) => {
  updateProduct(req, res);
});

module.exports = { productsRouter };
