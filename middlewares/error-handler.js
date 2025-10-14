const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const internalServerErrorStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;
  const statusCode = err.statusCode || internalServerErrorStatusCode;
  const message = err.message || "An error occurred on the server";

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
