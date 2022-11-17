const { create, readById, readByEmail } = require("../models/users");
const bcrypt = require("bcrypt");
const { now } = require("../utils/utils");

/*
 * register user - the account is identified by
 * the specified email and the password provided
 * will be encrypted before storage
 * @author Peter Walton
 * @param  {req, res}        [middleware parameters]
 * @return {status|message}  [status and message]
 */
const registerUser = async (req, res) => {
  try {
    // check email is new
    const chkUser = await getUserByEmail(req.body.email);
    if (chkUser) {
      res.status(409).send({ success: false, message: "Email already in use" });
      throw new Error("Email already in use");
    }

    // salt and hash the provided password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const timestamp = now();
    // form the user object
    const user = [
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      timestamp,
      timestamp,
      hashedPassword,
    ];

    // create the user
    await create(user);
    res.status(201).send({ success: true, message: "Email registered" });
    return;
  } catch (e) {
    console.error(e.message);
    res.status(500).end();
  }
};

/*
 * get the user detail for the specified
 *
 * @author Peter Walton
 * @param  {id}              [id of user to find]
 * @return {object|message}  [object containing user details]
 */
const getUserById = async (id) => {
  try {
    // attempt to get user and make
    // appropriate return
    const response = await readById(id);
    if (response.rows.length > 0) {
      return response.rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).end();
  }
};

/*
 * get the user detail for the specified
 *
 * @author Peter Walton
 * @param  {email}           [email of user to find]
 * @return {object|message}  [object containing user details]
 */
const getUserByEmail = async (email) => {
  try {
    // attempt to get user and make
    // appropriate return
    const response = await readByEmail(email);
    if (response.rows.length > 0) {
      return response.rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).end();
  }
};

module.exports = { getUserById, getUserByEmail, registerUser };
