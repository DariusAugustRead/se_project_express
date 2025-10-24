const router = require("express").Router();
const { Errors } = require("../utils/statusCodes");
const { createUser, login } = require("../controllers/users");
const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validator");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthentication, login);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use(() => {
  throw new Errors.NotFoundError("Router not found");
});

module.exports = router;
