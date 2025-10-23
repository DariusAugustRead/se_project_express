const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    console.log(`Authenticated user: ${payload._id}`);

    return next();
  } catch (err) {
    return res
      .status(unauthorizedStatusCode)
      .send({ message: "Authorization required" });
  }
};
