/*
 * main file in application. Responsible for:
 * 1. Interaction with the application environment,
 * 1. Setting up eExpress and core middleware functions,
 * 2. Establishing necessary routers,
 * 3. Beginning to listen on the specified port.
 */

// Prepare environment
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Key modules
const express = require("express");
const app = express();
const cors = require("cors");

// Prepare for sessions and for passport.
const session = require("express-session");
const passport = require("passport");
const SQLiteStore = require("connect-sqlite3")(session);

const bodyParser = require("body-parser");

// app.use(cors({ origin: true, credentials: true }));
// prettier-ignore
const corsOptions = {
  origin: ['http://localhost:3000', 'https://ecommerce-client00.netlify.app', 'https://ecommerce-client00.herokuapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'] };

app.use(cors(corsOptions));
// Add middleware to support application/json
// date from POST commands etc.
app.use(bodyParser.json());

// Add middleware to support
// application/x-www-form-urlencoded
// data from POST commands etc.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    // Set up session with key from environment
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    httpOnly: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);

const startPassport = require("./passport/passport");
startPassport(passport);

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Persist variables across session

const { adminRouter } = require("./routes/auth");
const { productsRouter } = require("./routes/products");
const { cartsRouter } = require("./routes/cartHeaders");
const { ordersRouter } = require("./routes/orderHeaders");
const { cartItemsRouter } = require("./routes/cartDetails");
const { orderItemsRouter } = require("./routes/orderDetails");
const { auxiliaryRouter } = require("./routes/auxiliary");
const { swaggerDocument } = require("./swagger/swagger");

// Present API documentation through /docs
const swaggerUi = require("swagger-ui-express");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", adminRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/cart/items", cartItemsRouter);
app.use("/order/items", orderItemsRouter);
app.use("/", auxiliaryRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
