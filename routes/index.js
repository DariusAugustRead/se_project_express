const router = require("express").Router();
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { validateAuthentication } = require("../middlewares/validator");

const notFoundStatusCode = NOT_FOUND_STATUS_CODE;

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.post("/signup", validateAuthentication, createUser);
router.post("/login", validateAuthentication, login);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(notFoundStatusCode).send({ message: "Router not found" });
});

module.exports = router;
