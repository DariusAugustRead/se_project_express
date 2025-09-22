const jwt = require("jsonwebtoken");
const secretKey = require("../utils/config");

const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

const unauthorizedStatusCode = UNAUTHORIZED_STATUS_CODE;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("Auth middleware triggered");
  console.log("Authorization header:", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unauthorizedStatusCode)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
    req.user = payload;
    console.log(`Authenticated user: ${payload._id}`);

    return next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res
      .status(unauthorizedStatusCode)
      .send({ message: "Authorization required" });
  }
};
