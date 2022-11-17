const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const swaggerDocument = yaml.load(
  fs.readFileSync(path.resolve(__dirname, "../ecommerce.yaml"), "utf8")
);

module.exports = { swaggerDocument };
