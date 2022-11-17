const { cardToOrder } = require("../models/auxiliary");

const { now } = require("../utils/utils");
const { readById: readCartById } = require("../models/cartHeaders");

/*
 * create order based on specified cart id
 * order email will be that for the user logged in
 * @author Peter Walton
 * @param  {req, res}     [middleware parameters]
 * @return {object|null}  [object containing created order]
 */
const copyCartToOrder = async (req, res) => {
  try {
    // check that cart id is valid
    const chkId = await readCartById(req.params.id);
    if (chkId.rows.length === 0) {
      res.status(404).send({ success: false, message: "No matching Id" });
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

    // create order from cart and send this is a response
    const response = await cardToOrder(req.params.id, currentUser.email, now());
    res.status(201).send(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

module.exports = { copyCartToOrder };
