const {
  create,
  read,
  readById,
  readByProductCode,
  deleteById,
  update,
  readByPartDescription,
} = require("../models/products");

/*
 * update product for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const updateProduct = async (req, res) => {
  try {
    // validate id
    const chkId = await readById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(290).send({ success: false, message: "No matching Id" });
      throw new Error("No matching Id");
    }

    // validate product code
    const chkProduct = await readByProductCode(req.body.product_code);
    // if there is a product with the specified product code ..
    if (chkProduct.rows.length > 0) {
      // it must be for the current product id or we will
      // create a duplicate
      if (chkProduct.rows[0].product_id !== Number(req.params.id)) {
        res
          .status(409)
          .send({ success: false, message: "Product code already in use" });
        throw new Error("Product code already in use");
      }
    }

    // complete update
    update(req.params.id, req.body);
    res.status(200).send({ success: true, message: "Product updated" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * delete product for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const deleteProduct = async (req, res) => {
  try {
    // validate id
    const chkId = await readById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(290).send({ success: false, message: "No matching Id" });
      throw new Error("No matching Id");
    }

    // complete deletion
    deleteById(req.params.id);
    res.status(200).send({ success: true, message: "Product deleted" });
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * create new product for specified id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {object|message}  [object containing new product]
 */
const addProduct = async (req, res) => {
  try {
    // check product is new using product id
    const chkProduct = await readByProductCode(req.body.product_code);
    if (chkProduct.rows.length > 0) {
      res
        .status(409)
        .send({ success: false, message: "Product code already in use" });
      throw new Error("Product code  already in use");
    }

    // create new product
    const newProduct = await create(req.body);
    res.status(201).send(newProduct.rows[0]);
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get all products
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {object|message}  [object containing all product]
 */
const getAllProducts = async (req, res) => {
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
 * get a products by id
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {object|message}  [object containing the product]
 */
const getProductById = async (req, res) => {
  try {
    // attempt to get specified product
    // and send appropriate response
    const id = req.params.id;
    const response = await readById(id);
    if (response.rows.length > 0) {
      return res.status(200).send(response.rows[0]);
    } else {
      return res
        .status(200)
        .send({ success: false, message: "No product with that id" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

const getProductByQuery = async (req, res) => {
  try {
    // attempt to get product by matching
    // the product description
    const query = req.params.query;
    const response = await readByPartDescription(query);
    if (response.rows.length > 0) {
      return res.status(200).send(response.rows);
    } else {
      return res
        .status(200)
        .send({ success: false, message: "No products found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductByQuery,
};
