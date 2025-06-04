const jwt = require("jsonwebtoken");
const secretKey = require("../utils/config");

const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

const unauthorizedStatusCode = UNAUTHORIZED_STATUS_CODE;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unauthorizedStatusCode)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return res
      .status(unauthorizedStatusCode)
      .send({ message: "Authorization required" });
  }

  req.user = payload;

  next();
};
