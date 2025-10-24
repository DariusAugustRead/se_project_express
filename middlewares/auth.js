const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const { UnauthorizedError } = require("../utils/errors/allErrors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    console.log(`Authenticated user: ${payload._id}`);

    return next();
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
  }
};
