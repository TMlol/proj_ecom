const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const swaggerDocument = yaml.safeLoad(
  fs.readFileSync(path.resolve(__dirname, "../swagger.yml"), "utf8")
);

module.exports = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
